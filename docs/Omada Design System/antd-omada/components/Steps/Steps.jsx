/* ────────────────────────────────────────────────────────────────────────
   components/Steps/Steps.jsx — OmadaSteps

   Thin wrapper over antd Steps. Matches the Figma "Steps 步骤条": a 24px
   status node per step — finished = green check, process = filled green
   circle with a white index, wait = #F4F4F4 circle with a grey index, error
   = red, plus a loading node — with a #E7E9ED connector line, a title and an
   optional description. Works horizontal or vertical (`direction`), and small
   (`size="small"`).

   colorPrimary (green) drives the process/finish nodes via omada-theme.js →
   components.Steps; everything else is antd defaults under the Omada token
   set, so no custom CSS is needed beyond the titleLineHeight already seeded.

   Pass antd's data-driven `items` ({ title, description?, icon?, status? }).
   Strings via window.t(). For a loading step, set
   `items[i].icon = <OmadaIcon name="refresh" className="omada-spin" />`.

   Figma: Steps 步骤条 node 3:15992 — process circle #00A870 / white index,
   wait circle #F4F4F4 / #636363 index, connector #E7E9ED, finished = check.

   Exports: window.Omada.Steps
   ──────────────────────────────────────────────────────────────────────── */

const { Steps: AntSteps } = window.antd;

function OmadaSteps({ className = '', ...rest }) {
  const cls = ('omada-steps ' + className).trim();
  return <AntSteps className={cls} {...rest} />;
}

OmadaSteps.Step = AntSteps.Step;

window.Omada = window.Omada || {};
window.Omada.Steps = OmadaSteps;
