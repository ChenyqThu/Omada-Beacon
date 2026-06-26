/* ────────────────────────────────────────────────────────────────────────
   components/HintPopover/HintPopover.jsx — OmadaHintPopover

   A thin wrapper over the antd Popover that handles the edge cases a plain
   Popover fumbles:
     · long content   — caps width + scrolls the body instead of ballooning.
     · follow-cursor   — the bubble tracks the pointer (for charts / maps /
                         canvases where there's no single anchor).
     · controlled open — pass `open` + `onOpenChange` and drive it yourself.
     · nested triggers — a popover inside a popover's content just works
                         (each manages its own open state).
     · disabled child  — a disabled Button swallows mouse events, so the
                         trigger never fires; `wrapDisabled` wraps the child in
                         an inline span that still hovers.

   Token-driven (the popover surface comes from antd tokens), dark twin for the
   follow-cursor bubble, i18n, RTL-mirrored.

   Figma: derived from the 气泡卡片 / Popover surface + Tooltip 文字提示
   (tooltip/* symbols, 16px offset spec from page14). Original edge-case wrapper.
   Exports: window.Omada.HintPopover
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { Popover } = window.antd;

  function FollowCursor(props) {
    const { useState, useRef } = React;
    const [pos, setPos] = useState(null);   // {x, y} viewport coords, or null
    const raf = useRef(0);

    const move = (e) => {
      const x = e.clientX, y = e.clientY;
      if (raf.current) return;
      raf.current = requestAnimationFrame(() => {
        raf.current = 0;
        setPos({ x, y });
      });
    };

    return (
      <span
        className="omada-hp-fctrigger"
        onMouseMove={move}
        onMouseLeave={() => setPos(null)}
      >
        {props.children}
        {pos && (
          <span
            className="omada-hp-fcbubble"
            style={{
              position: 'fixed',
              left: pos.x + 16,
              top: pos.y + 16,
              maxWidth: props.maxWidth || 260,
            }}
            role="tooltip"
          >
            {props.content}
          </span>
        )}
      </span>
    );
  }

  function OmadaHintPopover(props) {
    // ── follow-cursor mode is its own lightweight floating layer ──
    if (props.followCursor) {
      return (
        <FollowCursor content={props.content} maxWidth={props.maxWidth}>
          {props.children}
        </FollowCursor>
      );
    }

    // ── otherwise a thinly-wrapped antd Popover ──
    const maxWidth = props.maxWidth || 320;
    const maxHeight = props.maxHeight || 280;

    // long content: cap the card and let the body scroll
    const overlayStyle = Object.assign({ maxWidth }, props.overlayStyle);
    const overlayInnerStyle = Object.assign(
      { maxHeight, overflow: 'auto' },
      props.overlayInnerStyle
    );

    let child = props.children;
    // disabled controls swallow mouse events — wrap so the trigger still fires
    if (props.wrapDisabled) {
      child = <span className="omada-hp-disabledwrap">{child}</span>;
    }

    const passthrough = {
      title: props.title,
      content: props.content,
      trigger: props.trigger || 'hover',
      placement: props.placement || 'top',
      mouseEnterDelay: props.mouseEnterDelay != null ? props.mouseEnterDelay : 0.1,
      arrow: props.arrow,
      rootClassName: 'omada-hp-root' + (props.rootClassName ? ' ' + props.rootClassName : ''),
      overlayStyle,
      overlayInnerStyle,
    };
    // controlled open is opt-in (only forward if provided)
    if (props.open !== undefined) {
      passthrough.open = props.open;
      passthrough.onOpenChange = props.onOpenChange;
    } else if (props.defaultOpen !== undefined) {
      passthrough.defaultOpen = props.defaultOpen;
      passthrough.onOpenChange = props.onOpenChange;
    }
    if (props.getPopupContainer) passthrough.getPopupContainer = props.getPopupContainer;

    return <Popover {...passthrough}>{child}</Popover>;
  }

  window.Omada = window.Omada || {};
  window.Omada.HintPopover = OmadaHintPopover;
})();
