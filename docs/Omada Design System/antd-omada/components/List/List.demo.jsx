/* components/List/List.demo.jsx — window.OmadaDemos.List */
(function () {
  const { List, Button, StatusPill } = window.Omada;
  const OmadaIcon = window.OmadaIcon;
  const { useState } = React;

  // tone-coloured device-type disc (same vocabulary as Avatar tones)
  const TONE = {
    ap:      { fg: '#00A870', bg: 'rgba(0,168,112,0.12)' },
    switch:  { fg: '#0069CB', bg: 'rgba(0,105,203,0.12)' },
    gateway: { fg: '#FF8C27', bg: 'rgba(255,140,39,0.14)' },
    camera:  { fg: '#EE385C', bg: 'rgba(238,56,92,0.12)' },
  };
  function Disc({ icon, tone, size = 38 }) {
    const c = TONE[tone] || TONE.ap;
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: size, height: size, borderRadius: 10, background: c.bg, color: c.fg, flexShrink: 0,
      }}>
        <OmadaIcon name={icon} size={Math.round(size * 0.52)} />
      </span>
    );
  }

  function ListDemo() {
    const { t, lang } = window.useOmada();
    const [count, setCount] = useState(3);

    const devices = [
      { key: 'eap',  icon: 'ap',      tone: 'ap',      title: t('li.eap.title'),  desc: t('li.eap.desc'),  status: 'connected' },
      { key: 'sg',   icon: 'switch',  tone: 'switch',  title: t('li.sg.title'),   desc: t('li.sg.desc'),   status: 'connected' },
      { key: 'er',   icon: 'gateway', tone: 'gateway', title: t('li.er.title'),   desc: t('li.er.desc'),   status: 'connected' },
      { key: 'vigi', icon: 'camera',  tone: 'camera',  title: t('li.vigi.title'), desc: t('li.vigi.desc'), status: 'pending' },
    ];

    const feed = [
      { icon: 'download',     tone: 'ap',      text: t('li.act1'), ago: t('li.ago5m') },
      { icon: 'check-circle', tone: 'switch',  text: t('li.act2'), ago: t('li.ago20m') },
      { icon: 'user',         tone: 'gateway', text: t('li.act3'), ago: t('li.ago1h') },
      { icon: 'check',        tone: 'ap',      text: t('li.act4'), ago: t('li.ago3h') },
    ];

    return (
      <>
        {/* device list — meta + row actions + header / footer + load-more */}
        <div className="row"><span className="label">meta · actions</span></div>
        <List
          header={<span style={{ fontWeight: 600 }}>{t('list.header')}</span>}
          footer={<span style={{ color: 'var(--fg-tertiary)', fontSize: 12 }}>
            {t('list.footer').replace('{count}', devices.length)}
          </span>}
          itemLayout="horizontal"
          dataSource={devices.slice(0, count)}
          loadMore={count < devices.length ? (
            <div style={{ textAlign: 'center', padding: '12px 0 2px' }}>
              <Button variant="outline" size="small" onClick={() => setCount(devices.length)}>
                {t('list.loadMore')}
              </Button>
            </div>
          ) : null}
          renderItem={(d) => (
            <List.Item
              actions={[
                <Button key="r" variant="text" size="small" icon={<OmadaIcon name="reboot" size={15} />}>
                  {t('device.reboot')}
                </Button>,
                <Button key="m" variant="text" size="small" shape="circle"
                  icon={<OmadaIcon name="more-vertical" size={16} />} aria-label={t('common.more')} />,
              ]}
            >
              <List.Item.Meta
                avatar={<Disc icon={d.icon} tone={d.tone} />}
                title={<span style={{ fontWeight: 600 }}>{d.title}</span>}
                description={d.desc}
              />
              <StatusPill status={d.status} lang={lang} />
            </List.Item>
          )}
        />

        {/* inventory grid */}
        <div className="row" style={{ marginTop: 22 }}><span className="label">{t('list.grid')}</span></div>
        <List
          grid={{ gutter: 14, xs: 1, sm: 2, md: 2, lg: 4, xl: 4 }}
          dataSource={devices}
          renderItem={(d) => (
            <List.Item>
              <div style={{
                border: '1px solid var(--border-default)', borderRadius: 10, padding: '16px 16px 14px',
                display: 'flex', flexDirection: 'column', gap: 10, background: 'var(--om-list-card,#fff)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Disc icon={d.icon} tone={d.tone} size={34} />
                  <StatusPill status={d.status} lang={lang} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{d.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--fg-tertiary)', marginTop: 2 }}>{d.desc}</div>
                </div>
              </div>
            </List.Item>
          )}
        />

        {/* compact activity feed */}
        <div className="row" style={{ marginTop: 22 }}><span className="label">{t('list.feed')}</span></div>
        <List
          size="small"
          bordered
          dataSource={feed}
          renderItem={(f) => (
            <List.Item extra={<span style={{ fontSize: 12, color: 'var(--fg-tertiary)' }}>{f.ago}</span>}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                <Disc icon={f.icon} tone={f.tone} size={26} />
                <span style={{ fontSize: 13 }}>{f.text}</span>
              </span>
            </List.Item>
          )}
        />
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.List = ListDemo;
})();
