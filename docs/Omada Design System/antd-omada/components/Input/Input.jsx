/* ────────────────────────────────────────────────────────────────────────
   components/Input/Input.jsx — OmadaInput (+ .Search/.Password/.TextArea)

   Thin wrapper over antd Input. Adds `prefixIcon` / `suffixIcon` conveniences
   that accept an OmadaIcon name (string) or node. Everything else forwards to
   antd. Radius (4px), height (32), 3px green focus ring all come from
   omada-theme.js → components.Input.

   Exports: window.Omada.Input  (with .Search .Password .TextArea attached)
   ──────────────────────────────────────────────────────────────────────── */

const { Input: AntInput } = window.antd;

function iconNode(icon, color) {
  if (icon == null) return undefined;
  if (typeof icon === 'string' && window.OmadaIcon) {
    return <window.OmadaIcon name={icon} size={15} style={color ? { color } : undefined} />;
  }
  return icon;
}

function OmadaInput({ prefixIcon, suffixIcon, prefix, suffix, ...rest }) {
  // The gallery's direct-edit layer can re-inject string-literal attrs into
  // rest, so strip the conveniences defensively before forwarding to antd.
  delete rest.prefixIcon; delete rest.suffixIcon;
  const px = prefix != null ? prefix : iconNode(prefixIcon, 'var(--om-ph,#999)');
  const sx = suffix != null ? suffix : iconNode(suffixIcon, 'var(--om-ph,#999)');
  return <AntInput prefix={px} suffix={sx} {...rest} />;
}

// Sub-inputs already inherit the Omada Input tokens — expose them by name so
// callers reach them through one import (Omada.Input.Search, etc.).
OmadaInput.Search   = AntInput.Search;
OmadaInput.Password = AntInput.Password;
OmadaInput.TextArea = AntInput.TextArea;
OmadaInput.Group    = AntInput.Group;
OmadaInput.OTP      = AntInput.OTP;

window.Omada = window.Omada || {};
window.Omada.Input = OmadaInput;
