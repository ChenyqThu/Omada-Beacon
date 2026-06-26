/* ────────────────────────────────────────────────────────────────────────
   components/Sidebar/Sidebar.jsx — Omada.Sidebar

   The product MAIN MENU (Figma "Sidebar 侧边导航栏" node 1198:20546).
   A 216px rail on the warm-grey app field (#F7F7F7) holding:
     • a collapse toggle (top-left, 20px glyph)
     • a Site selector chip (grey #ECECEC plate, site icon + name + up/down)
     • grouped first-level nav. Each group = a 13px grey section title + rows.
       Row = 20px leading icon · 14px label · optional BETA · 16px chevron.
       Selected row paints a FULL-WIDTH WHITE band with brand-green
       text / icon / chevron (#00A870) — NOT a left accent bar (that was the
       old antd-Menu approximation; the Figma uses On4 = white bg + green ink).
     • collapsed (52px) state: icon-only rail, group titles collapse to a
       hairline, selected icon keeps the green ink + white plate.

   Data-driven:
     groups = [{ title, items:[{ key, label, icon, beta, danger }] }]
   Icons resolve through OmadaIcon names that exist in the real Figma set
   (settings · device · client · map · insight · log-alert · health · abnormal
    · network-config · device-config · hotspot · tools · intellirecover ·
    maintenance · site · right · up-down).

   Exports: window.Omada.Sidebar
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const Icon = window.OmadaIcon;

  function BetaTag() {
    return <span className="om-sb-beta">BETA</span>;
  }

  function SidebarItem({ item, active, collapsed, onSelect }) {
    return (
      <button
        type="button"
        className={'om-sb-item' + (active ? ' is-active' : '') + (item.danger ? ' is-danger' : '')}
        aria-current={active ? 'page' : undefined}
        title={collapsed ? item.label : undefined}
        onClick={() => onSelect && onSelect(item.key)}
      >
        <span className="om-sb-item-main">
          <Icon name={item.icon} size={20} className="om-sb-item-icon" />
          {!collapsed && (
            <span className="om-sb-item-label">
              <span className="om-sb-item-text">{item.label}</span>
              {item.beta && <BetaTag />}
            </span>
          )}
        </span>
        {!collapsed && <Icon name="right" size={16} className="om-sb-item-arrow" />}
      </button>
    );
  }

  function OmadaSidebar(props) {
    const { useState } = React;
    const groups = props.groups || [];
    const siteName = props.siteName || 'Site Name 1111';

    const controlledSel = props.selectedKey != null;
    const [innerSel, setInnerSel] = useState(props.defaultSelectedKey || null);
    const selectedKey = controlledSel ? props.selectedKey : innerSel;
    const handleSelect = (k) => {
      if (!controlledSel) setInnerSel(k);
      props.onSelect && props.onSelect(k);
    };

    const controlledCol = props.collapsed != null;
    const [innerCol, setInnerCol] = useState(!!props.defaultCollapsed);
    const collapsed = controlledCol ? props.collapsed : innerCol;
    const toggle = () => {
      const next = !collapsed;
      if (!controlledCol) setInnerCol(next);
      props.onToggleCollapse && props.onToggleCollapse(next);
    };

    return (
      <aside className={'om-sidebar' + (collapsed ? ' is-collapsed' : '') + (props.className ? ' ' + props.className : '')} style={props.style}>
        <button
          type="button"
          className="om-sb-collapse"
          aria-label={collapsed ? 'Expand menu' : 'Collapse menu'}
          onClick={toggle}
        >
          <Icon name="layout-sidebar-right-expand" size={20} />
        </button>

        <div className="om-sb-site" role={collapsed ? undefined : 'button'} title={siteName}>
          <span className="om-sb-site-plate">
            <Icon name="site" size={20} className="om-sb-site-icon" />
            {!collapsed && <span className="om-sb-site-name">{siteName}</span>}
            {!collapsed && <Icon name="up-down" size={16} className="om-sb-site-arrow" />}
          </span>
        </div>

        <nav className="om-sb-nav" aria-label="Main menu">
          {groups.map((g, gi) => (
            <div className="om-sb-group" key={g.key || g.title || gi}>
              {collapsed ? <div className="om-sb-group-rule" aria-hidden="true" /> : <div className="om-sb-group-title">{g.title}</div>}
              <div className="om-sb-group-items">
                {(g.items || []).map((it) => (
                  <SidebarItem
                    key={it.key}
                    item={it}
                    active={selectedKey === it.key}
                    collapsed={collapsed}
                    onSelect={handleSelect}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.Sidebar = OmadaSidebar;
})();
