/* ────────────────────────────────────────────────────────────────────────
   components/Tag/Tag.jsx — OmadaTag + OmadaStatusPill

   OmadaTag      — rectangular tag (4px radius). `tone` is an Omada convenience
                   that maps to antd's semantic `color`.
   OmadaStatusPill — the signature round status pill with a leading dot.
                   Pass `status` (connectivity) to auto-resolve colour + the
                   i18n label, or `tone` + children for a custom pill.

   Pill shape + dot live in omada-overrides.css (`.omada-pill`, with a
   [data-omada-theme="dark"] twin). Colours come from antd's semantic tokens.

   Figma: Tag node group under /Tag. Status words per root README "Content".

   Exports: window.Omada.Tag, window.Omada.StatusPill
   ──────────────────────────────────────────────────────────────────────── */

const { Tag: AntTag } = window.antd;

/* Omada tone → antd Tag color */
const OM_TONE_TO_COLOR = {
  success: 'success',
  processing: 'processing',
  warning: 'warning',
  error: 'error',
  neutral: 'default',
  default: 'default',
};

/* connectivity status → { color, i18n key } */
const OM_STATUS = {
  connected:    { color: 'success',    key: 'status.connected' },
  online:       { color: 'success',    key: 'status.online' },
  adopting:     { color: 'processing', key: 'status.adopting' },
  pending:      { color: 'warning',    key: 'status.pending' },
  disconnected: { color: 'error',      key: 'status.disconnected' },
  offline:      { color: 'default',    key: 'status.offline' },
  skipped:      { color: 'default',    key: 'status.skipped' },
  error:        { color: 'error',      key: 'status.error' },
  warning:      { color: 'warning',    key: 'status.warning' },
};

function OmadaTag({ tone, color, className, children, ...rest }) {
  delete rest.tone;
  const c = color != null ? color : (tone ? OM_TONE_TO_COLOR[tone] : undefined);
  return <AntTag color={c} className={className} {...rest}>{children}</AntTag>;
}

function OmadaStatusPill({ status, tone, color, lang, className, children, ...rest }) {
  delete rest.status; delete rest.tone; delete rest.lang;
  const meta = status ? OM_STATUS[status] : null;
  const c = color != null ? color : (meta ? meta.color : (tone ? OM_TONE_TO_COLOR[tone] : 'default'));
  // Auto-label from i18n when `status` is given and no explicit children.
  let label = children;
  if (label == null && meta) {
    const lg = lang || localStorage.getItem('omada.lang') || 'en';
    label = window.t(meta.key, lg);
  }
  const cls = ['omada-pill', className].filter(Boolean).join(' ');
  return <AntTag color={c} className={cls} {...rest}>{label}</AntTag>;
}

window.Omada = window.Omada || {};
window.Omada.Tag = OmadaTag;
window.Omada.StatusPill = OmadaStatusPill;
