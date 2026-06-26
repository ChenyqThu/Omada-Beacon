/* components/Topbar/Topbar.demo.jsx — window.OmadaDemos.Topbar */
(function () {
  const Topbar = window.Omada.Topbar;

  function TopbarDemo() {
    const { useState } = React;
    const ctx = window.useOmada();
    const t = ctx.t;
    const [tab, setTab] = useState('overview');
    const [last, setLast] = useState('');

    const nav = [
      { key: 'overview', label: t('tb.nav.overview'), icon: 'dashboard' },
      { key: 'devices', label: t('tb.nav.devices'), icon: 'devices' },
      { key: 'clients', label: t('tb.nav.clients'), icon: 'clients' },
      { key: 'logs', label: t('tb.nav.logs'), icon: 'list' },
    ];

    const actions = [
      { key: 'search', icon: 'search', label: t('common.search'), onClick: () => setLast('search') },
      { key: 'add', icon: 'plus', label: t('common.add'), tone: 'brand', onClick: () => setLast('add') },
      { key: 'refresh', icon: 'refresh', label: t('common.refresh'), onClick: () => setLast('refresh') },
      { key: 'alerts', icon: 'bell', label: t('tb.act.alerts'), badge: 3, onClick: () => setLast('alerts') },
      { key: 'theme', icon: ctx.mode === 'dark' ? 'moon' : 'sun', label: t('tb.act.theme'), onClick: () => { ctx.toggleMode(); setLast('theme'); } },
      { key: 'help', icon: 'help-circle', label: t('tb.act.help'), onClick: () => setLast('help') },
      { key: 'account', icon: 'user', label: t('tb.act.account'), onClick: () => setLast('account') },
    ];

    return (
      <div className="omada-tb-demo">
        {/* wide — everything fits */}
        <div className="omada-tb-stage">
          <Topbar title={t('tb.title')} nav={nav} activeKey={tab} onNavChange={setTab} actions={actions} />
        </div>

        {/* resizable — drag the handle to watch actions collapse into ⋮ */}
        <div className="omada-tb-hint">{t('tb.resizehint')}</div>
        <div className="omada-tb-stage omada-tb-resizable">
          <Topbar title={t('tb.title')} nav={nav.slice(0, 3)} activeKey={tab} onNavChange={setTab} actions={actions} />
        </div>

        {/* narrow — labels mode, most actions overflow */}
        <div className="omada-tb-stage" style={{ maxWidth: 420 }}>
          <Topbar title={t('tb.title2')} actions={actions} minVisible={2} />
        </div>

        <div className="omada-tb-echo">
          {t('tb.lastaction')}: <strong>{last ? (t('tb.a.' + last) || last) : t('tb.none')}</strong>
        </div>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Topbar = TopbarDemo;
})();
