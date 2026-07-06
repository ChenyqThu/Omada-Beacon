/* Omada Sidebar — sectioned nav: Manage / Monitoring / Configuration / Maintain */

const NAV = [
  {
    section: 'Manage',
    items: [
      { id: 'dashboard', label: 'Dashboard',    icon: 'layout-dashboard' },
      { id: 'devices',   label: 'Devices',      icon: 'radio' },
      { id: 'clients',   label: 'Clients',      icon: 'users' },
    ],
  },
  {
    section: 'Monitoring',
    items: [
      { id: 'map',       label: 'Map',          icon: 'map' },
      { id: 'insights',  label: 'Insights',     icon: 'lightbulb' },
      { id: 'alerts',    label: 'Alerts & Logs', icon: 'bell', badge: '12' },
      { id: 'health',    label: 'Health',       icon: 'activity' },
    ],
  },
  {
    section: 'Configuration',
    items: [
      { id: 'network',   label: 'Network Config', icon: 'globe',     chevron: true },
      { id: 'devcfg',    label: 'Device Config',  icon: 'settings-2', chevron: true },
      { id: 'hotspot',   label: 'Hotspot',        icon: 'wifi',       chevron: true },
    ],
  },
  {
    section: 'Maintain',
    items: [
      { id: 'tools',     label: 'Tools',          icon: 'briefcase',  chevron: true },
      { id: 'recover',   label: 'IntelliRecover', icon: 'rotate-ccw', betaTag: true },
      { id: 'maint',     label: 'Maintenance',    icon: 'wrench' },
    ],
  },
];

function Sidebar({ activeId, onSelect, site }) {
  useLucide();

  return (
    <aside className="sidebar scroll-hide">
      <div className="site-picker">
        <Icon name="map-pin" size={14} style={{ color: 'var(--fg-secondary)' }}/>
        <span className="name">{site}</span>
        <Icon name="chevrons-up-down" size={14} style={{ color: 'var(--fg-tertiary)' }}/>
      </div>

      {NAV.map((sec) => (
        <div className="section" key={sec.section}>
          <div className="section-label">{sec.section}</div>
          {sec.items.map((it) => (
            <div
              key={it.id}
              className={`navitem ${activeId === it.id ? 'active' : ''}`}
              onClick={() => onSelect(it.id)}
            >
              <Icon name={it.icon} size={18}/>
              <span>{it.label}</span>
              {it.betaTag && <span className="badge">BETA</span>}
              {it.badge && <span className="badge" style={{ background: 'var(--omada-red)' }}>{it.badge}</span>}
              {it.chevron && <Icon name="chevron-right" size={14} className="chev"/>}
            </div>
          ))}
        </div>
      ))}

      <div style={{ flex: 1 }}/>
      <div style={{
        padding: '12px 16px', borderTop: '1px solid var(--border-default)',
        display: 'flex', alignItems: 'center', gap: 8,
        fontSize: 11, color: 'var(--fg-tertiary)'
      }}>
        <div className="spinner" style={{ width: 10, height: 10, borderWidth: 1.5 }}/>
        v6.2.1 · synced 2 min ago
      </div>
    </aside>
  );
}

window.Sidebar = Sidebar;
