/* ────────────────────────────────────────────────────────────────────────
   components/AppShell/AppShell.jsx — OmadaAppShell

   The product chrome: antd <Layout> with the Omada green <Header> top bar, a
   collapsible <Sider> holding an <Omada.Menu>, and a content region with an
   optional breadcrumb + page title. This is the one wrapper that adds real
   structure (it composes Layout + Header + Sider + Menu) rather than a single
   antd component — but it still forwards to antd primitives and drives every
   colour through tokens / the omada-topbar CSS.

   The green top bar is a gradient antd can't express as a token, so it lives
   in omada-overrides.css as `.omada-topbar` (+ a dark twin that keeps the
   brand green for continuity, matching the theme's Layout.headerBg). Header
   height (56) and siderBg come from omada-theme.js → components.Layout.

   Top-bar contents (all optional, sensible Omada defaults):
     • brand logo + product name
     • org / site switcher (antd Dropdown)
     • centre service nav (Cloud / On-Premises / Account Manager)
     • search field, notifications (Badge), theme toggle, help, account menu
   Theme + language toggles are wired to useOmada() so the shell is live.

   Figma: Top Bar 顶部栏 node 285:6342 (green bar #038069→#026E64, h56, logo +
   org switcher + text nav + right icon cluster) and Sidebar 侧边导航栏
   node 1198:20546 (216px sider, 36px rows, left accent bar).

   Exports: window.Omada.AppShell
   ──────────────────────────────────────────────────────────────────────── */

const { Layout: AntLayout, Dropdown: AntDropdownShell, Badge: AntBadgeShell, Avatar: AntAvatarShell, Tooltip: AntTooltipShell } = window.antd;
const { Header: AntHeader, Sider: AntSider, Content: AntContent } = AntLayout;

function ShellTopBarButton({ icon, label, badge, onClick }) {
  const inner = (
    <button type="button" className="omada-topbar-icon" aria-label={label} onClick={onClick}>
      <window.OmadaIcon name={icon} size={18} />
    </button>
  );
  const node = badge
    ? <AntBadgeShell count={badge} size="small" offset={[-4, 4]}>{inner}</AntBadgeShell>
    : inner;
  return <AntTooltipShell title={label}>{node}</AntTooltipShell>;
}

function ShellServiceNav({ value, onChange, t }) {
  const items = [
    { key: 'cloud', label: t('shell.cloud') },
    { key: 'on',    label: t('shell.onPremises') },
    { key: 'acct',  label: t('shell.accountMgr') },
  ];
  return (
    <nav className="omada-topbar-nav" role="tablist">
      {items.map((it) => (
        <button
          key={it.key}
          role="tab"
          aria-selected={value === it.key}
          className={'omada-topbar-navitem' + (value === it.key ? ' is-active' : '')}
          onClick={() => onChange && onChange(it.key)}
        >
          {it.label}
        </button>
      ))}
    </nav>
  );
}

