/* ────────────────────────────────────────────────────────────────────────
   components/FieldArray/FieldArray.jsx — OmadaFieldArray

   A repeatable group of form rows — the "add another" pattern for port
   forwards, static routes, DHCP reservations, firewall rules. A schema of
   typed columns (text · number · select) drives each row; an Add button
   appends one, a per-row trash removes it (down to `min`), and required cells
   flag inline when empty. Fully controlled: `value` is an array of row objects,
   `onChange` returns the next array. New rows come from `newRow()`.

   Not a Form.List clone — it stands alone (no Form context required) so it
   drops into any panel, but forwards a clean value/onChange so it nests inside
   a Form.Item just as easily.

   Thin composition over Input / InputNumber / Select + Button + OmadaIcon.
   Token-driven, dark twin, i18n, RTL-mirrored.

   Figma: derived from Form 表单 repeatable-row group + Table 表格 add-row
   footer (Table11 "Add" affordance). Original field-array composite.
   Exports: window.Omada.FieldArray
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { Input, InputNumber, Select, Button } = window.antd;
  const Icon = window.Omada.Icon;

  function Cell(props) {
    const f = props.field;
    const val = props.value;
    const invalid = props.invalid;
    const common = {
      value: val == null ? undefined : val,
      placeholder: f.placeholder,
      status: invalid ? 'error' : undefined,
      style: { width: '100%' },
    };
    if (f.type === 'number') {
      return (
        <InputNumber
          {...common}
          min={f.min} max={f.max} step={f.step}
          onChange={(v) => props.onChange(v)}
        />
      );
    }
    if (f.type === 'select') {
      return (
        <Select
          {...common}
          options={f.options}
          onChange={(v) => props.onChange(v)}
        />
      );
    }
    return (
      <Input
        {...common}
        maxLength={f.maxLength}
        onChange={(e) => props.onChange(e.target.value)}
      />
    );
  }

  function OmadaFieldArray(props) {
    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;

    const fields = props.fields || [];
    const rows = props.value || [];
    const min = props.min == null ? 0 : props.min;
    const max = props.max == null ? Infinity : props.max;
    const showValidation = props.showValidation;

    const setRows = (next) => { if (props.onChange) props.onChange(next); };

    const newRow = () => {
      if (props.newRow) return props.newRow();
      const r = {};
      fields.forEach((f) => { r[f.name] = f.type === 'number' ? null : (f.type === 'select' ? undefined : ''); });
      return r;
    };

    const add = () => { if (rows.length < max) setRows(rows.concat([newRow()])); };
    const remove = (i) => { if (rows.length > min) setRows(rows.filter((_, idx) => idx !== i)); };
    const update = (i, name, v) => {
      setRows(rows.map((r, idx) => (idx === i ? Object.assign({}, r, { [name]: v }) : r)));
    };

    const isEmpty = (v) => v === '' || v == null;
    const cellInvalid = (f, v) => showValidation && f.required && isEmpty(v);

    // grid template: one fr-ish per field (respecting field.width) + 36px trash
    const cols = fields.map((f) => f.width || 'minmax(0, 1fr)').join(' ') + ' 36px';

    return (
      <div className="omada-fa">
        {props.showHead !== false && (
          <div className="omada-fa-head" style={{ gridTemplateColumns: cols }}>
            {fields.map((f) => (
              <span className="omada-fa-h" key={f.name}>
                {f.label}{f.required && <span className="omada-fa-req">*</span>}
              </span>
            ))}
            <span />
          </div>
        )}

        <div className="omada-fa-rows">
          {rows.length === 0 && (
            <div className="omada-fa-empty">{props.emptyText || t('fa.empty')}</div>
          )}
          {rows.map((row, i) => (
            <div className="omada-fa-row" style={{ gridTemplateColumns: cols }} key={i}>
              {fields.map((f) => (
                <div className="omada-fa-cell" key={f.name}>
                  <Cell
                    field={f}
                    value={row[f.name]}
                    invalid={cellInvalid(f, row[f.name])}
                    onChange={(v) => update(i, f.name, v)}
                  />
                </div>
              ))}
              <button
                type="button"
                className="omada-fa-del"
                aria-label={t('fa.remove')}
                disabled={rows.length <= min}
                onClick={() => remove(i)}
              >
                <Icon name="trash" size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="omada-fa-foot">
          <Button
            type="dashed"
            size="small"
            icon={<Icon name="plus" size={14} />}
            onClick={add}
            disabled={rows.length >= max}
          >
            {props.addLabel || t('fa.add')}
          </Button>
          {max !== Infinity && (
            <span className="omada-fa-count">{t('fa.countN').replace('{n}', rows.length).replace('{max}', max)}</span>
          )}
        </div>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.FieldArray = OmadaFieldArray;
})();
