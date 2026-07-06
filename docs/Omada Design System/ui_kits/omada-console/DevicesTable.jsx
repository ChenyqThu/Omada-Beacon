/* Devices list table. */

const DEVICES = [
  { name: 'NYC-GW-01',    type: 'Gateway', icon: 'globe',      ip: '10.0.1.1',   mac: 'AA:BB:CC:DD:EE:01', model: 'ER7212PC',     uptime: '14d 02:33', clients: 0,   status: 'connected'    },
  { name: 'NYC-CORE-SW',  type: 'Switch',  icon: 'server',     ip: '10.0.1.10',  mac: 'AA:BB:CC:DD:EE:10', model: 'TL-SG3428MP',  uptime: '14d 02:31', clients: 22,  status: 'connected'    },
  { name: 'NYC-EDGE-SW',  type: 'Switch',  icon: 'server',     ip: '10.0.1.11',  mac: 'AA:BB:CC:DD:EE:11', model: 'TL-SG3428',    uptime: '0d 00:00',  clients: 0,   status: 'disconnected' },
  { name: 'AP-LOBBY',     type: 'AP',      icon: 'wifi',       ip: '10.0.1.21',  mac: 'AA:BB:CC:DD:EE:21', model: 'EAP670 v2',    uptime: '06d 11:08', clients: 58,  status: 'connected'    },
  { name: 'AP-OFFICE-N',  type: 'AP',      icon: 'wifi',       ip: '10.0.1.22',  mac: 'AA:BB:CC:DD:EE:22', model: 'EAP670 v2',    uptime: '06d 11:08', clients: 42,  status: 'connected'    },
  { name: 'AP-OFFICE-S',  type: 'AP',      icon: 'wifi',       ip: '10.0.1.23',  mac: 'AA:BB:CC:DD:EE:23', model: 'EAP650',       uptime: '0d 00:00',  clients: 0,   status: 'pending'      },
  { name: 'CAM-ENTRANCE', type: 'VIGI',    icon: 'video',      ip: '10.0.1.31',  mac: 'AA:BB:CC:DD:EE:31', model: 'C540V',        uptime: '13d 21:14', clients: 0,   status: 'connected'    },
  { name: 'CAM-PARKING',  type: 'VIGI',    icon: 'video',      ip: '10.0.1.32',  mac: 'AA:BB:CC:DD:EE:32', model: 'C320WS',       uptime: '13d 21:09', clients: 0,   status: 'connected'    },
];

const STATUS = {
  connected:    { tone: 'success', label: 'Connected' },
  disconnected: { tone: 'danger',  label: 'Disconnected' },
  pending:      { tone: 'warning', label: 'Pending Adoption' },
};

