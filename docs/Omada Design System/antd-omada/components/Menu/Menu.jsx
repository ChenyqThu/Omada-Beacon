/* ────────────────────────────────────────────────────────────────────────
   components/Menu/Menu.jsx — OmadaMenu

   Thin wrapper over antd Menu for the Omada side navigation. Defaults to the
   inline (vertical) sidebar mode the Figma "Sidebar 侧边导航栏" uses: 36px
   rows, 16px inline indent, 20px leading OmadaIcon, sectioned with group
   titles + dividers, and the SIGNATURE left accent bar on the selected item.

   The accent bar, full-bleed rows and 0-radius items can't be expressed as
   antd tokens, so they live in omada-overrides.css
   (`.ant-menu-light.ant-menu-inline .ant-menu-item-selected::before`, with a
   dark twin). Metrics (itemHeight 36, itemPaddingInline 16, iconSize 18,
   activeBar width, groupTitleFontSize 11) come from omada-theme.js →
   components.Menu. Colours (itemSelectedColor green, itemSelectedBg green@8%)
   come from the per-mode theme objects.

   `items` follows antd's data-driven shape. Use OmadaIcon for `icon`, the
   `{ type: 'group', label }` row for a section header, and
   `{ type: 'divider' }` between sections. Strings route through window.t().

   Figma: Sidebar 侧边导航栏 node 1198:20546 (rows 1198:1409 off / 1198:2078 on);
   selected = brand-green text #00A870 + 2px left accent bar.

   Exports: window.Omada.Menu
   ──────────────────────────────────────────────────────────────────────── */

const { Menu: AntMenu } = window.antd;

function OmadaMenu({ mode = 'inline', inlineIndent = 16, className = '', ...rest }) {
  const cls = ('omada-menu ' + className).trim();
  return <AntMenu mode={mode} inlineIndent={inlineIndent} className={cls} {...rest} />;
}

/* Forward antd statics so callers can build items the antd way if preferred. */
OmadaMenu.Item       = AntMenu.Item;
OmadaMenu.SubMenu    = AntMenu.SubMenu;
OmadaMenu.ItemGroup  = AntMenu.ItemGroup;
OmadaMenu.Divider    = AntMenu.Divider;

/* Helper: build a sectioned item from { icon, key, labelKey, beta, children }.
   Pass a `t` so labels localise. Keeps demos + AppShell DRY. */
window.omadaMenuItem = function (t, OmadaIcon, { key, icon, labelKey, label, beta, children, danger, disabled }) {
  const text = labelKey ? t(labelKey) : label;
  const node = beta
    ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        {text}
        <span className="omada-menu-beta">{t('menu.beta')}</span>
      </span>
    : text;
  return {
    key,
    icon: icon ? <OmadaIcon name={icon} size={18} /> : undefined,
    label: node,
    danger,
    disabled,
    children,
  };
};

window.Omada = window.Omada || {};
window.Omada.Menu = OmadaMenu;
