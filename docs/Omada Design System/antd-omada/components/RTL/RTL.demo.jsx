/* components/RTL/RTL.demo.jsx — window.OmadaDemos.RTL
   RTL 语言适配规范 — direction mirroring. The whole library flips when
   ThemeProvider's `dir` is 'rtl' (ConfigProvider direction + <html dir>),
   toggled from the toolbar. This section shows an isolated side-by-side
   LTR vs RTL preview via a nested ConfigProvider so you can compare without
   flipping the page, plus the live global toggle.
   Figma: RTL语言适配规范 node 17135:1393. */
(function () {
  const { ConfigProvider, theme: antdTheme, Radio } = window.antd;
  const { Input, Button, Space, Card, Icon, StatusPill } = window.Omada;

  function Sample() {
    const { t } = window.useOmada();
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Input prefix={<Icon name="search" size={15} />} placeholder={t('field.search.ph')} allowClear />
        <Space size="small">
          <Button variant="primary"><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name="plus" size={15} />{t('device.addDevice')}</span></Button>
          <Button variant="secondary">{t('common.cancel')}</Button>
        </Space>
        <Card variant="outlined" size="small">
          <Card.Meta
            avatar={<span className="omada-card-glyph"><Icon name="ap" size={20} /></span>}
            title={<span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>EAP670 <StatusPill status="online" /></span>}
            description={t('card.metaDesc')}
          />
        </Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--fg-secondary)' }}>
          <span>{t('crumb.home')}</span>
          <Icon name="chevron-right" size={14} />
          <span>{t('crumb.devices')}</span>
          <Icon name="chevron-right" size={14} />
          <span style={{ color: 'var(--fg-primary)' }}>{t('crumb.deviceName')}</span>
        </div>
      </div>
    );
  }

  function Frame({ dir, label }) {
    const isDark = (window.useOmada().mode === 'dark');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <span className="label" style={{ width: 'auto' }}>{label}</span>
        <div style={{ border: '1px solid var(--border-default)', borderRadius: 10, padding: 16 }}>
          <ConfigProvider direction={dir} theme={window.getOmadaTheme(isDark ? 'dark' : 'light', antdTheme.darkAlgorithm)}>
            <div dir={dir}><Sample /></div>
          </ConfigProvider>
        </div>
      </div>
    );
  }

  function RTLDemo() {
    const { t, dir, setDir } = window.useOmada();
    return (
      <>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <span className="label" style={{ width: 'auto' }}>{t('rtl.live')}</span>
          <Radio.Group value={dir} onChange={(e) => setDir(e.target.value)} size="small" optionType="button" buttonStyle="solid"
            options={[{ value: 'ltr', label: 'LTR' }, { value: 'rtl', label: 'RTL' }]} />
        </div>
        <div style={{ fontSize: 12, color: 'var(--fg-tertiary)', marginBottom: 14 }}>{t('rtl.note')}</div>
        <div className="grid-2" style={{ alignItems: 'start' }}>
          <Frame dir="ltr" label="ltr · english" />
          <Frame dir="rtl" label="rtl · mirrored" />
        </div>
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.RTL = RTLDemo;
})();
