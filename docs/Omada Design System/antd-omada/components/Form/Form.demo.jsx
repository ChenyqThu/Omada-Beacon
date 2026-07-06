/* components/Form/Form.demo.jsx — Mounted by index.html. window.OmadaDemos.Form */
(function () {
  const { Form, Input, Select, Switch, Button } = window.Omada;
  const { Icon } = window.Omada;
  const { Space, Divider } = window.antd;
  const R = window.OmadaFormRules;

  function FormDemo() {
    const { lang, t } = window.useOmada();
    const [form] = Form.useForm();
    const [vertical, setVertical] = React.useState(false);

    const wanOptions = [
      { value: 'dhcp',   label: 'DHCP' },
      { value: 'static', label: 'Static IP' },
      { value: 'pppoe',  label: 'PPPoE' },
    ];

    const labelCol = vertical ? undefined : { flex: '150px' };
    const wrapperCol = vertical ? undefined : { flex: '1 1 320px' };

    return (
      <>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <span className="label">layout</span>
          <Space size={8}>
            <Switch size="small" checked={vertical} onChange={setVertical} />
            <span style={{ fontSize: 12, color: 'var(--fg-secondary,#636363)' }}>
              {vertical ? (lang === 'zh' ? '垂直（抽屉/窄屏）' : 'Vertical (drawer / narrow)')
                        : (lang === 'zh' ? '水平（左右布局）' : 'Horizontal (label-left)')}
            </span>
          </Space>
        </div>

        <div style={{ maxWidth: vertical ? 380 : 560 }}>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 16 }}>{t('form.wanSettings')}</div>
          <Form
            form={form}
            layout={vertical ? 'vertical' : 'horizontal'}
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            labelAlign="left"
            initialValues={{ wanMode: 'static', schedule: true }}
            onFinish={() => {}}
          >
            <Form.Item
              name="wanMode"
              label={t('field.wanMode')}
              tooltip={lang === 'zh' ? '选择 WAN 口的连接方式' : 'How the WAN port obtains its address'}
              rules={R.required(t)}
            >
              <Select options={wanOptions} style={{ maxWidth: 260 }} />
            </Form.Item>

            <Form.Item name="ip" label={t('field.ipAddress')} rules={R.ipv4(t)}>
              <Input placeholder={t('field.ipAddress.ph')} prefixIcon="globe" />
            </Form.Item>

            <Form.Item name="gateway" label={t('field.gateway')} rules={R.ipv4(t)}>
              <Input placeholder={t('field.ipAddress.ph')} />
            </Form.Item>

            <Form.Item name="email" label={t('field.email')} rules={R.email(t)}>
              <Input placeholder={t('field.email.ph')} prefixIcon="bell" />
            </Form.Item>

            <Form.Item
              name="schedule"
              label={t('field.scheduleEnabled')}
              valuePropName="checked"
              tooltip={t('tip.help')}
            >
              <Switch />
            </Form.Item>

            <Divider style={{ margin: '4px 0 18px' }} />

            <Form.Item label={vertical ? null : ' '} colon={false} style={{ marginBottom: 0 }}>
              <Space size={8}>
                <Button variant="primary" onClick={() => form.submit()}>{t('common.confirm')}</Button>
                <Button variant="secondary" onClick={() => form.resetFields()}>{t('common.cancel')}</Button>
              </Space>
            </Form.Item>
          </Form>
        </div>

        <div className="row" style={{ marginTop: 8 }}>
          <span className="label">validate</span>
          <Button variant="outline" icon={<Icon name="check-circle" size={16} />}
                  onClick={() => form.validateFields().catch(() => {})}>
            {lang === 'zh' ? '触发校验反馈' : 'Trigger validation'}
          </Button>
          <span style={{ fontSize: 12, color: 'var(--fg-tertiary,#999)' }}>
            {lang === 'zh' ? '清空 IP / 邮箱后点击，查看失焦校验' : 'Clear IP / email, then click to see blur validation'}
          </span>
        </div>
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Form = FormDemo;
})();
