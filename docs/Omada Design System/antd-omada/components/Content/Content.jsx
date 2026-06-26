/* ────────────────────────────────────────────────────────────────────────
   components/Content/Content.jsx — OmadaContent

   A CONTENT / VOICE-&-TONE board — the writing-fundamentals counterpart to the
   Accessibility and Spacing spec boards. It renders the §4 writing rules from
   COMPONENT_SPEC as live do / don't specimens you can actually read, so the
   product voice can never drift from the components:

     1. Casing — sentence case for buttons/cells/labels vs Title Case for
        page/tab titles (Chinese: no case, no trailing punctuation).
     2. Product terms & acronyms — Wi-Fi / SSID / MAC kept canonical.
     3. Numbers & units — spaced value+unit, exact unit casing, grouped
        thousands.
     4. Empty & error microcopy — plain, blameless, actionable; never a raw
        status code.

   Each rule is a card with a green-check DO row, a red-ban DON'T row rendered
   in the real type tokens, and a one-line rationale. Strings come from the
   locale dictionary so the specimens themselves localize (the casing pair even
   shows the Chinese rule when lang=zh).

   This is NOT a primitive — it's a spec board. All colour/surfaces are theme
   vars with dark twins in omada-overrides.css.

   Figma: no single voice frame; the rules are COMPONENT_SPEC §4 + the scattered
   copy notes in the source (Button 文案过长 25331…, Toast-Message length, Empty
   文案长度限制560px). Original synthesis — no branded copy lifted.
   Exports: window.Omada.Content
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const OmadaIcon = window.OmadaIcon;

  function Spec(props) {
    // one do/don't specimen row
    const t = props.t;
    const doKey = props.doKey, dontKey = props.dontKey, whyKey = props.whyKey;
    const mono = props.mono;
    return (
      <div className="omada-content-spec">
        <div className="omada-content-line is-do">
          <span className="omada-content-mark is-do"><OmadaIcon name="check-circle" size={16} /></span>
          <span className={'omada-content-sample' + (mono ? ' is-mono' : '')}>{t(doKey)}</span>
        </div>
        <div className="omada-content-line is-dont">
          <span className="omada-content-mark is-dont"><OmadaIcon name="ban" size={16} /></span>
          <span className={'omada-content-sample is-dont' + (mono ? ' is-mono' : '')}>{t(dontKey)}</span>
        </div>
        <div className="omada-content-why">{t(whyKey)}</div>
      </div>
    );
  }

  function OmadaContent(props) {
    const className = props.className || '';
    const rest = Object.assign({}, props);
    delete rest.className;

    const ctx = window.useOmada ? window.useOmada() : { t: (k) => k, lang: 'en' };
    const t = ctx.t;

    const GROUPS = [
      { titleKey: 'content.casing', descKey: 'content.casingDesc', specs: [
        { doKey: 'content.btn.do',   dontKey: 'content.btn.dont',   whyKey: 'content.btn.why' },
        { doKey: 'content.title.do', dontKey: 'content.title.dont', whyKey: 'content.title.why' },
      ] },
      { titleKey: 'content.terms', descKey: 'content.termsDesc', specs: [
        { doKey: 'content.term.do', dontKey: 'content.term.dont', whyKey: 'content.term.why', mono: true },
      ] },
      { titleKey: 'content.units', descKey: 'content.unitsDesc', specs: [
        { doKey: 'content.unit.do', dontKey: 'content.unit.dont', whyKey: 'content.unit.why', mono: true },
      ] },
      { titleKey: 'content.micro', descKey: 'content.microDesc', specs: [
        { doKey: 'content.empty.do', dontKey: 'content.empty.dont', whyKey: 'content.empty.why' },
        { doKey: 'content.error.do', dontKey: 'content.error.dont', whyKey: 'content.error.why' },
      ] },
    ];

    return (
      <div className={('omada-content ' + className).trim()} {...rest}>
        {GROUPS.map((g) => (
          <div key={g.titleKey} className="omada-content-group">
            <div className="omada-content-sub">{t(g.titleKey)}</div>
            <div className="omada-content-desc">{t(g.descKey)}</div>
            <div className="omada-content-specs">
              {g.specs.map((s, i) => (
                <Spec key={i} t={t} doKey={s.doKey} dontKey={s.dontKey} whyKey={s.whyKey} mono={s.mono} />
              ))}
            </div>
          </div>
        ))}
        <div className="omada-content-note">{t('content.note')}</div>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.Content = OmadaContent;
})();
