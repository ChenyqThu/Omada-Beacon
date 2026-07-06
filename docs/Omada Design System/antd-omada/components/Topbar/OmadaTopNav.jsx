/* ────────────────────────────────────────────────────────────────────────
   components/Topbar/OmadaTopNav.jsx — Omada.TopNav

   The product NAV BAR (Figma "Top Bar 顶部栏" node 285:6342). A 56px green
   gradient bar: linear-gradient(90deg,#038069,#026E64).

   Portal layout (system level):
     • white Omada wordmark (left)
     • SYSTEM TABS — browser-tab shape, bottom-aligned in the bar. The
       selected tab is a WHITE shape with 8px rounded top corners and concave
       quarter-circle notches at the bottom edge that flare into the surface
       below (Figma On2 "Subtract" geometry); its label is brand-green
       (#00A870, 14/Medium). Inactive labels are white@64%. Optional red count
       badge top-right of each tab.
     • right ICON CLUSTER (Figma "类型=icon" node 1274:31319) — 32px white
       glyphs, gap 8, translucent hover plate: search · refresh · theme ·
       account(avatar) · more(kebab).

   Data-driven:
     tabs    = [{ key, label, badge }]
     actions = [{ key, icon, badge, onClick }]  (defaults to the Figma cluster)
   Theme toggle + account avatar are wired through useOmada() when present.

   Exports: window.Omada.TopNav
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const Icon = window.OmadaIcon;

  const LOGO_SRC = '../assets/omada-logo-dark.svg'; // white wordmark for the green bar

  function Badge({ count }) {
    if (count == null) return null;
    const txt = count > 99 ? '99+' : String(count);
    return <span className="om-tn-badge">{txt}</span>;
  }

  function NavTab({ tab, active, onClick }) {
    return (
      <button
        type="button"
        role="tab"
        aria-selected={active}
        className={'om-tn-tab' + (active ? ' is-active' : '')}
        onClick={() => onClick && onClick(tab.key)}
      >
        <span className="om-tn-tab-inner">
          <span className="om-tn-tab-label">{tab.label}</span>
          <Badge count={tab.badge} />
        </span>
      </button>
    );
  }

  function ActionBtn({ action }) {
    return (
      <button
        type="button"
        className="om-tn-act"
        aria-label={action.label || action.key}
        title={action.label}
        onClick={action.onClick}
      >
        {action.avatar
          ? <span className="om-tn-avatar"><Icon name="account" size={20} /></span>
          : <Icon name={action.icon} size={20} />}
        <Badge count={action.badge} />
      </button>
    );
  }

  function OmadaTopNav(props) {
    const ctx = window.useOmada ? window.useOmada() : null;
    const tabs = props.tabs || [];
    const controlled = props.activeTab != null;
    const { useState } = React;
    const [inner, setInner] = useState(props.defaultActiveTab || (tabs[0] && tabs[0].key));
    const activeTab = controlled ? props.activeTab : inner;
    const onTabChange = (k) => {
      if (!controlled) setInner(k);
      props.onTabChange && props.onTabChange(k);
    };

    // Default right cluster mirrors the Figma "类型=icon" set.
    const defaultActions = [
      { key: 'search',  icon: 'search',  label: 'Search' },
      { key: 'refresh', icon: 'refresh', label: 'Refresh' },
      { key: 'theme',   icon: 'mode-light', label: 'Theme',
        onClick: () => ctx && ctx.toggleMode && ctx.toggleMode() },
      { key: 'account', avatar: true, label: 'Account' },
      { key: 'more',    icon: 'more', label: 'More' },
    ];
    const actions = props.actions || defaultActions;

    return (
      <header className={'om-topnav' + (props.className ? ' ' + props.className : '')} style={props.style}>
        <div className="om-tn-left">
          <a className="om-tn-logo" href="#" aria-label="Omada">
            <img src={props.logoSrc || LOGO_SRC} alt="Omada" draggable="false" />
          </a>
          {tabs.length > 0 && (
            <nav className="om-tn-tabs" role="tablist" aria-label="Systems">
              {tabs.map((t) => (
                <NavTab key={t.key} tab={t} active={activeTab === t.key} onClick={onTabChange} />
              ))}
            </nav>
          )}
        </div>

        <div className="om-tn-actions">
          {actions.map((a) => <ActionBtn key={a.key} action={a} />)}
        </div>
      </header>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.TopNav = OmadaTopNav;
})();
