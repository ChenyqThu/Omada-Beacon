/* components/SettingsPage/SettingsPage.demo.jsx — window.OmadaDemos.SettingsPage */
(function () {
  const { Form, Input, Select, Switch, Slider, Radio, InputNumber } = window.antd;
  const SettingsPage = window.Omada.SettingsPage;

  function SettingsPageDemo() {
    const ctx = window.useOmada();
    const t = ctx.t;
    const msg = window.Omada.useMessage();

    const initialValues = {
      siteName: 'HQ — Floor 2',
      timezone: 'utc+8',
      ledStatus: true,
      ssid: 'Omada-Corp',
      bandSteering: true,
      channelWidth: '80',
      txPower: 60,
      emailAlerts: true,
      digest: 'daily',
      threshold: 80,
      twoFactor: false,
      sessionTimeout: '30',
      allowGuest: true,
    };

    const sections = [
      { key: 'general', title: t('set.s.general'), icon: 'settings', desc: t('set.d.general'),
        render: function () {
          return (
            <React.Fragment>
              <Form.Item name="siteName" label={t('set.f.siteName')}><Input /></Form.Item>
              <Form.Item name="timezone" label={t('set.f.timezone')}>
                <Select options={[
                  { label: 'UTC+08:00 · Beijing', value: 'utc+8' },
                  { label: 'UTC+00:00 · London', value: 'utc+0' },
                  { label: 'UTC−08:00 · Los Angeles', value: 'utc-8' },
                ]} />
              </Form.Item>
              <Form.Item name="ledStatus" label={t('set.f.led')} valuePropName="checked"><Switch /></Form.Item>
            </React.Fragment>
          );
        } },
      { key: 'wireless', title: t('set.s.wireless'), icon: 'wifi', desc: t('set.d.wireless'),
        render: function () {
          return (
            <React.Fragment>
              <Form.Item name="ssid" label={t('set.f.ssid')}><Input /></Form.Item>
              <Form.Item name="bandSteering" label={t('set.f.bandSteering')} valuePropName="checked"><Switch /></Form.Item>
              <Form.Item name="channelWidth" label={t('set.f.channelWidth')}>
                <Select options={[
                  { label: '20 MHz', value: '20' },
                  { label: '40 MHz', value: '40' },
                  { label: '80 MHz', value: '80' },
                  { label: '160 MHz', value: '160' },
                ]} />
              </Form.Item>
              <Form.Item name="txPower" label={t('set.f.txPower')}><Slider /></Form.Item>
            </React.Fragment>
          );
        } },
      { key: 'notify', title: t('set.s.notify'), icon: 'bell', desc: t('set.d.notify'),
        render: function () {
          return (
            <React.Fragment>
              <Form.Item name="emailAlerts" label={t('set.f.emailAlerts')} valuePropName="checked"><Switch /></Form.Item>
              <Form.Item name="digest" label={t('set.f.digest')}>
                <Radio.Group options={[
                  { label: t('set.o.realtime'), value: 'realtime' },
                  { label: t('set.o.daily'), value: 'daily' },
                  { label: t('set.o.weekly'), value: 'weekly' },
                ]} optionType="button" />
              </Form.Item>
              <Form.Item name="threshold" label={t('set.f.threshold')}>
                <InputNumber min={0} max={100} addonAfter="%" />
              </Form.Item>
            </React.Fragment>
          );
        } },
      { key: 'security', title: t('set.s.security'), icon: 'lock', desc: t('set.d.security'),
        render: function () {
          return (
            <React.Fragment>
              <Form.Item name="twoFactor" label={t('set.f.twoFactor')} valuePropName="checked"><Switch /></Form.Item>
              <Form.Item name="sessionTimeout" label={t('set.f.sessionTimeout')}>
                <Select options={[
                  { label: '15 ' + t('set.u.min'), value: '15' },
                  { label: '30 ' + t('set.u.min'), value: '30' },
                  { label: '60 ' + t('set.u.min'), value: '60' },
                ]} />
              </Form.Item>
              <Form.Item name="allowGuest" label={t('set.f.allowGuest')} valuePropName="checked"><Switch /></Form.Item>
            </React.Fragment>
          );
        } },
    ];

    return (
      <SettingsPage
        sections={sections}
        initialValues={initialValues}
        onSave={function () { msg.success(t('set.savedToast')); }}
      />
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.SettingsPage = SettingsPageDemo;
})();
