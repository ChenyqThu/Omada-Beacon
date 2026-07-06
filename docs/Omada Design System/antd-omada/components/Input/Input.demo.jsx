/* components/Input/Input.demo.jsx — Mounted by index.html. window.OmadaDemos.Input */
(function () {
  const { Input } = window.Omada;
  const { Search, Password, TextArea } = Input;
  const { Form, InputNumber } = window.antd;
  const { Item } = Form;

  function InputDemo() {
    const { t } = window.useOmada();
    return (
      <div className="grid-2">
        <Item label={t('field.siteName')} style={{ margin: 0 }}>
          <Input placeholder={t('field.siteName.ph')} />
        </Item>
        <Item label={t('common.search')}>
          <Search placeholder={t('field.search.ph')} allowClear onSearch={() => {}} />
        </Item>
        <Item label={t('field.password')}>
          <Password placeholder={t('field.password.ph')} defaultValue="omadaomada" />
        </Item>
        <Item label={t('common.disabled')}>
          <Input defaultValue="Read-only" disabled />
        </Item>
        <Item label="Prefix icon">
          <Input prefixIcon="globe" placeholder="https://" />
        </Item>
        <Item label="With error" validateStatus="error" help="MAC address must follow AA:BB:CC:DD:EE:FF.">
          <Input prefixIcon="wifi" defaultValue="AA:BB:CC" />
        </Item>
        <Item label="Number">
          <InputNumber min={0} max={9999} defaultValue={132} addonAfter="W" style={{ width: '100%' }} />
        </Item>
        <Item label={t('field.notes')}>
          <TextArea rows={2} placeholder="Add a note about this site" />
        </Item>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Input = InputDemo;
})();
