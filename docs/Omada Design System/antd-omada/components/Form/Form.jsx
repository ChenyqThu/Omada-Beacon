/* ────────────────────────────────────────────────────────────────────────
   components/Form/Form.jsx — OmadaForm + Form.Item presets

   Thin wrapper over antd Form. Omada defaults match the Figma "Form 表单"
   spec: horizontal label-left layout that the host can flip to vertical for
   drawers / narrow widths, no colon, a quiet "optional" required-mark, and
   first-error scroll on submit. Metrics (label height 32, item gap 18,
   vertical label padding) come from omada-theme.js → components.Form, and
   the red required asterisk from omada-overrides.css.

   Form.Item is forwarded as-is — antd already supports the two things the
   Figma needs: a trailing `tooltip` info glyph on the label, and per-field
   `rules` for the blur-validation feedback. The .demo.jsx ships ready-made
   rule presets (required / email / ipv4 / range) routed through window.t().

   Figma: Form 表单-说明 node 3000:104884 (structure, label-left layout,
   Confirm/Cancel footer, info-icon labels, validation feedback section).

   Exports: window.Omada.Form (with .Item / .List / .useForm / … attached)
   ──────────────────────────────────────────────────────────────────────── */

const { Form: AntForm } = window.antd;

/* NB: read props plainly + clone — do NOT use `...rest` parameter destructuring
   in a <script type="text/babel"> wrapper. The in-browser Babel transform drops
   `children` out of a captured `...rest`, which renders an EMPTY form. Cloning
   props keeps children intact. (COMPONENT_SPEC critical pattern note.) */
function OmadaForm(props) {
  const rest = Object.assign({}, props);
  if (rest.layout === undefined) rest.layout = 'horizontal';
  if (rest.requiredMark === undefined) rest.requiredMark = 'optional';
  if (rest.colon === undefined) rest.colon = false;
  if (rest.scrollToFirstError === undefined) rest.scrollToFirstError = true;
  return <AntForm {...rest} />;
}

/* Re-attach antd's statics + hooks so callers use Omada.Form everywhere. */
OmadaForm.Item        = AntForm.Item;
OmadaForm.List        = AntForm.List;
OmadaForm.ErrorList   = AntForm.ErrorList;
OmadaForm.Provider    = AntForm.Provider;
OmadaForm.useForm     = AntForm.useForm;
OmadaForm.useWatch    = AntForm.useWatch;
OmadaForm.useFormInstance = AntForm.useFormInstance;

/* Rule presets — call with the current `t` so messages localise (en/zh).
   e.g. rules={OmadaFormRules.email(t)}  /  OmadaFormRules.range(t, 1, 100) */
window.OmadaFormRules = {
  required: (t) => [{ required: true, message: t('valid.required') }],
  email:    (t) => [{ required: true, message: t('valid.required') },
                    { type: 'email', message: t('valid.email') }],
  ipv4:     (t) => [{ required: true, message: t('valid.required') },
                    { pattern: /^(\d{1,3}\.){3}\d{1,3}$/, message: t('valid.ip') }],
  minLen:   (t, n) => [{ required: true, message: t('valid.required') },
                    { min: n, message: t('valid.minLen').replace('{n}', n) }],
  range:    (t, min, max) => [{ required: true, message: t('valid.required') },
                    { type: 'number', min, max,
                      message: t('valid.range').replace('{min}', min).replace('{max}', max) }],
};

window.Omada = window.Omada || {};
window.Omada.Form = OmadaForm;
