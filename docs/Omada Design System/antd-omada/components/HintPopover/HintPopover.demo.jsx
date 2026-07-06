/* components/HintPopover/HintPopover.demo.jsx — window.OmadaDemos.HintPopover */
(function () {
  const HintPopover = window.Omada.HintPopover;
  const Icon = window.Omada.Icon;
  const { Button } = window.antd;

  function HintPopoverDemo() {
    const { useState } = React;
    const ctx = window.useOmada();
    const t = ctx.t;
    const [open, setOpen] = useState(false);

    const longContent = (
      <div className="omada-hp-long">
        <p>{t('hp.long.p1')}</p>
        <p>{t('hp.long.p2')}</p>
        <p>{t('hp.long.p3')}</p>
        <p>{t('hp.long.p4')}</p>
      </div>
    );

    const nestedContent = (
      <div className="omada-hp-nested">
        <span>{t('hp.nested.body')}</span>
        <HintPopover
          title={t('hp.nested.inner.title')}
          content={<div style={{ maxWidth: 200 }}>{t('hp.nested.inner.body')}</div>}
          placement="right"
          trigger="hover"
        >
          <a className="omada-hp-nestedlink">{t('hp.nested.link')}</a>
        </HintPopover>
      </div>
    );

    return (
      <div className="omada-hp-demo">
        <div className="omada-hp-grid">
          {/* long content */}
          <div className="omada-hp-card">
            <span className="omada-hp-cardtitle">{t('hp.case.long')}</span>
            <span className="omada-hp-carddesc">{t('hp.case.long.d')}</span>
            <HintPopover title={t('hp.long.title')} content={longContent}
                         placement="bottom" maxWidth={300} maxHeight={150} trigger="click">
              <Button icon={<Icon name="docs" size={15} />}>{t('hp.open')}</Button>
            </HintPopover>
          </div>

          {/* follow cursor */}
          <div className="omada-hp-card">
            <span className="omada-hp-cardtitle">{t('hp.case.follow')}</span>
            <span className="omada-hp-carddesc">{t('hp.case.follow.d')}</span>
            <HintPopover followCursor content={t('hp.follow.body')} maxWidth={220}>
              <div className="omada-hp-canvas">
                <Icon name="map" size={22} />
                <span>{t('hp.follow.hover')}</span>
              </div>
            </HintPopover>
          </div>

          {/* controlled open */}
          <div className="omada-hp-card">
            <span className="omada-hp-cardtitle">{t('hp.case.controlled')}</span>
            <span className="omada-hp-carddesc">{t('hp.case.controlled.d')}</span>
            <div className="omada-hp-controlrow">
              <HintPopover
                open={open}
                onOpenChange={setOpen}
                title={t('hp.controlled.title')}
                content={<div style={{ maxWidth: 220 }}>{t('hp.controlled.body')}</div>}
                placement="top"
              >
                <span className="omada-hp-target">{t('hp.controlled.anchor')}</span>
              </HintPopover>
              <Button size="small" onClick={() => setOpen((v) => !v)}>
                {open ? t('hp.controlled.hide') : t('hp.controlled.show')}
              </Button>
            </div>
          </div>

          {/* nested triggers */}
          <div className="omada-hp-card">
            <span className="omada-hp-cardtitle">{t('hp.case.nested')}</span>
            <span className="omada-hp-carddesc">{t('hp.case.nested.d')}</span>
            <HintPopover title={t('hp.nested.title')} content={nestedContent}
                         placement="bottom" trigger="click">
              <Button icon={<Icon name="layers" size={15} />}>{t('hp.open')}</Button>
            </HintPopover>
          </div>

          {/* disabled child */}
          <div className="omada-hp-card">
            <span className="omada-hp-cardtitle">{t('hp.case.disabled')}</span>
            <span className="omada-hp-carddesc">{t('hp.case.disabled.d')}</span>
            <HintPopover wrapDisabled content={t('hp.disabled.body')} placement="top">
              <Button disabled icon={<Icon name="lock" size={15} />}>{t('hp.disabled.btn')}</Button>
            </HintPopover>
          </div>
        </div>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.HintPopover = HintPopoverDemo;
})();
