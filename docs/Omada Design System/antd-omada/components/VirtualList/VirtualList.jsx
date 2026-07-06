/* ────────────────────────────────────────────────────────────────────────
   components/VirtualList/VirtualList.jsx — OmadaVirtualList

   A DATA-DENSITY / 虚拟滚动 board: how to render a 10,000-row device list
   without dropping frames. antd 6 Table ships a `virtual` prop (built on
   rc-virtual-list) that windows the rows — only the visible slice plus a small
   buffer is in the DOM, so scroll stays smooth at any length.

   The board proves it: a live counter reads how many `.ant-table-row` nodes
   actually exist while you scroll a 10k-row table. Flip `virtual` off with the
   switch and the same data tries to mount all 10k rows — the counter jumps and
   the frame stutters. (Capped to a smaller set when off so the demo can't hang
   the page.)

   Guidance cards summarise the rules: virtualize past ~100 rows, require a
   fixed scroll height + fixed column widths, lose in-DOM Ctrl+F / sticky
   uneven-height rows, and prefer server pagination for truly huge sets.

   All chrome is token-driven; the table itself is the Omada-themed antd Table,
   so light/dark/RTL come for free.

   Figma: no dedicated node — a performance/architecture board. The row visuals
   reuse the DataTable language (node 536:7989).
   Exports: window.Omada.VirtualList
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { useState, useMemo, useRef, useEffect, useCallback } = React;
  const { Table, Switch } = window.antd;
  const Icon = window.Omada.Icon;

  const TYPES = ['ap', 'switch', 'gateway', 'camera'];
  const STATES = [
    { key: 'connected',    tone: 'var(--omada-green-500,#00A870)' },
    { key: 'pending',      tone: 'var(--omada-orange,#FF8C27)' },
    { key: 'disconnected', tone: 'var(--grey-400,#BFBFBF)' },
  ];

  // deterministic seed so the list is stable across renders/themes
  function buildRows(n) {
    const rows = new Array(n);
    for (let i = 0; i < n; i++) {
      const type = TYPES[i % TYPES.length];
      const st = STATES[(i * 7) % STATES.length];
      rows[i] = {
        key: i,
        idx: i + 1,
        name: 'OC-' + type.toUpperCase() + '-' + String(1000 + i),
        type,
        mac: ('A4:5E:' + ((i * 13) % 256).toString(16).padStart(2, '0') + ':' +
              ((i * 31) % 256).toString(16).padStart(2, '0') + ':' +
              ((i * 7) % 256).toString(16).padStart(2, '0') + ':' +
              (i % 256).toString(16).padStart(2, '0')).toUpperCase(),
        clients: (i * 17) % 240,
        state: st,
      };
    }
    return rows;
  }

  function OmadaVirtualList(props) {
    const className = props.className || '';
    const rest = Object.assign({}, props);
    delete rest.className;

    const ctx = window.useOmada();
    const t = ctx.t;

    const [virtual, setVirtual] = useState(true);
    const [domCount, setDomCount] = useState(0);
    const wrapRef = useRef(null);

    const TOTAL_VIRTUAL = 10000;
    const TOTAL_PLAIN = 400; // safety cap when virtualization is off
    const total = virtual ? TOTAL_VIRTUAL : TOTAL_PLAIN;

    const allRows = useMemo(() => buildRows(TOTAL_VIRTUAL), []);
    const rows = useMemo(() => (virtual ? allRows : allRows.slice(0, TOTAL_PLAIN)), [virtual, allRows]);

    const columns = useMemo(() => [
      { title: '#', dataIndex: 'idx', width: 72,
        render: (v) => <span className="omada-vl-idx">{v}</span> },
      { title: t('vlist.col.device'), dataIndex: 'name', width: 220,
        render: (v, r) => (
          <span className="omada-vl-device">
            <Icon name={r.type} size={16} />
            <code>{v}</code>
          </span>
        ) },
      { title: t('vlist.col.mac'), dataIndex: 'mac', width: 180,
        render: (v) => <code className="omada-vl-mac">{v}</code> },
      { title: t('vlist.col.clients'), dataIndex: 'clients', width: 120, align: 'right',
        render: (v) => <span className="omada-vl-num">{v}</span> },
      { title: t('vlist.col.status'), dataIndex: 'state', width: 150,
        render: (st) => (
          <span className="omada-vl-status">
            <span className="omada-vl-dot" style={{ background: st.tone }} />
            {t('status.' + st.key)}
          </span>
        ) },
    ], [t]);

    // live DOM-row counter
    const recount = useCallback(() => {
      if (!wrapRef.current) return;
      const n = wrapRef.current.querySelectorAll('.ant-table-row').length;
      setDomCount(n);
    }, []);

    useEffect(() => {
      recount();
      const id = setInterval(recount, 400);
      return () => clearInterval(id);
    }, [recount, virtual]);

    const ratio = total > 0 ? Math.round((domCount / total) * 100) : 0;

    return (
      <div className={('omada-vl ' + className).trim()} {...rest}>

        <div className="omada-vl-bar">
          <label className="omada-vl-toggle">
            <Switch checked={virtual} onChange={setVirtual} size="small" />
            <span>{t('vlist.virtualOn')}</span>
          </label>
          <div className="omada-vl-meters">
            <div className="omada-vl-meter">
              <div className="omada-vl-metern">{total.toLocaleString(ctx.lang === 'zh' ? 'zh-CN' : 'en-US')}</div>
              <div className="omada-vl-meterl">{t('vlist.rowsTotal')}</div>
            </div>
            <div className="omada-vl-meter">
              <div className="omada-vl-metern" style={{ color: virtual ? 'var(--omada-green-500,#00A870)' : 'var(--omada-orange,#FF8C27)' }}>{domCount}</div>
              <div className="omada-vl-meterl">{t('vlist.rowsDom')}</div>
            </div>
            <div className="omada-vl-meter">
              <div className="omada-vl-metern">{ratio}%</div>
              <div className="omada-vl-meterl">{t('vlist.rowsRatio')}</div>
            </div>
          </div>
        </div>

        <div ref={wrapRef} className="omada-vl-tablewrap">
          <Table
            columns={columns}
            dataSource={rows}
            virtual={virtual}
            scroll={{ y: 360, x: 740 }}
            pagination={false}
            size="small"
            rowKey="key"
          />
        </div>

        <div className="omada-vl-cards">
          <div className="omada-vl-card">
            <span className="omada-vl-cardix"><Icon name="check-circle" size={18} /></span>
            <div className="omada-vl-cardtitle">{t('vlist.when.title')}</div>
            <div className="omada-vl-carddesc">{t('vlist.when.desc')}</div>
          </div>
          <div className="omada-vl-card">
            <span className="omada-vl-cardix"><Icon name="settings" size={18} /></span>
            <div className="omada-vl-cardtitle">{t('vlist.req.title')}</div>
            <div className="omada-vl-carddesc">{t('vlist.req.desc')}</div>
          </div>
          <div className="omada-vl-card">
            <span className="omada-vl-cardix" style={{ color: 'var(--omada-orange,#FF8C27)' }}><Icon name="warning" size={18} /></span>
            <div className="omada-vl-cardtitle">{t('vlist.cost.title')}</div>
            <div className="omada-vl-carddesc">{t('vlist.cost.desc')}</div>
          </div>
        </div>

        <div className="omada-vl-note">{t('vlist.note')}</div>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.VirtualList = OmadaVirtualList;
})();
