/* ────────────────────────────────────────────────────────────────────────
   components/ColorTokens/ColorTokens.jsx — OmadaColorTokens

   A living swatch board for the Omada palette. Not a wrapper — it READS the
   single source of truth (window.OMADA from omada-theme.js) and renders it, so
   it can never drift from the tokens the components actually use. Shows:
     - the brand-green ramp 50→900 (with hover/press markers)
     - the neutral ladder (light) + the dark surface ladder
     - the semantic four (success / warning / error / info)
     - the chart accent ramp (green → lime → blue → magenta → orange → red)
   Each chip shows its hex and copies it on click. Pure display; colours are
   the tokens themselves.

   Figma: Color 色彩 page (node 3:64240) — palette / token board.
   Exports: window.Omada.ColorTokens
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const OMADA = window.OMADA;
  const { useState } = React;

  function Chip({ value, name, note, big }) {
    const [copied, setCopied] = useState(false);
    const onCopy = () => {
      try { navigator.clipboard && navigator.clipboard.writeText(value); } catch (e) {}
      setCopied(true); setTimeout(() => setCopied(false), 900);
    };
    return (
      <button type="button" className="omada-swatch" onClick={onCopy} title={'Copy ' + value}
        style={{ height: big ? 72 : 56 }}>
        <span className="omada-swatch-fill" style={{ background: value }} />
        <span className="omada-swatch-meta">
          <span className="omada-swatch-name">{name}</span>
          <span className="omada-swatch-hex">{copied ? 'copied' : value}</span>
          {note ? <span className="omada-swatch-note">{note}</span> : null}
        </span>
      </button>
    );
  }

  function Group({ label, children, cols = 5 }) {
    return (
      <div className="omada-swatch-group">
        <div className="omada-swatch-grouplabel">{label}</div>
        <div className="omada-swatch-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {children}
        </div>
      </div>
    );
  }

  function OmadaColorTokens() {
    const { t } = window.useOmada();
    const g = OMADA.green;
    const n = OMADA.neutral;
    const d = OMADA.dark;
    return (
      <div className="omada-tokens">
        <Group label={t('tok.brand')} cols={5}>
          {['50','100','200','300','400','500','600','700','800','900'].map((k) => (
            <Chip key={k} value={g[k]} name={'green-' + k}
              note={k === '500' ? t('tok.base') : k === '400' ? t('tok.hover') : k === '600' ? t('tok.press') : null} />
          ))}
        </Group>

        <Group label={t('tok.neutral')} cols={5}>
          <Chip value={n.white} name="white" />
          {['50','100','200','400','500','600','800','950'].map((k) => (
            <Chip key={k} value={n[k]} name={'grey-' + k} />
          ))}
        </Group>

        <Group label={t('tok.semantic')} cols={4}>
          <Chip big value={g[500]} name={t('type.success')} note="#00A870" />
          <Chip big value={OMADA.orange} name={t('type.warning')} note="#FF8C27" />
          <Chip big value={OMADA.red} name={t('type.danger')} note="#EE385C" />
          <Chip big value={OMADA.blue} name="info" note="#0069CB" />
        </Group>

        <Group label={t('tok.accent')} cols={6}>
          <Chip value={g[500]} name="green" />
          <Chip value={OMADA.lime} name="lime" />
          <Chip value={OMADA.blue} name="blue" />
          <Chip value={OMADA.magenta} name="magenta" />
          <Chip value={OMADA.orange} name="orange" />
          <Chip value={OMADA.red} name="red" />
        </Group>

        <Group label={t('tok.darkSurface')} cols={5}>
          <Chip value={d.canvas} name="canvas" />
          <Chip value={d.surface} name="surface" />
          <Chip value={d.elevated} name="elevated" />
          <Chip value={d.spotlight} name="spotlight" />
          <Chip value={d.border} name="border" />
        </Group>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.ColorTokens = OmadaColorTokens;
})();
