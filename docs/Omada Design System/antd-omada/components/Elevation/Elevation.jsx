/* ────────────────────────────────────────────────────────────────────────
   components/Elevation/Elevation.jsx — OmadaElevation

   A living board for the elevation (shadow) + radius tokens. Like ColorTokens
   it READS the source of truth — the boxShadow values straight off
   window.omadaThemeLight / omadaThemeDark — so the cards demonstrate the exact
   shadows components use, and it re-reads the dark set when the theme flips.
   Shows the sm / md / lg shadow ladder (with its usage: card · drawer ·
   dropdown), plus the radius scale (button → pill).

   Figma: Shadow 投影 page (node 559:34761) — elevation token board.
   Exports: window.Omada.Elevation
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  function OmadaElevation() {
    const { t, mode } = window.useOmada();
    const tk = (mode === 'dark' ? window.omadaThemeDark : window.omadaThemeLight).token;

    const shadows = [
      { name: 'shadow-sm', value: tk.boxShadow,          use: t('elev.useSm') },
      { name: 'shadow-md', value: tk.boxShadowSecondary, use: t('elev.useMd') },
      { name: 'shadow-lg', value: tk.boxShadowTertiary,  use: t('elev.useLg') },
    ];
    const radii = [
      { name: 'button', v: 3 }, { name: 'input · tag', v: 4 },
      { name: 'card · menu', v: 8 }, { name: 'modal', v: 12 },
      { name: 'drawer', v: 16 }, { name: 'pill', v: 999 },
    ];

    return (
      <div className="omada-elev">
        <div className="omada-swatch-grouplabel">{t('elev.shadows')}</div>
        <div className="omada-elev-grid">
          {shadows.map((s) => (
            <div key={s.name} className="omada-elev-cell">
              <div className="omada-elev-chip" style={{ boxShadow: s.value }} />
              <div className="omada-elev-name">{s.name}</div>
              <div className="omada-elev-use">{s.use}</div>
            </div>
          ))}
        </div>

        <div className="omada-swatch-grouplabel" style={{ marginTop: 22 }}>{t('elev.radii')}</div>
        <div className="omada-elev-grid omada-elev-grid-6">
          {radii.map((r) => (
            <div key={r.name} className="omada-elev-cell">
              <div className="omada-radius-chip"
                style={{ borderRadius: r.v === 999 ? 999 : r.v }} />
              <div className="omada-elev-name">{r.v === 999 ? '999' : r.v + 'px'}</div>
              <div className="omada-elev-use">{r.name}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.Elevation = OmadaElevation;
})();
