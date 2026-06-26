/* ────────────────────────────────────────────────────────────────────────
   components/Mask/Mask.jsx — OmadaMask

   The overlay scrim. antd has no standalone "mask" primitive (it's baked
   into Modal/Drawer/Image), but the Figma "Mask 遮罩" page specs it as a
   reusable component: a dimming layer that blocks interaction beneath a
   focused surface, loading state, or spotlight. This is an original Omada
   control, but still token-/CSS-driven — the scrim colour is antd's
   `colorBgMask` value via a CSS var, with a light + dark twin in
   omada-overrides.css; nothing is hard-coded in the JSX.

   Props:
     open        show / hide (animated fade)
     container   'parent' (absolute, fills nearest positioned ancestor) |
                 'fullscreen' (fixed, covers the viewport)   [default parent]
     tone        'dark' (default, dim) | 'light' (frost a dark surface)
     blur        backdrop-blur the content beneath           [default false]
     closable    clicking the scrim fires onClose            [default false]
     onClose     handler when the scrim is clicked
     zIndex      stacking (default 1000)
     children    optional centred content (spinner, message, actions)

   Figma: Mask 遮罩 node 3:27258.
   Exports: window.Omada.Mask
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { useRef } = React;

  function OmadaMask({
    open = false, container = 'parent', tone = 'dark', blur = false,
    closable = false, onClose, zIndex = 1000, className = '', children, style, ...rest
  }) {
    const scrimRef = useRef(null);

    const cls = [
      'omada-mask',
      'omada-mask-' + container,
      'omada-mask-' + tone,
      blur ? 'is-blur' : '',
      open ? 'is-open' : '',
      className,
    ].filter(Boolean).join(' ');

    const onClick = (e) => {
      // only the scrim itself, not bubbled clicks from children
      if (closable && e.target === scrimRef.current && onClose) onClose(e);
    };

    return (
      <div
        ref={scrimRef}
        className={cls}
        style={{ zIndex, ...style }}
        aria-hidden={open ? undefined : true}
        onClick={onClick}
        {...rest}
      >
        {children != null && <div className="omada-mask-body">{children}</div>}
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.Mask = OmadaMask;
})();
