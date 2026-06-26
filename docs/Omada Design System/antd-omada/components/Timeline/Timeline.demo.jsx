/* components/Timeline/Timeline.demo.jsx — window.OmadaDemos.Timeline */
(function () {
  const { Timeline } = window.Omada;

  function Entry({ title, sub }) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--fg-primary)' }}>{title}</span>
        <span style={{ fontSize: 12, color: 'var(--fg-tertiary)' }}>{sub}</span>
      </div>
    );
  }

  function TimelineDemo() {
    const { t } = window.useOmada();

    const items = [
      { tone: 'success', iconName: 'adopt',     children: <Entry title={t('tl.adopted')} sub={t('tl.adoptedAt')} /> },
      { tone: 'success', iconName: 'download',   children: <Entry title={t('tl.provisioned')} sub={t('tl.provisionedAt')} /> },
      { tone: 'success', iconName: 'check-circle',children: <Entry title={t('tl.online')} sub={t('tl.onlineAt')} /> },
      { tone: 'info',    iconName: 'info',        children: <Entry title={t('tl.firmware')} sub={t('tl.firmwareAt')} /> },
      { tone: 'warning', iconName: 'warning',     children: <Entry title={t('tl.warning')} sub={t('tl.warningAt')} /> },
      { tone: 'error',   iconName: 'disconnect',  children: <Entry title={t('tl.offline')} sub={t('tl.offlineAt')} /> },
    ];

    const pendingItems = [
      { tone: 'success', children: <Entry title={t('tl.adopted')} sub={t('tl.adoptedAt')} /> },
      { tone: 'success', children: <Entry title={t('tl.provisioned')} sub={t('tl.provisionedAt')} /> },
      { tone: 'processing', children: <Entry title={t('status.adopting')} sub={t('loading.tip')} /> },
    ];

    return (
      <>
        <div className="row"><span className="label">{t('tl.title')}</span></div>
        <div className="grid-2" style={{ alignItems: 'start' }}>
          <div style={{ paddingTop: 8 }}>
            <Timeline items={items} />
          </div>
          <div style={{ paddingTop: 8 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)', marginBottom: 14 }}>
              processing · pending
            </div>
            <Timeline items={pendingItems} pending={t('loading.fetching')} />
          </div>
        </div>
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Timeline = TimelineDemo;
})();
