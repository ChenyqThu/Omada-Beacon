/* ────────────────────────────────────────────────────────────────────────
   components/Upload/Upload.jsx — OmadaUpload

   Thin wrapper over antd Upload. Two presets via `variant`:
     • 'button' (default) — an OmadaUpload trigger button (upload icon + label)
     • 'drag'             — the dashed drop zone (Upload.Dragger) with a green
                            hover edge and a centred OmadaIcon
   Always `beforeUpload={() => false}` so the gallery never hits a network —
   files stay client-side (presentational). Callers in a real app pass their
   own action/customRequest.

   Visuals: drag radius + green hover edge + icon colour from
   omada-overrides.css (dark twins); everything else is antd defaults under the
   Omada token theme. Strings via window.t().

   Figma: Upload 上传 (page node 43:34738) — dashed drop zone, green accent on
   hover, list rows with status colour.

   Exports: window.Omada.Upload
   ──────────────────────────────────────────────────────────────────────── */

const { Upload: AntUpload } = window.antd;

function OmadaUpload({ variant = 'button', children, className = '', beforeUpload, listType, ...rest }) {
  const guard = beforeUpload !== undefined ? beforeUpload : () => false; // keep it client-side
  if (variant === 'drag') {
    const cls = ('omada-upload ' + className).trim();
    return <AntUpload.Dragger className={cls} beforeUpload={guard} listType={listType} {...rest}>{children}</AntUpload.Dragger>;
  }
  const cls = ('omada-upload ' + className).trim();
  return <AntUpload className={cls} beforeUpload={guard} listType={listType} {...rest}>{children}</AntUpload>;
}

OmadaUpload.Dragger = AntUpload.Dragger;
OmadaUpload.LIST_IGNORE = AntUpload.LIST_IGNORE;

window.Omada = window.Omada || {};
window.Omada.Upload = OmadaUpload;
