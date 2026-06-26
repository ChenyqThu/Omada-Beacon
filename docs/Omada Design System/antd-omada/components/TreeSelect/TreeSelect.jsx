/* ────────────────────────────────────────────────────────────────────────
   components/TreeSelect/TreeSelect.jsx — OmadaTreeSelect

   Thin wrapper over antd TreeSelect — a Select whose dropdown is a Tree. Used
   for the "Assign to Site" picker. Defaults to the OmadaIcon chevron suffix
   and the rotating tree switcher (shared with OmadaTree), 4px radius, and the
   green selected-node tint. Supports single + `treeCheckable` multiple.

   Visuals: Select control tokens (radius/height) + TreeSelect node tokens
   (nodeSelectedBg green-50) from omada-theme.js; dropdown shadow from the
   `.ant-select-dropdown` rule in omada-overrides.css. Strings via window.t().

   Figma: TreeSelect 树选择 (page node 43:34732) — control matches Select 选择器,
   dropdown matches the Tree node rows.

   Exports: window.Omada.TreeSelect
   ──────────────────────────────────────────────────────────────────────── */

const { TreeSelect: AntTreeSelect } = window.antd;

function OmadaTreeSelect({ className = '', popupClassName = '', switcherIcon, suffixIcon, ...rest }) {
  const cls = ('omada-treeselect ' + className).trim();
  const pcls = ('omada-treeselect-pop ' + popupClassName).trim();
  return (
    <AntTreeSelect
      className={cls}
      popupClassName={pcls}
      switcherIcon={switcherIcon || window.omadaSwitcherIcon}
      suffixIcon={suffixIcon !== undefined ? suffixIcon : <window.OmadaIcon name="chevron-down" size={16} />}
      {...rest}
    />
  );
}

OmadaTreeSelect.TreeNode = AntTreeSelect.TreeNode;
OmadaTreeSelect.SHOW_PARENT = AntTreeSelect.SHOW_PARENT;
OmadaTreeSelect.SHOW_CHILD = AntTreeSelect.SHOW_CHILD;
OmadaTreeSelect.SHOW_ALL = AntTreeSelect.SHOW_ALL;

window.Omada = window.Omada || {};
window.Omada.TreeSelect = OmadaTreeSelect;
