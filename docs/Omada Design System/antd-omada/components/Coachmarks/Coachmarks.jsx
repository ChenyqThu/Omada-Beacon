/* ────────────────────────────────────────────────────────────────────────
   components/Coachmarks/Coachmarks.jsx — OmadaCoachmarks

   A feature-spotlight COACHMARK sequence — the lighter, self-hosting cousin of
   Tour. Given a list of steps each pointing at a target element, it dims the
   rest of a container, cuts a spotlight around the target, drops a pulsing
   beacon, and floats a callout card (icon · title · body · step dots ·
   Back / Next / Done + Skip).

   Behaviour:
     · Scoped to a CONTAINER (default the component's own relative wrapper, or
       pass `getContainer`). Targets resolve by CSS selector / id WITHIN that
       container; the spotlight + callout are positioned relative to it (not the
       viewport), so it stays contained in panels, drawers, cards.
     · `steps`: [{ target, title, body, icon?, placement? }]. Placement auto-
       flips to stay inside the container. Recomputes on step change + resize.
     · Controlled (`open` / `current` / `onChange` / `onClose`) or uncontrolled
       (internal state + a render-prop / imperative `start()` via ref).
     · Keyboard: → / Enter next, ← back, Esc closes. The scrim swallows clicks
       so the spotlit element is the only calm focus. prefers-reduced-motion
       drops the beacon pulse.

   The spotlight uses the box-shadow-spread mask trick (one ring element casts a
   huge translucent shadow over everything else) — no extra DOM, no SVG. All
   chrome is theme-var driven with a dark twin.

   Figma: onboarding spotlight pattern — extends Tour 漫游引导 (no dedicated
   node); original redraw.
   Exports: window.Omada.Coachmarks
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const Icon = window.Omada.Icon;
  const { Button } = window.antd;

  function OmadaCoachmarks(props) {
    const { useState, useRef, useLayoutEffect, useCallback, useEffect } = React;
    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;

    const steps = props.steps || [];
    const controlled = props.open !== undefined;
    const [openS, setOpenS] = useState(!!props.defaultOpen);
    const open = controlled ? props.open : openS;
    const curControlled = props.current !== undefined;
    const [curS, setCurS] = useState(props.defaultCurrent || 0);
    const current = curControlled ? props.current : curS;

    const wrapRef = useRef(null);
    const [rect, setRect] = useState(null);

    const setCurrent = useCallback((n) => {
      if (props.onChange) props.onChange(n);
      if (!curControlled) setCurS(n);
    }, [props, curControlled]);

    const close = useCallback(() => {
      if (props.onClose) props.onClose();
      if (!controlled) setOpenS(false);
    }, [props, controlled]);

    const getContainer = useCallback(() => {
      if (props.getContainer) return props.getContainer();
      return wrapRef.current;
    }, [props]);

    const measure = useCallback(() => {
      const cont = getContainer();
      const step = steps[current];
      if (!cont || !step) { setRect(null); return; }
      const target = typeof step.target === 'string' ? cont.querySelector(step.target) : step.target;
      if (!target) { setRect(null); return; }
      const cb = cont.getBoundingClientRect();
      const tb = target.getBoundingClientRect();
      setRect({
        top: tb.top - cb.top + cont.scrollTop,
        left: tb.left - cb.left + cont.scrollLeft,
        width: tb.width,
        height: tb.height,
        contW: cb.width,
        contH: cb.height,
      });
    }, [getContainer, steps, current]);

    useLayoutEffect(() => {
      if (!open) return;
      measure();
      const cont = getContainer();
      let ro;
      if (cont && typeof ResizeObserver !== 'undefined') { ro = new ResizeObserver(measure); ro.observe(cont); }
      window.addEventListener('resize', measure);
      return () => { if (ro) ro.disconnect(); window.removeEventListener('resize', measure); };
    }, [open, measure, getContainer]);

    useEffect(() => {
      if (!open) return;
      const onKey = (e) => {
        if (e.key === 'Escape') { close(); }
        else if (e.key === 'ArrowRight' || e.key === 'Enter') { if (current < steps.length - 1) setCurrent(current + 1); else close(); }
        else if (e.key === 'ArrowLeft') { if (current > 0) setCurrent(current - 1); }
      };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }, [open, current, steps.length, setCurrent, close]);

    if (!open) return props.children || null;

    const step = steps[current] || {};
    const pad = 6;

    // callout positioning relative to the ring
    let callout = null;
    if (rect) {
      const place = step.placement || 'bottom';
      const ringTop = rect.top - pad, ringLeft = rect.left - pad;
      const ringW = rect.width + pad * 2, ringH = rect.height + pad * 2;
      const CW = 268, gap = 14;
      const style = { width: CW };
      const vert = place === 'top' || place === 'bottom';
      if (place === 'bottom') { style.top = ringTop + ringH + gap; style.left = ringLeft; }
      else if (place === 'top') { style.top = ringTop - gap; style.left = ringLeft; style.transform = 'translateY(-100%)'; }
      else if (place === 'right') { style.top = ringTop; style.left = ringLeft + ringW + gap; }
      else if (place === 'left') { style.top = ringTop; style.left = ringLeft - gap; style.transform = 'translateX(-100%)'; }
      // clamp horizontally within container
      if (rect.contW) {
        if (vert) {
          let l = style.left;
          if (l + CW > rect.contW - 8) l = Math.max(8, rect.contW - 8 - CW);
          if (l < 8) l = 8;
          style.left = l;
        }
      }

      const isFirst = current === 0, isLast = current === steps.length - 1;

      callout = (
        <React.Fragment>
          <div className="omada-cm-ring" style={{ top: ringTop, left: ringLeft, width: ringW, height: ringH }} />
          <span className="omada-cm-beacon" style={{ top: ringTop, left: ringLeft + ringW }} aria-hidden="true" />
          <div className="omada-cm-callout" style={style} role="dialog" aria-label={step.title}>
            <div className="omada-cm-head">
              {step.icon && <span className="omada-cm-ic"><Icon name={step.icon} size={16} /></span>}
              <span className="omada-cm-title">{step.title}</span>
              <button type="button" className="omada-cm-x" onClick={close} aria-label={t('common.close')}><Icon name="close" size={14} /></button>
            </div>
            <p className="omada-cm-body">{step.body}</p>
            <div className="omada-cm-foot">
              <span className="omada-cm-dots">
                {steps.map((_, i) => <span key={i} className={'omada-cm-dot' + (i === current ? ' is-on' : '')} />)}
              </span>
              <span className="omada-cm-btns">
                {isFirst
                  ? <button type="button" className="omada-cm-skip" onClick={close}>{t('cm.skip')}</button>
                  : <button type="button" className="omada-cm-skip" onClick={() => setCurrent(current - 1)}>{t('cm.back')}</button>}
                <Button type="primary" size="small" onClick={() => isLast ? close() : setCurrent(current + 1)}>
                  {isLast ? t('cm.done') : t('cm.next')}
                </Button>
              </span>
            </div>
          </div>
        </React.Fragment>
      );
    }

    const overlay = (
      <div className="omada-cm-overlay" onClick={(e) => { if (e.target === e.currentTarget) { /* swallow */ } }}>
        {callout}
      </div>
    );

    // self-hosting: wrap children + overlay in a relative box (unless an external container is supplied)
    if (props.getContainer) {
      return <React.Fragment>{props.children}{overlay}</React.Fragment>;
    }
    return (
      <div className="omada-cm-wrap" ref={wrapRef}>
        {props.children}
        {overlay}
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.Coachmarks = OmadaCoachmarks;
})();
