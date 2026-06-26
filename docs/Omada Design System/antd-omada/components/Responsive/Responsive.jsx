/* ────────────────────────────────────────────────────────────────────────
   components/Responsive/Responsive.jsx — OmadaResponsive

   A RESPONSIVE / BREAKPOINT board, built on antd's 24-column Grid and the
   standard breakpoint scale. Three surfaces, all live:

     1. Active breakpoint — a chip row driven by Grid.useBreakpoint(); the
        breakpoints currently satisfied by the preview width light up, so you
        can watch them flip as the pane resizes.
     2. Breakpoint scale — each breakpoint with its min-width and a device
        label (xs phone … xxl wide desktop).
     3. Responsive grid — a <Row> of <Col>s whose span changes per breakpoint
        (xs 24 · sm 12 · md 8 · lg 6) + a content/sidebar split that stacks
        under md — the real reflow, not a picture of one.

   This is NOT a new primitive — it composes antd Row / Col / Grid.useBreakpoint.
   Surfaces are theme vars with dark twins; the active accent is the brand token.

   Figma: no dedicated breakpoint frame; this is antd's Grid responsive system
   (xs<576 · sm≥576 · md≥768 · lg≥992 · xl≥1200 · xxl≥1600) themed with Omada
   tokens.
   Exports: window.Omada.Responsive
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  function OmadaResponsive(props) {
    const className = props.className || '';
    const rest = Object.assign({}, props);
    delete rest.className;

    const ctx = window.useOmada ? window.useOmada() : { t: (k) => k, lang: 'en' };
    const t = ctx.t;

    const { Row, Col, Grid } = window.antd;
    const screens = Grid.useBreakpoint();

    const BP = [
      { key: 'xs',  min: '< 576px',  devKey: 'resp.xs' },
      { key: 'sm',  min: '≥ 576px',  devKey: 'resp.sm' },
      { key: 'md',  min: '≥ 768px',  devKey: 'resp.md' },
      { key: 'lg',  min: '≥ 992px',  devKey: 'resp.lg' },
      { key: 'xl',  min: '≥ 1200px', devKey: 'resp.xl' },
      { key: 'xxl', min: '≥ 1600px', devKey: 'resp.xxl' },
    ];
    // the largest currently-active breakpoint, for the headline chip
    const activeKey = [...BP].reverse().find((b) => screens[b.key]);
    const sideStacks = !screens.md; // sidebar collapses under md

    return (
      <div className={('omada-resp ' + className).trim()} {...rest}>

        {/* ── active breakpoint ── */}
        <div className="omada-resp-sub">{t('resp.current')}</div>
        <div className="omada-resp-chips">
          {BP.map((b) => {
            const on = !!screens[b.key];
            const head = activeKey && activeKey.key === b.key;
            return (
              <span key={b.key} className={'omada-resp-chip' + (on ? ' is-on' : '') + (head ? ' is-head' : '')}>
                <code>{b.key}</code>
                {head ? <span className="omada-resp-chiptag">{t('resp.active')}</span> : null}
              </span>
            );
          })}
        </div>

        {/* ── breakpoint scale ── */}
        <div className="omada-resp-sub">{t('resp.scale')}</div>
        <div className="omada-resp-scale">
          {BP.map((b) => (
            <div key={b.key} className={'omada-resp-srow' + (screens[b.key] ? ' is-on' : '')}>
              <code className="omada-resp-skey">{b.key}</code>
              <span className="omada-resp-smin">{b.min}</span>
              <span className="omada-resp-sdev">{t(b.devKey)}</span>
            </div>
          ))}
        </div>

        {/* ── responsive grid ── */}
        <div className="omada-resp-sub">{t('resp.grid')}</div>
        <div className="omada-resp-desc">{t('resp.desc')}</div>

        <div className="omada-resp-gridnote"><code>{t('resp.colNote')}</code></div>
        <Row gutter={[12, 12]} className="omada-resp-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <Col key={i} xs={24} sm={12} md={8} lg={6}>
              <div className="omada-resp-cell">{i + 1}</div>
            </Col>
          ))}
        </Row>

        <div className="omada-resp-gridnote"><code>{t('resp.sidebarNote')}</code></div>
        <Row gutter={[12, 12]} className="omada-resp-grid">
          <Col xs={24} md={7} lg={6}>
            <div className={'omada-resp-panel is-side' + (sideStacks ? ' is-stacked' : '')}>{t('resp.side')}</div>
          </Col>
          <Col xs={24} md={17} lg={18}>
            <div className="omada-resp-panel is-main">{t('resp.main')}</div>
          </Col>
        </Row>

        <div className="omada-resp-note">{t('resp.note')}</div>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.Responsive = OmadaResponsive;
})();
