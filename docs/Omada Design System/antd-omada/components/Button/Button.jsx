/* ────────────────────────────────────────────────────────────────────────
   components/Button/Button.jsx — OmadaButton + OmadaIconButton

   Thin wrappers over antd Button. `variant` is an Omada convenience that maps
   to antd's type/danger/ghost combo + (where antd can't express it) a small
   class defined in omada-overrides.css. All antd props forward through.

   Figma node 41:30099 — 7 variants: Primary, Secondary, Outline, Text, Link,
   Danger (+ dashed). States: default/hover/active/disabled/loading. Heights
   24/32/40 and 3px radius come from omada-theme.js (no hard-coded values here).

   Exports: window.Omada.Button, window.Omada.IconButton
   ──────────────────────────────────────────────────────────────────────── */

const { Button: AntButton } = window.antd;

/* variant → antd props (+ extra className for the two neutral fills antd
   doesn't model: grey "secondary" and green-bordered "outline"). */
const OM_BTN_VARIANTS = {
  primary:        { type: 'primary' },
  secondary:      { type: 'default', _cls: 'omada-btn-secondary' },
  outline:        { type: 'default', _cls: 'omada-btn-outline' },
  default:        { type: 'default' },
  dashed:         { type: 'dashed' },
  text:           { type: 'text' },
  link:           { type: 'link' },
  danger:         { type: 'primary', danger: true },
  'danger-outline': { type: 'default', danger: true },
  'danger-text':  { type: 'text', danger: true },
  'danger-link':  { type: 'link', danger: true },
};

function resolveIcon(icon, size) {
  // Accept an OmadaIcon name string ("refresh") or a ready node.
  if (typeof icon === 'string' && window.OmadaIcon) {
    return <window.OmadaIcon name={icon} size={size} />;
  }
  return icon;
}

const OmadaButton = React.forwardRef(function OmadaButton(
  { variant = 'default', icon, iconSize, className, children, ...rest }, ref
) {
  delete rest.variant; delete rest.icon; delete rest.iconSize;
  const map = OM_BTN_VARIANTS[variant] || OM_BTN_VARIANTS.default;
  const { _cls, ...antProps } = map;
  const cls = [_cls, className].filter(Boolean).join(' ') || undefined;
  // default icon size tracks the control size
  const isz = iconSize != null
    ? iconSize
    : (rest.size === 'large' ? 18 : rest.size === 'small' ? 13 : 14);
  return (
    <AntButton
      ref={ref}
      className={cls}
      icon={icon != null ? resolveIcon(icon, isz) : undefined}
      {...antProps}
      {...rest}
    >
      {children}
    </AntButton>
  );
});

/* Icon-only button. Circular by default (Omada's FAB/toolbar style). Always
   pass `label` for accessibility — it becomes aria-label (and title). */
const OmadaIconButton = React.forwardRef(function OmadaIconButton({
  icon, label, variant = 'text', shape = 'circle', size, iconSize, className, ...rest
}, ref) {
  delete rest.icon; delete rest.label; delete rest.variant; delete rest.iconSize;
  const map = OM_BTN_VARIANTS[variant] || OM_BTN_VARIANTS.text;
  const { _cls, ...antProps } = map;
  const cls = [_cls, className].filter(Boolean).join(' ') || undefined;
  const isz = iconSize != null
    ? iconSize
    : (size === 'large' ? 18 : size === 'small' ? 14 : 16);
  return (
    <AntButton
      ref={ref}
      className={cls}
      shape={shape}
      size={size}
      aria-label={label}
      title={label}
      icon={resolveIcon(icon, isz)}
      {...antProps}
      {...rest}
    />
  );
});

window.Omada = window.Omada || {};
window.Omada.Button = OmadaButton;
window.Omada.IconButton = OmadaIconButton;
