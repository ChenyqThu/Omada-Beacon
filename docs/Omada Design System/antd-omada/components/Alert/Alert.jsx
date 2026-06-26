/* ────────────────────────────────────────────────────────────────────────
   components/Alert/Alert.jsx — OmadaAlert

   Thin wrapper over antd Alert. Omada defaults: an OmadaIcon glyph per type
   (so the icon matches the rest of the library, not antd's default set), a
   `tone` convenience aliasing antd's `type`, and `showIcon` on by default.
   The tinted fills (e.g. rgba(0,168,112,0.10) success) come from the Alert
   colour tokens in omada-theme.js (light + dark); the 3px left accent strip
   from omada-overrides.css. Radius 6px (token).

   Figma: Alert 警告提示 node 3:25828 (success / info / warning / error;
   icon + leading-dot variants; dark twin under /Alert/Alert-dark).

   Exports: window.Omada.Alert
   ──────────────────────────────────────────────────────────────────────── */

const { Alert: AntAlert } = window.antd;

/* Omada tone → antd Alert type */
const OM_ALERT_TONE = { success: 'success', info: 'info', warning: 'warning', error: 'error' };
/* type → OmadaIcon glyph */
const OM_ALERT_ICON = {
  success: 'check-circle',
  info:    'info',
  warning: 'warning',
  error:   'ban',
};

function OmadaAlert({ tone, type, showIcon = true, icon, closeIcon, ...rest }) {
  delete rest.tone;
  const t = type || (tone ? OM_ALERT_TONE[tone] : 'info');
  const glyph = icon !== undefined
    ? icon
    : (showIcon && window.OmadaIcon
        ? <window.OmadaIcon name={OM_ALERT_ICON[t] || 'info'} size={18} />
        : undefined);
  const ci = closeIcon !== undefined
    ? closeIcon
    : (window.OmadaIcon ? <window.OmadaIcon name="close" size={15} /> : undefined);
  return <AntAlert type={t} showIcon={showIcon} icon={glyph} closeIcon={ci} {...rest} />;
}

window.Omada = window.Omada || {};
window.Omada.Alert = OmadaAlert;