function OmadaAppShell({
  menuItems,
  selectedKeys,
  defaultSelectedKeys = ['dashboard'],
  openKeys,
  defaultOpenKeys,
  onMenuSelect,
  onOpenChange,
  collapsed,
  defaultCollapsed = false,
  onCollapse,
  breadcrumb,
  title,
  extra,
  children,
  showServiceNav = true,
  contentStyle,
  style,
  ...rest
}) {
  const { useState } = React;
  const { mode, toggleMode, lang, setLang, t } = window.useOmada();
  const OmadaIcon = window.OmadaIcon;

  const [innerCollapsed, setInnerCollapsed] = useState(defaultCollapsed);
  const isCollapsed = collapsed != null ? collapsed : innerCollapsed;
  const setCollapsed = (v) => { if (collapsed == null) setInnerCollapsed(v); onCollapse && onCollapse(v); };

  const [service, setService] = useState('cloud');

  const orgMenu = {
    items: [
      { key: 'all', label: t('shell.allSites') },
      { type: 'divider' },
      { key: 's1', label: t('shell.site') },
      { key: 's2', label: 'Branch — Lab' },
    ],
    selectedKeys: ['s1'],
  };

  const accountMenu = {
    items: [
      { key: 'profile', icon: <OmadaIcon name="user" size={16} />, label: t('dd.profile') },
      { key: 'prefs',   icon: <OmadaIcon name="settings" size={16} />, label: t('dd.preferences') },
      { key: 'lang',    icon: <OmadaIcon name="languages" size={16} />,
        label: lang === 'zh' ? 'English' : '中文' },
      { type: 'divider' },
      { key: 'signout', icon: <OmadaIcon name="power" size={16} />, label: t('common.signOut') },
    ],
    onClick: ({ key }) => { if (key === 'lang') setLang(lang === 'zh' ? 'en' : 'zh'); },
  };

  return (
    <AntLayout className="omada-appshell" style={{ minHeight: 520, ...style }}>
      <AntHeader className="omada-topbar">
        <div className="omada-topbar-left">
          <button
            type="button"
            className="omada-topbar-icon"
            aria-label={isCollapsed ? t('shell.expand') : t('shell.collapse')}
            onClick={() => setCollapsed(!isCollapsed)}
          >
            <OmadaIcon name="more-horizontal" size={18} />
          </button>
          <div className="omada-topbar-brand">
            <OmadaIcon name="cloud" size={22} />
            <span className="omada-topbar-product">{t('shell.product')}</span>
          </div>
          <AntDropdownShell menu={orgMenu} trigger={['click']}>
            <button type="button" className="omada-topbar-org">
              <span className="omada-topbar-org-name">{t('shell.org')}</span>
              <span className="omada-topbar-org-sub">{t('shell.site')}</span>
              <OmadaIcon name="chevron-down" size={16} />
            </button>
          </AntDropdownShell>
        </div>

        {showServiceNav && (
          <ShellServiceNav value={service} onChange={setService} t={t} />
        )}

        <div className="omada-topbar-right">
          <ShellTopBarButton icon="search" label={t('common.search')} />
          <ShellTopBarButton icon="refresh" label={t('common.refresh')} />
          <ShellTopBarButton icon="bell" label={t('shell.notifications')} badge={3} />
          <ShellTopBarButton
            icon={mode === 'dark' ? 'sun' : 'moon'}
            label={mode === 'dark' ? 'Light' : 'Dark'}
            onClick={toggleMode}
          />
          <ShellTopBarButton icon="help-circle" label={t('shell.help')} />
          <AntDropdownShell menu={accountMenu} trigger={['click']} placement="bottomRight">
            <button type="button" className="omada-topbar-account" aria-label={t('shell.account')}>
              <AntAvatarShell size={28} style={{ background: 'rgba(255,255,255,0.22)', color: '#fff', fontSize: 13, fontWeight: 600 }}>A</AntAvatarShell>
              <OmadaIcon name="chevron-down" size={16} />
            </button>
          </AntDropdownShell>
        </div>
      </AntHeader>

      <AntLayout hasSider>
        <AntSider
          className="omada-sider"
          width={216}
          collapsedWidth={64}
          collapsible
          collapsed={isCollapsed}
          trigger={null}
        >
          <window.Omada.Menu
            items={menuItems}
            mode="inline"
            selectedKeys={selectedKeys}
            defaultSelectedKeys={defaultSelectedKeys}
            openKeys={openKeys}
            defaultOpenKeys={defaultOpenKeys}
            onSelect={onMenuSelect}
            onOpenChange={onOpenChange}
            inlineCollapsed={isCollapsed}
          />
        </AntSider>

        <AntContent className="omada-content" style={contentStyle}>
          {(breadcrumb || title || extra) && (
            <div className="omada-content-head">
              {breadcrumb}
              {(title || extra) && (
                <div className="omada-content-titlerow">
                  {title && <h1 className="omada-content-title">{title}</h1>}
                  {extra && <div className="omada-content-extra">{extra}</div>}
                </div>
              )}
            </div>
          )}
          <div className="omada-content-body">{children}</div>
        </AntContent>
      </AntLayout>
    </AntLayout>
  );
}

window.Omada = window.Omada || {};
window.Omada.AppShell = OmadaAppShell;
