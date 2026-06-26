/* components/Tooltip/Tooltip.demo.jsx — Mounted by index.html. window.OmadaDemos.Tooltip */
(function () {
  const { Tooltip, Button } = window.Omada;
  const { Icon } = window.Omada;

  function TooltipDemo() {
    const { t } = window.useOmada();
    return (
      <>
        <div className="row">
          <span className="label">placement</span>
          <Tooltip title={t('tip.reboot')} placement="top"><Button>Top</Button></Tooltip>
          <Tooltip title={t('tip.reboot')} placement="bottom"><Button>Bottom</Button></Tooltip>
          <Tooltip title={t('tip.reboot')} placement="left"><Button>Left</Button></Tooltip>
          <Tooltip title={t('tip.reboot')} placement="right"><Button>Right</Button></Tooltip>
        </div>
        <div className="row">
          <span className="label">on icon</span>
          <Tooltip title={t('tip.reboot')}>
            <Button variant="text" icon={<Icon name="reboot" size={18} />} />
          </Tooltip>
          <Tooltip title={t('tip.locate')}>
            <Button variant="text" icon={<Icon name="map" size={18} />} />
          </Tooltip>
          <Tooltip title={t('tip.help')}>
            <span style={{ display: 'inline-flex', color: 'var(--fg-tertiary,#999)' }}>
              <Icon name="help-circle" size={18} />
            </span>
          </Tooltip>
        </div>
        <div className="row">
          <span className="label">no arrow</span>
          <Tooltip title="Firmware 1.2.4 · up to date" arrow={false} placement="bottom">
            <Button variant="outline">Firmware</Button>
          </Tooltip>
        </div>
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Tooltip = TooltipDemo;
})();
