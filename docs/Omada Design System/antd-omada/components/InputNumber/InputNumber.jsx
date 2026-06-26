/* ────────────────────────────────────────────────────────────────────────
   components/InputNumber/InputNumber.jsx — OmadaInputNumber

   Thin wrapper over antd InputNumber. Covers the five Figma variants via
   plain antd props plus two conveniences:
     • `unit`       → addonAfter  (formatted input, unit trailing — "Mbps")
     • `unitBefore` → addonBefore (formatted input, unit leading — "$")
   Range-limited is just `min`/`max`; the fixed-label variant is `prefix`.
   Radius (4px) + 32 height come from omada-theme.js → components.InputNumber.

   Figma: InputNumber 数字输入框 node 3:16328 (basic / unit-after / unit-before /
   fixed-label / range-limited; dark twin 3:16498).

   Exports: window.Omada.InputNumber
   ──────────────────────────────────────────────────────────────────────── */

const { InputNumber: AntInputNumber } = window.antd;

function OmadaInputNumber({ unit, unitBefore, addonAfter, addonBefore, ...rest }) {
  delete rest.unit; delete rest.unitBefore;
  return (
    <AntInputNumber
      addonAfter={addonAfter !== undefined ? addonAfter : unit}
      addonBefore={addonBefore !== undefined ? addonBefore : unitBefore}
      {...rest}
    />
  );
}

window.Omada = window.Omada || {};
window.Omada.InputNumber = OmadaInputNumber;
