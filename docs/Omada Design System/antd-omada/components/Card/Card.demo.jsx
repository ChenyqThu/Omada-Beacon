/* components/Card/Card.demo.jsx — window.OmadaDemos.Card */
(function () {
  const { Card } = window.Omada;
  const { Icon } = window.Omada;

  function Stat({ label, value }) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontSize: 12, color: 'var(--fg-tertiary)' }}>{label}</span>
        <span style={{ fontSize: 20, fontWeight: 600, color: 'var(--fg-primary)' }}>{value}</span>
      </div>
    );
  }

  function CardDemo() {
    const { t } = window.useOmada();
    const { Button } = window.Omada;

    return (
      <>
        <div className="row"><span className="label">variants</span></div>
        <div className="grid-3" style={{ alignItems: 'start' }}>
          <Card variant="outlined" title={t('card.outlined')} size="small">
            <Stat label={t('stat.online')} value="42 / 48" />
          </Card>
          <Card variant="shadow" title={t('card.shadow')} size="small">
            <Stat label={t('stat.clients')} value="1,284" />
          </Card>
          <Card variant="filled" title={t('card.filled')} size="small">
            <Stat label={t('stat.throughput')} value="318 Mbps" />
          </Card>
        </div>

        <div className="row" style={{ marginTop: 22 }}><span className="label">title · extra · actions</span></div>
        <div className="grid-2" style={{ alignItems: 'start' }}>
          <Card
            title={t('card.deviceTitle')}
            extra={<Button variant="link" size="small">{t('common.more')}</Button>}
            actions={[
              <span key="r" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name="reboot" size={15} />{t('device.reboot')}</span>,
              <span key="l" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name="wifi" size={15} />{t('device.locate')}</span>,
            ]}
          >
            <Card.Meta
              avatar={<span className="omada-card-glyph"><Icon name="ap" size={22} /></span>}
              title="EAP670"
              description={t('card.metaDesc')}
            />
          </Card>

          <Card title={t('card.gridTitle')} size="small" styles={{ body: { padding: 0 } }}>
            <Card.Grid style={{ width: '50%', textAlign: 'center' }} hoverable={false}>
              <Stat label={t('chart.dev.ap')} value="48" />
            </Card.Grid>
            <Card.Grid style={{ width: '50%', textAlign: 'center' }} hoverable={false}>
              <Stat label={t('chart.dev.switch')} value="12" />
            </Card.Grid>
            <Card.Grid style={{ width: '50%', textAlign: 'center' }} hoverable={false}>
              <Stat label={t('chart.dev.gateway')} value="3" />
            </Card.Grid>
            <Card.Grid style={{ width: '50%', textAlign: 'center' }} hoverable={false}>
              <Stat label={t('chart.dev.camera')} value="9" />
            </Card.Grid>
          </Card>
        </div>

        <div className="row" style={{ marginTop: 22 }}><span className="label">hoverable · loading · inner</span></div>
        <div className="grid-3" style={{ alignItems: 'start' }}>
          <Card variant="outlined" hoverable size="small" title={t('card.hoverable')}>
            <span style={{ fontSize: 13, color: 'var(--fg-secondary)' }}>{t('card.hoverBody')}</span>
          </Card>
          <Card variant="outlined" size="small" loading title={t('common.loading')} />
          <Card variant="filled" size="small" title={t('card.nested')}>
            <Card variant="outlined" size="small" type="inner" title="WAN 1">
              <span style={{ fontSize: 13, color: 'var(--fg-secondary)' }}>192.168.0.1</span>
            </Card>
          </Card>
        </div>
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Card = CardDemo;
})();
