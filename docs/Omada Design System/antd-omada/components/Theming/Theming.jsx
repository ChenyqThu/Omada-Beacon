/* ────────────────────────────────────────────────────────────────────────
   components/Theming/Theming.jsx — OmadaTheming

   A THEMING / TOKEN-ARCHITECTURE board — the "how the skin is built" companion
   to the ColorTokens palette board. ColorTokens shows the finished values;
   this shows the CASCADE that produces them:

     seed (colorPrimary)  →  map (hover / active / bg / border / text, DERIVED
     by antd's algorithm)  →  component (real Button / Switch / Checkbox / Tag
     that read those map tokens).

   A live brand-hue swap rebuilds a scoped ConfigProvider with only the seed
   changed — the explicit derived primaries are stripped so antd re-derives the
   whole map from the seed, exactly as production would. The map swatches and
   the component column read the LIVE values via theme.useToken(), so the board
   can never disagree with what antd actually computes.

   NOT a primitive — it wraps antd ConfigProvider + theme.useToken + existing
   Omada wrappers. Surfaces are theme vars with dark twins; the only colours are
   the seed presets (the Omada accent ramp) and whatever antd derives.

   Figma: the brand-ramp methodology is the Color frame "基于品牌色延伸全套色系"
   (node 25331:84189) — build a from-dark-to-light scale from one brand seed.
   Here the derivation is antd's algorithm rather than the manual opacity steps,
   but the principle (one seed → a full system) is the same.
   Exports: window.Omada.Theming
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { useState } = React;

  // seed presets — the Omada accent ramp (window.OMADA), one chroma family
  const HUES = [
    { key: 'theme.hue.green',   val: '#00A870' },
    { key: 'theme.hue.blue',    val: '#0069CB' },
    { key: 'theme.hue.magenta', val: '#F476FF' },
    { key: 'theme.hue.orange',  val: '#FF8C27' },
  ];

  function Swatch(props) {
    return (
      <div className="omada-theme-swatch">
        <span className="omada-theme-chip" style={{ background: props.color }} />
        <div className="omada-theme-swmeta">
          <code className="omada-theme-swname">{props.name}</code>
          <code className="omada-theme-swval">{props.value}</code>
        </div>
      </div>
    );
  }

  // child of the scoped ConfigProvider — reads the DERIVED tokens live
  function Cascade(props) {
    const t = props.t;
    const { theme, Switch, Checkbox, Tag } = window.antd;
    const Button = window.Omada.Button;
    const { token } = theme.useToken();

    const MAP = [
      { key: 'theme.tok.hover',  val: token.colorPrimaryHover },
      { key: 'theme.tok.active', val: token.colorPrimaryActive },
      { key: 'theme.tok.bg',     val: token.colorPrimaryBg },
      { key: 'theme.tok.border', val: token.colorPrimaryBorder },
      { key: 'theme.tok.text',   val: token.colorPrimaryText },
    ];

    return (
      <div className="omada-theme-cascade">

        {/* seed */}
        <div className="omada-theme-col">
          <div className="omada-theme-coltag">{t('theme.seed')}</div>
          <div className="omada-theme-seed" style={{ background: token.colorPrimary }}>
            <code>{token.colorPrimary}</code>
          </div>
          <code className="omada-theme-seedname">{t('theme.tok.primary')}</code>
        </div>

        <div className="omada-theme-arrow"><window.OmadaIcon name="arrow-right" size={18} /></div>

        {/* map (derived) */}
        <div className="omada-theme-col is-map">
          <div className="omada-theme-coltag">{t('theme.map')}</div>
          <div className="omada-theme-maplist">
            {MAP.map((m) => <Swatch key={m.key} color={m.val} name={t(m.key)} value={String(m.val)} />)}
          </div>
        </div>

        <div className="omada-theme-arrow"><window.OmadaIcon name="arrow-right" size={18} /></div>

        {/* component */}
        <div className="omada-theme-col is-comp">
          <div className="omada-theme-coltag">{t('theme.component')}</div>
          <div className="omada-theme-comprow">
            <Button variant="primary">{t('theme.compName.button')}</Button>
          </div>
          <div className="omada-theme-comprow">
            <Switch defaultChecked />
            <span className="omada-theme-complabel">{t('theme.compName.switch')}</span>
          </div>
          <div className="omada-theme-comprow">
            <Checkbox defaultChecked />
            <Tag color={token.colorPrimary}>{t('theme.compName.tag')}</Tag>
          </div>
        </div>

      </div>
    );
  }

  function OmadaTheming(props) {
    const className = props.className || '';
    const rest = Object.assign({}, props);
    delete rest.className;

    const ctx = window.useOmada ? window.useOmada() : { t: (k) => k, lang: 'en', mode: 'light' };
    const t = ctx.t;
    const mode = ctx.mode;

    const { ConfigProvider, theme } = window.antd;
    const [hue, setHue] = useState('#00A870');

    // rebuild the scoped theme: Omada base, seed swapped, derived primaries
    // stripped so the algorithm re-derives the map from the seed.
    const base = window.getOmadaTheme(mode, theme.darkAlgorithm);
    const token = Object.assign({}, base.token, { colorPrimary: hue });
    delete token.colorPrimaryHover; delete token.colorPrimaryActive;
    delete token.colorPrimaryBg; delete token.colorPrimaryBgHover;
    delete token.colorPrimaryBorder; delete token.colorPrimaryBorderHover;
    delete token.colorPrimaryText;
    const scoped = Object.assign({}, base, { token });

    return (
      <div className={('omada-theme ' + className).trim()} {...rest}>

        {/* ── brand-hue swap ── */}
        <div className="omada-theme-sub">{t('theme.swap')}</div>
        <div className="omada-theme-desc">{t('theme.swapDesc')}</div>
        <div className="omada-theme-hues">
          {HUES.map((h) => (
            <button key={h.val} type="button"
                    className={'omada-theme-hue' + (hue === h.val ? ' is-on' : '')}
                    onClick={() => setHue(h.val)} aria-pressed={hue === h.val}>
              <span className="omada-theme-hueswatch" style={{ background: h.val }} />
              <span className="omada-theme-huename">{t(h.key)}</span>
              <code className="omada-theme-huehex">{h.val}</code>
            </button>
          ))}
        </div>

        {/* ── cascade ── */}
        <div className="omada-theme-sub">{t('theme.seed')} → {t('theme.map')} → {t('theme.component')}</div>
        <div className="omada-theme-desc">{t('theme.cascadeDesc')}</div>
        <ConfigProvider theme={scoped}>
          <Cascade t={t} />
        </ConfigProvider>

        <div className="omada-theme-note">{t('theme.note')}</div>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.Theming = OmadaTheming;
})();
