/* ────────────────────────────────────────────────────────────────────────
   components/FilterBuilder/FilterBuilder.jsx — OmadaFilterBuilder

   A compound QUERY BUILDER. antd has Select/Input but no notion of a multi-row
   filter; this composes one: stack condition rows of [field][operator][value],
   join them with ALL (AND) / ANY (OR), and surface the committed query as a row
   of removable CHIPS plus a compiled, copy-ready expression — the "advanced
   filter" of a device/log table.

   Behaviour:
     · Each row picks a field; the operator set + the value control adapt to the
       field TYPE (enum → Select, text → contains/is, number → comparison +
       numeric input). Add / remove rows freely; the conjunction segmented
       control flips AND ↔ OR.
     · Only COMPLETE rows (field + op + value) compile into chips and the
       expression; incomplete rows are ignored until filled.
     · Remove a chip → its row drops. onChange({ conjunction, rows, valid })
       fires on every edit so a table can react live.

   Thin composition over antd Select / Input / InputNumber / Segmented / Button.
   All chrome is theme-var driven with dark twins in omada-overrides.css; chips
   + the active expression use brand-green tokens. RTL-safe.

   Figma: filter language from the Table toolbar (page node 43:34741) + the
   Form control metrics (node 43:34720); chips reuse the Tag radius. Glyphs are
   OmadaIcon (sliders / plus / close).
   Exports: window.Omada.FilterBuilder
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { useState, useMemo, useCallback, useRef } = React;
  const { Select, Input, InputNumber, Segmented } = window.antd;
  const Icon = window.Omada.Icon;
  const Button = window.Omada.Button;

  const OPS = {
    enum:   [{ v: 'is', }, { v: 'isNot' }],
    text:   [{ v: 'contains' }, { v: 'is' }, { v: 'startsWith' }],
    number: [{ v: 'eq', sym: '=' }, { v: 'gt', sym: '>' }, { v: 'lt', sym: '<' }, { v: 'gte', sym: '≥' }, { v: 'lte', sym: '≤' }],
  };

  let SEQ = 0;
  function uid() { SEQ += 1; return 'fb' + SEQ; }

  function OmadaFilterBuilder(props) {
    const className = props.className || '';
    const rest = Object.assign({}, props);
    delete rest.className; delete rest.fields; delete rest.onChange; delete rest.defaultRows;

    const ctx = window.useOmada();
    const t = ctx.t;
    const fields = props.fields || [];
    const fieldByKey = useMemo(function () { const m = {}; fields.forEach(function (f) { m[f.key] = f; }); return m; }, [fields]);

    const makeRow = function (fieldKey) {
      const f = fieldByKey[fieldKey] || fields[0];
      const ops = OPS[f.type] || OPS.text;
      return { id: uid(), field: f.key, op: ops[0].v, value: f.type === 'number' ? null : (f.type === 'enum' ? undefined : '') };
    };

    const [conj, setConj] = useState('and');
    const [rows, setRows] = useState(function () {
      if (props.defaultRows) return props.defaultRows.map(function (r) { return Object.assign({ id: uid() }, r); });
      return [makeRow(fields[0] && fields[0].key)];
    });

    const opLabel = function (f, opV) {
      const o = (OPS[f.type] || OPS.text).find(function (x) { return x.v === opV; });
      if (o && o.sym) return o.sym;
      return t('fb.op.' + opV);
    };
    const valLabel = function (f, value) {
      if (f.type === 'enum') {
        const opt = (f.options || []).find(function (o) { return o.value === value; });
        return opt ? opt.label : value;
      }
      return value;
    };
    const isComplete = function (r) {
      const f = fieldByKey[r.field]; if (!f) return false;
      if (f.type === 'number') return r.value !== null && r.value !== undefined && r.value !== '';
      return r.value !== undefined && String(r.value).trim() !== '';
    };

    const valid = useMemo(function () { return rows.filter(isComplete); }, [rows]);

    const fire = useCallback(function (nextRows, nextConj) {
      if (props.onChange) props.onChange({ conjunction: nextConj, rows: nextRows.filter(isComplete), valid: nextRows.filter(isComplete).length });
    }, [props]);

    const update = function (id, patch) {
      setRows(function (rs) {
        const next = rs.map(function (r) {
          if (r.id !== id) return r;
          const merged = Object.assign({}, r, patch);
          // field changed → reset op + value to the new type's defaults
          if (patch.field && patch.field !== r.field) {
            const f = fieldByKey[patch.field];
            const ops = OPS[f.type] || OPS.text;
            merged.op = ops[0].v;
            merged.value = f.type === 'number' ? null : (f.type === 'enum' ? undefined : '');
          }
          return merged;
        });
        fire(next, conj);
        return next;
      });
    };
    const addRow = function () { setRows(function (rs) { const next = rs.concat([makeRow(fields[0] && fields[0].key)]); return next; }); };
    const removeRow = function (id) { setRows(function (rs) { const next = rs.filter(function (r) { return r.id !== id; }); fire(next, conj); return next; }); };
    const clearAll = function () { const next = [makeRow(fields[0] && fields[0].key)]; setRows(next); fire(next, conj); };
    const changeConj = function (v) { setConj(v); fire(rows, v); };

    const joinWord = conj === 'and' ? t('fb.and') : t('fb.or');
    const expression = valid.map(function (r) {
      const f = fieldByKey[r.field];
      return f.label + ' ' + opLabel(f, r.op) + ' ' + valLabel(f, r.value);
    }).join('  ' + joinWord + '  ');

    return (
      <div className={('omada-fb ' + className).trim()} {...rest}>
        <div className="omada-fb-head">
          <span className="omada-fb-headlabel"><Icon name="sliders" size={15} />{t('fb.title')}</span>
          {valid.length > 1 && (
            <span className="omada-fb-conj">
              <span className="omada-fb-conjlabel">{t('fb.match')}</span>
              <Segmented
                size="small"
                value={conj}
                onChange={changeConj}
                options={[{ label: t('fb.all'), value: 'and' }, { label: t('fb.any'), value: 'or' }]}
              />
            </span>
          )}
        </div>

        <div className="omada-fb-rows">
          {rows.map(function (r, i) {
            const f = fieldByKey[r.field] || fields[0];
            const ops = OPS[f.type] || OPS.text;
            return (
              <div className="omada-fb-row" key={r.id}>
                <span className="omada-fb-joincol">
                  {i === 0 ? <span className="omada-fb-where">{t('fb.where')}</span>
                           : <span className="omada-fb-joinword">{joinWord}</span>}
                </span>
                <Select
                  className="omada-fb-field"
                  value={r.field}
                  onChange={function (v) { update(r.id, { field: v }); }}
                  options={fields.map(function (ff) { return { label: ff.label, value: ff.key }; })}
                  size="small"
                  style={{ minWidth: 140 }}
                />
                <Select
                  className="omada-fb-op"
                  value={r.op}
                  onChange={function (v) { update(r.id, { op: v }); }}
                  options={ops.map(function (o) { return { label: o.sym || t('fb.op.' + o.v), value: o.v }; })}
                  size="small"
                  style={{ minWidth: 110 }}
                />
                <span className="omada-fb-val">
                  {f.type === 'enum' && (
                    <Select
                      value={r.value}
                      onChange={function (v) { update(r.id, { value: v }); }}
                      options={f.options}
                      size="small"
                      placeholder={t('fb.value')}
                      style={{ minWidth: 150 }}
                    />
                  )}
                  {f.type === 'number' && (
                    <InputNumber
                      value={r.value}
                      onChange={function (v) { update(r.id, { value: v }); }}
                      size="small"
                      placeholder={t('fb.value')}
                      addonAfter={f.unit}
                      style={{ width: f.unit ? 150 : 110 }}
                    />
                  )}
                  {(!f.type || f.type === 'text') && (
                    <Input
                      value={r.value}
                      onChange={function (e) { update(r.id, { value: e.target.value }); }}
                      size="small"
                      placeholder={t('fb.value')}
                      style={{ minWidth: 150 }}
                    />
                  )}
                </span>
                <button type="button" className="omada-fb-remove" onClick={function () { removeRow(r.id); }}
                        aria-label={t('fb.remove')} disabled={rows.length === 1}>
                  <Icon name="close" size={15} />
                </button>
              </div>
            );
          })}
        </div>

        <div className="omada-fb-foot">
          <Button variant="text" size="small" className="omada-fb-add" onClick={addRow}>
            <Icon name="plus" size={15} />{t('fb.add')}
          </Button>
          {valid.length > 0 && (
            <Button variant="text" size="small" className="omada-fb-clear" onClick={clearAll}>
              {t('fb.clear')}
            </Button>
          )}
        </div>

        {/* committed chips + compiled expression */}
        <div className="omada-fb-result">
          <div className="omada-fb-chips" aria-live="polite">
            {valid.length === 0 && <span className="omada-fb-nochips">{t('fb.none')}</span>}
            {valid.map(function (r, i) {
              const f = fieldByKey[r.field];
              return (
                <React.Fragment key={r.id}>
                  {i > 0 && <span className="omada-fb-chipjoin">{joinWord}</span>}
                  <span className="omada-fb-chip">
                    <span className="omada-fb-chipfield">{f.label}</span>
                    <span className="omada-fb-chipop">{opLabel(f, r.op)}</span>
                    <span className="omada-fb-chipval">{valLabel(f, r.value)}</span>
                    <button type="button" className="omada-fb-chipx" onClick={function () { removeRow(r.id); }} aria-label={t('fb.remove')}>
                      <Icon name="close" size={12} />
                    </button>
                  </span>
                </React.Fragment>
              );
            })}
          </div>
          {valid.length > 0 && (
            <div className="omada-fb-expr">
              <span className="omada-fb-exprlabel">{t('fb.query')}</span>
              <code>{expression}</code>
            </div>
          )}
        </div>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.FilterBuilder = OmadaFilterBuilder;
})();
