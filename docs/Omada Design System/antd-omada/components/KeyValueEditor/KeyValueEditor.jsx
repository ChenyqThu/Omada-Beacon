/* ────────────────────────────────────────────────────────────────────────
   components/KeyValueEditor/KeyValueEditor.jsx — OmadaKeyValueEditor

   Add / edit / remove / reorder a list of key→value pairs — the control behind
   custom HTTP headers, environment variables, DHCP options, tag maps and any
   "name = value" config. Each row is a grip handle (drag to reorder via native
   HTML5 DnD, like SortableList), a key Input, a value Input, and a remove
   button; an "Add pair" button appends a blank row and focuses its key. Empty
   keys are ignored on emit; duplicate keys get an inline error marker. The
   value is an array of `{ key, value }` — controlled via `value`/`onChange` or
   self-managed from `defaultValue`.

   Thin composition over antd Input + Button + OmadaIcon. Token-driven, dark
   twin, keyboard reorder via ↑/↓ on a focused handle.

   Figma: no dedicated node — built on the Input 输入框 + Button tokens and the
   SortableList (Batch 18) drag affordance. Original.
   Exports: window.Omada.KeyValueEditor
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { Input, Button } = window.antd;
  const Icon = window.Omada.Icon;

  let uid = 0;
  const mkRow = (k, v) => ({ _id: 'kv' + (++uid), key: k || '', value: v || '' });

  function OmadaKeyValueEditor(props) {
    const { useState, useRef, useCallback } = React;
    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;

    const controlled = props.value != null;
    const seed = (props.value || props.defaultValue || []).map((p) => mkRow(p.key, p.value));
    const [localRows, setLocalRows] = useState(seed);
    const rows = controlled
      ? props.value.map((p, i) => ({ _id: 'kv-c' + i, key: p.key, value: p.value }))
      : localRows;
    const [dragId, setDragId] = useState(null);
    const focusKeyRef = useRef(null);

    const emit = useCallback((next) => {
      if (!controlled) setLocalRows(next);
      if (props.onChange) props.onChange(next.map((r) => ({ key: r.key, value: r.value })));
    }, [controlled, props]);

    const update = (id, field, val) => emit(rows.map((r) => (r._id === id ? Object.assign({}, r, { [field]: val }) : r)));
    const remove = (id) => emit(rows.filter((r) => r._id !== id));
    const add = () => {
      const row = mkRow('', '');
      focusKeyRef.current = row._id;
      emit(rows.concat([row]));
    };
    const moveBy = (index, delta) => {
      const to = index + delta;
      if (to < 0 || to >= rows.length) return;
      const next = rows.slice();
      const [it] = next.splice(index, 1);
      next.splice(to, 0, it);
      emit(next);
    };

    // duplicate-key detection (non-empty keys appearing >1×)
    const counts = {};
    rows.forEach((r) => { const k = r.key.trim(); if (k) counts[k] = (counts[k] || 0) + 1; });

    const onDrop = (targetId) => {
      if (dragId == null || dragId === targetId) { setDragId(null); return; }
      const from = rows.findIndex((r) => r._id === dragId);
      const to = rows.findIndex((r) => r._id === targetId);
      if (from < 0 || to < 0) { setDragId(null); return; }
      const next = rows.slice();
      const [it] = next.splice(from, 1);
      next.splice(to, 0, it);
      emit(next); setDragId(null);
    };

    return (
      <div className="omada-kv">
        {rows.length > 0 && (
          <div className="omada-kv-head">
            <span className="omada-kv-h-grip" />
            <span className="omada-kv-h-key">{props.keyLabel || t('kv.key')}</span>
            <span className="omada-kv-h-val">{props.valueLabel || t('kv.value')}</span>
            <span className="omada-kv-h-act" />
          </div>
        )}

        <div className="omada-kv-rows">
          {rows.map((r, i) => {
            const dupe = r.key.trim() && counts[r.key.trim()] > 1;
            return (
              <div key={r._id}
                   className={'omada-kv-row' + (dragId === r._id ? ' is-dragging' : '')}
                   draggable={props.reorderable !== false}
                   onDragStart={() => setDragId(r._id)}
                   onDragOver={(e) => e.preventDefault()}
                   onDrop={() => onDrop(r._id)}
                   onDragEnd={() => setDragId(null)}>
                {props.reorderable !== false && (
                  <span className="omada-kv-grip" aria-label={t('kv.reorder')} tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'ArrowUp') { e.preventDefault(); moveBy(i, -1); }
                          else if (e.key === 'ArrowDown') { e.preventDefault(); moveBy(i, 1); }
                        }}>
                    <Icon name="grip-vertical" size={16} />
                  </span>
                )}
                <Input
                  className="omada-kv-key"
                  value={r.key}
                  status={dupe ? 'error' : ''}
                  placeholder={props.keyPlaceholder || t('kv.key')}
                  onChange={(e) => update(r._id, 'key', e.target.value)}
                  autoFocus={focusKeyRef.current === r._id}
                  size={props.size || 'middle'}
                />
                <Input
                  className="omada-kv-val"
                  value={r.value}
                  placeholder={props.valuePlaceholder || t('kv.value')}
                  onChange={(e) => update(r._id, 'value', e.target.value)}
                  size={props.size || 'middle'}
                />
                <button type="button" className="omada-kv-del" aria-label={t('kv.remove')} onClick={() => remove(r._id)}>
                  <Icon name="trash" size={16} />
                </button>
                {dupe && <span className="omada-kv-dupe">{t('kv.dupe')}</span>}
              </div>
            );
          })}
        </div>

        {rows.length === 0 && <div className="omada-kv-empty">{t('kv.empty')}</div>}

        <div className="omada-kv-foot">
          <Button size="small" type="dashed" icon={<Icon name="plus" size={14} />} onClick={add}>
            {props.addLabel || t('kv.add')}
          </Button>
          <span className="omada-kv-count">{t('kv.countN').replace('{n}', rows.length)}</span>
        </div>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.KeyValueEditor = OmadaKeyValueEditor;
})();
