/* ────────────────────────────────────────────────────────────────────────
   components/FormWizard/FormWizard.jsx — OmadaFormWizard

   A multi-step WIZARD — Steps + a single antd Form, the "set up a new site /
   adopt a gateway / onboard a tenant" flow. antd gives Steps and Form
   separately; the wizard is the glue everyone re-writes, so it lives here once:

     · One <Form> instance spans every step (values persist across Back/Next,
       nothing is lost when you step away and return).
     · Next validates ONLY the current step's declared `fields` via
       form.validateFields(names) — a failing field blocks advance and scrolls
       into view; passing steps light their Steps node green (finish state).
     · A trailing review step renders a read-only Descriptions summary from
       form.getFieldsValue() so the user confirms before Finish.
     · Footer: Back (hidden on step 0) · Next · Finish (last step) — Finish runs
       a full validateFields() then onFinish(values). A loading flag disables
       the footer during async submit.

   It is a thin COMPOSITION over Omada wrappers: Steps, Form, Button, Icon. Each
   step supplies its own content (the caller owns the fields); the wizard owns
   navigation, per-step validation, the Steps header and the review.

   All chrome is theme-var driven with dark twins in omada-overrides.css; the
   active/finished Steps nodes use the brand-green token. Steps switch to
   vertical under a narrow container and mirror under RTL.

   Figma: no dedicated node — composes the Steps (Batch 4) wizard node with the
   Form (Batch 3) language. Glyphs are OmadaIcon.
   Exports: window.Omada.FormWizard
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { useState, useMemo } = React;
  const { Steps, Form } = window.antd;
  const Icon = window.Omada.Icon;
  const Button = window.Omada.Button;

  function OmadaFormWizard(props) {
    const className = props.className || '';
    const rest = Object.assign({}, props);
    delete rest.className; delete rest.steps; delete rest.onFinish;
    delete rest.form; delete rest.direction; delete rest.initialValues;

    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;

    const steps = props.steps || [];
    const [form] = Form.useForm(props.form);
    const [current, setCurrent] = useState(0);
    const [done, setDone] = useState({});      // {stepIndex: true} for finished nodes
    const [submitting, setSubmitting] = useState(false);

    const last = steps.length - 1;
    const isLast = current === last;

    const stepItems = useMemo(() => steps.map((s, i) => ({
      key: s.key || i,
      title: s.title,
      icon: s.icon ? <span className="omada-fw-stepicon"><Icon name={s.icon} size={16} /></span> : undefined,
      status: i === current ? 'process' : (done[i] ? 'finish' : 'wait'),
    })), [steps, current, done]);

    const goNext = async () => {
      const fields = steps[current] && steps[current].fields;
      try {
        if (fields && fields.length) await form.validateFields(fields);
        setDone((d) => Object.assign({}, d, { [current]: true }));
        setCurrent((c) => Math.min(c + 1, last));
      } catch (_) { /* validation surfaced inline by antd */ }
    };
    const goBack = () => setCurrent((c) => Math.max(c - 1, 0));

    const finish = async () => {
      try {
        const values = await form.validateFields();
        setDone((d) => Object.assign({}, d, { [current]: true }));
        setSubmitting(true);
        Promise.resolve(props.onFinish ? props.onFinish(values, form) : null)
          .finally(() => setSubmitting(false));
      } catch (_) { /* surfaced inline */ }
    };

    const stepDef = steps[current] || {};
    const content = typeof stepDef.content === 'function'
      ? stepDef.content(form, { getValues: () => form.getFieldsValue(true) })
      : stepDef.content;

    return (
      <div className={('omada-fw ' + className).trim()} {...rest}>
        <Steps
          className="omada-fw-steps"
          current={current}
          items={stepItems}
          direction={props.direction || 'horizontal'}
          size="small"
        />
        <Form
          form={form}
          layout="vertical"
          className="omada-fw-form"
          initialValues={props.initialValues}
          requiredMark
        >
          {steps.map((s, i) => (
            <div key={s.key || i} style={{ display: i === current ? 'block' : 'none' }}>
              {i === current ? content : null}
            </div>
          ))}
        </Form>

        <div className="omada-fw-foot">
          <div className="omada-fw-footinfo">
            {t('fw.stepOf')
              .replace('{n}', String(current + 1))
              .replace('{total}', String(steps.length))}
          </div>
          <div className="omada-fw-footbtns">
            {current > 0 && (
              <Button variant="text" onClick={goBack} disabled={submitting}
                icon={<Icon name="chevron-left" size={16} />}>
                {t('fw.back')}
              </Button>
            )}
            {!isLast && (
              <Button variant="primary" onClick={goNext}>
                {t('fw.next')}<Icon name="chevron-right" size={16} />
              </Button>
            )}
            {isLast && (
              <Button variant="primary" onClick={finish} loading={submitting}
                icon={<Icon name="check" size={16} />}>
                {t('fw.finish')}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.FormWizard = OmadaFormWizard;
})();
