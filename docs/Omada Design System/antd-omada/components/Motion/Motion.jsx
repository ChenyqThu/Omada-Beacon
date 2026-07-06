/* ────────────────────────────────────────────────────────────────────────
   components/Motion/Motion.jsx — OmadaMotion

   A token-driven MOTION SPEC BOARD — the live counterpart to the ColorTokens
   and Elevation specimen boards. It reads the authoritative motion tokens
   straight off window.omadaThemeLight.token (motionDurationFast / Mid / Slow
   + motionEaseOut) and renders them as animated specimens you can replay, so
   the board can never drift from the theme: change a token, the board moves
   at the new speed.

   Three surfaces:
     · Duration scale — 120 / 180 / 240 ms, each a dot that travels the track
       at the real token duration + the shared ease-out, with its use-case.
     · Easing — the cubic-bezier(0.16, 1, 0.3, 1) curve drawn from the token,
       control points marked, plus a box that travels with that easing.
     · Transitions — the four entrance recipes (fade · slide-up · scale-in ·
       lift), all on the slow duration so the curve is legible.

   Everything is CSS-keyframe driven (durations/easing injected as CSS vars);
   replays by remounting specimens on a nonce. All motion is gated behind
   @media (prefers-reduced-motion) in omada-overrides.css. Colours/surfaces
   are theme vars with dark twins — no brand hex in the JSX.

   There is no dedicated motion frame in the Figma; the values are the
   COMPONENT_SPEC §8 reference (120/180/240ms · ease-out cubic-bezier
   (0.16,1,0.3,1)), which live in omada-theme.js → token.

   Exports: window.Omada.Motion
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { useState, useEffect, useCallback } = React;
  const OmadaIcon = window.OmadaIcon;

  function motionTokens() {
    const tk = (window.omadaThemeLight && window.omadaThemeLight.token) || {};
    return {
      fast: tk.motionDurationFast || '120ms',
      mid:  tk.motionDurationMid  || '180ms',
      slow: tk.motionDurationSlow || '240ms',
      ease: tk.motionEaseOut || 'cubic-bezier(0.16, 1, 0.3, 1)',
    };
  }

  const DURATIONS = [
    { key: 'fast', tokenName: 'motionDurationFast', useKey: 'motion.useFast' },
    { key: 'mid',  tokenName: 'motionDurationMid',  useKey: 'motion.useMid' },
    { key: 'slow', tokenName: 'motionDurationSlow', useKey: 'motion.useSlow' },
  ];
  const RECIPES = ['fade', 'slide', 'scale', 'lift'];

  function OmadaMotion(props) {
    const className = props.className || '';
    const rest = Object.assign({}, props);
    delete rest.className;

    const ctx = window.useOmada ? window.useOmada() : { t: (k) => k, lang: 'en' };
    const t = ctx.t;
    const M = motionTokens();

    const [nonce, setNonce] = useState(0);
    const replay = useCallback(() => setNonce((n) => n + 1), []);
    // auto-play once shortly after mount so the board isn't static on arrival
    useEffect(() => {
      const id = window.setTimeout(() => setNonce((n) => n + 1), 160);
      return () => window.clearTimeout(id);
    }, []);

    return (
      <div className={('omada-motion ' + className).trim()} {...rest}>
        <div className="omada-motion-bar">
          <code className="omada-motion-curvetag">{M.ease}</code>
          <button type="button" className="omada-motion-replay" onClick={replay}>
            <OmadaIcon name="refresh" size={14} /> {t('motion.replay')}
          </button>
        </div>

        {/* ── duration scale ── */}
        <div className="omada-motion-sub">{t('motion.durations')}</div>
        <div className="omada-motion-durations">
          {DURATIONS.map((d) => (
            <div key={d.key} className="omada-motion-dcard">
              <div className="omada-motion-track">
                <span
                  key={nonce}
                  className="omada-motion-dot"
                  style={{ '--om-mo-dur': M[d.key], '--om-mo-ease': M.ease }}
                />
              </div>
              <div className="omada-motion-dmeta">
                <code className="omada-motion-dtok">{d.tokenName}</code>
                <span className="omada-motion-dval">{M[d.key]}</span>
              </div>
              <div className="omada-motion-duse">{t(d.useKey)}</div>
            </div>
          ))}
        </div>

        {/* ── easing ── */}
        <div className="omada-motion-sub">{t('motion.easing')}</div>
        <div className="omada-motion-ease">
          <div className="omada-motion-graph">
            <svg viewBox="0 0 120 120" aria-hidden="true">
              <line x1="12" y1="108" x2="108" y2="108" className="omada-motion-axis" />
              <line x1="12" y1="108" x2="12" y2="12" className="omada-motion-axis" />
              <line x1="12" y1="12" x2="108" y2="12" className="omada-motion-grid" />
              {/* control handles */}
              <line x1="12" y1="108" x2="27.4" y2="12" className="omada-motion-handle" />
              <line x1="108" y1="12" x2="40.8" y2="12" className="omada-motion-handle" />
              {/* the curve: cubic-bezier(0.16,1,0.3,1) */}
              <path d="M12 108 C27.4 12 40.8 12 108 12" className="omada-motion-path" />
              <circle cx="27.4" cy="12" r="2.6" className="omada-motion-cp" />
              <circle cx="40.8" cy="12" r="2.6" className="omada-motion-cp" />
              <circle cx="12" cy="108" r="3" className="omada-motion-end" />
              <circle cx="108" cy="12" r="3" className="omada-motion-end" />
            </svg>
          </div>
          <div className="omada-motion-easebody">
            <div className="omada-motion-easedesc">{t('motion.easeDesc')}</div>
            <div className="omada-motion-feel">
              <span
                key={nonce}
                className="omada-motion-feeldot"
                style={{ '--om-mo-dur': M.slow, '--om-mo-ease': M.ease }}
              />
            </div>
          </div>
        </div>

        {/* ── transition recipes ── */}
        <div className="omada-motion-sub">{t('motion.recipes')}</div>
        <div className="omada-motion-recipes">
          {RECIPES.map((r) => (
            <div key={r} className="omada-motion-recipe">
              <div className="omada-motion-stage">
                <span
                  key={nonce}
                  className={'omada-motion-spec is-' + r}
                  style={{ '--om-mo-dur': M.slow, '--om-mo-ease': M.ease }}
                />
              </div>
              <code className="omada-motion-rname">{t('motion.' + r)}</code>
            </div>
          ))}
        </div>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.Motion = OmadaMotion;
})();
