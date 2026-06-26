/* ────────────────────────────────────────────────────────────────────────
   components/ErrorBoundary/ErrorBoundary.jsx — OmadaErrorBoundary

   The error-handling primitive the library was missing. React only catches
   render/lifecycle errors through a CLASS componentDidCatch boundary — there's
   no hook for it — so this is a real class wrapper, and the antd-recommended
   composition is "boundary catches → render a Result". This wires the two:

     · OmadaErrorBoundary (class) — catches a thrown render error, stores it,
       and renders a recoverable fallback instead of a white screen.
     · default fallback — an Omada.Result tone="error" with a "Try again"
       primary action (re-mounts the subtree via a reset key), an optional
       Reload, and a collapsible technical detail (dev affordance, not shown to
       end users by default).
     · custom fallback — pass `fallback={({ error, reset }) => …}` to render
       your own state; `onReset` / `onError` hooks for logging + telemetry.
     · resetKeys — change any value in the array to auto-recover (e.g. on route
       change) without a manual retry.

   All visuals are the Omada.Result wrapper (semantic tokens, light + dark) plus
   a little chrome in omada-overrides.css. Strings via window.t().

   Figma: no node — an architecture primitive. The recovery screen it renders is
   the Result wrapper (built token-first from the Empty / Illustration style).
   Exports: window.Omada.ErrorBoundary
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { useState } = React;

  // Default recovery screen — a function so it can read theme/locale via hooks.
  function DefaultFallback(props) {
    const ctx = window.useOmada ? window.useOmada() : { t: (k) => k };
    const t = ctx.t;
    const Result = window.Omada.Result;
    const Button = window.Omada.Button;
    const [showDetail, setShowDetail] = useState(false);

    const message = props.error && props.error.message ? props.error.message : String(props.error || '');

    return (
      <div className="omada-eb-fallback">
        <Result
          tone="error"
          title={t('eb.title')}
          subTitle={t('eb.subtitle')}
          extra={
            <div className="omada-eb-actions">
              <Button variant="primary" onClick={props.reset}>
                <window.OmadaIcon name="refresh" size={15} /> {t('eb.retry')}
              </Button>
              <Button variant="secondary" onClick={() => window.location.reload()}>
                {t('eb.reload')}
              </Button>
            </div>
          }
        />
        <div className="omada-eb-detailwrap">
          <button type="button" className="omada-eb-detailtoggle" onClick={() => setShowDetail((s) => !s)}>
            <window.OmadaIcon name={showDetail ? 'chevron-up' : 'chevron-down'} size={14} />
            {t('eb.detail')}
          </button>
          {showDetail && <pre className="omada-eb-detail">{message}</pre>}
        </div>
      </div>
    );
  }

  class OmadaErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { error: null, resetCount: 0 };
      this.reset = this.reset.bind(this);
    }

    static getDerivedStateFromError(error) {
      return { error: error };
    }

    componentDidCatch(error, info) {
      if (this.props.onError) this.props.onError(error, info);
    }

    componentDidUpdate(prevProps) {
      // auto-recover when any resetKey changes
      const a = prevProps.resetKeys || [];
      const b = this.props.resetKeys || [];
      if (this.state.error && (a.length !== b.length || a.some((v, i) => v !== b[i]))) {
        this.reset();
      }
    }

    reset() {
      this.setState((s) => ({ error: null, resetCount: s.resetCount + 1 }));
      if (this.props.onReset) this.props.onReset();
    }

    render() {
      if (this.state.error) {
        if (typeof this.props.fallback === 'function') {
          return this.props.fallback({ error: this.state.error, reset: this.reset });
        }
        return <DefaultFallback error={this.state.error} reset={this.reset} />;
      }
      // key bump forces a fresh mount of the subtree on reset
      return <React.Fragment key={this.state.resetCount}>{this.props.children}</React.Fragment>;
    }
  }

  window.Omada = window.Omada || {};
  window.Omada.ErrorBoundary = OmadaErrorBoundary;
})();
