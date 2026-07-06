/* ────────────────────────────────────────────────────────────────────────
   components/LoadingStates/LoadingStates.jsx — OmadaLoadingStates

   A "how to show loading" PATTERN PAGE — not a new primitive. It ties the
   three loading building blocks already in the library (Spin · Skeleton ·
   ChartEmpty) into one decision board so a designer can pick the right one,
   following the Figma "loading 加载" taxonomy (node 2942:88307 / 18920:27065):

     1. 通用加载  inline    → Spin (icon · text · icon + text) for a block
     2. 全局加载  full page → blocking Spin overlay + a top progress sweep
     3. 骨架屏加载 skeleton  → Skeleton mirroring the final layout in grey
     4. 图表/空白 chart/blank→ ChartEmpty keeps the chart frame; short waits blank

   Each card pairs a "when to use" caption with a LIVE specimen built from the
   real wrappers, so the guidance and the components can't drift apart. All
   colour is theme-var driven (dark twins in omada-overrides.css); the only
   bespoke motion is the indeterminate top-bar sweep, gated for reduced motion.

   Figma: loading 加载 node 2942:88307 + 18920:27065 (page 43:34762).
   Exports: window.Omada.LoadingStates
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  function OmadaLoadingStates(props) {
    const className = props.className || '';
    const rest = Object.assign({}, props);
    delete rest.className;

    const ctx = window.useOmada ? window.useOmada() : { t: (k) => k, lang: 'en' };
    const t = ctx.t;
    const L = (en, zh) => (ctx.lang === 'zh' ? zh : en);

    const Spin = window.Omada.Spin;
    const Skeleton = window.Omada.Skeleton;
    const ChartEmpty = window.Omada.ChartEmpty;

    return (
      <div className={('omada-loadstate ' + className).trim()} {...rest}>
        <div className="omada-loadstate-grid">

          {/* 1 — inline / block */}
          <div className="omada-loadstate-card">
            <div className="omada-loadstate-head">
              <span className="omada-loadstate-tag">{t('ls.inline')}</span>
              <span className="omada-loadstate-title">{t('ls.inlineTitle')}</span>
            </div>
            <div className="omada-loadstate-when">{t('ls.inlineWhen')}</div>
            <div className="omada-loadstate-stage">
              <div className="omada-loadstate-inline-row">
                <span className="omada-loadstate-pill"><Spin size="small" /></span>
                <span className="omada-loadstate-pill omada-loadstate-text">{t('loading.tip')}</span>
                <span className="omada-loadstate-pill">
                  <Spin size="small" /> <span>{t('loading.tip')}</span>
                </span>
              </div>
            </div>
          </div>

          {/* 2 — full page / global */}
          <div className="omada-loadstate-card">
            <div className="omada-loadstate-head">
              <span className="omada-loadstate-tag">{t('ls.global')}</span>
              <span className="omada-loadstate-title">{t('ls.globalTitle')}</span>
            </div>
            <div className="omada-loadstate-when">{t('ls.globalWhen')}</div>
            <div className="omada-loadstate-stage">
              <div className="omada-loadstate-viewport">
                <div className="omada-loadstate-topbar"><i /></div>
                <Spin spinning tip={t('loading.fetching')}>
                  <div className="omada-loadstate-page">
                    <div className="omada-loadstate-ph" style={{ width: '52%' }} />
                    <div className="omada-loadstate-ph" style={{ width: '88%' }} />
                    <div className="omada-loadstate-ph" style={{ width: '74%' }} />
                    <div className="omada-loadstate-ph" style={{ width: '40%' }} />
                  </div>
                </Spin>
              </div>
            </div>
          </div>

          {/* 3 — skeleton */}
          <div className="omada-loadstate-card">
            <div className="omada-loadstate-head">
              <span className="omada-loadstate-tag">{t('ls.skeleton')}</span>
              <span className="omada-loadstate-title">{t('ls.skeletonTitle')}</span>
            </div>
            <div className="omada-loadstate-when">{t('ls.skeletonWhen')}</div>
            <div className="omada-loadstate-stage">
              <div className="omada-loadstate-skel">
                <Skeleton avatar active title paragraph={{ rows: 3 }} />
              </div>
            </div>
          </div>

          {/* 4 — chart / blank */}
          <div className="omada-loadstate-card">
            <div className="omada-loadstate-head">
              <span className="omada-loadstate-tag">{t('ls.chart')}</span>
              <span className="omada-loadstate-title">{t('ls.chartTitle')}</span>
            </div>
            <div className="omada-loadstate-when">{t('ls.chartWhen')}</div>
            <div className="omada-loadstate-stage">
              <ChartEmpty type="line" loading height={150} />
            </div>
          </div>

        </div>

        <div className="omada-loadstate-note">
          {L(
            'Rule of thumb: structured content → Skeleton; a busy action or partial fetch → Spin; a chart with no data → keep its frame (ChartEmpty); a sub-300ms wait → stay blank.',
            '经验法则：结构化内容用骨架屏；繁忙操作或局部加载用 Spin；无数据的图表保留其框架（ChartEmpty）；不足 300ms 的等待保持空白即可。'
          )}
        </div>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.LoadingStates = OmadaLoadingStates;
})();
