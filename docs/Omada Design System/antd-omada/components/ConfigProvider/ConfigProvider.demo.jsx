/* components/ConfigProvider/ConfigProvider.demo.jsx — window.OmadaDemos.ConfigProvider */
(function () {
  const { ConfigProvider, Button, Input, Select, Icon } = window.Omada;
  const { Space, Switch, Radio, Segmented, Divider } = window.antd;
  const { useState } = React;

  function ConfigProviderDemo() {
    const { t, lang } = window.useOmada();
    const L = (en, zh) => (lang === 'zh' ? zh : en);
    const msg = window.Omada.useMessage();

    const [size, setSize] = useState('middle');
    const [compact, setCompact] = useState(false);
    const [wave, setWave] = useState(true);
    const [disabled, setDisabled] = useState(false);

    const sizeOpts = [
      { label: L('Small', '小'), value: 'small' },
      { label: L('Middle', '中'), value: 'middle' },
      { label: L('Large', '大'), value: 'large' },
    ];

    // A live preview region — every control inside reflects the presets at once.
    const Sample = () => (
      <Space wrap size={12} align="center">
        <Button variant="primary">{t('common.apply')}</Button>
        <Button variant="secondary" icon={<Icon name="refresh" size={16} />}>{t('common.refresh')}</Button>
        <Input placeholder={t('field.search.ph')} style={{ width: 180 }} prefix={<Icon name="search" size={15} />} />
        <Select
          defaultValue="all"
          style={{ width: 150 }}
          options={[
            { value: 'all', label: t('common.all') },
            { value: 'ap', label: t('net.ap') },
            { value: 'sw', label: t('net.switch') },
          ]}
        />
        <Switch defaultChecked />
        <Radio.Group defaultValue="cloud" optionType="button" buttonStyle="solid"
          options={[{ label: t('shell.cloud'), value: 'cloud' }, { label: t('shell.onPremises'), value: 'on' }]} />
      </Space>
    );

    return (
      <>
        <div className="omada-cfg-controls">
          <span className="omada-cfg-ctl">
            <span className="omada-cfg-lbl">componentSize</span>
            <Segmented size="small" value={size} onChange={setSize} options={sizeOpts} />
          </span>
          <span className="omada-cfg-ctl">
            <span className="omada-cfg-lbl">compactAlgorithm</span>
            <Switch size="small" checked={compact} onChange={setCompact} />
          </span>
          <span className="omada-cfg-ctl">
            <span className="omada-cfg-lbl">wave</span>
            <Switch size="small" checked={wave} onChange={setWave} />
          </span>
          <span className="omada-cfg-ctl">
            <span className="omada-cfg-lbl">componentDisabled</span>
            <Switch size="small" checked={disabled} onChange={setDisabled} />
          </span>
        </div>

        <div className="omada-cfg-stage">
          <ConfigProvider size={size} compact={compact} wave={wave} disabled={disabled}>
            <Sample />
          </ConfigProvider>
        </div>

        <Divider style={{ margin: '22px 0 18px' }} />

        <div className="row"><span className="label">app context</span></div>
        <div style={{ fontSize: 12, color: 'var(--fg-tertiary,#999)', marginBottom: 10, maxWidth: 560, lineHeight: 1.55 }}>
          {L(
            'The shell wraps the tree in antd 6’s <App>, so message / notification / Modal use the themed, locale-aware context. useMessage() reads that instance — no static API, no ConfigProvider mismatch.',
            '外层通过 antd 6 的 <App> 包裹组件树，因此 message / notification / Modal 都使用带主题与语言的上下文。useMessage() 读取该实例——无需静态 API，也不会与 ConfigProvider 不一致。'
          )}
        </div>
        <Space wrap size={12}>
          <Button variant="outline" icon={<Icon name="check-circle" size={16} />}
            onClick={() => msg.success(t('msg.saved'))}>{t('msg.trigger.success')}</Button>
          <Button variant="text" icon={<Icon name="info" size={16} />}
            onClick={() => msg.info(t('msg.copied'))}>{L('Show info', '显示信息')}</Button>
        </Space>
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.ConfigProvider = ConfigProviderDemo;
})();
