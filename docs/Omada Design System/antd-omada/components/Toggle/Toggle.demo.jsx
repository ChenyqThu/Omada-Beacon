/* components/Toggle/Toggle.demo.jsx — Mounted by index.html. window.OmadaDemos.Toggle */
(function () {
  const { Switch, Checkbox, Radio } = window.Omada;
  const { Space, Divider } = window.antd;

  function ToggleDemo() {
    const { t, lang } = window.useOmada();
    const L = (en, zh) => (lang === 'zh' ? zh : en);
    return (
      <div className="grid-3">
        <div>
          <div className="desc">Switch</div>
          <Space direction="vertical">
            <Space><Switch defaultChecked /> <span>{L('Auto-backup', '自动备份')}</span></Space>
            <Space><Switch /> <span>{L('Roaming', '漫游')}</span></Space>
            <Space><Switch loading defaultChecked /> <span>{t('common.saving')}</span></Space>
            <Space><Switch disabled defaultChecked /> <span>{L('Locked by policy', '策略锁定')}</span></Space>
            <Space><Switch size="small" defaultChecked /> <span style={{ fontSize: 12 }}>{L('Compact', '紧凑')}</span></Space>
          </Space>
        </div>
        <div>
          <div className="desc">Checkbox</div>
          <Space direction="vertical">
            <Checkbox defaultChecked>{L('Enable DPI', '启用 DPI')}</Checkbox>
            <Checkbox>{L('Enable QoS', '启用 QoS')}</Checkbox>
            <Checkbox indeterminate>{L('Mixed state', '部分选中')}</Checkbox>
            <Checkbox disabled defaultChecked>{t('common.disabled')}</Checkbox>
            <Checkbox.Group defaultValue={['a', 'c']}
              options={[{ label: '2.4 GHz', value: 'a' }, { label: '5 GHz', value: 'b' }, { label: '6 GHz', value: 'c' }]} />
          </Space>
        </div>
        <div>
          <div className="desc">Radio</div>
          <Radio.Group defaultValue="dhcp">
            <Space direction="vertical">
              <Radio value="dhcp">{L('DHCP (auto)', 'DHCP（自动）')}</Radio>
              <Radio value="static">{L('Static IP', '静态 IP')}</Radio>
              <Radio value="pppoe">PPPoE</Radio>
              <Radio value="other" disabled>{L('Other (locked)', '其他（锁定）')}</Radio>
            </Space>
          </Radio.Group>
          <Divider style={{ margin: '12px 0' }} />
          <Radio.Group defaultValue="24h" buttonStyle="solid">
            <Radio.Button value="1h">1 h</Radio.Button>
            <Radio.Button value="24h">24 h</Radio.Button>
            <Radio.Button value="7d">7 d</Radio.Button>
            <Radio.Button value="30d">30 d</Radio.Button>
          </Radio.Group>
        </div>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Toggle = ToggleDemo;
})();
