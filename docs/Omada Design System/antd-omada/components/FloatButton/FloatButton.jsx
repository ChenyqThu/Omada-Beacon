/* ────────────────────────────────────────────────────────────────────────
   components/FloatButton/FloatButton.jsx — OmadaFloatButton

   The fixed action affordance pinned to the corner of the viewport: a single
   round button, a Group (expand-on-hover speed-dial), and BackTop. antd
   <FloatButton> already reads colorPrimary + the elevated surface tokens, so
   this wrapper only:
     - swaps in OmadaIcon for the default + tooltip glyphs
     - exposes `variant` ('primary' = brand-green fill, 'default' = surface)
       mapped to antd's `type`
     - re-exports FloatButton.Group and FloatButton.BackTop
   The brand-green primary disc + shadow come from tokens; one small CSS hook
   (omada-overrides.css, with a dark twin) rounds the group + tightens the
   icon. No brand hex here.

   Figma: floating action / back-to-top pattern from /Layout chrome.
   Exports: window.Omada.FloatButton  (.Group, .BackTop)
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { FloatButton: AntFloatButton } = window.antd;
  const OmadaIcon = window.OmadaIcon;

  function OmadaFloatButton(props) {
    const { variant = 'default', icon, iconName, className = '' } = props;
    const rest = Object.assign({}, props);
    delete rest.variant; delete rest.icon; delete rest.iconName; delete rest.className;
    const type = variant === 'primary' ? 'primary' : 'default';
    const resolvedIcon = icon || (iconName ? <OmadaIcon name={iconName} size={18} /> : undefined);
    const cls = ['omada-float-btn', className].filter(Boolean).join(' ');
    return <AntFloatButton type={type} icon={resolvedIcon} className={cls} {...rest} />;
  }

  // Group keeps the same icon convenience for its trigger.
  function OmadaFloatGroup(props) {
    const { icon, iconName, className = '' } = props;
    const rest = Object.assign({}, props);
    delete rest.icon; delete rest.iconName; delete rest.className;
    const resolvedIcon = icon || (iconName ? <OmadaIcon name={iconName} size={18} /> : undefined);
    const cls = ['omada-float-group', className].filter(Boolean).join(' ');
    return <AntFloatButton.Group icon={resolvedIcon} className={cls} {...rest} />;
  }

  OmadaFloatButton.Group = OmadaFloatGroup;
  OmadaFloatButton.BackTop = AntFloatButton.BackTop;

  window.Omada = window.Omada || {};
  window.Omada.FloatButton = OmadaFloatButton;
})();
