/* components/AuditTrail/AuditTrail.demo.jsx — window.OmadaDemos.AuditTrail */
(function () {
  const AuditTrail = window.Omada.AuditTrail;
  const { Segmented } = window.antd;

  function AuditTrailDemo() {
    const { useState, useMemo } = React;
    const ctx = window.useOmada();
    const t = ctx.t;
    const [filter, setFilter] = useState('all');

    const entries = useMemo(() => {
      const now = Date.now();
      const h = 3600000;
      return [
        { id: 1, ts: now - 0.4 * h, actor: 'admin', action: t('audit.a.cfg'), target: 'guest-portal.timeout', ip: '192.168.0.12', via: 'Web', result: 'success' },
        { id: 2, ts: now - 1.2 * h, actor: 'n.zhang', action: t('audit.a.fw'), target: 'EAP-660 HD ×4', ip: '10.0.8.3', via: 'Cloud', result: 'success' },
        { id: 3, ts: now - 2.1 * h, actor: 'viewer01', action: t('audit.a.export'), target: 'clients.csv', ip: '192.168.0.87', via: 'Web', result: 'denied' },
        { id: 4, ts: now - 3.6 * h, actor: 'admin', action: t('audit.a.login'), ip: '192.168.0.12', via: 'Web', result: 'success' },
        { id: 5, ts: now - 26 * h, actor: 'unknown', action: t('audit.a.loginfail'), ip: '203.0.113.54', via: 'API', result: 'failed' },
        { id: 6, ts: now - 27.5 * h, actor: 'unknown', action: t('audit.a.loginfail'), ip: '203.0.113.54', via: 'API', result: 'failed' },
        { id: 7, ts: now - 29 * h, actor: 'j.silva', action: t('audit.a.acl'), target: 'ACL-12 IoT→LAN', ip: '10.0.8.21', via: 'Web', result: 'success' },
        { id: 8, ts: now - 73 * h, actor: 'admin', action: t('audit.a.user'), target: 'j.silva', ip: '192.168.0.12', via: 'Web', result: 'success' },
        { id: 9, ts: now - 75 * h, actor: 'n.zhang', action: t('audit.a.del'), target: 'Voucher #2210', ip: '10.0.8.3', via: 'Cloud', result: 'success' },
      ];
    }, [t]);

    return (
      <div className="omada-audit-demo">
        <div className="omada-audit-toolbar">
          <Segmented
            size="small"
            value={filter}
            onChange={setFilter}
            options={[
              { value: 'all', label: t('audit.f.all') },
              { value: 'success', label: t('audit.r.success') },
              { value: 'failed', label: t('audit.r.failed') },
              { value: 'denied', label: t('audit.r.denied') },
            ]}
          />
        </div>
        <AuditTrail entries={entries} filter={filter} />
        <p className="omada-audit-pagehint">{t('audit.hint')}</p>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.AuditTrail = AuditTrailDemo;
})();
