/* ────────────────────────────────────────────────────────────────────────
   components/Tree/Tree.jsx — OmadaTree

   Thin wrapper over antd Tree for the Omada site / device hierarchy. Defaults
   to a 32px node height, OmadaIcon switcher (chevron), green checkbox + green
   selected-node tint, and `blockNode` so the whole row is the hit target.
   `Tree.DirectoryTree` is forwarded for the file-manager style (full-row
   highlight) used by the site picker.

   Visuals come from tokens (Tree.titleHeight 32, nodeSelectedBg green-50,
   colorPrimary green) + omada-overrides.css (node wrapper radius, icon colour,
   both with dark twins). Switcher uses OmadaIcon, never Lucide.

   Figma: TreeSelect 树选择 page (node 43:34732) — the dropdown tree shares the
   node row metrics; selected = green text + green-50 tint, 32px rows.

   Exports: window.Omada.Tree
   ──────────────────────────────────────────────────────────────────────── */

const { Tree: AntTree } = window.antd;

function omadaSwitcherIcon({ expanded } = {}) {
  return (
    <window.OmadaIcon
      name="chevron-down"
      size={16}
      style={{ transform: expanded ? 'none' : 'rotate(-90deg)', transition: 'transform 180ms cubic-bezier(0.16,1,0.3,1)' }}
    />
  );
}

function OmadaTree({ blockNode = true, switcherIcon = omadaSwitcherIcon, className = '', ...rest }) {
  const cls = ('omada-tree ' + className).trim();
  return <AntTree blockNode={blockNode} switcherIcon={switcherIcon} className={cls} {...rest} />;
}

/* DirectoryTree — full-row highlight variant for the site/folder picker */
function OmadaDirectoryTree({ switcherIcon = omadaSwitcherIcon, className = '', ...rest }) {
  const cls = ('omada-tree ' + className).trim();
  return <AntTree.DirectoryTree switcherIcon={switcherIcon} className={cls} {...rest} />;
}

OmadaTree.DirectoryTree = OmadaDirectoryTree;
OmadaTree.TreeNode = AntTree.TreeNode;

window.Omada = window.Omada || {};
window.Omada.Tree = OmadaTree;
window.omadaSwitcherIcon = omadaSwitcherIcon;
