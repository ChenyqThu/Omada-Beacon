/* ────────────────────────────────────────────────────────────────────────
   components/Result/Result.jsx — OmadaResult

   Thin wrapper over antd Result — the full-page feedback state (success /
   error / info / warning / 403 / 404). antd ships cartoon illustrations for
   403/404/500; the Omada style uses the same OmadaIcon line set on a tinted
   disc instead, so the feedback reads in the product's own visual language.
   For the numeric pages (403/404) we keep antd's built-in illustration.

   `tone` is the Omada convenience that maps to antd's `status` + picks the
   matching OmadaIcon + semantic tint:
     success → check-circle (green) · error → ban (red)
     warning → warning (orange) · info → info (blue)

   Visuals come entirely from semantic tokens (colorSuccess/Error/… already
   Omada-tuned, light + dark). Only the icon-disc + extra spacing are CSS
   (omada-overrides.css). Strings via window.t().

   Figma: no dedicated Result frame in the file — built token-first from the
   Empty / Illustration style + the semantic colour ramp (a token-only call).

   Exports: window.Omada.Result
   ──────────────────────────────────────────────────────────────────────── */

const { Result: AntResult } = window.antd;

const TONE = {
  success: { status: 'success', icon: 'check-circle', light: '#00A870', dark: '#16B981' },
  error:   { status: 'error',   icon: 'ban',          light: '#EE385C', dark: '#FF5C7A' },
  warning: { status: 'warning', icon: 'warning',      light: '#FF8C27', dark: '#FFA552' },
  info:    { status: 'info',    icon: 'info',         light: '#0069CB', dark: '#3D9BFF' },
};

function ToneDisc({ tone }) {
  const { mode } = window.useOmada();
  const cfg = TONE[tone] || TONE.info;
  const color = mode === 'dark' ? cfg.dark : cfg.light;
  return (
    <span className="omada-result-icon" style={{
      width: 72, height: 72, borderRadius: '50%',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      background: color + (mode === 'dark' ? '2B' : '1F'),
      color: color,
    }}>
      <window.OmadaIcon name={cfg.icon} size={36} strokeWidth={1.6} />
    </span>
  );
}

function OmadaResult({ tone, status, icon, ...rest }) {
  // numeric pages (403/404/500) keep antd's own illustration
  const numeric = ['403', '404', '500', 404, 403, 500].includes(status);
  if (tone && !numeric) {
    return <AntResult status={(TONE[tone] || TONE.info).status} icon={icon || <ToneDisc tone={tone} />} {...rest} />;
  }
  return <AntResult status={status} icon={icon} {...rest} />;
}

window.Omada = window.Omada || {};
window.Omada.Result = OmadaResult;
