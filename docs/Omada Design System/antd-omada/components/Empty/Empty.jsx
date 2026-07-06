/* ────────────────────────────────────────────────────────────────────────
   components/Empty/Empty.jsx — OmadaEmpty

   Thin wrapper over antd Empty — the no-data placeholder. Defaults to antd's
   SIMPLE line illustration (the greyscale outline reads cleanly in both
   themes and matches the Omada "chart frame at 40% opacity" empty pattern in
   the Figma far better than the default cartoon). A `withAction` slot renders
   a primary CTA under the description (e.g. "Add Device").

   Visuals are token-only — the illustration inherits the neutral text/border
   tokens, so dark mode follows automatically. Strings via window.t().

   Figma: Empty-Space 空状态 (page node 43:34767) — "图表空状态" uses a faded
   frame + caption; we use antd's SIMPLE image (the bespoke illustrations are
   page-specific art, not redrawn here).

   Exports: window.Omada.Empty
   ──────────────────────────────────────────────────────────────────────── */

const { Empty: AntEmpty } = window.antd;

function OmadaEmpty({ image, simple = true, withAction, children, ...rest }) {
  // Babel-standalone's loose rest-spread can leak these onto antd's root div;
  // strip them explicitly (same defensive pattern as Icon.jsx).
  delete rest.simple; delete rest.withAction;
  const img = image !== undefined ? image : (simple ? AntEmpty.PRESENTED_IMAGE_SIMPLE : AntEmpty.PRESENTED_IMAGE_DEFAULT);
  return <AntEmpty image={img} {...rest}>{withAction || children}</AntEmpty>;
}

OmadaEmpty.PRESENTED_IMAGE_SIMPLE = AntEmpty.PRESENTED_IMAGE_SIMPLE;
OmadaEmpty.PRESENTED_IMAGE_DEFAULT = AntEmpty.PRESENTED_IMAGE_DEFAULT;

window.Omada = window.Omada || {};
window.Omada.Empty = OmadaEmpty;
