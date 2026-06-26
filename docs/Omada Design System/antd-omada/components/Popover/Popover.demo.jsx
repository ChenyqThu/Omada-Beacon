/* components/Popover/Popover.demo.jsx — Mounted by index.html. window.OmadaDemos.Popover */
(function () {
  const { Popover, Button, Descriptions, StatusPill } = window.Omada;
  const { Icon } = window.Omada;
  const { Space } = window.antd;
  const { Item } = Descriptions;

  function ConfirmBody({ onClose, lang, t }) {
    return (
      <div style={{ maxWidth: 240 }}>
        <div style={{ color: 'var(--fg-secondary,#636363)', fontSize: 14, marginBottom: 16 }}>
          {t('pop.rebootBody')}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button size="small" onClick={onClose}>{t('common.cancel')}</Button>
          <Button size="small" variant="primary" onClick={onClose}>{t('device.reboot')}</Button>
        </div>
      </div>
    );
  }

  function InfoBody({ lang }) {
    return (
      <Descriptions column={1} size="small" style={{ width: 240 }}>
        <Item label={window.t('desc.model', lang)}>ER7206</Item>
        <Item label={window.t('desc.ip', lang)}><span className="omada-mono">192.168.0.1</span></Item>
        <Item label={window.t('desc.mac', lang)}><span className="omada-mono">AC:84:C6:1A:2B:3C</span></Item>
        <Item label={window.t('desc.firmware', lang)}>1.2.4</Item>
      </Descriptions>
    );
  }

  function PopoverDemo() {
    const { lang, t } = window.useOmada();
    const { useState } = React;
    const [open, setOpen] = useState(false);
    return (
      <>
        <div className="row">
          <span className="label">confirm</span>
          <Popover
            trigger="click"
            open={open}
            onOpenChange={setOpen}
            icon="warning"
            iconTone="var(--omada-orange,#FF8C27)"
            title={t('pop.rebootTitle')}
            content={<ConfirmBody onClose={() => setOpen(false)} lang={lang} t={t} />}
          >
            <Button variant="danger-ghost" icon={<Icon name="reboot" size={16} />}>
              {t('device.reboot')}
            </Button>
          </Popover>
        </div>
        <div className="row">
          <span className="label">rich</span>
          <Popover
            title={t('pop.deviceInfo')}
            content={<InfoBody lang={lang} />}
            placement="bottomLeft"
          >
            <Button variant="outline" icon={<Icon name="gateway" size={16} />}>ER7206</Button>
          </Popover>
        </div>
        <div className="row">
          <span className="label">placement</span>
          <Space size={10} wrap>
            {['top', 'bottom', 'left', 'right'].map((p) => (
              <Popover key={p} content={<span style={{ fontSize: 13 }}>{t('pop.deviceInfo')}</span>} placement={p}>
                <Button>{p}</Button>
              </Popover>
            ))}
          </Space>
        </div>
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Popover = PopoverDemo;
})();
