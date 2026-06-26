/* ────────────────────────────────────────────────────────────────────────
   components/ColorPicker/ColorPicker.jsx — OmadaColorPicker

   Thin wrapper over antd ColorPicker — used for LED / SSID-tag colours. Adds
   an Omada-curated `presets` swatch set drawn from the brand accent ramp
   (green · lime · blue · magenta · orange · red + neutrals) so picks stay
   on-palette, a 4px trigger radius, and the standard size set. Forwards
   `showText`, `allowClear`, `format`, gradient mode, etc.

   Visuals are token-only (trigger radius from components.ColorPicker, panel
   surfaces from the dark algorithm). The accent ramp is read from window.OMADA
   so it tracks the design tokens, not a literal list. Strings via window.t().

   Figma: ColorPicker 颜色选择器 (node 3:20255) — trigger swatch + popover with
   RGB/HSB inputs and preset swatches.

   Exports: window.Omada.ColorPicker
   ──────────────────────────────────────────────────────────────────────── */

const { ColorPicker: AntColorPicker } = window.antd;

function omadaPresets() {
  const O = window.OMADA || {};
  const g = O.green || {};
  return [
    {
      label: 'Omada',
      colors: [
        g[500] || '#00A870', g[300] || '#4BC68C', O.lime || '#A6EF00',
        O.blue || '#0069CB', O.magenta || '#F476FF', O.orange || '#FF8C27',
        O.red || '#EE385C', O.teal700 || '#0A5A5A',
      ],
    },
    {
      label: 'Neutral',
      colors: ['#2B2B2B', '#636363', '#999999', '#CCCCCC', '#ECECEC', '#FFFFFF'],
    },
  ];
}

function OmadaColorPicker({ presets, className = '', ...rest }) {
  const cls = ('omada-colorpicker ' + className).trim();
  return <AntColorPicker className={cls} presets={presets || omadaPresets()} {...rest} />;
}

window.Omada = window.Omada || {};
window.Omada.ColorPicker = OmadaColorPicker;
window.omadaColorPresets = omadaPresets;
