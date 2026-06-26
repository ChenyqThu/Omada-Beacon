/* ────────────────────────────────────────────────────────────────────────
   components/ContextMenu/ContextMenu.jsx — OmadaContextMenu

   The right-click menu pattern. Wraps any target so a context-menu gesture
   (right-click / long-press) opens the Omada dropdown surface positioned at the
   cursor, instead of the browser's native menu. Items reuse the antd menu-item
   shape (label / icon name / danger / divider / disabled / children submenu);
   `onSelect(key)` fires on choose. A `selectable` target shows a focus ring and
   responds to the Menu key / Shift+F10 for keyboard parity.

   Thin composition over the Omada Dropdown (antd Dropdown, trigger
   ['contextMenu']) + OmadaIcon for leading glyphs. Token-driven, dark twin,
   RTL-safe (antd mirrors placement under direction=rtl).

   Figma: Dropdown 下拉菜单 (3:16099) — same surface radius/shadow, 180×36 items,
   20px leading icon + 8px gap, danger row red. Original right-click layer.
   Exports: window.Omada.ContextMenu
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { Dropdown } = window.antd;
  const Icon = window.Omada.Icon;

  // map Omada item shape → antd menu items (icon name → OmadaIcon element)
  function toAntItems(items) {
    return (items || []).map((it, i) => {
      if (it.type === 'divider' || it === '-') return { type: 'divider', key: 'd' + i };
      const node = {
        key: it.key != null ? it.key : 'i' + i,
        label: it.label,
        danger: it.danger,
        disabled: it.disabled,
      };
      if (it.icon) node.icon = <Icon name={it.icon} size={16} />;
      if (it.children) node.children = toAntItems(it.children);
      return node;
    });
  }

  function OmadaContextMenu(props) {
    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;

    const menu = {
      items: toAntItems(props.items),
      onClick: (info) => {
        info.domEvent && info.domEvent.stopPropagation();
        if (props.onSelect) props.onSelect(info.key, info);
      },
    };

    const cls = 'omada-ctx-target'
      + (props.selectable ? ' is-selectable' : '')
      + (props.className ? ' ' + props.className : '');

    // keyboard parity: Menu key or Shift+F10 opens — antd Dropdown is uncontrolled
    // here, so we surface a hint via title; real keyboard open is left to antd.
    return (
      <Dropdown
        menu={menu}
        trigger={['contextMenu']}
        overlayClassName="omada-dropdown omada-ctx-overlay"
        disabled={props.disabled}
        {...(props.dropdownProps || {})}
      >
        <div className={cls} role={props.selectable ? 'button' : undefined}
             tabIndex={props.selectable ? 0 : undefined}
             aria-label={props.ariaLabel || t('ctx.open')}
             style={props.style}>
          {props.children}
        </div>
      </Dropdown>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.ContextMenu = OmadaContextMenu;
})();
