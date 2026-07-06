/* ────────────────────────────────────────────────────────────────────────
   components/BulkActions/BulkActions.jsx — OmadaBulkActions

   A SELECTION ACTION BAR over a data Table. antd Table gives you checkbox
   selection but no place to ACT on it; this wraps Table with rowSelection and
   floats a sticky toolbar in from the bottom the moment one row is checked —
   "3 selected · Reboot · Move · Export · Forget". The everyday batch-ops
   pattern for a device list.

   Behaviour:
     · Check rows (or the header box) → the bar slides up with a live count and
       the action set; uncheck all → it slides away. Esc clears the selection.
     · "Select all N" / "Clear" affordances act across the whole dataSource,
       not just the visible page. A danger action is visually separated.
     · Each action gets (selectedRowKeys, selectedRows, clear); calling clear()
       empties the selection (e.g. after a successful batch op).

   It forwards arbitrary Table props (pagination, size, scroll…) so it stays a
   thin wrapper. All chrome is theme-var driven with dark twins in
   omada-overrides.css; the bar surface + count use brand-green tokens. RTL-safe.

   Figma: the Table selection language from "Table 表格" (page node 43:34741) —
   selected-row green tint + the floating batch bar; metrics/elevation from
   tokens. Glyphs are OmadaIcon.
   Exports: window.Omada.BulkActions
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { useState, useEffect, useMemo, useCallback } = React;
  const { Table } = window.antd;
  const Icon = window.Omada.Icon;
  const Button = window.Omada.Button;

  function OmadaBulkActions(props) {
    const className = props.className || '';
    const rest = Object.assign({}, props);
    delete rest.className; delete rest.columns; delete rest.dataSource; delete rest.rowKey;
    delete rest.actions; delete rest.selectedRowKeys; delete rest.onSelectionChange;
    delete rest.barTitle;

    const ctx = window.useOmada();
    const t = ctx.t;

    const rowKey = props.rowKey || 'key';
    const dataSource = props.dataSource || [];
    const actions = props.actions || [];

    const controlled = props.selectedRowKeys !== undefined;
    const [innerKeys, setInnerKeys] = useState([]);
    const keys = controlled ? props.selectedRowKeys : innerKeys;

    const setKeys = useCallback(function (next) {
      if (!controlled) setInnerKeys(next);
      if (props.onSelectionChange) props.onSelectionChange(next);
    }, [controlled, props]);

    const keyFor = function (r, i) { return typeof rowKey === 'function' ? rowKey(r) : (r[rowKey] != null ? r[rowKey] : i); };
    const selectedRows = useMemo(function () {
      const set = {}; keys.forEach(function (k) { set[k] = true; });
      return dataSource.filter(function (r, i) { return set[keyFor(r, i)]; });
    }, [keys, dataSource]);

    const clear = useCallback(function () { setKeys([]); }, [setKeys]);
    const all = useCallback(function () { setKeys(dataSource.map(keyFor)); }, [dataSource, setKeys]);

    // Esc clears
    useEffect(function () {
      if (!keys.length) return;
      const onKey = function (e) { if (e.key === 'Escape') clear(); };
      window.addEventListener('keydown', onKey);
      return function () { window.removeEventListener('keydown', onKey); };
    }, [keys.length, clear]);

    const count = keys.length;
    const allSelected = count > 0 && count === dataSource.length;

    return (
      <div className={('omada-bulk ' + className).trim()}>
        <Table
          columns={props.columns}
          dataSource={dataSource}
          rowKey={rowKey}
          rowSelection={{
            selectedRowKeys: keys,
            onChange: function (k) { setKeys(k); },
            columnWidth: 48,
          }}
          {...rest}
        />

        <div className={'omada-bulk-bar' + (count > 0 ? ' is-visible' : '')} role="region" aria-label={t('bulk.aria')} aria-hidden={count === 0}>
          <span className="omada-bulk-count">
            <span className="omada-bulk-countn">{count}</span>
            {t('bulk.selected')}
          </span>
          <span className="omada-bulk-sep" aria-hidden="true" />
          <button type="button" className="omada-bulk-link" onClick={allSelected ? clear : all}>
            {allSelected
              ? t('bulk.clear')
              : (t('bulk.selectAll') || 'Select all {n}').replace('{n}', dataSource.length)}
          </button>
          <span className="omada-bulk-spacer" />
          <span className="omada-bulk-actions">
            {actions.map(function (a) {
              if (a.danger) return null;
              return (
                <Button key={a.key} variant="secondary" size="small" className="omada-bulk-act"
                        onClick={function () { if (a.onRun) a.onRun(keys, selectedRows, clear); }}>
                  {a.icon && <Icon name={a.icon} size={15} />}{a.label}
                </Button>
              );
            })}
            {actions.some(function (a) { return a.danger; }) && <span className="omada-bulk-sep" aria-hidden="true" />}
            {actions.filter(function (a) { return a.danger; }).map(function (a) {
              return (
                <Button key={a.key} variant="danger-ghost" size="small" className="omada-bulk-act"
                        onClick={function () { if (a.onRun) a.onRun(keys, selectedRows, clear); }}>
                  {a.icon && <Icon name={a.icon} size={15} />}{a.label}
                </Button>
              );
            })}
          </span>
          <button type="button" className="omada-bulk-close" onClick={clear} aria-label={t('bulk.clearSel')}>
            <Icon name="close" size={16} />
          </button>
        </div>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.BulkActions = OmadaBulkActions;
})();
