/* ────────────────────────────────────────────────────────────────────────
   components/TableInlineCreate/TableInlineCreate.jsx — OmadaTableInlineCreate

   The "+ Add row" affordance that lives at the foot of a table and expands,
   in place, into a typed editor row — the pattern for adding port-forwards,
   DHCP reservations, firewall rules without leaving the table or opening a
   modal. Distinct from DataGrid (Batch 20, a full spreadsheet where every cell
   edits) and FieldArray (Batch 23, an always-editable form-row group): here
   committed rows are READ-ONLY display rows and there is one collapsed
   add-affordance that opens an inline editor.

     · A CSS-grid table (header · static data rows · add-row) so the editor
       aligns pixel-perfect with the data columns — no antd-cell misalignment.
     · Typed columns: text / number / select. Required cells flag inline on a
       blocked Save.
     · Collapsed: a full-width "+ Add {entity}" button. Open: inputs inline,
       Enter or ✓ commits (onCreate + appends), Esc or ✕ cancels.
     · `keepOpen` keeps the editor open with the first cell focused to add
       several in a row. Per-row trash removes (gated by `removable`).
     · Controlled `value`/`onChange` or uncontrolled.

   Thin composition over antd Input / InputNumber / Select + OmadaIcon.
   Token-driven, dark twin, i18n, RTL-mirrored.

   Figma: no dedicated node — built from the Table language (Table2 3:200xx);
   inline-create affordance is original.
   Exports: window.Omada.TableInlineCreate
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { Input, InputNumber, Select } = window.antd;
  const Icon = window.Omada.Icon;
  const Button = window.Omada.Button;

  let uid = 0;

  function blankDraft(columns) {
    const d = {};
    columns.forEach((c) => { d[c.key] = c.type === 'number' ? null : (c.default != null ? c.default : ''); });
    return d;
  }

  function OmadaTableInlineCreate(props) {
    const { useState, useRef, useMemo } = React;
    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;

    const columns = props.columns || [];
    const rowKey = props.rowKey || 'id';
    const controlled = props.value !== undefined;
    const [innerRows, setInnerRows] = useState(props.defaultValue || []);
    const rows = controlled ? props.value : innerRows;
    const setRows = (next) => {
      if (!controlled) setInnerRows(next);
      if (props.onChange) props.onChange(next);
    };
    const removable = props.removable !== false;
    const keepOpen = !!props.keepOpen;

    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(() => blankDraft(columns));
    const [touched, setTouched] = useState(false);
    const firstRef = useRef(null);

    // grid template from column widths (number → fr, string → as-is)
    const template = useMemo(() => {
      const cols = columns.map((c) => {
        if (c.width == null) return 'minmax(0, 1fr)';
        return typeof c.width === 'number' ? c.width + 'px' : c.width;
      });
      return cols.join(' ') + ' 40px';   // trailing action column
    }, [columns]);

    const invalid = (c, v) => c.required && (v == null || String(v).trim() === '');
    const draftValid = columns.every((c) => !invalid(c, draft[c.key]));

    const open = () => { setDraft(blankDraft(columns)); setTouched(false); setEditing(true);
      setTimeout(() => { if (firstRef.current && firstRef.current.focus) firstRef.current.focus(); }, 20); };
    const cancel = () => { setEditing(false); setTouched(false); setDraft(blankDraft(columns)); };
    const commit = () => {
      if (!draftValid) { setTouched(true); return; }
      const row = Object.assign({}, draft);
      if (row[rowKey] == null) row[rowKey] = 'r-' + (++uid) + '-' + Date.now();
      const next = rows.concat(row);
      setRows(next);
      if (props.onCreate) props.onCreate(row);
      if (keepOpen) {
        setDraft(blankDraft(columns)); setTouched(false);
        setTimeout(() => { if (firstRef.current && firstRef.current.focus) firstRef.current.focus(); }, 20);
      } else {
        setEditing(false); setTouched(false);
      }
    };
    const remove = (key) => {
      const next = rows.filter((r) => r[rowKey] !== key);
      setRows(next);
      if (props.onRemove) props.onRemove(key);
    };

    const setCell = (k, v) => setDraft((d) => Object.assign({}, d, { [k]: v }));
    const onKeyDown = (e) => {
      if (e.key === 'Enter') { e.preventDefault(); commit(); }
      else if (e.key === 'Escape') { e.preventDefault(); cancel(); }
    };

    const renderEditor = (c, i) => {
      const v = draft[c.key];
      const bad = touched && invalid(c, v);
      const common = {
        status: bad ? 'error' : undefined,
        onKeyDown,
        ref: i === 0 ? firstRef : undefined,
        placeholder: c.placeholder || c.title,
      };
      if (c.type === 'number') {
        return <InputNumber {...common} value={v} min={c.min} max={c.max}
                 onChange={(val) => setCell(c.key, val)} style={{ width: '100%' }}
                 controls={c.controls !== false} />;
      }
      if (c.type === 'select') {
        return <Select {...common} value={v == null || v === '' ? undefined : v}
                 options={c.options || []} onChange={(val) => setCell(c.key, val)}
                 style={{ width: '100%' }} getPopupContainer={(n) => n.parentNode} />;
      }
      return <Input {...common} value={v} onChange={(e) => setCell(c.key, e.target.value)} />;
    };

    const renderCell = (c, row) => {
      const v = row[c.key];
      if (c.render) return c.render(v, row);
      if (c.type === 'select' && c.options) {
        const opt = c.options.find((o) => o.value === v);
        return opt ? opt.label : (v == null ? '' : v);
      }
      return v == null || v === '' ? <span className="omada-tic-muted">—</span> : v;
    };

    const cls = 'omada-tic' + (props.className ? ' ' + props.className : '');

    return (
      <div className={cls}>
        <div className="omada-tic-grid" role="table">
          <div className="omada-tic-head" role="row" style={{ gridTemplateColumns: template }}>
            {columns.map((c) => (
              <span className="omada-tic-h" role="columnheader" key={c.key}
                    style={{ textAlign: c.align || 'start' }}>
                {c.title}{c.required && <span className="omada-tic-req">*</span>}
              </span>
            ))}
            <span className="omada-tic-h" role="columnheader" aria-hidden="true" />
          </div>

          {rows.length === 0 && !editing && (
            <div className="omada-tic-empty">{props.emptyText || t('tic.empty')}</div>
          )}

          {rows.map((row) => (
            <div className="omada-tic-row" role="row" key={row[rowKey]}
                 style={{ gridTemplateColumns: template }}>
              {columns.map((c) => (
                <span className="omada-tic-cell" role="cell" key={c.key}
                      style={{ textAlign: c.align || 'start' }}>
                  {renderCell(c, row)}
                </span>
              ))}
              <span className="omada-tic-cell omada-tic-actcell">
                {removable && (
                  <button type="button" className="omada-tic-del" aria-label={t('tic.remove')}
                          onClick={() => remove(row[rowKey])}>
                    <Icon name="trash" size={15} />
                  </button>
                )}
              </span>
            </div>
          ))}

          {editing ? (
            <div className="omada-tic-editrow" role="row" style={{ gridTemplateColumns: template }}>
              {columns.map((c, i) => (
                <span className="omada-tic-editcell" key={c.key}>{renderEditor(c, i)}</span>
              ))}
              <span className="omada-tic-editcell omada-tic-editact">
                <button type="button" className="omada-tic-ok" aria-label={t('tic.save')}
                        onClick={commit} disabled={touched && !draftValid}>
                  <Icon name="check" size={16} />
                </button>
                <button type="button" className="omada-tic-x" aria-label={t('tic.cancel')}
                        onClick={cancel}>
                  <Icon name="close" size={16} />
                </button>
              </span>
            </div>
          ) : (
            <button type="button" className="omada-tic-add" onClick={open}
                    disabled={props.disabled || (props.max != null && rows.length >= props.max)}>
              <Icon name="plus" size={16} />
              {props.addLabel || t('tic.add')}
            </button>
          )}
        </div>

        {editing && (
          <div className="omada-tic-edithint">
            <Icon name="corner-down-left" size={13} />
            {t('tic.edithint')}
          </div>
        )}
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.TableInlineCreate = OmadaTableInlineCreate;
})();
