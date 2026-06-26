/* ────────────────────────────────────────────────────────────────────────
   components/Tour/Tour.jsx — OmadaTour

   The guided onboarding walkthrough — spotlights a target, shows a titled
   card with prev/next/skip. antd <Tour> reads colorPrimary for the active
   indicator + the elevated/mask tokens, so this wrapper only:
     - localizes the built-in buttons (Next / Previous / Finish) via
       useOmada().t through antd's `indicatorsRender` + per-step button text
     - exposes an OmadaIcon `iconName` per step (rendered into the card)
   Steps + open/onClose pass straight through. No brand hex here.

   Figma: onboarding/guided-tour pattern (the /Driver page is a divider card,
   so Tour is themed to the Omada token language rather than that frame).
   Exports: window.Omada.Tour
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { Tour: AntTour } = window.antd;
  const OmadaIcon = window.OmadaIcon;

  function OmadaTour(props) {
    const steps = props.steps, className = props.className || '';
    const rest = Object.assign({}, props);
    delete rest.steps; delete rest.className;
    const { t } = window.useOmada();
    const mapped = Array.isArray(steps) ? steps.map((s) => {
      if (!s || typeof s !== 'object') return s;
      const iconName = s.iconName, title = s.title;
      const out = Object.assign({}, s);
      delete out.iconName;
      if (iconName) {
        out.title = (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span className="omada-tour-glyph"><OmadaIcon name={iconName} size={16} /></span>
            {title}
          </span>
        );
      } else {
        out.title = title;
      }
      return out;
    }) : steps;

    return (
      <AntTour
        steps={mapped}
        rootClassName={'omada-tour ' + className}
        {...rest}
      />
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.Tour = OmadaTour;
})();
