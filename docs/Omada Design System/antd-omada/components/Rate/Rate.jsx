/* ────────────────────────────────────────────────────────────────────────
   components/Rate/Rate.jsx — OmadaRate

   Thin wrapper over antd Rate. Matches the Figma "Rate 评分": 5 stars,
   on-star #FFCB00 (gold), off-star #CCCCCC, supporting half-stars,
   read-only and disabled. Star colour + empty colour come from
   omada-theme.js → components.Rate (starColor #FFCB00, starBg per mode),
   so no hard-coded hex here.

   Convenience: `tips` — an array of hover labels (one per value); maps to
   antd's per-star `tooltips`.

   Figma: Rate 评分 node 43:34765 (on #FFCB00 / off #CCCCCC, 32px stars).
   Exports: window.Omada.Rate
   ──────────────────────────────────────────────────────────────────────── */

const { Rate: AntRate } = window.antd;

function OmadaRate({ tips, tooltips, className = '', ...rest }) {
  const cls = ('omada-rate ' + className).trim();
  return <AntRate className={cls} tooltips={tooltips || tips} {...rest} />;
}

window.Omada = window.Omada || {};
window.Omada.Rate = OmadaRate;
