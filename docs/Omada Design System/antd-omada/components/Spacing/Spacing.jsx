/* ────────────────────────────────────────────────────────────────────────
   components/Spacing/Spacing.jsx — OmadaSpacing

   A SPACING / LAYOUT-TOKEN board — the measured-specimen counterpart to the
   Elevation (shadow + radius) board. Elevation owns radius/shadow; this owns
   the 8-grid SPACING system from the design system:

     1. Base unit — 8px, with 4 as the only half-step, stated plainly.
     2. Spacing scale — 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48, each drawn as
        a bar whose WIDTH is the real value so the steps are visually measured,
        with the px value + an 8×N multiple tag.
     3. Gaps — a flex row rendered at three real gap values so you can see the
        sibling distance the 8-grid produces.
     4. Insets — table-cell / card / modal padding drawn as a measured inset
        frame, tying each padding step to where it's used.

   This is NOT a primitive — it's a spec board. Everything is theme-var driven
   (dark twins in omada-overrides.css); the only "values" are the 8-grid scale,
   which mirrors the design-system spacing and the component padding tokens in
   omada-theme.js (Table cellPadding 12 · Card padding 20 · Modal padding 24).

   Figma: no dedicated spacing frame; the 8-grid is the design-system spacing
   rule (see root README / colors_and_type.css) and the component padding tokens.
   Exports: window.Omada.Spacing
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  function OmadaSpacing(props) {
    const className = props.className || '';
    const rest = Object.assign({}, props);
    delete rest.className;

    const ctx = window.useOmada ? window.useOmada() : { t: (k) => k, lang: 'en' };
    const t = ctx.t;

    const SCALE = [4, 8, 12, 16, 20, 24, 32, 40, 48];
    const GAPS = [8, 16, 24];
    const INSETS = [
      { pad: 12, labelKey: 'spacing.cell' },
      { pad: 20, labelKey: 'spacing.card' },
      { pad: 24, labelKey: 'spacing.modal' },
    ];

    return (
      <div className={('omada-spacing ' + className).trim()} {...rest}>

        {/* ── base unit ── */}
        <div className="omada-spacing-base">
          <div className="omada-spacing-baseglyph">
            <span className="omada-spacing-basebox" />
            <code>8</code>
          </div>
          <div className="omada-spacing-basebody">
            <div className="omada-spacing-sub" style={{ marginTop: 0 }}>{t('spacing.base')}</div>
            <div className="omada-spacing-desc">{t('spacing.baseDesc')}</div>
          </div>
        </div>

        {/* ── spacing scale ── */}
        <div className="omada-spacing-sub">{t('spacing.scale')}</div>
        <div className="omada-spacing-scale">
          {SCALE.map((v) => (
            <div key={v} className="omada-spacing-srow">
              <code className="omada-spacing-sval">{v}</code>
              <div className="omada-spacing-strack">
                <span className="omada-spacing-sbar" style={{ width: v }} />
              </div>
              <span className="omada-spacing-smult">{v % 8 === 0 ? '8 × ' + (v / 8) : '½ · 4'}</span>
            </div>
          ))}
        </div>

        {/* ── gaps ── */}
        <div className="omada-spacing-sub">{t('spacing.gaps')}</div>
        <div className="omada-spacing-desc">{t('spacing.gapsDesc')}</div>
        <div className="omada-spacing-gaps">
          {GAPS.map((g) => (
            <div key={g} className="omada-spacing-gapcard">
              <div className="omada-spacing-gaprow" style={{ gap: g }}>
                <span className="omada-spacing-chip" />
                <span className="omada-spacing-chip" />
                <span className="omada-spacing-chip" />
              </div>
              <code className="omada-spacing-gaptok">gap: {g}px</code>
            </div>
          ))}
        </div>

        {/* ── insets ── */}
        <div className="omada-spacing-sub">{t('spacing.insets')}</div>
        <div className="omada-spacing-desc">{t('spacing.insetsDesc')}</div>
        <div className="omada-spacing-insets">
          {INSETS.map((ins) => (
            <div key={ins.pad} className="omada-spacing-insetcard">
              <div className="omada-spacing-insetframe" style={{ padding: ins.pad }}>
                <div className="omada-spacing-insetfill">
                  <span className="omada-spacing-insetdim">{ins.pad}px</span>
                </div>
              </div>
              <div className="omada-spacing-insetmeta">
                <span className="omada-spacing-insetname">{t(ins.labelKey)}</span>
                <code className="omada-spacing-insettok">padding: {ins.pad}px</code>
              </div>
            </div>
          ))}
        </div>

        <div className="omada-spacing-note">{t('spacing.note')}</div>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.Spacing = OmadaSpacing;
})();
