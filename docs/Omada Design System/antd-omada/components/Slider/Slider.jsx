/* ────────────────────────────────────────────────────────────────────────
   components/Slider/Slider.jsx — OmadaSlider

   Thin wrapper over antd Slider. Matches the Figma "Slider 滑动输入条": a 3px
   #ECECEC rail, a brand-green active track, a 14px round handle with a green
   focus ring, and graduated marks ("有级分段") rendered as quiet captions. A
   `unit` convenience appends a suffix to the tooltip value (e.g. "Mbps", "%").
   Single value + range; horizontal + vertical.

   Visuals: rail/track/handle/dot colours + sizes from omada-theme.js
   components.Slider (light + dark); the 3px focus ring + mark caption colours
   from omada-overrides.css (dark twins). Strings via window.t().

   Figma: Slider 滑动输入条 (node 3:17962) — rail 3px #ECECEC, track #00A870,
   handle 14px, graduated segments with value captions.

   Exports: window.Omada.Slider
   ──────────────────────────────────────────────────────────────────────── */

const { Slider: AntSlider } = window.antd;

function OmadaSlider({ unit, tooltip, className = '', ...rest }) {
  const cls = ('omada-slider ' + className).trim();
  const tip = unit
    ? { formatter: (v) => `${v} ${unit}`, ...(tooltip || {}) }
    : tooltip;
  return <AntSlider className={cls} tooltip={tip} {...rest} />;
}

window.Omada = window.Omada || {};
window.Omada.Slider = OmadaSlider;
