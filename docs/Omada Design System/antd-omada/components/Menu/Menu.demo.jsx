/* components/Menu/Menu.demo.jsx — Mounted by index.html. window.OmadaDemos.Menu */
(function () {
  const { Menu, Icon } = window.Omada;

  function buildItems(t, OmadaIcon) {
    const I = (cfg) => window.omadaMenuItem(t, OmadaIcon, cfg);
    return [
      { type: 'group', label: t('menu.group.monitor') },
      I({ key: 'dashboard', icon: 'dashboard', labelKey: 'menu.dashboard' }),
      I({ key: 'insights',  icon: 'insights',  labelKey: 'menu.insights' }),
      I({ key: 'map',       icon: 'map',       labelKey: 'menu.map' }),
      { type: 'divider' },
      { type: 'group', label: t('menu.group.manage') },
      I({ key: 'devices', icon: 'devices', labelKey: 'menu.devices', children: [
        I({ key: 'wireless', icon: 'wifi',    labelKey: 'menu.wireless' }),
        I({ key: 'wired',    icon: 'switch',  labelKey: 'menu.wired' }),
      ] }),
      I({ key: 'clients',  icon: 'clients',  labelKey: 'menu.clients' }),
      I({ key: 'services', icon: 'globe',    labelKey: 'menu.services', beta: true }),
      { type: 'divider' },
      { type: 'group', label: t('menu.group.system') },
      I({ key: 'logs',     icon: 'alerts',   labelKey: 'menu.logs' }),
      I({ key: 'settings', icon: 'settings', labelKey: 'menu.settings' }),
    ];
  }

  function MenuDemo() {
    const { t, lang } = window.useOmada();
    const [selected, setSelected] = React.useState(['dashboard']);
    const [openKeys, setOpenKeys] = React.useState(['devices']);
    const items = buildItems(t, Icon);

    const card = {
      width: 232, border: '1px solid var(--border-default,#ECECEC)',
      borderRadius: 8, overflow: 'hidden', background: 'var(--bg-surface,#fff)',
    };

    return (
      <>
        <div className="grid-2" style={{ gridTemplateColumns: '232px 1fr', alignItems: 'start' }}>
          <div>
            <div className="row"><span className="label">sectioned</span></div>
            <div style={card}>
              <Menu
                items={items}
                selectedKeys={selected}
                openKeys={openKeys}
                onSelect={({ selectedKeys }) => setSelected(selectedKeys)}
                onOpenChange={(k) => setOpenKeys(k)}
                style={{ borderInlineEnd: 'none' }}
              />
            </div>
            <div style={{ fontSize: 12, color: 'var(--fg-tertiary,#999)', marginTop: 10 }}>
              {lang === 'zh'
                ? '分组标题 + 分割线 · 选中项左侧 2px 绿色强调条 + 绿色文字'
                : 'Group titles + dividers · selected row = 2px green left accent bar + green label'}
            </div>
          </div>

          <div>
            <div className="row"><span className="label">collapsed</span></div>
            <div style={{ ...card, width: 64 }}>
              <Menu
                items={items.filter((it) => it.type !== 'group' && it.type !== 'divider')}
                selectedKeys={selected}
                onSelect={({ selectedKeys }) => setSelected(selectedKeys)}
                inlineCollapsed
                style={{ borderInlineEnd: 'none' }}
              />
            </div>
          </div>
        </div>
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Menu = MenuDemo;
})();
