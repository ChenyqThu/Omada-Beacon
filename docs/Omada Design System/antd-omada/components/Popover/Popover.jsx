/* ────────────────────────────────────────────────────────────────────────
   components/Popover/Popover.jsx — OmadaPopover

   Thin wrapper over antd Popover (the rich, light-surface bubble — distinct
   from Tooltip's dark spotlight). Omada defaults: 8px radius (token), the
   Omada shadow, arrow shown. `icon` adds a leading OmadaIcon next to the
   title for the confirm-style bubble seen in the Figma.

   Figma: Popover 气泡卡片 node 3:25129 (confirm bubble: warning icon, title
   16/500, body 14, Yes/No footer).

   Exports: window.Omada.Popover
   ──────────────────────────────────────────────────────────────────────── */

const { Popover: AntPopover } = window.antd;

function OmadaPopover({ icon, iconTone, title, children, ...rest }) {
  delete rest.icon; delete rest.iconTone;
  // When an icon is supplied, compose a titled header with a leading glyph.
  const composedTitle = icon
    ? (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        <window.OmadaIcon
          name={icon}
          size={18}
          style={{ color: iconTone || 'var(--omada-green-500, #00A870)' }}
        />
        <span>{title}</span>
      </span>
    )
    : title;
  return (
    <AntPopover title={composedTitle} {...rest}>
      {children}
    </AntPopover>
  );
}

window.Omada = window.Omada || {};
window.Omada.Popover = OmadaPopover;
