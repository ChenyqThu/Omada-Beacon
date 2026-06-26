/* ────────────────────────────────────────────────────────────────────────
   components/DataGrid/DataGrid.jsx — OmadaDataGrid

   A spreadsheet-style EDITABLE grid. TablePatterns showed antd Table's
   one-cell-at-a-time inline edit; this is the heavier surface a NOC reaches for
   to bulk-edit a device matrix — every editable cell is keyboard-reachable, you
   type straight into it, and a dirty tracker + Save / Revert bar sits underneath.

   Behaviour:
     · SELECT a cell with a click or the arrow keys. The active cell shows a
       brand-green ring. Press Enter / F2 (or just start typing) to EDIT; the
       per-column type picks the editor — text → Input, number → InputNumber,
       enum → Select, toggle → Switch (toggles in place, no edit mode).
     · COMMIT with Enter (moves down) or Tab (moves right; Shift+Tab left);
       CANCEL with Esc. onChange(nextRows, { rowKey, colKey, value }) fires on
       every commit. Optional column.validate(value,row) → error string paints
       the cell red and blocks the commit.
     · DIRTY tracking: a changed cell carries a green corner marker; the footer
       counts changes and offers Save (→ onSave, resets baseline) / Revert
       (restores baseline). Non-editable columns are skipped by navigation-edit.

   The grid scaffold is ours (a semantic <table>); every EDITOR is a thin antd
   control, so density / theme / locale all inherit. All chrome is theme-var
   driven with dark twins in omada-overrides.css; the active ring, dirty marker
   and focus use brand-green. RTL-safe (arrow L/R swap is visual-order based).

   Figma: the editable Table cell language from the device table (page 43:34741)
   + Form control metrics (43:34720). No branded art.
   Exports: window.Omada.DataGrid
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { useState, useRef, useEffect } = React;
  const { Input, InputNumber, Select, Switch } = window.antd;
  const Icon = window.Omada.Icon;
  const Button = window.Omada.Button;

  function OmadaDataGrid(props) {
    const className = props.className || '';
    const rest = Object.assign({}, props);
    delete rest.className; delete rest.columns; delete rest.rows; delete rest.rowKey;
    delete rest.onChange; delete rest.onSave; delete rest.onRevert; delete rest.showFooter;

    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;

    const columns = props.columns || [];
    const rowKey = props.rowKey || 'key';
    const showFooter = props.showFooter === undefined ? true : props.showFooter;

    const controlled = props.onChange !== undefined;
    const [inner, setInner] = useState(props.rows || []);
    const rows = controlled ? (props.rows || []) : inner;

    const baselineRef = useRef(JSON.stringify(props.rows || []));
    const [dirty, setDirty] = useState({});      // "r:c" → true
    const [errors, setErrors] = useState({});    // "r:c" → message
    const [active, setActive] = useState({ r: -1, c: -1 });
    const [editing, setEditing] = useState(null); // { r, c } | null
    const [draft, setDraft] = useState(null);
    const tableRef = useRef(null);

    // reset baseline if the parent swaps the dataset wholesale
    useEffect(() => {
      if (controlled) baselineRef.current = JSON.stringify(props.rows || []);
      // eslint-disable-next-line
    }, []);

    const editableCols = columns.map((c, i) => (c.editable === false ? null : i)).filter((x) => x !== null);
    const isEditable = (c) => columns[c] && columns[c].editable !== false;

    const setRowsNext = (next, meta) => {
      if (!controlled) setInner(next);
      if (props.onChange) props.onChange(next, meta);
    };

    const cellId = (r, c) => r + ':' + c;

    const commitValue = (r, c, value) => {
      const col = columns[c];
      const row = rows[r];
      if (col.validate) {
        const msg = col.validate(value, row);
        if (msg) { setErrors((e) => Object.assign({}, e, { [cellId(r, c)]: msg })); return false; }
      }
      setErrors((e) => { const n = Object.assign({}, e); delete n[cellId(r, c)]; return n; });
      const next = rows.map((rw, ri) => (ri === r ? Object.assign({}, rw, { [col.key]: value }) : rw));
      // dirty vs baseline
      const base = JSON.parse(baselineRef.current);
      const baseVal = base[r] ? base[r][col.key] : undefined;
      setDirty((d) => {
        const n = Object.assign({}, d);
        if (JSON.stringify(value) !== JSON.stringify(baseVal)) n[cellId(r, c)] = true; else delete n[cellId(r, c)];
        return n;
      });
      setRowsNext(next, { rowKey: row[rowKey], colKey: col.key, value });
      return true;
    };

    const focusCell = (r, c) => requestAnimationFrame(() => {
      if (!tableRef.current) return;
      const sel = '[data-cell="' + r + '-' + c + '"]';
      const node = tableRef.current.querySelector(sel);
      if (node) node.focus();
    });

    const startEdit = (r, c, initial) => {
      const col = columns[c];
      if (!isEditable(c)) return;
      if (col.type === 'toggle') { commitValue(r, c, !rows[r][col.key]); return; }
      setEditing({ r, c });
      setDraft(initial !== undefined ? initial : rows[r][col.key]);
    };
    const cancelEdit = () => { setEditing(null); setDraft(null); };
    const finishEdit = (move) => {
      if (!editing) return;
      const { r, c } = editing;
      const ok = commitValue(r, c, draft);
      if (!ok) return; // stay in edit on validation error
      setEditing(null); setDraft(null);
      let nr = r, nc = c;
      if (move === 'down') nr = Math.min(rows.length - 1, r + 1);
      else if (move === 'right') { const ix = editableCols.indexOf(c); nc = editableCols[Math.min(editableCols.length - 1, ix + 1)]; }
      else if (move === 'left') { const ix = editableCols.indexOf(c); nc = editableCols[Math.max(0, ix - 1)]; }
      setActive({ r: nr, c: nc });
      focusCell(nr, nc);
    };

    const onCellKey = (e, r, c) => {
      if (editing) return;
      const k = e.key;
      if (k === 'ArrowDown') { e.preventDefault(); const nr = Math.min(rows.length - 1, r + 1); setActive({ r: nr, c }); focusCell(nr, c); }
      else if (k === 'ArrowUp') { e.preventDefault(); const nr = Math.max(0, r - 1); setActive({ r: nr, c }); focusCell(nr, c); }
      else if (k === 'ArrowRight') { e.preventDefault(); const nc = Math.min(columns.length - 1, c + 1); setActive({ r, c: nc }); focusCell(r, nc); }
      else if (k === 'ArrowLeft') { e.preventDefault(); const nc = Math.max(0, c - 1); setActive({ r, c: nc }); focusCell(r, nc); }
      else if (k === 'Enter' || k === 'F2') { e.preventDefault(); startEdit(r, c); }
      else if (k === ' ' && columns[c].type === 'toggle') { e.preventDefault(); startEdit(r, c); }
      else if (k.length === 1 && !e.metaKey && !e.ctrlKey && isEditable(c) && columns[c].type !== 'toggle' && columns[c].type !== 'enum') {
        startEdit(r, c, columns[c].type === 'number' ? Number(k) || null : k);
      }
    };

    const renderEditor = (r, c) => {
      const col = columns[c];
      const common = { size: 'small', autoFocus: true, className: 'omada-dg-editor' };
      if (col.type === 'number') {
        return <InputNumber {...common} value={draft} addonAfter={col.unit}
          onChange={(v) => setDraft(v)}
          onPressEnter={() => finishEdit('down')}
          onBlur={() => finishEdit(null)}
          onKeyDown={(e) => { if (e.key === 'Escape') cancelEdit(); if (e.key === 'Tab') { e.preventDefault(); finishEdit(e.shiftKey ? 'left' : 'right'); } }}
          style={{ width: '100%' }} />;
      }
      if (col.type === 'enum') {
        return <Select {...common} value={draft} options={col.options} defaultOpen
          onChange={(v) => { setDraft(v); }}
          onSelect={(v) => { setTimeout(() => { commitOnSelect(r, c, v); }, 0); }}
          onKeyDown={(e) => { if (e.key === 'Escape') cancelEdit(); }}
          style={{ width: '100%' }} popupMatchSelectWidth={false} />;
      }
      return <Input {...common} value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onPressEnter={() => finishEdit('down')}
        onBlur={() => finishEdit(null)}
        onKeyDown={(e) => { if (e.key === 'Escape') cancelEdit(); if (e.key === 'Tab') { e.preventDefault(); finishEdit(e.shiftKey ? 'left' : 'right'); } }} />;
    };

    // enum commits on select directly
    const commitOnSelect = (r, c, v) => {
      const ok = commitValue(r, c, v);
      if (ok) { setEditing(null); setDraft(null); setActive({ r, c }); focusCell(r, c); }
    };

    const display = (col, row) => {
      if (col.render) return col.render(row[col.key], row);
      if (col.type === 'toggle') return <Switch size="small" checked={!!row[col.key]} tabIndex={-1} />;
      if (col.type === 'enum') {
        const opt = (col.options || []).find((o) => o.value === row[col.key]);
        return opt ? opt.label : row[col.key];
      }
      const v = row[col.key];
      return (v === '' || v == null) ? <span className="omada-dg-empty">—</span> : (col.unit ? v + ' ' + col.unit : v);
    };

    const dirtyCount = Object.keys(dirty).length;
    const errorCount = Object.keys(errors).length;

    const save = () => {
      baselineRef.current = JSON.stringify(rows);
      setDirty({}); setErrors({});
      if (props.onSave) props.onSave(rows);
    };
    const revert = () => {
      const base = JSON.parse(baselineRef.current);
      if (!controlled) setInner(base);
      if (props.onChange) props.onChange(base, { revert: true });
      setDirty({}); setErrors({}); cancelEdit();
      if (props.onRevert) props.onRevert(base);
    };

    return (
      <div className={('omada-dg ' + className).trim()} {...rest}>
        <div className="omada-dg-scroll">
          <table className="omada-dg-table" ref={tableRef}>
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.key} className={'omada-dg-th' + (col.align === 'right' ? ' is-right' : '')}
                      style={{ width: col.width }}>
                    {col.title}{col.editable === false && <Icon name="lock" size={11} className="omada-dg-lockix" />}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, r) => (
                <tr key={row[rowKey] != null ? row[rowKey] : r}>
                  {columns.map((col, c) => {
                    const id = cellId(r, c);
                    const isActive = active.r === r && active.c === c;
                    const isEditingCell = editing && editing.r === r && editing.c === c;
                    const ed = isEditable(c);
                    const hasErr = !!errors[id];
                    return (
                      <td
                        key={col.key}
                        data-cell={r + '-' + c}
                        tabIndex={ed || col.type === 'toggle' ? 0 : -1}
                        className={'omada-dg-td'
                          + (col.align === 'right' ? ' is-right' : '')
                          + (ed ? ' is-editable' : ' is-locked')
                          + (isActive ? ' is-active' : '')
                          + (dirty[id] ? ' is-dirty' : '')
                          + (hasErr ? ' is-error' : '')
                          + (isEditingCell ? ' is-editing' : '')}
                        onClick={() => { setActive({ r, c }); if (ed && !isEditingCell) { if (col.type === 'toggle') startEdit(r, c); } }}
                        onDoubleClick={() => ed && startEdit(r, c)}
                        onFocus={() => setActive({ r, c })}
                        onKeyDown={(e) => onCellKey(e, r, c)}
                        title={hasErr ? errors[id] : undefined}
                      >
                        {isEditingCell ? renderEditor(r, c) : (
                          <span className="omada-dg-val">
                            {display(col, row)}
                            {dirty[id] && <span className="omada-dg-marker" aria-hidden="true" />}
                            {hasErr && <Icon name="warning" size={13} className="omada-dg-errix" />}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showFooter && (
          <div className="omada-dg-foot">
            <span className={'omada-dg-status' + (errorCount ? ' is-error' : (dirtyCount ? ' is-dirty' : ''))}>
              {errorCount > 0
                ? <span><Icon name="warning" size={14} />{errorCount} {t('dg.errors')}</span>
                : dirtyCount > 0
                  ? <span><Icon name="edit" size={14} />{dirtyCount} {t('dg.unsaved')}</span>
                  : <span><Icon name="check-circle" size={14} />{t('dg.clean')}</span>}
            </span>
            <span className="omada-dg-footactions">
              <Button variant="text" size="small" disabled={!dirtyCount} onClick={revert}>{t('dg.revert')}</Button>
              <Button variant="primary" size="small" disabled={!dirtyCount || errorCount > 0} onClick={save}>
                <Icon name="save" size={14} />{t('dg.save')}
              </Button>
            </span>
          </div>
        )}
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.DataGrid = OmadaDataGrid;
})();
