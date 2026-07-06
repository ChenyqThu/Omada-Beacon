/* components/Tour/Tour.demo.jsx — window.OmadaDemos.Tour */
(function () {
  const { Tour, Button } = window.Omada;
  const { Icon } = window.Omada;
  const { useRef, useState } = React;

  function TourDemo() {
    const { t } = window.useOmada();
    const [open, setOpen] = useState(false);
    const adoptRef = useRef(null);
    const filterRef = useRef(null);
    const settingsRef = useRef(null);

    const steps = [
      { iconName: 'adopt', title: t('tour.s1Title'), description: t('tour.s1Body'),
        target: () => adoptRef.current,
        nextButtonProps: { children: t('tour.next') } },
      { iconName: 'filter', title: t('tour.s2Title'), description: t('tour.s2Body'),
        target: () => filterRef.current,
        prevButtonProps: { children: t('tour.prev') },
        nextButtonProps: { children: t('tour.next') } },
      { iconName: 'settings', title: t('tour.s3Title'), description: t('tour.s3Body'),
        target: () => settingsRef.current,
        prevButtonProps: { children: t('tour.prev') },
        nextButtonProps: { children: t('tour.finish') } },
    ];

    return (
      <>
        <div className="row"><span className="label">guided</span></div>
        {/* mock toolbar the tour points at */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16,
                      border: '1px solid var(--border-default)', borderRadius: 8, flexWrap: 'wrap' }}>
          <span ref={adoptRef}><Button variant="primary"><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name="adopt" size={15} />{t('device.adopt')}</span></Button></span>
          <span ref={filterRef}><Button variant="secondary"><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name="filter" size={15} />{t('common.filter')}</span></Button></span>
          <span style={{ marginInlineStart: 'auto' }} ref={settingsRef}>
            <Button variant="text"><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name="settings" size={16} />{t('menu.settings')}</span></Button>
          </span>
        </div>

        <div className="row" style={{ marginTop: 16 }}>
          <Button variant="primary" onClick={() => setOpen(true)}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name="help-circle" size={15} />{t('tour.start')}</span>
          </Button>
        </div>

        <Tour open={open} onClose={() => setOpen(false)} steps={steps} />
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Tour = TourDemo;
})();
