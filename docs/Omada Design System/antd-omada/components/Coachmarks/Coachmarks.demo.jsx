/* components/Coachmarks/Coachmarks.demo.jsx — window.OmadaDemos.Coachmarks */
(function () {
  const Coachmarks = window.Omada.Coachmarks;
  const Icon = window.Omada.Icon;
  const { Button } = window.antd;

  function CoachmarksDemo() {
    const { useState } = React;
    const ctx = window.useOmada();
    const t = ctx.t;
    const [open, setOpen] = useState(false);
    const [cur, setCur] = useState(0);

    const steps = [
      { target: '#cm-add', title: t('cm.s1.t'), body: t('cm.s1.b'), icon: 'plus', placement: 'bottom' },
      { target: '#cm-search', title: t('cm.s2.t'), body: t('cm.s2.b'), icon: 'search', placement: 'bottom' },
      { target: '#cm-tile', title: t('cm.s3.t'), body: t('cm.s3.b'), icon: 'insights', placement: 'right' },
      { target: '#cm-nav', title: t('cm.s4.t'), body: t('cm.s4.b'), icon: 'bell', placement: 'left' },
    ];

    const start = () => { setCur(0); setOpen(true); };

    return (
      <div className="omada-cm-demo">
        <div className="omada-cm-controls">
          <Button type="primary" size="small" onClick={start}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name="rocket" size={15} />{t('cm.start')}</span>
          </Button>
          <span className="omada-cm-note">{t('cm.note')}</span>
        </div>

        <Coachmarks steps={steps} open={open} current={cur} onChange={setCur} onClose={() => setOpen(false)}>
          {/* mini app surface with spotlight targets */}
          <div className="omada-cm-app">
            <div className="omada-cm-appbar">
              <span className="omada-cm-applogo"><Icon name="dashboard" size={18} />{t('cm.app')}</span>
              <span className="omada-cm-apptools">
                <button id="cm-search" type="button" className="omada-cm-tool"><Icon name="search" size={16} /></button>
                <button id="cm-nav" type="button" className="omada-cm-tool"><Icon name="bell" size={16} /></button>
                <button id="cm-add" type="button" className="omada-cm-toolprimary"><Icon name="plus" size={15} />{t('cm.adddev')}</button>
              </span>
            </div>
            <div className="omada-cm-appbody">
              <div id="cm-tile" className="omada-cm-apptile">
                <span className="omada-cm-tilelabel"><Icon name="insights" size={15} />{t('cm.tile')}</span>
                <span className="omada-cm-tileval">99.98%</span>
              </div>
              <div className="omada-cm-applist">
                <div className="omada-cm-applistrow"><Icon name="ap" size={16} />AP-Lobby-03</div>
                <div className="omada-cm-applistrow"><Icon name="switch" size={16} />SW-Core-01</div>
                <div className="omada-cm-applistrow"><Icon name="gateway" size={16} />GW-HQ-01</div>
              </div>
            </div>
          </div>
        </Coachmarks>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Coachmarks = CoachmarksDemo;
})();
