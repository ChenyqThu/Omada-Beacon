/* ────────────────────────────────────────────────────────────────────────
   components/RowSelection/RowSelection.jsx — OmadaRowSelection

   A keyboard- and range-aware selection layer over the Omada Table. antd's
   built-in rowSelection toggles one checkbox at a time; bulk workflows on a
   device roster need the spreadsheet gestures: click to select, Shift-click
   (or Shift+↑/↓) to extend a contiguous range from an anchor, ⌘/Ctrl-click to
   toggle one, ⌘/Ctrl+A to select all, Esc to clear. A focusable wrapper owns
   an "active" row (roving outline) that the arrow keys move; Space toggles it.

   When anything is selected a sticky bar surfaces the count + bulk actions;
   otherwise a quiet hint teaches the gestures. Selection is controlled
   internally for the demo but `selectedKeys` / `onChange` make it controllable.

   Thin composition over the Omada Table (antd Table) + Button + OmadaIcon — all
   chrome theme-var driven with a dark twin.

   Figma: derived from Table 表格 selection states (24381:129437 row-action
   table) + the Dropdown bulk pattern. Original interaction layer.
   Exports: window.Omada.RowSelection
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { Table, Button } = window.antd;
  const Icon = window.Omada.Icon;

  function OmadaRowSelection(props) {
    const { useState, useRef, useMemo, useCallback } = React;
    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;

    const rows = props.dataSource || [];
    const rowKey = props.rowKey || 'key';
    const keyOf = useCallback((r, i) => (typeof rowKey === 'function' ? rowKey(r, i) : r[rowKey]), [rowKey]);
    const keys = useMemo(() => rows.map((r, i) => keyOf(r, i)), [rows, keyOf]);

    const controlled = props.selectedKeys != null;
    const [localSel, setLocalSel] = useState(props.defaultSelectedKeys || []);
    const selected = controlled ? props.selectedKeys : localSel;
    const selSet = useMemo(() => new Set(selected), [selected]);

    const [active, setActive] = useState(0);
    const anchorRef = useRef(0);
    const wrapRef = useRef(null);

    const commit = useCallback((next) => {
      if (!controlled) setLocalSel(next);
      if (props.onChange) props.onChange(next);
    }, [controlled, props]);

    const setRange = useCallback((from, to) => {
      const lo = Math.min(from, to), hi = Math.max(from, to);
      const inRange = keys.slice(lo, hi + 1);
      commit(inRange);
    }, [keys, commit]);

    const toggleOne = useCallback((k) => {
      const next = new Set(selSet);
      if (next.has(k)) next.delete(k); else next.add(k);
      commit(keys.filter((x) => next.has(x)));
    }, [selSet, keys, commit]);

    const onRowClick = useCallback((index, e) => {
      const k = keys[index];
      setActive(index);
      if (e.shiftKey) {
        e.preventDefault();
        setRange(anchorRef.current, index);
      } else if (e.metaKey || e.ctrlKey) {
        anchorRef.current = index;
        toggleOne(k);
      } else {
        anchorRef.current = index;
        commit([k]);
      }
    }, [keys, setRange, toggleOne, commit]);

    const onKeyDown = useCallback((e) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault(); commit(keys.slice()); return;
      }
      if (e.key === 'Escape') { commit([]); return; }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const dir = e.key === 'ArrowDown' ? 1 : -1;
        const nextIdx = Math.max(0, Math.min(keys.length - 1, active + dir));
        setActive(nextIdx);
        if (e.shiftKey) setRange(anchorRef.current, nextIdx);
        else anchorRef.current = nextIdx;
        return;
      }
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        anchorRef.current = active;
        toggleOne(keys[active]);
      }
    }, [keys, active, commit, setRange, toggleOne]);

    const rowSelection = {
      selectedRowKeys: selected,
      onChange: (sk) => commit(sk),
      columnWidth: 46,
      getCheckboxProps: () => ({ 'aria-label': t('rs.selectrow') }),
    };

    const onRow = (record, index) => ({
      onClick: (e) => {
        // ignore clicks that originate on the checkbox cell (antd handles those)
        if (e.target.closest('.ant-table-selection-column')) return;
        onRowClick(index, e);
      },
      className: index === active ? 'omada-rs-activerow' : '',
    });

    const count = selected.length;
    const bulk = props.bulkActions || [];

    return (
      <div className="omada-rs" ref={wrapRef} tabIndex={0} onKeyDown={onKeyDown}
           role="grid" aria-multiselectable="true" aria-label={props.ariaLabel || t('rs.selectrow')}>
        <div className={'omada-rs-bar' + (count > 0 ? ' is-active' : '')}>
          {count > 0 ? (
            <React.Fragment>
              <span className="omada-rs-count">
                <Icon name="check-check" size={15} />
                {t('rs.selectedN').replace('{n}', count)}
              </span>
              <div className="omada-rs-actions">
                {bulk.map((b) => (
                  <Button key={b.key} size="small" danger={b.danger}
                          icon={b.icon ? <Icon name={b.icon} size={14} /> : undefined}
                          onClick={() => b.onClick && b.onClick(selected)}>
                    {b.label}
                  </Button>
                ))}
                <button type="button" className="omada-rs-clear" onClick={() => commit([])}>
                  {t('rs.clear')}
                </button>
              </div>
            </React.Fragment>
          ) : (
            <span className="omada-rs-hint">{t('rs.hint')}</span>
          )}
        </div>

        <Table
          columns={props.columns}
          dataSource={rows}
          rowKey={rowKey}
          rowSelection={rowSelection}
          onRow={onRow}
          pagination={false}
          size={props.size || 'middle'}
          className="omada-rs-table"
        />
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.RowSelection = OmadaRowSelection;
})();
