/* ────────────────────────────────────────────────────────────────────────
   components/SetupChecklist/SetupChecklist.jsx — OmadaSetupChecklist

   A FIRST-RUN onboarding panel. antd has no "getting started" surface, so this
   composes one: the empty-state a controller shows the first time a site has no
   devices — a titled card with a progress meter and a vertical list of setup
   STEPS, each a status disc + title + hint + a single call-to-action. Complete
   every required step and the panel flips to a success state.

   Behaviour:
     · Each step is "todo", "current" (the first incomplete one), or "done".
       The disc reflects it (hollow → accent ring → green check). The current
       step's CTA is primary; later steps are muted until reached unless
       `gated={false}` lets any step run.
     · Clicking a CTA fires onRun(key); the parent marks it done by passing
       items with done:true (controlled) — or, with no onRun, the panel toggles
       its own copy (uncontrolled) so the demo is live.
     · Optional steps carry a "Skip" link and an "Optional" tag; they don't
       count against the required total. Dismiss hides the whole panel.
     · When all REQUIRED steps are done the body swaps to an OmadaIllustration
       success scene + a done message + an optional final CTA.

   Thin composition over antd Progress + Omada Button / Tag / Icon /
   Illustration. All chrome is theme-var driven with dark twins in
   omada-overrides.css; the meter + active disc use brand-green tokens. RTL-safe.

   Figma: the controller first-run / empty-site guide (icon/guide 25947:13977 +
   the "empty / no devices" states 26455:6471) — recomposed as a checklist, no
   branded art copied.
   Exports: window.Omada.SetupChecklist
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { useState } = React;
  const { Progress } = window.antd;
  const Icon = window.Omada.Icon;
  const Button = window.Omada.Button;
  const Tag = window.Omada.Tag;
  const Illustration = window.Omada.Illustration;

  function OmadaSetupChecklist(props) {
    const className = props.className || '';
    const rest = Object.assign({}, props);
    delete rest.className; delete rest.items; delete rest.onRun; delete rest.onSkip;
    delete rest.onDismiss; delete rest.onFinish; delete rest.title; delete rest.subtitle;
    delete rest.gated; delete rest.finishCta; delete rest.successScene;

    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;

    const controlled = props.onRun !== undefined;
    const [inner, setInner] = useState(props.items || []);
    const items = controlled ? (props.items || []) : inner;
    const gated = props.gated === undefined ? true : props.gated;

    const [dismissed, setDismissed] = useState(false);
    const [skipped, setSkipped] = useState({});

    const isSkipped = (it) => !!skipped[it.key];
    const required = items.filter((it) => !it.optional && !isSkipped(it));
    const doneRequired = required.filter((it) => it.done);
    const total = required.length;
    const completed = doneRequired.length;
    const pct = total ? Math.round((completed / total) * 100) : 0;
    const allDone = total > 0 && completed === total;

    // index of the first incomplete, non-skipped step (the "current" one)
    let currentKey = null;
    for (let i = 0; i < items.length; i += 1) {
      const it = items[i];
      if (!it.done && !isSkipped(it)) { currentKey = it.key; break; }
    }

    const run = (it) => {
      if (props.onRun) { props.onRun(it.key); return; }
      setInner((arr) => arr.map((x) => (x.key === it.key ? Object.assign({}, x, { done: true }) : x)));
    };
    const skip = (it) => {
      setSkipped((s) => Object.assign({}, s, { [it.key]: true }));
      if (props.onSkip) props.onSkip(it.key);
    };
    const dismiss = () => { setDismissed(true); if (props.onDismiss) props.onDismiss(); };

    if (dismissed) return null;

    return (
      <div className={('omada-suc ' + className).trim()} {...rest}>
        <div className="omada-suc-head">
          <div className="omada-suc-headmain">
            <span className="omada-suc-headix"><Icon name="rocket" size={20} /></span>
            <div className="omada-suc-headtext">
              <div className="omada-suc-title">{props.title || t('suc.title')}</div>
              <div className="omada-suc-sub">{props.subtitle || t('suc.subtitle')}</div>
            </div>
          </div>
          <button type="button" className="omada-suc-dismiss" onClick={dismiss} aria-label={t('suc.dismiss')}>
            <Icon name="close" size={16} />
          </button>
        </div>

        <div className="omada-suc-meter">
          <div className="omada-suc-meterlabel">
            <span className="omada-suc-metercount">{completed}<span className="omada-suc-metersep">/</span>{total}</span>
            <span className="omada-suc-metertext">{t('suc.stepsDone')}</span>
          </div>
          <Progress percent={pct} showInfo={false} size="small" strokeColor={allDone ? undefined : '#00A870'}
                    status={allDone ? 'success' : 'active'} className="omada-suc-progress" />
        </div>

        {allDone ? (
          <div className="omada-suc-success">
            <Illustration name={props.successScene || 'success'} size={104} />
            <div className="omada-suc-successtext">
              <div className="omada-suc-successtitle">{t('suc.allDone')}</div>
              <div className="omada-suc-successsub">{t('suc.allDoneHint')}</div>
            </div>
            {props.finishCta && (
              <Button variant="primary" onClick={() => props.onFinish && props.onFinish()}>
                {props.finishCta}<Icon name="arrow-right" size={16} />
              </Button>
            )}
          </div>
        ) : (
          <ul className="omada-suc-list" role="list">
            {items.map((it) => {
              const sk = isSkipped(it);
              const state = it.done ? 'done' : (it.key === currentKey ? 'current' : 'todo');
              const locked = gated && state === 'todo';
              return (
                <li key={it.key} className={'omada-suc-step is-' + state + (sk ? ' is-skipped' : '')} role="listitem">
                  <span className="omada-suc-disc" aria-hidden="true">
                    {it.done
                      ? <Icon name="check" size={14} />
                      : (state === 'current'
                          ? <span className="omada-suc-dot" />
                          : <Icon name="circle" size={20} />)}
                  </span>
                  <div className="omada-suc-stepbody">
                    <div className="omada-suc-steptop">
                      <span className="omada-suc-stepname">{it.title}</span>
                      {it.optional && !it.done && <Tag tone="default" className="omada-suc-opttag">{t('suc.optional')}</Tag>}
                      {sk && <span className="omada-suc-skippedtag">{t('suc.skipped')}</span>}
                    </div>
                    {it.desc && <div className="omada-suc-stepdesc">{it.desc}</div>}
                  </div>
                  <div className="omada-suc-stepaction">
                    {it.done
                      ? <span className="omada-suc-donelabel"><Icon name="check-circle" size={15} />{t('suc.done')}</span>
                      : sk
                        ? null
                        : (
                          <span className="omada-suc-actions">
                            <Button variant={state === 'current' ? 'primary' : 'outline'} size="small"
                                    disabled={locked} onClick={() => run(it)}>
                              {it.cta || t('suc.start')}
                            </Button>
                            {it.optional && (
                              <button type="button" className="omada-suc-skip" onClick={() => skip(it)}>
                                {t('suc.skip')}
                              </button>
                            )}
                          </span>
                        )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.SetupChecklist = OmadaSetupChecklist;
})();
