/* components/FormWizard/FormWizard.demo.jsx — window.OmadaDemos.FormWizard */
(function () {
  const { useState } = React;
  const { Form, Input, Select, Radio, Descriptions } = window.antd;
  const Icon = window.Omada.Icon;
  const FormWizard = window.Omada.FormWizard;

  function FormWizardDemo() {
    const ctx = window.useOmada();
    const t = ctx.t;
    const msg = window.Omada.useMessage();
    const [finished, setFinished] = useState(null);

    const steps = [
      {
        key: 'basics', icon: 'map', title: t('fw.s.basics'),
        fields: ['siteName', 'region'],
        content: (
          <div className="omada-fw-fields">
            <Form.Item name="siteName" label={t('fw.f.siteName')}
              rules={[{ required: true, message: t('fw.v.siteName') }]}>
              <Input placeholder="HQ — Floor 3" prefix={<Icon name="map" size={16} />} />
            </Form.Item>
            <Form.Item name="region" label={t('fw.f.region')}
              rules={[{ required: true, message: t('fw.v.region') }]}>
              <Select placeholder={t('fw.f.regionPh')} options={[
                { value: 'apac', label: t('fw.r.apac') },
                { value: 'emea', label: t('fw.r.emea') },
                { value: 'amer', label: t('fw.r.amer') },
              ]} />
            </Form.Item>
          </div>
        ),
      },
      {
        key: 'network', icon: 'wifi', title: t('fw.s.network'),
        fields: ['ssid', 'band'],
        content: (
          <div className="omada-fw-fields">
            <Form.Item name="ssid" label={t('fw.f.ssid')}
              rules={[{ required: true, message: t('fw.v.ssid') }]}>
              <Input placeholder="Omada-Corp" prefix={<Icon name="wifi" size={16} />} />
            </Form.Item>
            <Form.Item name="band" label={t('fw.f.band')} initialValue="dual">
              <Radio.Group optionType="button" buttonStyle="solid" options={[
                { value: '2g', label: '2.4 GHz' },
                { value: '5g', label: '5 GHz' },
                { value: 'dual', label: t('fw.b.dual') },
              ]} />
            </Form.Item>
          </div>
        ),
      },
      {
        key: 'admin', icon: 'user', title: t('fw.s.admin'),
        fields: ['adminEmail'],
        content: (
          <div className="omada-fw-fields">
            <Form.Item name="adminEmail" label={t('fw.f.email')}
              rules={[
                { required: true, message: t('fw.v.email') },
                { type: 'email', message: t('fw.v.emailFmt') },
              ]}>
              <Input placeholder="admin@example.com" prefix={<Icon name="user" size={16} />} />
            </Form.Item>
            <Form.Item name="notify" label={t('fw.f.notify')} initialValue="all">
              <Select options={[
                { value: 'all', label: t('fw.n.all') },
                { value: 'critical', label: t('fw.n.critical') },
                { value: 'none', label: t('fw.n.none') },
              ]} />
            </Form.Item>
          </div>
        ),
      },
      {
        key: 'review', icon: 'check-circle', title: t('fw.s.review'),
        content: (form) => {
          const v = form.getFieldsValue(true);
          const regionLabel = { apac: t('fw.r.apac'), emea: t('fw.r.emea'), amer: t('fw.r.amer') }[v.region];
          const bandLabel = { '2g': '2.4 GHz', '5g': '5 GHz', dual: t('fw.b.dual') }[v.band || 'dual'];
          const notifyLabel = { all: t('fw.n.all'), critical: t('fw.n.critical'), none: t('fw.n.none') }[v.notify || 'all'];
          return (
            <div className="omada-fw-review">
              <div className="omada-fw-reviewhd">
                <Icon name="check-circle" size={16} />
                {t('fw.reviewHint')}
              </div>
              <Descriptions bordered size="small" column={1} className="omada-fw-desc">
                <Descriptions.Item label={t('fw.f.siteName')}>{v.siteName || '—'}</Descriptions.Item>
                <Descriptions.Item label={t('fw.f.region')}>{regionLabel || '—'}</Descriptions.Item>
                <Descriptions.Item label={t('fw.f.ssid')}>{v.ssid || '—'}</Descriptions.Item>
                <Descriptions.Item label={t('fw.f.band')}>{bandLabel}</Descriptions.Item>
                <Descriptions.Item label={t('fw.f.email')}>{v.adminEmail || '—'}</Descriptions.Item>
                <Descriptions.Item label={t('fw.f.notify')}>{notifyLabel}</Descriptions.Item>
              </Descriptions>
            </div>
          );
        },
      },
    ];

    return (
      <div className="omada-fw-demo">
        <FormWizard
          steps={steps}
          onFinish={(values) => {
            setFinished(values);
            msg.success(t('fw.created'));
            return new Promise((r) => setTimeout(r, 700));
          }}
        />
        {finished && (
          <div className="omada-fw-result">
            <Icon name="check-circle" size={16} />
            <span>{t('fw.resultPrefix')} <code>{finished.siteName}</code> · {finished.adminEmail}</span>
          </div>
        )}
        <div className="omada-fw-note">{t('fw.note')}</div>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.FormWizard = FormWizardDemo;
})();
