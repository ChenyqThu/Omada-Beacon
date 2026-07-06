/* Dashboard / Overview screen — the canonical Omada console landing.
   Lays out: Site Health gauge + trend, Topology row, Clients, Traffic,
   All Network Activity, AP Density, Channel Distribution, Pending Alarms,
   Gateway Name card, Speedtest card.                                     */

function Dashboard({ product }) {
  const [range, setRange] = useState('24h');
  const [tab, setTab] = useState('overview');
  useLucide();

  const healthTrend = [78, 74, 76, 80, 82, 75, 70, 78, 86, 90, 84, 76, 78, 82, 76, 88, 92, 90, 84, 80, 76, 78, 82, 78];
  const trafficClients = [12, 14, 13, 22, 35, 60, 78, 84, 92, 88, 76, 70, 65, 68, 80, 110, 132, 124, 96, 70, 48, 30, 18, 12];
  const trafficWifi    = [8, 10, 10, 16, 22, 40, 56, 60, 72, 64, 50, 46, 42, 48, 58, 80, 96, 90, 70, 52, 36, 22, 14, 10];
  const trafficWired   = [4, 4, 3, 6, 10, 16, 22, 28, 30, 28, 22, 20, 18, 22, 24, 36, 44, 40, 30, 20, 14, 10, 6, 4];

  return (
    <>
      <div className="page-head">
        <h1>Site Name 12312312312 31</h1>
        <div className="tabs">
          {['overview', 'topology', 'clients', 'traffic'].map((t) => (
            <div key={t} className={`t ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t[0].toUpperCase() + t.slice(1)}
            </div>
          ))}
        </div>
        <div className="range">
          {['24h', '7days', '30days'].map((r) => (
            <div key={r} className={`r ${range === r ? 'active' : ''}`} onClick={() => setRange(r)}>{r}</div>
          ))}
        </div>
      </div>

      {/* ── Row 1: A-zone (300 fixed) + B-zone trend chart ───────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 16, marginBottom: 16 }}>
        <Card title="Site Health" action={<Pill tone="success">Healthy</Pill>}>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
            <HealthGauge value={76}/>
          </div>
          <div style={{
            display: 'flex', justifyContent: 'space-around', marginTop: 14, paddingTop: 14,
            borderTop: '1px solid var(--border-default)', fontSize: 11, color: 'var(--fg-secondary)'
          }}>
            <div style={{ textAlign: 'center' }}><div style={{ fontSize: 16, fontWeight: 600, color: 'var(--fg-primary)' }}>1/2</div>Devices</div>
            <div style={{ textAlign: 'center' }}><div style={{ fontSize: 16, fontWeight: 600, color: 'var(--fg-primary)' }}>142</div>Clients</div>
            <div style={{ textAlign: 'center' }}><div style={{ fontSize: 16, fontWeight: 600, color: 'var(--omada-orange)' }}>4</div>WAN</div>
          </div>
        </Card>
        <Card title="Site Health Trend" action={
          <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--fg-secondary)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><i style={{ width: 8, height: 8, background: '#00A870', borderRadius: 2 }}/> Devices</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><i style={{ width: 8, height: 8, background: '#FF8C27', borderRadius: 2 }}/> Clients</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><i style={{ width: 8, height: 8, background: '#0069CB', borderRadius: 2 }}/> WAN</span>
          </div>
        }>
          <SparkLine data={healthTrend} w={760} h={140} stroke="#00A870" fill="rgba(0,168,112,0.10)"/>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--fg-tertiary)', marginTop: 6, fontFamily: 'var(--font-mono)' }}>
            <span>12:00</span><span>15:00</span><span>18:00</span><span>21:00</span><span>00:00</span><span>03:00</span><span>06:00</span><span>09:00</span><span>now</span>
          </div>
        </Card>
      </div>

      {/* ── Row 2: Topology / Clients / Traffic ─────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr 1fr', gap: 16, marginBottom: 16 }}>
        <Card title="Topology" action={<a className="card-link">More ›</a>} tight>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, paddingTop: 8 }}>
            {[
              { ic: 'globe', n: 'Gateway', v: '1', tone: '#00A870' },
              { ic: 'server', n: 'Switch',  v: '2', tone: '#00A870' },
              { ic: 'wifi',   n: 'AP',      v: '2', tone: '#00A870' },
              { ic: 'users',  n: 'Client',  v: '142', tone: '#2B2B2B' },
            ].map((x) => (
              <div key={x.n} style={{ textAlign: 'center' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10, background: '#F4FBF7',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 6px', color: x.tone
                }}>
                  <Icon name={x.ic} size={20}/>
                </div>
                <div style={{ fontSize: 11, color: 'var(--fg-secondary)' }}>{x.n}</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{x.v}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Clients" action={<a className="card-link">More ›</a>} tight>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '6px 0' }}>
            <Donut
              size={92} thickness={12}
              centerLabel="Total" centerValue="142"
              slices={[
                { value: 88, color: '#00A870' },
                { value: 36, color: '#18B782' },
                { value: 12, color: '#FF8C27' },
                { value: 6,  color: '#0069CB' },
              ]}
            />
            <div style={{ flex: 1, fontSize: 12 }}>
              {[
                { c: '#00A870', n: 'Wireless · 5 GHz', v: 88 },
                { c: '#18B782', n: 'Wireless · 2.4 GHz', v: 36 },
                { c: '#FF8C27', n: 'Wired',  v: 12 },
                { c: '#0069CB', n: 'Guest',  v: 6  },
              ].map((r) => (
                <div key={r.n} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 0' }}>
                  <i style={{ width: 7, height: 7, background: r.c, borderRadius: 2 }}/>
                  <span style={{ color: 'var(--fg-secondary)' }}>{r.n}</span>
                  <span style={{ marginLeft: 'auto', fontWeight: 600 }}>{r.v}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card title="Traffic" action={<a className="card-link">View ›</a>} tight>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--fg-secondary)', marginBottom: 6 }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--fg-primary)' }}>432.1 <span style={{ fontSize: 11, color: 'var(--fg-tertiary)' }}>GB</span></div>
              <div>past 24 hours</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: 'var(--omada-green-600)', fontWeight: 600 }}>↑ 12.4%</div>
              <div>vs. yesterday</div>
            </div>
          </div>
          <SparkLine data={trafficWifi} w={300} h={56} stroke="#0069CB" fill="rgba(0,105,203,0.10)" />
        </Card>
      </div>

      {/* ── Row 3: All Network Activity ─────────────────────────────── */}
      <Card
        title="All Network Activity"
        action={
          <div style={{ fontSize: 11, color: 'var(--fg-secondary)', display: 'flex', gap: 14 }}>
            <span><i style={{ display: 'inline-block', width: 8, height: 8, background: '#0069CB', borderRadius: 2, marginRight: 6 }}/> Clients</span>
            <span><i style={{ display: 'inline-block', width: 8, height: 8, background: '#F476FF', borderRadius: 2, marginRight: 6 }}/> Wireless</span>
            <span><i style={{ display: 'inline-block', width: 8, height: 8, background: '#00A870', borderRadius: 2, marginRight: 6 }}/> Wired</span>
          </div>
        }
        style={{ marginBottom: 16 }}
      >
        <div style={{ position: 'relative', height: 180 }}>
          <SparkLine data={trafficClients} w={1100} h={180} stroke="#0069CB" fill="rgba(0,105,203,0.06)"/>
          <div style={{ position: 'absolute', inset: 0 }}>
            <SparkLine data={trafficWifi}  w={1100} h={180} stroke="#F476FF" fill="transparent" />
          </div>
          <div style={{ position: 'absolute', inset: 0 }}>
            <SparkLine data={trafficWired} w={1100} h={180} stroke="#00A870" fill="transparent" />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--fg-tertiary)', marginTop: 6, fontFamily: 'var(--font-mono)' }}>
          {['12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00'].map((x) => <span key={x}>{x}</span>)}
        </div>
      </Card>

      {/* ── Row 4: AP Density + Pending Alarm + Gateway ─────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr 1fr', gap: 16 }}>
        <Card title="Pending Alarm" action={<span className="pill pill-warning"><span className="dot"></span>12</span>}>
          {[
            { c: '#EE385C', t: 'PoE power drop event', m: 'Port 1 · Nov 7, 4:00 pm' },
            { c: '#FF8C27', t: 'Switch dropped',       m: 'Nov 8, 5:01 pm' },
            { c: '#FFCB00', t: 'Wireless offline',     m: 'AP-3 · Nov 8, 1:14 pm' },
          ].map((a) => (
            <div key={a.t} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border-default)' }}>
              <i style={{ width: 8, height: 8, borderRadius: 50, background: a.c, marginTop: 6, flexShrink: 0 }}/>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.t}</div>
                <div style={{ fontSize: 11, color: 'var(--fg-tertiary)' }}>{a.m}</div>
              </div>
            </div>
          ))}
          <a className="card-link" style={{ marginTop: 8, display: 'inline-block' }}>View all 12 alarms ›</a>
        </Card>

        <Card title="AP Density" action={<a className="card-link">More ›</a>}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', height: 110, gap: 4, padding: '6px 0 4px' }}>
            {[60,55,68,72,80,85,72,68,60,58,52,48,42,38,40,42,45,52,60,72,80,75,68,60].map((h, i) => (
              <div key={i} style={{
                flex: 1,
                height: h + '%',
                background: i === 14 ? '#00A870' : 'linear-gradient(180deg, #00A870 0%, #8DD6B0 100%)',
                opacity: i === 14 ? 1 : 0.7,
                borderRadius: '3px 3px 0 0'
              }}/>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--fg-tertiary)', fontFamily: 'var(--font-mono)', marginTop: 6 }}>
            <span>-95</span><span>-85</span><span>-75</span><span>-65</span><span>-55</span><span>-45</span><span>dBm</span>
          </div>
        </Card>

        <Card title="Gateway · NYC-GW-01" action={<Pill tone="success">Online</Pill>}>
          <div style={{ display: 'flex', gap: 16, fontSize: 12, marginBottom: 14 }}>
            {[
              { l: 'Latency', v: '12', u: 'ms' },
              { l: 'Loss',    v: '0',  u: '%'  },
              { l: 'WAN',     v: '850 / 940', u: 'Mbps' },
            ].map((s) => (
              <div key={s.l}>
                <div style={{ color: 'var(--fg-tertiary)', fontSize: 11 }}>{s.l}</div>
                <div style={{ fontWeight: 600, fontSize: 16, color: 'var(--fg-primary)' }}>
                  {s.v} <span style={{ fontSize: 11, color: 'var(--fg-tertiary)', fontWeight: 400 }}>{s.u}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{
            background: 'var(--bg-app)', borderRadius: 6, padding: '8px 10px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--fg-tertiary)' }}>ISP Activity</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>↓ 850 Mbps · ↑ 165 Mbps</div>
            </div>
            <Icon name="zap" size={20} style={{ color: 'var(--omada-green-500)' }}/>
          </div>
          <div style={{ fontSize: 11, color: 'var(--fg-tertiary)', marginTop: 10 }}>
            Last Speedtest: Nov 8, 9:00 pm
          </div>
        </Card>
      </div>
    </>
  );
}

window.Dashboard = Dashboard;
