/* ────────────────────────────────────────────────────────────────────────
   components/Spin/Spin.jsx — OmadaSpin

   Thin wrapper over antd <Spin>, matching the Figma "loading 加载" node:
   a brand-green circular indicator (the Omada `refresh` glyph spun by the
   shared `.omada-spin` keyframe, recoloured to colorPrimary so it reads as
   one family with the Steps loading node) plus an optional green tip
   ("Loading…"). Sizes sm / default / lg map to the 16 / 24 / 36 dot tokens.

   Adds nothing antd can't do — it just supplies the bespoke indicator and the
   `omada-spin-wrap` class the overrides layer uses to colour the dot + tip
   (light + dark twins in omada-overrides.css). Everything else (spinning,
   delay, fullscreen, percent 'auto'|number, wrapperClassName, children as a
   blocking overlay) is forwarded straight through.

   Figma: loading 加载 node 3:26828 (page 43:34762) — Loading text · icon+text.
   Exports: window.Omada.Spin
   ──────────────────────────────────────────────────────────────────────── */

const { Spin: AntSpin } = window.antd;

function OmadaSpin(props) {
  const size = props.size || 'default';
  const className = props.className || '';
  const rest = Object.assign({}, props);
  delete rest.size; delete rest.className; delete rest.indicator;

  const glyph = { small: 16, default: 24, large: 36 }[size] || 24;
  const indicator = props.indicator || (
    <window.OmadaIcon name="refresh" size={glyph} className="omada-spin omada-spin-indicator" />
  );
  const cls = ('omada-spin-wrap ' + className).trim();

  return <AntSpin className={cls} size={size} indicator={indicator} {...rest} />;
}

window.Omada = window.Omada || {};
window.Omada.Spin = OmadaSpin;
