/* Omada Top Bar — green chrome with site selector, product tabs, right-side actions. */

function TopBar({ site, product, onProduct, onMenu }) {
  useLucide();

  const tabs = [
    { id: 'wireless', icon: 'wifi' },
    { id: 'wired',    icon: 'globe' },
    { id: 'vigi',     icon: 'video' },
  ];

  return (
    <header className="topbar">
      <div className="brand">
        <img src="../../assets/omada-logo.svg" alt="Omada"
             style={{ height: 26, display: 'block', filter: 'brightness(0) invert(1)' }}/>
      </div>

      <div className="site-pill">
        <Icon name="map-pin" size={16}/>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {site}
        </span>
        <Icon name="chevron-down" size={16} className="chev"/>
      </div>

      <div className="product-tabs">
        {tabs.map((t) => (
          <div key={t.id}
               className={`ptab ${product === t.id ? 'active' : ''}`}
               onClick={() => onProduct(t.id)}>
            <Icon name={t.icon} size={20}/>
          </div>
        ))}
      </div>

      <div className="right">
        <IconBtn name="search" />
        <IconBtn name="rotate-cw" />
        <IconBtn name="sun-medium" />
        <span className="avatar">
          <Icon name="user" size={14} style={{ color: '#fff' }}/>
        </span>
        <IconBtn name="more-vertical" onClick={onMenu}/>
      </div>
    </header>
  );
}

window.TopBar = TopBar;
