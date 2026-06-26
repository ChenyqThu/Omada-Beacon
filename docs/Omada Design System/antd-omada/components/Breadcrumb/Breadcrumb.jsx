/* ────────────────────────────────────────────────────────────────────────
   components/Breadcrumb/Breadcrumb.jsx — OmadaBreadcrumb

   Thin wrapper over antd Breadcrumb. The Omada signature (Figma) is a
   SLANTED-SLASH separator (a ~15°-tilted hairline, #999) instead of antd's
   default ">" — so the wrapper sets `separator` to a slim slash glyph. Item
   colours (link #636363, last item #2B2B2B, hover green) come from
   omada-theme.js → components.Breadcrumb; the separator tilt + colour come
   from `.omada-breadcrumb` in omada-overrides.css (with a dark twin).

   Pass antd's data-driven `items` (each { title, href?, onClick? }). A leading
   icon is just a node in `title`; use OmadaIcon. Strings via window.t().

   Figma: breadcrumb separator "icon/斜杠" in Pagination 分页器 node 3:16180
   (Rectangle-6, 1.371px wide, rotated ~15°, fill #999999).

   Exports: window.Omada.Breadcrumb
   ──────────────────────────────────────────────────────────────────────── */

const { Breadcrumb: AntBreadcrumb } = window.antd;

function OmadaBreadcrumb({ separator, className = '', ...rest }) {
  const sep = separator !== undefined
    ? separator
    : <span className="omada-breadcrumb-sep" aria-hidden="true">/</span>;
  const cls = ('omada-breadcrumb ' + className).trim();
  return <AntBreadcrumb separator={sep} className={cls} {...rest} />;
}

window.Omada = window.Omada || {};
window.Omada.Breadcrumb = OmadaBreadcrumb;
