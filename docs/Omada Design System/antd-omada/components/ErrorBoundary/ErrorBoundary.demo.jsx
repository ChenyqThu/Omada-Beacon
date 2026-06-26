/* components/ErrorBoundary/ErrorBoundary.demo.jsx — window.OmadaDemos.ErrorBoundary */
(function () {
  const { useState } = React;

  // A child that throws during render when asked — the only honest way to
  // exercise a render-error boundary.
  function Buggy(props) {
    if (props.crash) {
      throw new Error('Cannot read properties of undefined (reading "ssid") — DeviceCard');
    }
    return (
      <div className="omada-eb-ok">
        <window.OmadaIcon name="check-circle" size={18} />
        <div>
          <div className="omada-eb-oktitle">{props.okTitle}</div>
          <div className="omada-eb-oksub">{props.okSub} · #{props.mountId}</div>
        </div>
      </div>
    );
  }

  function ErrorBoundaryDemo() {
    const ctx = window.useOmada ? window.useOmada() : { t: (k) => k };
    const t = ctx.t;
    const { ErrorBoundary, Button } = window.Omada;

    const [crashA, setCrashA] = useState(false);
    const [crashB, setCrashB] = useState(false);
    const [mountA] = useState(() => Math.floor(Math.random() * 900 + 100));
    const [mountB] = useState(() => Math.floor(Math.random() * 900 + 100));

    return (
      <div className="omada-eb">

        {/* default fallback */}
        <div className="omada-eb-card">
          <div className="omada-eb-tag">{t('eb.defaultTag')}</div>
          <div className="omada-eb-desc">{t('eb.defaultDesc')}</div>
          <div className="omada-eb-stage">
            <ErrorBoundary onReset={() => setCrashA(false)}>
              <Buggy crash={crashA} mountId={mountA}
                     okTitle={t('eb.okTitle')} okSub={t('eb.okSub')} />
            </ErrorBoundary>
          </div>
          <div className="omada-eb-trigger">
            <Button variant="danger-ghost" disabled={crashA} onClick={() => setCrashA(true)}>
              <window.OmadaIcon name="warning" size={15} /> {t('eb.trigger')}
            </Button>
          </div>
        </div>

        {/* custom fallback */}
        <div className="omada-eb-card">
          <div className="omada-eb-tag">{t('eb.customTag')}</div>
          <div className="omada-eb-desc">{t('eb.customDesc')}</div>
          <div className="omada-eb-stage">
            <ErrorBoundary
              onReset={() => setCrashB(false)}
              fallback={(o) => (
                <div className="omada-eb-inline">
                  <window.OmadaIcon name="ban" size={16} />
                  <span className="omada-eb-inlinemsg">{t('eb.inlineMsg')}</span>
                  <button type="button" className="omada-eb-inlineretry" onClick={o.reset}>
                    <window.OmadaIcon name="refresh" size={13} /> {t('eb.retry')}
                  </button>
                </div>
              )}
            >
              <Buggy crash={crashB} mountId={mountB}
                     okTitle={t('eb.okTitle')} okSub={t('eb.okSub')} />
            </ErrorBoundary>
          </div>
          <div className="omada-eb-trigger">
            <Button variant="danger-ghost" disabled={crashB} onClick={() => setCrashB(true)}>
              <window.OmadaIcon name="warning" size={15} /> {t('eb.trigger')}
            </Button>
          </div>
        </div>

        <div className="omada-eb-note">{t('eb.note')}</div>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.ErrorBoundary = ErrorBoundaryDemo;
})();
