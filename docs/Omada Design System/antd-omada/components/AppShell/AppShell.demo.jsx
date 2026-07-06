/* components/AppShell/AppShell.demo.jsx — Mounted by index.html. window.OmadaDemos.AppShell */
(function () {
  const { AppShell, Menu, Breadcrumb, Button, Icon, Statistic } = window.Omada;
  const { Card } = window.antd;

  function buildMenu(t, OmadaIcon) {
    const I = (cfg) => window.omadaMenuItem(t, OmadaIcon, cfg);
    return [
      { type: 'group', label: t('menu.group.monitor') },
      I({ key: 'dashboard', icon: 'dashboard', labelKey: 'menu.dashboard' }),
      I({ key: 'insights',  icon: 'insights',  labelKey: 'menu.insights' }),
      { type: 'divider' },
      { type: 'group', label: t('menu.group.manage') },
      I({ key: 'devices', icon: 'devices', labelKey: 'menu.devices', children: [
        I({ key: 'wireless', icon: 'wifi',   labelKey: 'menu.wireless' }),
        I({ key: 'wired',    icon: 'switch', labelKey: 'menu.wired' }),
      ] }),
      I({ key: 'clients',  icon: 'clients', labelKey: 'menu.clients' }),
      I({ key: 'services', icon: 'globe',   labelKey: 'menu.services', beta: true }),
      { type: 'divider' },
      { type: 'group', label: t('menu.group.system') },
      I({ key: 'logs',     icon: 'alerts',   labelKey: 'menu.logs' }),
      I({ key: 'settings', icon: 'settings', labelKey: 'menu.settings' }),
    ];
  }

  function AppShellDemo() {
    const { t, lang } = window.useOmada();
    const [selected, setSelected] = React.useState(['dashboard']);
    const menuItems = buildMenu(t, Icon);

    const crumb = (
      <Breadcrumb
        items={[
          { title: <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name="dashboard" size={14} />{t('crumb.home')}</span>, href: '#' },
          { title: t('menu.devices'), href: '#' },
          { title: t('menu.dashboard') },
        ]}
      />
    );

    const stats = [
      { icon: 'devices', labelKey: 'stat.totalDevices', value: 48 },
      { icon: 'check-circle', labelKey: 'stat.online', value: 45, iconTone: '#00A870' },
      { icon: 'clients', labelKey: 'stat.clients', value: 312 },
    ];

    return (
      <div style={{ border: '1px solid var(--border-default,#ECECEC)', borderRadius: 12, overflow: 'hidden', height: 580 }}>
        <AppShell
          menuItems={menuItems}
          selectedKeys={selected}
          defaultOpenKeys={['devices']}
          onMenuSelect={({ selectedKeys }) => setSelected(selectedKeys)}
          breadcrumb={crumb}
          title={t('menu.dashboard')}
          extra={<Button variant="primary" icon={<Icon name="plus" size={16} />}>{t('device.addDevice')}</Button>}
          style={{ height: 580 }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {stats.map((s) => (
              <Card key={s.labelKey} size="small" style={{ borderRadius: 8 }}>
                <Statistic
                  icon={s.icon}
                  iconTone={s.iconTone}
                  title={t(s.labelKey)}
                  value={s.value}
                />
              </Card>
            ))}
          </div>
          <div style={{ marginTop: 16, padding: '28px 20px', border: '1px dashed var(--border-default,#ECECEC)', borderRadius: 8,
                        color: 'var(--fg-tertiary,#999)', fontSize: 13, textAlign: 'center' }}>
            {lang === 'zh'
              ? '内容区 · 顶部绿色栏 + 可折叠侧边栏（点击左上角图标折叠）· 主题/语言切换已接入右上角'
              : 'Content region · green top bar + collapsible sider (toggle via the top-left icon) · theme & language wired into the top-right cluster'}
          </div>
        </AppShell>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.AppShell = AppShellDemo;
})();
