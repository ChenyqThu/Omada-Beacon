/* components/Drawer/Drawer.demo.jsx — window.OmadaDemos.Drawer */
(function () {
  const { Drawer, Button, Descriptions, StatusPill, Form, Select, Switch } = window.Omada;
  const { Icon } = window.Omada;
  const { Space, Divider } = window.antd;
  const { Item } = Descriptions;

  function DrawerDemo() {
    const { lang, t } = window.useOmada();
    const { useState } = React;
    const [detail, setDetail] = useState(false);
    const [filter, setFilter] = useState(false);

    const footer = (
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <Button variant="secondary" onClick={() => setFilter(false)}>{t('common.cancel')}</Button>
        <Button variant="primary" onClick={() => setFilter(false)}>{t('common.apply')}</Button>
      </div>
    );

    return (
      <>
        <div className="row">
          <span className="label">placement</span>
          <Button variant="outline" icon={<Icon name="gateway" size={16} />} onClick={() => setDetail(true)}>
            {t('drawer.deviceDetail')} · {t('drawer.openRight')}
          </Button>
          <Button variant="outline" icon={<Icon name="filter" size={16} />} onClick={() => setFilter(true)}>
            {t('drawer.filters')} · {t('drawer.openLeft')}
          </Button>
        </div>

        {/* Device detail — right */}
        <Drawer
          open={detail}
          onClose={() => setDetail(false)}
          title={t('drawer.deviceDetail')}
          placement="right"
          extra={<StatusPill status="connected" lang={lang} />}
        >
          <Descriptions className="omada-desc" column={1} size="small">
            <Item label={window.t('desc.model', lang)}>ER7206</Item>
            <Item label={window.t('desc.ip', lang)}><span className="omada-mono">192.168.0.1</span></Item>
            <Item label={window.t('desc.mac', lang)}><span className="omada-mono">AC:84:C6:1A:2B:3C</span></Item>
            <Item label={window.t('desc.firmware', lang)}>1.2.4</Item>
            <Item label={window.t('desc.uptime', lang)}>14d 6h</Item>
          </Descriptions>
          <Divider style={{ margin: '8px 0 16px' }} />
          <Space>
            <Button variant="outline" icon={<Icon name="reboot" size={16} />}>{t('device.reboot')}</Button>
            <Button variant="text" icon={<Icon name="map" size={16} />}>{t('device.locate')}</Button>
          </Space>
        </Drawer>

        {/* Filter — left, with footer */}
        <Drawer
          open={filter}
          onClose={() => setFilter(false)}
          title={t('drawer.filters')}
          placement="left"
          footer={footer}
        >
          <Form layout="vertical">
            <Form.Item label={t('field.site')} style={{ marginBottom: 16 }}>
              <Select
                defaultValue="all"
                options={[
                  { value: 'all', label: t('common.all') },
                  { value: 'hq', label: 'HQ — Floor 3' },
                  { value: 'wh', label: 'Warehouse' },
                ]}
              />
            </Form.Item>
            <Form.Item label={t('table.col.status')} style={{ marginBottom: 16 }}>
              <Select
                mode="multiple"
                placeholder={t('common.all')}
                options={[
                  { value: 'online', label: t('status.online') },
                  { value: 'offline', label: t('status.offline') },
                  { value: 'pending', label: t('status.pending') },
                ]}
              />
            </Form.Item>
            <Form.Item label={t('field.scheduleEnabled')} valuePropName="checked" style={{ marginBottom: 0 }}>
              <Switch defaultChecked />
            </Form.Item>
          </Form>
        </Drawer>
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Drawer = DrawerDemo;
})();
