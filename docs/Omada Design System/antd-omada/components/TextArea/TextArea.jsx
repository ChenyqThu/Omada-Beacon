/* ────────────────────────────────────────────────────────────────────────
   components/TextArea/TextArea.jsx — OmadaTextArea

   Thin wrapper over antd Input.TextArea. Omada defaults: a sensible
   autoSize range (3–6 rows) so the field grows with content instead of
   scrolling, and 4px radius inherited from the Input tokens
   (omada-theme.js → components.Input). Pass `autoSize={false}` for a fixed
   box, or your own {minRows,maxRows}.

   Figma: Input 输入框 (multiline / 文本域 variant) — shares the Input spec.

   Exports: window.Omada.TextArea
   ──────────────────────────────────────────────────────────────────────── */

const { Input: AntInputForTextArea } = window.antd;
const AntTextArea = AntInputForTextArea.TextArea;

function OmadaTextArea({ autoSize = { minRows: 3, maxRows: 6 }, ...rest }) {
  return <AntTextArea autoSize={autoSize} {...rest} />;
}

window.Omada = window.Omada || {};
window.Omada.TextArea = OmadaTextArea;
