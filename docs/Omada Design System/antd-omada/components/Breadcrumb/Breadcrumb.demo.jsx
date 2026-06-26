/* components/Breadcrumb/Breadcrumb.demo.jsx — Mounted by index.html. window.OmadaDemos.Breadcrumb */
(function () {
  const { Breadcrumb, Dropdown, Icon } = window.Omada;

  function BreadcrumbDemo() {
    const { t, lang } = window.useOmada();

    const homeTitle = (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <Icon name="dashboard" size={14} />{t('crumb.home')}
      </span>
    );

    return (
      <>
        <div className="row"><span className="label">default</span></div>
        <Breadcrumb
          items={[
            { title: homeTitle, href: '#' },
            { title: t('crumb.devices'), href: '#' },
            { title: t('crumb.switches'), href: '#' },
            { title: t('crumb.deviceName') },
          ]}
        />

        <div className="row" style={{ marginTop: 18 }}><span className="label">with menu</span></div>
        <Breadcrumb
          items={[
            { title: homeTitle, href: '#' },
            {
              title: t('crumb.devices'),
              menu: {
                items: [
                  { key: 'sw', label: t('crumb.switches') },
                  { key: 'ap', label: t('net.ap') },
                  { key: 'gw', label: t('net.gateway') },
                ],
              },
            },
            { title: t('crumb.deviceName') },
          ]}
        />

        <div className="row" style={{ marginTop: 18 }}><span className="label">two-level</span></div>
        <Breadcrumb items={[{ title: homeTitle, href: '#' }, { title: t('menu.settings') }]} />

        <div style={{ fontSize: 12, color: 'var(--fg-tertiary,#999)', marginTop: 14 }}>
          {lang === 'zh'
            ? '分隔符为 Omada 标志性的倾斜斜杠（≈15°，#999），非默认的 “>”'
            : 'Separator is the Omada signature slanted slash (≈15°, #999), not the default “>”'}
        </div>
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Breadcrumb = BreadcrumbDemo;
})();
