/* components/Space/Space.demo.jsx — window.OmadaDemos.Space */
(function () {
  const { Space, Button, StatusPill, Input, Select, Divider } = window.Omada;
  function SpaceDemo() {
    const { t } = window.useOmada();

    return (
      <>
        <div className="row"><span className="label">horizontal · sizes</span></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 6 }}>
          <Space size="small"><Button variant="secondary" size="small">{t('common.edit')}</Button><Button variant="secondary" size="small">{t('device.reboot')}</Button><Button variant="secondary" size="small">{t('device.forget')}</Button></Space>
          <Space size="middle"><Button variant="secondary" size="small">{t('common.edit')}</Button><Button variant="secondary" size="small">{t('device.reboot')}</Button><Button variant="secondary" size="small">{t('device.forget')}</Button></Space>
          <Space size="large"><Button variant="secondary" size="small">{t('common.edit')}</Button><Button variant="secondary" size="small">{t('device.reboot')}</Button><Button variant="secondary" size="small">{t('device.forget')}</Button></Space>
        </div>

        <div className="row" style={{ marginTop: 18 }}><span className="label">split · wrap</span></div>
        <Space split={<Divider type="vertical" />} wrap>
          <a style={{ color: 'var(--omada-green-600, #009765)' }}>{t('tab.overview')}</a>
          <a style={{ color: 'var(--omada-green-600, #009765)' }}>{t('tab.ports')}</a>
          <a style={{ color: 'var(--omada-green-600, #009765)' }}>{t('tab.clients')}</a>
          <a style={{ color: 'var(--omada-green-600, #009765)' }}>{t('tab.log')}</a>
        </Space>

        <div className="row" style={{ marginTop: 18 }}><span className="label">vertical · tags</span></div>
        <Space direction="vertical" size="small" style={{ alignItems: 'flex-start' }}>
          <Space size="small"><StatusPill status="online" /><span style={{ fontSize: 13, color: 'var(--fg-secondary)' }}>EAP670</span></Space>
          <Space size="small"><StatusPill status="pending" /><span style={{ fontSize: 13, color: 'var(--fg-secondary)' }}>ER605</span></Space>
          <Space size="small"><StatusPill status="offline" /><span style={{ fontSize: 13, color: 'var(--fg-secondary)' }}>SG2428P</span></Space>
        </Space>

        <div className="row" style={{ marginTop: 18 }}><span className="label">compact · control group</span></div>
        <Space.Compact style={{ width: 360 }}>
          <Select defaultValue="ip" style={{ width: 110 }} options={[{ value: 'ip', label: 'IP' }, { value: 'mac', label: 'MAC' }]} />
          <Input placeholder={t('field.search.ph')} />
          <Button variant="primary">{t('common.search')}</Button>
        </Space.Compact>
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Space = SpaceDemo;
})();
