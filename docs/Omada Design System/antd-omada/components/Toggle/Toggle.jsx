/* ────────────────────────────────────────────────────────────────────────
   components/Toggle/Toggle.jsx — OmadaSwitch · OmadaCheckbox · OmadaRadio

   The three boolean/choice controls. antd already renders them correctly from
   the Omada tokens (brand-green checked state, 36×20 switch, 8px radio dot,
   3px checkbox radius — all in omada-theme.js light + dark), so these wrappers
   are intentionally near-pure passthroughs that exist to (a) give the library
   one consistent import surface and (b) carry sub-components (.Group, .Button).

   Exports: window.Omada.Switch, window.Omada.Checkbox, window.Omada.Radio
   ──────────────────────────────────────────────────────────────────────── */

const { Switch: AntSwitch, Checkbox: AntCheckbox, Radio: AntRadio } = window.antd;

function OmadaSwitch(props)   { return <AntSwitch {...props} />; }

function OmadaCheckbox(props) { return <AntCheckbox {...props} />; }
OmadaCheckbox.Group = AntCheckbox.Group;

function OmadaRadio(props)    { return <AntRadio {...props} />; }
OmadaRadio.Group  = AntRadio.Group;
OmadaRadio.Button = AntRadio.Button;

window.Omada = window.Omada || {};
window.Omada.Switch   = OmadaSwitch;
window.Omada.Checkbox = OmadaCheckbox;
window.Omada.Radio    = OmadaRadio;
