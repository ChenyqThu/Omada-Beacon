/* components/Watermark/Watermark.demo.jsx — window.OmadaDemos.Watermark */
(function () {
  const { Watermark, Descriptions } = window.Omada;

  function WatermarkDemo() {
    const { t } = window.useOmada();
    return (
      <>
        <div className="row"><span className="label">overlay</span>
          <span style={{ fontSize: 12, color: 'var(--fg-tertiary)' }}>{t('wm.hint')}</span>
        </div>
        <div className="omada-wm-panel">
          <Watermark content={[t('wm.confidential'), t('wm.org')]}>
            <div style={{ padding: 22 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, margin: '0 0 14px', color: 'var(--fg-primary)' }}>
                {t('drawer.deviceDetail')}
              </h3>
              <Descriptions
                column={2}
                items={[
                  { key: 'm', label: t('desc.model'), children: 'EAP670' },
                  { key: 'ip', label: t('desc.ip'), children: '192.168.0.42' },
                  { key: 'mac', label: t('desc.mac'), children: '9C-53-22-1A-0B-7E' },
                  { key: 'fw', label: t('desc.firmware'), children: '1.3.0' },
                  { key: 's', label: t('desc.site'), children: t('shell.site') },
                  { key: 'up', label: t('desc.uptime'), children: '4d 06:18' },
                ]}
              />
            </div>
          </Watermark>
        </div>
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Watermark = WatermarkDemo;
})();
