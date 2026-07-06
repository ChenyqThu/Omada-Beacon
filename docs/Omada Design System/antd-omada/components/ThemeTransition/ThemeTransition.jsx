/* ────────────────────────────────────────────────────────────────────────
   components/ThemeTransition/ThemeTransition.jsx — OmadaThemeTransition

   A light↔dark THEME-SWITCH board built on the View Transitions API. The
   default antd theme swap is instant; this wraps the swap in
   document.startViewTransition so the whole page cross-fades, and adds an
   optional CIRCULAR REVEAL clipped from the toggle that was clicked — the
   "ripple from the switch" most modern apps use for dark mode.

   It is the canonical place a product wires its theme toggle. The mechanic is
   exposed as a reusable helper so any toggle can adopt it:

     window.Omada.viewTransition(applyFn, { style, origin })
       · style  'reveal' | 'fade' | 'instant'
       · origin DOMRect | {x,y} | an element — centre of the circular reveal

   Graceful degradation: if the API is missing OR the user prefers reduced
   motion, applyFn runs synchronously (instant swap) — no broken state, no
   polyfill. Honours the §0 motion tokens (240ms / ease-out cubic-bezier).

   All visuals are theme-var driven with dark twins in omada-overrides.css.

   Figma: no dedicated node — an interaction/motion pattern layered on the
   ThemeProvider's existing mode state. Glyphs are OmadaIcon (sun / moon).
   Exports: window.Omada.ThemeTransition, window.Omada.viewTransition
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { useState, useRef, useCallback } = React;
  const Icon = window.Omada.Icon;

  const supported = typeof document !== 'undefined' && !!document.startViewTransition;
  const reduced = typeof window !== 'undefined' && window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* The reusable mechanic. Any theme toggle can call this. */
  function viewTransition(apply, opts) {
    const o = opts || {};
    const style = o.style || 'reveal';
    if (style === 'instant' || !supported || reduced) { apply(); return; }

    // Resolve the reveal origin to a viewport point.
    let x = window.innerWidth / 2, y = window.innerHeight / 2;
    const origin = o.origin;
    if (origin) {
      if (typeof origin.getBoundingClientRect === 'function') {
        const r = origin.getBoundingClientRect();
        x = r.left + r.width / 2; y = r.top + r.height / 2;
      } else if (origin.left !== undefined) {
        x = origin.left + (origin.width || 0) / 2; y = origin.top + (origin.height || 0) / 2;
      } else if (origin.x !== undefined) { x = origin.x; y = origin.y; }
    }

    const isReveal = style === 'reveal';
    if (isReveal) document.documentElement.classList.add('omada-vt-reveal');
    const t = document.startViewTransition(function () { apply(); });
    if (!isReveal) return; // plain cross-fade — let the default ::view-transition handle it
    const end = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    t.ready.then(function () {
      document.documentElement.animate(
        { clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + end + 'px at ' + x + 'px ' + y + 'px)'] },
        { duration: 480, easing: 'cubic-bezier(0.16,1,0.3,1)', pseudoElement: '::view-transition-new(root)' }
      );
    }).catch(function () {});
    if (t.finished && t.finished.finally) {
      t.finished.finally(function () { document.documentElement.classList.remove('omada-vt-reveal'); });
    }
  }

  function OmadaThemeTransition() {
    const ctx = window.useOmada();
    const t = ctx.t;
    const mode = ctx.mode, setMode = ctx.setMode;
    const [style, setStyle] = useState(supported && !reduced ? 'reveal' : 'instant');
    const sunRef = useRef(null);
    const moonRef = useRef(null);

    const swap = useCallback((next, originEl) => {
      if (next === mode) return;
      viewTransition(function () { setMode(next); }, { style, origin: originEl });
    }, [mode, setMode, style]);

    const styles = [
      { key: 'reveal',  label: t('tvt.reveal'),  icon: 'power' },
      { key: 'fade',    label: t('tvt.fade'),    icon: 'layers' },
      { key: 'instant', label: t('tvt.instant'), icon: 'arrow-right' },
    ];

    return (
      <div className="omada-tvt">
        {/* The big switch */}
        <div className="omada-tvt-switchwrap">
          <button
            type="button"
            ref={sunRef}
            className={'omada-tvt-side' + (mode === 'light' ? ' is-on' : '')}
            onClick={function (e) { swap('light', e.currentTarget); }}
            aria-pressed={mode === 'light'}
          >
            <Icon name="sun" size={20} /><span>{t('tvt.light')}</span>
          </button>
          <button
            type="button"
            className={'omada-tvt-track tone-' + mode}
            onClick={function (e) { swap(mode === 'dark' ? 'light' : 'dark', e.currentTarget); }}
            role="switch"
            aria-checked={mode === 'dark'}
            aria-label={t('tvt.toggle')}
          >
            <span className="omada-tvt-knob">
              <Icon name={mode === 'dark' ? 'moon' : 'sun'} size={16} />
            </span>
          </button>
          <button
            type="button"
            ref={moonRef}
            className={'omada-tvt-side' + (mode === 'dark' ? ' is-on' : '')}
            onClick={function (e) { swap('dark', e.currentTarget); }}
            aria-pressed={mode === 'dark'}
          >
            <Icon name="moon" size={20} /><span>{t('tvt.dark')}</span>
          </button>
        </div>

        {/* Transition-style picker */}
        <div className="omada-tvt-styles" role="radiogroup" aria-label={t('tvt.style')}>
          <span className="omada-tvt-styleslabel">{t('tvt.style')}</span>
          {styles.map(function (s) {
            const dis = s.key !== 'instant' && (!supported || reduced);
            return (
              <button
                key={s.key}
                type="button"
                role="radio"
                aria-checked={style === s.key}
                disabled={dis}
                className={'omada-tvt-stylebtn' + (style === s.key ? ' is-active' : '')}
                onClick={function () { setStyle(s.key); }}
              >
                <Icon name={s.icon} size={15} />{s.label}
              </button>
            );
          })}
        </div>

        {/* Support line */}
        <div className={'omada-tvt-support tone-' + (supported ? 'ok' : 'warn')}>
          <Icon name={supported ? 'check-circle' : 'warning'} size={15} />
          <span>{supported ? t('tvt.supported') : t('tvt.unsupported')}</span>
          {reduced && <span className="omada-tvt-reduced">· {t('tvt.reduced')}</span>}
        </div>

        <p className="omada-tvt-note">{t('tvt.note')}</p>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.ThemeTransition = OmadaThemeTransition;
  window.Omada.viewTransition = viewTransition;
})();
