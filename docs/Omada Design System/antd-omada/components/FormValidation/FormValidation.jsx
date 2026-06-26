/* ────────────────────────────────────────────────────────────────────────
   components/FormValidation/FormValidation.jsx — OmadaFormValidation

   A FORM-VALIDATION PATTERN BOARD — the visual rules from the Figma "Form 表单"
   spec (node 3000:104884), where the 校验反馈 (validation feedback) section
   defines two flows:
     1. 失焦校验反馈 — blur validation: empty + format errors surface when a
        field loses focus, so users correct as they go.
     2. 提交后校验反馈 — submit validation: submitting validates everything.

   This is NOT a new primitive — it composes the existing Omada Form / Input
   wrappers and the shared OmadaFormRules presets. It has two surfaces:
     · Field states — one specimen per antd validateStatus (success · warning
       · error · validating) with hasFeedback status icons + help text.
     · Live blur validation — a real form that validates on blur (and on
       submit), driven by the OmadaFormRules presets so messages localise.

   The Figma error field is a filled control with a #EE385C (token colorError)
   border + a feedback message below; success/warning/validating reuse antd's
   native validateStatus, themed by the Omada semantic tokens (omada-theme.js).

   Figma: Form 表单 node 3000:104884 (校验反馈 section) + Input states
   (/Input2 Error / Done / Focus symbols).
   Exports: window.Omada.FormValidation
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  function OmadaFormValidation(props) {
    const className = props.className || '';
    const rest = Object.assign({}, props);
    delete rest.className;

    const ctx = window.useOmada ? window.useOmada() : { t: (k) => k, lang: 'en' };
    const t = ctx.t;
    const L = (en, zh) => (ctx.lang === 'zh' ? zh : en);

    const Form = window.Omada.Form;
    const Input = window.Omada.Input;
    const Button = window.Omada.Button;
    const { Space } = window.antd;
    const rules = window.OmadaFormRules;

    const [form] = Form.useForm();

    const STATES = [
      { status: 'success',    label: 'field.ipAddress', value: '192.168.0.1',   help: 'fv.successMsg' },
      { status: 'warning',    label: 'field.siteName',  value: 'HQ — Floor 3',  help: 'fv.warnMsg' },
      { status: 'error',      label: 'field.email',     value: 'name@@exmpl',   help: 'valid.email' },
      { status: 'validating', label: 'field.siteName',  value: 'eap-670-hq',    help: 'fv.validatingMsg' },
    ];

    return (
      <div className={('omada-formval ' + className).trim()} {...rest}>
        {/* ── field states ── */}
        <div className="row"><span className="label">{t('fv.states')}</span></div>
        <Form layout="vertical" requiredMark={false} className="omada-formval-states">
          <div className="omada-formval-stategrid">
            {STATES.map((s) => (
              <Form.Item
                key={s.status}
                label={t(s.label)}
                validateStatus={s.status}
                help={t(s.help)}
                hasFeedback
              >
                <Input defaultValue={s.value} />
              </Form.Item>
            ))}
          </div>
        </Form>

        {/* ── live blur validation ── */}
        <div className="row" style={{ marginTop: 18 }}><span className="label">{t('fv.blurTitle')}</span></div>
        <div className="omada-formval-hint">{t('fv.blurDesc')}</div>
        <Form
          form={form}
          layout="vertical"
          requiredMark
          validateTrigger="onBlur"
          onFinish={() => {}}
          className="omada-formval-live"
          style={{ maxWidth: 440 }}
        >
          <Form.Item name="siteName" label={t('field.siteName')} rules={rules.minLen(t, 3)} hasFeedback>
            <Input placeholder={t('field.siteName.ph')} />
          </Form.Item>
          <Form.Item name="ip" label={t('field.ipAddress')} rules={rules.ipv4(t)} hasFeedback>
            <Input placeholder={t('field.ipAddress.ph')} />
          </Form.Item>
          <Form.Item name="email" label={t('field.email')} rules={rules.email(t)} hasFeedback>
            <Input placeholder={t('field.email.ph')} />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Space>
              <Button variant="primary" htmlType="submit">{t('common.apply')}</Button>
              <Button variant="text" onClick={() => form.resetFields()}>{t('common.reset')}</Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.FormValidation = OmadaFormValidation;
})();
