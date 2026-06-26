/* components/WidgetGrid/WidgetGrid.demo.jsx — window.OmadaDemos.WidgetGrid */
(function () {
  const { useState } = React;
  const WidgetGrid = window.Omada.WidgetGrid;
  const Statistic = window.Omada.Statistic;
  const Sparkline = window.Omada.Sparkline;
  const StatusPill = window.Omada.StatusPill;
  const Icon = window.Omada.Icon;
  const Button = window.Omada.Button;

  function WidgetGridDemo() {
    const ctx = window.useOmada();
    const t = ctx.t; const lang = ctx.lang;

    const seed = [
      { key: 'throughput', title: t('wg.w.throughput'), icon: 'trending-up', span: 2, kind: 'spark' },
      { key: 'clients',    title: t('wg.w.clients'),    icon: 'clients',     span: 1, kind: 'kpi', value: 248, trend: { dir: 'up', value: '6%' } },
      { key: 'uptime',     title: t('wg.w.uptime'),     icon: 'check-circle', span: 1, kind: 'kpi', value: '99.9%', trend: { dir: 'up', value: '0.2%' } },
      { key: 'alerts',     title: t('wg.w.alerts'),     icon: 'alerts',      span: 1, kind: 'list' },
      { key: 'devices',    title: t('wg.w.devices'),    icon: 'devices',     span: 1, kind: 'kpi', value: 36, trend: { dir: 'down', value: '1' } },
    ];
    const [tiles, setTiles] = useState(seed);

    const renderTile = function (it) {
      if (it.kind === 'spark') {
        return (
          <div className="omada-wg-spark">
            <div className="omada-wg-sparkval">1.84 <span>Gbps</span></div>
            <Sparkline data={[8, 11, 9, 14, 12, 17, 15, 19, 16, 21]} tone="up" height={48} width={260} />
          </div>
        );
      }
      if (it.kind === 'kpi') {
        return <Statistic value={it.value} trend={it.trend} valueStyle={{ fontSize: 26, fontWeight: 700 }} />;
      }
      if (it.kind === 'list') {
        return (
          <ul className="omada-wg-mini">
            <li><StatusPill status="disconnected" lang={lang} /><span>AP-Lobby-2</span></li>
            <li><StatusPill status="pending" lang={lang} /><span>SW-Core-01</span></li>
          </ul>
        );
      }
      return null;
    };

    return (
      <div className="omada-wg-demo">
        <WidgetGrid
          tiles={tiles}
          columns={3}
          onChange={function (next) { setTiles(next); }}
          onRemove={function () { /* a dashboard would persist here */ }}
          renderTile={renderTile}
        />
        <div className="omada-wg-foot">
          <span className="omada-wg-kbd">
            <Icon name="grip-vertical" size={13} />{t('wg.hint')}
          </span>
          <Button variant="text" size="small" onClick={function () { setTiles(seed); }}>
            <Icon name="refresh" size={14} />{t('wg.reset')}
          </Button>
        </div>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.WidgetGrid = WidgetGridDemo;
})();
