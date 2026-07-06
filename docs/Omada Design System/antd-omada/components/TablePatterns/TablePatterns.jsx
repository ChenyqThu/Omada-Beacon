/* ────────────────────────────────────────────────────────────────────────
   components/TablePatterns/TablePatterns.jsx — OmadaTablePatterns

   A TABLES-PATTERNS board — the composition companion to the DataTable wrapper
   (which covers sort / select / filter / dense). DataTable is the everyday
   table; this board shows the four heavier antd Table features the product
   needs, all on ONE real table so they're seen working together:

     1. Sticky header — header pinned while the body scrolls (scroll.y + sticky),
        for long device rosters.
     2. Expandable rows — a detail drawer per row (expandedRowRender): MAC / IP /
        uptime without leaving the table.
     3. Summary row — a pinned Table.Summary footer that totals clients & traffic
        (live — recomputed from the row data).
     4. Editable cells — click the "clients" cell to edit inline; commit on
        Enter / blur, cancel on Esc. Local state, no server.

   Uses antd Table directly (these are Table-level features), themed entirely by
   omada-theme.js → components.Table (header bg, row hover/selected, cell pad)
   plus the status pill from Omada.Tag. NOT a primitive.

   Figma: Table 表格 family — header/zebra/row-action metrics already encoded in
   components.Table. Expand chevron, summary emphasis and inline-edit affordance
   are antd Table features expressed against those Omada tokens.
   Exports: window.Omada.TablePatterns
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { useState, useRef, useEffect } = React;

  // inline-editable numeric cell
  function EditCell(props) {
    const [editing, setEditing] = useState(false);
    const [val, setVal] = useState(props.value);
    const ref = useRef(null);
    useEffect(() => { if (editing && ref.current) ref.current.focus({ cursor: 'all' }); }, [editing]);

    const { InputNumber } = window.antd;
    const commit = () => { setEditing(false); props.onChange(val); };
    const cancel = () => { setEditing(false); setVal(props.value); };

    if (editing) {
      return (
        <InputNumber
          ref={ref} size="small" value={val} min={0} max={9999}
          onChange={(v) => setVal(v == null ? 0 : v)}
          onPressEnter={commit} onBlur={commit}
          onKeyDown={(e) => { if (e.key === 'Escape') cancel(); }}
          style={{ width: 84 }}
        />
      );
    }
    return (
      <button type="button" className="omada-tp-editcell" onClick={() => setEditing(true)}
              title={props.editHint}>
        <span>{props.value}</span>
        <window.OmadaIcon name="edit" size={13} className="omada-tp-editglyph" />
      </button>
    );
  }

  function OmadaTablePatterns(props) {
    const className = props.className || '';
    const rest = Object.assign({}, props);
    delete rest.className;

    const ctx = window.useOmada ? window.useOmada() : { t: (k) => k, lang: 'en' };
    const t = ctx.t, lang = ctx.lang;

    const { Table } = window.antd;
    const StatusPill = window.Omada.StatusPill;

    const seed = [
      { key: 'ap1', name: 'AP-Lobby-01',   type: 'ap',      status: 'connected',    clients: 42, traffic: 128, mac: 'A4:2B:8C:10:44:01', ip: '192.168.1.21', uptime: '12d 4h' },
      { key: 'sw1', name: 'SW-Core-01',     type: 'switch',  status: 'connected',    clients: 0,  traffic: 980, mac: 'A4:2B:8C:10:44:02', ip: '192.168.1.2',  uptime: '63d 1h' },
      { key: 'ap2', name: 'AP-Floor2-07',   type: 'ap',      status: 'pending',      clients: 18, traffic: 64,  mac: 'A4:2B:8C:10:44:07', ip: '192.168.1.27', uptime: '—' },
      { key: 'gw1', name: 'GW-Edge-01',     type: 'gateway', status: 'connected',    clients: 0,  traffic: 1450,mac: 'A4:2B:8C:10:44:00', ip: '192.168.1.1',  uptime: '120d' },
      { key: 'ap3', name: 'AP-Warehouse-03',type: 'ap',      status: 'disconnected', clients: 0,  traffic: 0,   mac: 'A4:2B:8C:10:44:03', ip: '192.168.1.23', uptime: '—' },
      { key: 'ap4', name: 'AP-Cafe-02',     type: 'ap',      status: 'connected',    clients: 27, traffic: 92,  mac: 'A4:2B:8C:10:44:04', ip: '192.168.1.24', uptime: '8d 9h' },
    ];
    const [rows, setRows] = useState(seed);

    const setClients = (key, v) =>
      setRows((rs) => rs.map((r) => (r.key === key ? Object.assign({}, r, { clients: v }) : r)));

    const typeIcon = { ap: 'ap', switch: 'switch', gateway: 'gateway' };

    const columns = [
      {
        title: t('tp.col.device'), dataIndex: 'name', key: 'name', fixed: 'left',
        render: (v, r) => (
          <span className="omada-tp-device">
            <window.OmadaIcon name={typeIcon[r.type] || 'devices'} size={16} />
            <span>{v}</span>
          </span>
        ),
      },
      {
        title: t('tp.col.status'), dataIndex: 'status', key: 'status',
        render: (s) => <StatusPill status={s} lang={lang} />,
      },
      {
        title: t('tp.col.clients'), dataIndex: 'clients', key: 'clients', align: 'right', width: 130,
        render: (v, r) => (
          <EditCell value={v} editHint={t('tp.editHint')} onChange={(nv) => setClients(r.key, nv)} />
        ),
      },
      {
        title: t('tp.col.traffic'), dataIndex: 'traffic', key: 'traffic', align: 'right',
        render: (v) => <span className="omada-tp-num">{v.toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US')} <span className="omada-tp-unit">MB</span></span>,
      },
    ];

    const totalClients = rows.reduce((s, r) => s + (r.clients || 0), 0);
    const totalTraffic = rows.reduce((s, r) => s + (r.traffic || 0), 0);
    const nf = (n) => n.toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US');

    return (
      <div className={('omada-tp ' + className).trim()} {...rest}>
        <div className="omada-tp-legend">
          <span className="omada-tp-chip"><window.OmadaIcon name="chevron-down" size={13} /> {t('tp.legend.expand')}</span>
          <span className="omada-tp-chip"><window.OmadaIcon name="edit" size={13} /> {t('tp.legend.edit')}</span>
          <span className="omada-tp-chip"><window.OmadaIcon name="insights" size={13} /> {t('tp.legend.sticky')}</span>
        </div>

        <Table
          className="omada-tp-table"
          size="small"
          columns={columns}
          dataSource={rows}
          pagination={false}
          sticky
          scroll={{ y: 240 }}
          expandable={{
            expandedRowRender: (r) => (
              <div className="omada-tp-detail">
                <div className="omada-tp-fact"><span className="omada-tp-factlabel">MAC</span><code>{r.mac}</code></div>
                <div className="omada-tp-fact"><span className="omada-tp-factlabel">IP</span><code>{r.ip}</code></div>
                <div className="omada-tp-fact"><span className="omada-tp-factlabel">{t('tp.uptime')}</span><code>{r.uptime}</code></div>
              </div>
            ),
            rowExpandable: () => true,
          }}
          summary={() => (
            <Table.Summary fixed>
              <Table.Summary.Row className="omada-tp-summary">
                <Table.Summary.Cell index={0}>{t('tp.total')}</Table.Summary.Cell>
                <Table.Summary.Cell index={1} />
                <Table.Summary.Cell index={2} align="right"><strong>{nf(totalClients)}</strong></Table.Summary.Cell>
                <Table.Summary.Cell index={3} align="right"><strong>{nf(totalTraffic)} MB</strong></Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />

        <div className="omada-tp-note">{t('tp.note')}</div>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.TablePatterns = OmadaTablePatterns;
})();
