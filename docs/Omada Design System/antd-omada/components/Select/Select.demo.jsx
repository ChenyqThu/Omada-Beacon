/* components/Select/Select.demo.jsx — Mounted by index.html. window.OmadaDemos.Select */
(function () {
  const { Select } = window.Omada;
  const { Form } = window.antd;
  const { Item } = Form;

  function SelectDemo() {
    const { t, lang } = window.useOmada();

    const sites = [
      { value: 'nyc', label: 'New York · Manhattan HQ' },
      { value: 'sf',  label: 'San Francisco · Mission' },
      { value: 'ldn', label: 'London · Shoreditch' },
      { value: 'tok', label: 'Tokyo · Shibuya' },
    ];
    const deviceTypes = [
      { value: 'gw',  label: t('net.gateway') },
      { value: 'sw',  label: t('net.switch') },
      { value: 'ap',  label: t('net.ap') },
      { value: 'cam', label: t('net.camera') },
    ];
    const ranges = [
      { value: '1h',  label: lang === 'zh' ? '最近 1 小时'  : 'Last 1 hour' },
      { value: '24h', label: lang === 'zh' ? '最近 24 小时' : 'Last 24 hours' },
      { value: '7d',  label: lang === 'zh' ? '最近 7 天'    : 'Last 7 days' },
      { value: '30d', label: lang === 'zh' ? '最近 30 天'   : 'Last 30 days' },
    ];

    return (
      <div className="grid-3">
        <Item label={t('field.site')}>
          <Select options={sites} defaultValue="nyc" style={{ width: '100%' }} />
        </Item>
        <Item label={t('field.deviceTypes')}>
          <Select mode="multiple" defaultValue={['ap', 'sw']} options={deviceTypes} style={{ width: '100%' }} />
        </Item>
        <Item label={t('field.timeRange')}>
          <Select defaultValue="24h" options={ranges} style={{ width: '100%' }} />
        </Item>
        <Item label={`${t('field.site')} · ${t('common.search')}`}>
          <Select showSearch placeholder={t('common.search')} options={sites} style={{ width: '100%' }}
                  optionFilterProp="label" />
        </Item>
        <Item label={t('common.disabled')}>
          <Select disabled defaultValue="nyc" options={sites} style={{ width: '100%' }} />
        </Item>
        <Item label={t('common.loading')}>
          <Select loading placeholder={t('common.loading')} style={{ width: '100%' }} />
        </Item>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Select = SelectDemo;
})();
