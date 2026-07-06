/* components/Statistic/Statistic.demo.jsx — Mounted by index.html. window.OmadaDemos.Statistic */
(function () {
  const { Statistic } = window.Omada;

  function Tile({ children }) {
    return (
      <div style={{
        flex: 1, minWidth: 180, padding: '18px 20px', borderRadius: 8,
        border: '1px solid var(--border-default, #ECECEC)',
        background: 'var(--om-tile-bg, transparent)',
      }}>
        {children}
      </div>
    );
  }

  function StatisticDemo() {
    const { t } = window.useOmada();
    return (
      <>
        <div className="row" style={{ alignItems: 'stretch', gap: 14 }}>
          <Tile>
            <Statistic icon="devices" title={t('stat.totalDevices')} value={248} />
          </Tile>
          <Tile>
            <Statistic icon="cloud" iconTone="var(--omada-green-500,#00A870)"
              title={t('stat.online')} value={231}
              suffix={<span style={{ fontSize: 14, color: 'var(--fg-tertiary,#999)' }}>/ 248</span>}
              trend={{ dir: 'up', value: '3.2%' }} />
          </Tile>
          <Tile>
            <Statistic icon="clients" title={t('stat.clients')} value={1864}
              trend={{ dir: 'down', value: '1.1%' }} />
          </Tile>
        </div>
        <div className="row" style={{ alignItems: 'stretch', gap: 14 }}>
          <Tile>
            <Statistic icon="insights" title={t('stat.throughput')} value={4.82} precision={2} suffix="Gbps" />
          </Tile>
          <Tile>
            <Statistic icon="clock" title={t('stat.uptime')} value={99.98} precision={2} suffix="%" />
          </Tile>
          <Tile>
            <Statistic title={t('common.loading')} value={0} loading />
          </Tile>
        </div>
        {/* ── Batch 17 — remaining Statistic surfaces: prefix / formatter / edge formats ── */}
        <div className="row" style={{ alignItems: 'stretch', gap: 14 }}>
          <Tile>
            <Statistic icon="trending-up" title={t('stat.spend')} value={12480}
              prefix="$" precision={2} />
          </Tile>
          <Tile>
            <Statistic icon="clock" iconTone="var(--omada-blue,#0069CB)" title={t('stat.uptimeFmt')} value={189000}
              formatter={(v) => {
                const s = Number(v); const d = Math.floor(s / 86400); const h = Math.floor((s % 86400) / 3600);
                return <span><b>{d}</b>d <b>{h}</b>h</span>;
              }} />
          </Tile>
          <Tile>
            <Statistic icon="devices" title={t('stat.firstMac')}
              valueStyle={{ fontFamily: 'var(--font-mono)', fontSize: 20, letterSpacing: '0.02em' }}
              value="A4:5E:60:1C:0F:32"
              formatter={(v) => v} />
          </Tile>
        </div>
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Statistic = StatisticDemo;
})();
