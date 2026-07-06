/* components/Countdown/Countdown.demo.jsx — window.OmadaDemos.Countdown */
(function () {
  const { useState } = React;

  function Tile(props) {
    return (
      <div className="omada-cd-tile">
        <div className="omada-cd-tag">{props.tag}</div>
        {props.children}
      </div>
    );
  }

  function CountdownDemo() {
    const ctx = window.useOmada ? window.useOmada() : { t: (k) => k };
    const t = ctx.t;
    const { Countdown } = window.Omada;
    const { Card, Tag } = window.antd;

    // stable absolute targets (set once)
    const [tg] = useState(() => {
      const n = Date.now();
      return {
        maint: n + (1 * 3600 + 25 * 60 + 30) * 1000,            // 1h 25m
        fw:    n + (2 * 86400 + 6 * 3600 + 30 * 60) * 1000,     // 2d 6h 30m
        uptime: n - (5 * 86400 + 3 * 3600 + 12 * 60) * 1000,    // 5d 3h elapsed
        kpi:   n + (8 * 3600 + 12 * 60) * 1000,                 // 8h 12m
      };
    });

    const [done, setDone] = useState(false);
    const [finishTarget, setFinishTarget] = useState(() => Date.now() + 8000);
    const restart = () => { setDone(false); setFinishTarget(Date.now() + 8000); };

    return (
      <div className="omada-cd">
        <div className="omada-cd-grid">

          {/* deadline countdown */}
          <Tile tag={t('cd.countdown')}>
            <Countdown type="down" value={tg.maint} format="HH:mm:ss"
                       icon="clock" title={t('cd.maintIn')} />
          </Tile>

          {/* with days */}
          <Tile tag={t('cd.withDays')}>
            <Countdown type="down" value={tg.fw} format="D[d] HH:mm:ss"
                       icon="download" title={t('cd.firmwareIn')} />
          </Tile>

          {/* count-up elapsed */}
          <Tile tag={t('cd.countup')}>
            <Countdown type="up" value={tg.uptime} format="D[d] HH:mm:ss"
                       icon="power" title={t('cd.uptime')} />
          </Tile>

          {/* finish callback */}
          <Tile tag={t('cd.onFinish')}>
            {done ? (
              <div className="omada-cd-done">
                <div className="omada-cd-donetitle">{t('cd.finishedTitle')}</div>
                <div className="omada-cd-donerow">
                  <Tag color="green"><window.OmadaIcon name="check" size={13} /> {t('cd.finished')}</Tag>
                  <button type="button" className="omada-cd-restart" onClick={restart}>
                    <window.OmadaIcon name="refresh" size={13} /> {t('cd.restart')}
                  </button>
                </div>
              </div>
            ) : (
              <Countdown key={finishTarget} type="down" value={finishTarget} format="mm:ss"
                         icon="adopt" title={t('cd.finishedTitle')} onFinish={() => setDone(true)} />
            )}
          </Tile>

        </div>

        {/* KPI tile inside a Card */}
        <div className="omada-cd-kpiwrap">
          <Card size="small" className="omada-cd-kpi">
            <Countdown type="down" value={tg.kpi} format="HH:mm:ss"
                       icon="reboot" title={t('cd.kpiTitle')} />
          </Card>
          <Card size="small" className="omada-cd-kpi">
            <Countdown type="down" value={tg.maint} format="HH:mm:ss"
                       icon="lock" title={t('cd.session')} />
          </Card>
        </div>

        <div className="omada-cd-note">{t('cd.note')}</div>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Countdown = CountdownDemo;
})();
