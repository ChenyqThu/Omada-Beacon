/* ────────────────────────────────────────────────────────────────────────
   components/Tabs/Tabs.jsx — OmadaTabs

   Thin wrapper over antd Tabs. Omada defaults to the line variant from the
   Figma "Tab 标签页": brand-green active label + a 2px green ink bar. A
   `variant` convenience maps to antd's `type`:
     line          → underline tabs (default)
     card          → card / 小标签 tabs
     editable-card → card tabs with add + close (设备 tabs)

   All visuals come from omada-theme.js → components.Tabs (titleFontSize,
   cardGutter/cardPadding, horizontalItemPadding, itemSelectedColor green,
   inkBarColor green) and the ink-bar height bump in omada-overrides.css.
   Tab labels are the caller's responsibility — route them through window.t().

   Figma: Tab 标签页 node 3:15843 — 1.一级Tab (line, green ink), 2.大胶囊Tab
   (large), 3.小标签Tab (card), 4.视图切换Tab (icon view-switch → use Segmented).

   Exports: window.Omada.Tabs
   ──────────────────────────────────────────────────────────────────────── */

const { Tabs: AntTabs } = window.antd;

const OMADA_TAB_VARIANT = {
  line:            { type: 'line' },
  card:            { type: 'card' },
  'editable-card': { type: 'editable-card' },
};

function OmadaTabs({ variant = 'line', size = 'middle', className = '', ...rest }) {
  const map = OMADA_TAB_VARIANT[variant] || OMADA_TAB_VARIANT.line;
  const cls = ('omada-tabs ' + className).trim();
  return <AntTabs {...map} size={size} className={cls} {...rest} />;
}

OmadaTabs.TabPane = AntTabs.TabPane;

window.Omada = window.Omada || {};
window.Omada.Tabs = OmadaTabs;