function DevicesTable() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState({});
  useLucide();

  const rows = DEVICES.filter((d) =>
    (filter === 'all' || d.type.toLowerCase() === filter) &&
    (d.name.toLowerCase().includes(search.toLowerCase()) || d.mac.toLowerCase().includes(search.toLowerCase()))
  );

  const allSelected = rows.length > 0 && rows.every((r) => selected[r.mac]);
  const someSelected = rows.some((r) => selected[r.mac]);

  function toggleAll() {
    if (allSelected) setSelected({});
    else {
      const next = {};
      rows.forEach((r) => (next[r.mac] = true));
      setSelected(next);
    }
  }

  return (
    <>
      <div className="page-head">
        <h1>Devices</h1>
        <div className="tabs">
          <div className={`t ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All <span style={{ opacity: 0.6 }}>{DEVICES.length}</span></div>
          <div className={`t ${filter === 'gateway' ? 'active' : ''}`} onClick={() => setFilter('gateway')}>Gateways 1</div>
          <div className={`t ${filter === 'switch' ? 'active' : ''}`} onClick={() => setFilter('switch')}>Switches 2</div>
          <div className={`t ${filter === 'ap' ? 'active' : ''}`} onClick={() => setFilter('ap')}>APs 3</div>
          <div className={`t ${filter === 'vigi' ? 'active' : ''}`} onClick={() => setFilter('vigi')}>VIGI 2</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <div style={{ position: 'relative' }}>
            <Icon name="search" size={14} style={{ position: 'absolute', left: 10, top: 9, color: 'var(--fg-tertiary)' }}/>
            <input
              className="input" style={{ paddingLeft: 30, height: 32, width: 220 }}
              placeholder="Search name / MAC / IP"
              value={search} onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="secondary" icon="rotate-cw">Refresh</Button>
          <Button variant="primary" icon="plus">Add Device</Button>
        </div>
      </div>

      {someSelected && (
        <div style={{
          background: 'rgba(0,168,112,0.06)', border: '1px solid #C2EAD6',
          padding: '8px 14px', borderRadius: 8, marginBottom: 12,
          display: 'flex', alignItems: 'center', gap: 12, fontSize: 13
        }}>
          <span style={{ fontWeight: 500 }}>{Object.values(selected).filter(Boolean).length} selected</span>
          <Button variant="text" icon="power">Reboot</Button>
          <Button variant="text" icon="folder-input">Move to Site</Button>
          <Button variant="text" icon="x-circle">Forget</Button>
          <span style={{ marginLeft: 'auto', color: 'var(--fg-tertiary)', cursor: 'pointer' }} onClick={() => setSelected({})}>Clear</span>
        </div>
      )}

      <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border-default)' }}>
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: 36 }}>
                <span className={`checkbox ${allSelected ? 'on' : ''}`}
                      style={{ width: 14, height: 14, border: '1.5px solid var(--grey-400)', borderRadius: 3, display: 'inline-block',
                               background: allSelected ? '#00A870' : 'transparent', cursor: 'pointer', position: 'relative' }}
                      onClick={toggleAll}>
                  {allSelected && <i style={{ position: 'absolute', left: 3, top: 0, width: 5, height: 9, border: 'solid #fff', borderWidth: '0 2px 2px 0', transform: 'rotate(45deg)' }}/>}
                </span>
              </th>
              <th>Status</th>
              <th>Name</th>
              <th>IP Address</th>
              <th>MAC</th>
              <th>Model</th>
              <th>Uptime</th>
              <th>Clients</th>
              <th style={{ width: 96 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((d) => {
              const s = STATUS[d.status];
              const isSel = !!selected[d.mac];
              return (
                <tr key={d.mac}>
                  <td>
                    <span className={`checkbox`}
                          style={{ width: 14, height: 14, border: '1.5px solid var(--grey-400)', borderRadius: 3, display: 'inline-block',
                                   background: isSel ? '#00A870' : 'transparent', cursor: 'pointer', position: 'relative' }}
                          onClick={() => setSelected({ ...selected, [d.mac]: !isSel })}>
                      {isSel && <i style={{ position: 'absolute', left: 3, top: 0, width: 5, height: 9, border: 'solid #fff', borderWidth: '0 2px 2px 0', transform: 'rotate(45deg)' }}/>}
                    </span>
                  </td>
                  <td><Pill tone={s.tone}>{s.label}</Pill></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: 6,
                        background: 'var(--bg-app)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: d.status === 'connected' ? 'var(--omada-green-500)' : 'var(--fg-tertiary)'
                      }}><Icon name={d.icon} size={16}/></div>
                      <div>
                        <div className="name">{d.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--fg-tertiary)' }}>{d.type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="mono">{d.ip}</td>
                  <td className="mono">{d.mac}</td>
                  <td>{d.model}</td>
                  <td className="mono">{d.uptime}</td>
                  <td>{d.clients > 0 ? <strong>{d.clients}</strong> : <span style={{ color: 'var(--fg-tertiary)' }}>–</span>}</td>
                  <td>
                    <div className="actions">
                      <IconBtn name="settings"  size={14}/>
                      <IconBtn name="rotate-cw" size={14}/>
                      <IconBtn name="more-horizontal" size={14}/>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 4px', fontSize: 12, color: 'var(--fg-secondary)' }}>
        <span>Showing {rows.length} of {DEVICES.length}</span>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <button className="icbtn"><Icon name="chevron-left" size={14}/></button>
          {[1,2,3].map((p) => (
            <button key={p} className="icbtn" style={{
              width: 28, height: 28,
              background: p === 1 ? 'var(--omada-green-500)' : 'transparent',
              color: p === 1 ? '#fff' : 'var(--fg-primary)',
              fontWeight: p === 1 ? 600 : 400
            }}>{p}</button>
          ))}
          <button className="icbtn"><Icon name="chevron-right" size={14}/></button>
        </div>
      </div>
    </>
  );
}

window.DevicesTable = DevicesTable;
