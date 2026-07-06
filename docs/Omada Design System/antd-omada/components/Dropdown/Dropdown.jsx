/* ────────────────────────────────────────────────────────────────────────
   components/Dropdown/Dropdown.jsx — OmadaDropdown

   Thin wrapper over antd Dropdown. Matches the Figma "Dropdown 下拉菜单":
   36px rows, 20px leading OmadaIcon + 8px gap, #F4F4F4 hover, 6px radius and
   the soft Omada shadow. The menu surface radius, item hover and the tuned
   shadow come from omada-theme.js + the `.ant-dropdown-menu` shadow rule in
   omada-overrides.css (both with dark twins).

   `menu.items` follows antd's shape — give each item an `icon` via OmadaIcon,
   use `{ type: 'divider' }` to group, `danger: true` for a destructive row,
   and `children` for a submenu. A `Dropdown.Button` is forwarded for the
   split primary+caret pattern. Strings via window.t().

   Figma: Dropdown 下拉菜单 node 3:16099 — surface radius 6, shadow
   0 3 10 rgba(29,37,41,0.2), item 180×36 / pad 7px 16px, hover bg #F4F4F4.

   Exports: window.Omada.Dropdown
   ──────────────────────────────────────────────────────────────────────── */

const { Dropdown: AntDropdown } = window.antd;

function OmadaDropdown({ trigger = ['click'], className = '', overlayClassName = '', ...rest }) {
  const ocls = ('omada-dropdown ' + overlayClassName).trim();
  return <AntDropdown trigger={trigger} className={className} overlayClassName={ocls} {...rest} />;
}

OmadaDropdown.Button = AntDropdown.Button;

window.Omada = window.Omada || {};
window.Omada.Dropdown = OmadaDropdown;
