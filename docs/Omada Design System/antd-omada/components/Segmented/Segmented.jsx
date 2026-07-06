/* ────────────────────────────────────────────────────────────────────────
   components/Segmented/Segmented.jsx — OmadaSegmented

   Thin wrapper over antd Segmented — the inline view / range switch (Day ·
   Week · Month, or List · Grid · Map). The selected thumb sits on a grey-100
   track, lifts on a white card with the soft Omada shadow, and uses green
   text. Options may carry a leading OmadaIcon. Sizes sm / default / lg.

   Visuals: track/thumb colours + green selected text from omada-theme.js
   components.Segmented (light + dark); the selected-thumb shadow + 500 weight
   from omada-overrides.css (dark twin). Build icon options with the
   `seg.icon()` helper so glyphs route through OmadaIcon. Strings via window.t().

   Figma: no dedicated antd-Segmented frame — built token-first to match the
   Tabs/Radio.Button visual family (a token-only call). The Slider "有级分段"
   in the Figma is a different control (graduated slider), handled by Slider.

   Exports: window.Omada.Segmented
   ──────────────────────────────────────────────────────────────────────── */

const { Segmented: AntSegmented } = window.antd;

function OmadaSegmented({ className = '', ...rest }) {
  const cls = ('omada-segmented ' + className).trim();
  return <AntSegmented className={cls} {...rest} />;
}

/* helper: an option with a leading OmadaIcon + label */
OmadaSegmented.iconOption = function (value, label, iconName) {
  return {
    value,
    label: (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <window.OmadaIcon name={iconName} size={16} />{label}
      </span>
    ),
  };
};

window.Omada = window.Omada || {};
window.Omada.Segmented = OmadaSegmented;
