/* ────────────────────────────────────────────────────────────────────────
   components/Avatar/Avatar.jsx — OmadaAvatar (+ OmadaAvatar.Group)

   Thin wrapper over antd Avatar. Omada conventions:
   - default shape is `circle`, default icon is OmadaIcon "user"
   - `tone` tints the fallback (initials) background with a brand-family colour
   - sizes follow the Figma top-bar avatars: 32 (default) and 48 (hover/menu)

   Colours come from window.OMADA so light/dark both read correctly; the
   wrapper picks the dark value when the app root is in dark mode.

   Figma: Avatar 头像 node 2985:128851 (32px / 48px specimens).

   Exports: window.Omada.Avatar
   ──────────────────────────────────────────────────────────────────────── */

const { Avatar: AntAvatar } = window.antd;

/* tone → {bg, fg} pulled from the Omada ramp; dark variants soften the fill */
function avatarTone(tone, dark) {
  const O = window.OMADA;
  const map = {
    brand:   dark ? { bg: 'rgba(0,168,112,0.22)', fg: '#5FD3A6' } : { bg: O.green[50],  fg: O.green[700] },
    blue:    dark ? { bg: 'rgba(0,105,203,0.24)', fg: '#7FB8FF' } : { bg: '#E0EFFB',     fg: '#0050A3' },
    magenta: dark ? { bg: 'rgba(244,118,255,0.20)', fg: '#F4A8FF' } : { bg: '#FCE6FF',  fg: '#A21CB0' },
    orange:  dark ? { bg: 'rgba(255,140,39,0.22)', fg: '#FFB877' } : { bg: '#FFF1E0',    fg: '#C46315' },
    neutral: dark ? { bg: '#2A2A2A', fg: '#A6A6A6' } : { bg: O.neutral[100], fg: O.neutral[600] },
  };
  return map[tone] || map.neutral;
}

function OmadaAvatar({ tone, icon, size = 'default', style, children, src, ...rest }) {
  delete rest.tone;
  // Derive mode from context so the tint reacts to theme flips (the DOM
  // attribute is set in an effect AFTER first render — reading it here is stale).
  let mode = 'light';
  try { mode = window.useOmada().mode; } catch (e) { /* outside provider → light */ }
  const dark = mode === 'dark';
  // Only tint when there is no image (initials / icon fallback).
  const tinted = !src && tone ? avatarTone(tone, dark) : null;
  const resolvedIcon =
    icon === undefined && !children && !src
      ? <window.OmadaIcon name="user" size={typeof size === 'number' ? Math.round(size * 0.56) : 18} />
      : icon;
  return (
    <AntAvatar
      shape="circle"
      size={size}
      src={src}
      icon={resolvedIcon}
      style={{ ...(tinted ? { background: tinted.bg, color: tinted.fg } : {}), ...style }}
      {...rest}
    >
      {children}
    </AntAvatar>
  );
}

OmadaAvatar.Group = AntAvatar.Group;

window.Omada = window.Omada || {};
window.Omada.Avatar = OmadaAvatar;
