/* ────────────────────────────────────────────────────────────────────────
   components/MaintenanceBanner/MaintenanceBanner.jsx — OmadaMaintenanceBanner

   A SCHEDULED-WINDOW announcement bar with a LIVE COUNTDOWN. Give it the
   maintenance window (start / end) and it manages its own phases:

     upcoming  → info tone, "Starts in 2h 14m" chip counting down
     active    → warning tone, "In progress · ends in 41m 12s"
     done      → success tone, "Maintenance complete" (dismiss to clear)

   Distinct from Banner (Batch 22 — a static persistent announcement):
   this one is time-driven — it re-tones itself as the window arrives,
   counts down each second, and shows the absolute window alongside.

     · `start` / `end` — epoch ms or Date.
     · `title`, `message`, `actions` (node) — content slots.
     · `dismissible` (default true) — × hides it for the CURRENT phase;
       it reappears when the phase changes. `onDismiss(phase)` observes.
     · `onPhaseChange(phase)` fires on transitions.

   Thin composition over OmadaIcon + the semantic token washes.
   Token-driven, dark twin, i18n, RTL-mirrored (countdown digits LTR).

   Figma: no dedicated node — bar anatomy follows Banner / Alert; the
   phase machine + countdown chip are original.
   Exports: window.Omada.MaintenanceBanner
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { useState, useEffect, useRef } = React;
  const Icon = window.Omada.Icon;

  const ms = (v) => (v instanceof Date ? v.getTime() : +v);

  function phaseOf(now, start, end) {
    if (now < start) return 'upcoming';
    if (now < end) return 'active';
    return 'done';
  }

  function span(msLeft, t) {
    const s = Math.max(0, Math.floor(msLeft / 1000));
    const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600),
          m = Math.floor((s % 3600) / 60), sec = s % 60;
    if (d > 0) return d + t('maintb.u.d') + ' ' + h + t('maintb.u.h');
    if (h > 0) return h + t('maintb.u.h') + ' ' + m + t('maintb.u.m');
    return m + t('maintb.u.m') + ' ' + (sec < 10 ? '0' + sec : sec) + t('maintb.u.s');
  }

  function clock(ts, lang) {
    return new Date(ts).toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US',
      { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  const TONE_ICON = { upcoming: 'clock', active: 'wrench', done: 'check-circle' };

  function OmadaMaintenanceBanner(props) {
    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;
    const lang = ctx ? ctx.lang : 'en';

    const start = ms(props.start), end = ms(props.end);
    const [now, setNow] = useState(() => Date.now());
    const [dismissedPhase, setDismissedPhase] = useState(null);
    const phase = phaseOf(now, start, end);
    const prevPhase = useRef(phase);

    useEffect(() => {
      const id = setInterval(() => setNow(Date.now()), 1000);
      return () => clearInterval(id);
    }, []);

    useEffect(() => {
      if (prevPhase.current !== phase) {
        prevPhase.current = phase;
        if (props.onPhaseChange) props.onPhaseChange(phase);
      }
    }, [phase, props.onPhaseChange]);

    if (dismissedPhase === phase) return null;

    const countdown = phase === 'upcoming'
      ? t('maintb.startsin').replace('{x}', span(start - now, t))
      : phase === 'active'
        ? t('maintb.endsin').replace('{x}', span(end - now, t))
        : t('maintb.done');

    return (
      <div className={'omada-maintb is-' + phase + (props.className ? ' ' + props.className : '')} role="status">
        <span className="omada-maintb-icon"><Icon name={TONE_ICON[phase]} size={16} /></span>
        <div className="omada-maintb-body">
          <span className="omada-maintb-title">{props.title || t('maintb.title')}</span>
          {phase !== 'done' && props.message && <span className="omada-maintb-msg">{props.message}</span>}
          <span className="omada-maintb-window">
            <Icon name="calendar" size={12} />
            <span className="omada-maintb-times">{clock(start, lang)} – {clock(end, lang)}</span>
          </span>
        </div>
        <span className={'omada-maintb-count' + (phase === 'active' ? ' is-live' : '')}>
          {phase === 'active' && <span className="omada-maintb-pulse" aria-hidden="true" />}
          {countdown}
        </span>
        {props.actions && <span className="omada-maintb-actions">{props.actions}</span>}
        {props.dismissible !== false && (
          <button
            type="button"
            className="omada-maintb-x"
            aria-label={t('maintb.dismiss')}
            onClick={() => { setDismissedPhase(phase); if (props.onDismiss) props.onDismiss(phase); }}
          >
            <Icon name="close" size={14} />
          </button>
        )}
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.MaintenanceBanner = OmadaMaintenanceBanner;
})();
