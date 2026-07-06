/* ────────────────────────────────────────────────────────────────────────
   components/FormPatterns/FormPatterns.jsx — OmadaFormPatterns

   A FORMS-PATTERNS board — the "how to compose a real form" companion to the
   FormValidation board (which covers field STATES). This covers form STRUCTURE,
   the four decisions every Omada form makes:

     1. Layout — vertical (drawers / narrow) ↔ horizontal label-left (settings)
        ↔ inline (filter bars). Live segmented switch reflows one real form.
     2. Density — one ConfigProvider componentSize (small / default / large);
        no per-field sizing.
     3. Section grouping — fields chunked under quiet subheaders with a hairline,
        not one undifferentiated stack.
     4. Dependent fields — a control that reveals/hides downstream fields
        (Form.useWatch). DHCP hides the static-IP block; Static reveals it.

   Everything is the real Omada.Form + Form.Item + Omada inputs, so the board
   doubles as a copy-paste reference. NOT a primitive.

   Figma: Form 表单-说明 node 3000:104884 (label-left layout, sectioning,
   Confirm/Cancel footer). Layout/density/dependency are antd Form features
   expressed against the Omada metrics in omada-theme.js → components.Form.
   Exports: window.Omada.FormPatterns
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { useState } = React;

  function Section(props) {
    return (
      <div className="omada-fp-section">
        <div className="omada-fp-secheader">
          <window.OmadaIcon name={props.icon} size={15} />
          <span>{props.title}</span>
        </div>
        <div className="omada-fp-secbody">{props.children}</div>
      </div>
    );
  }

  function OmadaFormPatterns(props) {
    const className = props.className || '';
    const rest = Object.assign({}, props);
    delete rest.className;

    const ctx = window.useOmada ? window.useOmada() : { t: (k) => k, lang: 'en' };
    const t = ctx.t;

    const { ConfigProvider, Form: AntForm, Segmented } = window.antd;
    const Form = window.Omada.Form;
    const Input = window.Omada.Input;
    const Select = window.Omada.Select;
    const Button = window.Omada.Button;

    const [layout, setLayout] = useState('vertical');
    const [size, setSize] = useState('default');
    const [form] = Form.useForm();
    // dependent field: watch the connection-type control
    const conn = AntForm.useWatch('conn', form) || 'dhcp';

    const layoutOpts = [
      { value: 'vertical',   label: t('fp.layout.vertical') },
      { value: 'horizontal', label: t('fp.layout.horizontal') },
      { value: 'inline',     label: t('fp.layout.inline') },
    ];
    const sizeOpts = [
      { value: 'small',   label: t('fp.size.small') },
      { value: 'default', label: t('fp.size.default') },
      { value: 'large',   label: t('fp.size.large') },
    ];

    const connOpts = [
      { value: 'dhcp',   label: t('fp.conn.dhcp') },
      { value: 'static', label: t('fp.conn.static') },
    ];
    const bandOpts = [
      { value: '2g', label: '2.4 GHz' },
      { value: '5g', label: '5 GHz' },
      { value: 'both', label: t('fp.band.both') },
    ];

    return (
      <div className={('omada-fp ' + className).trim()} {...rest}>

        {/* controls */}
        <div className="omada-fp-controls">
          <div className="omada-fp-ctl">
            <span className="omada-fp-ctllabel">{t('fp.layoutLabel')}</span>
            <Segmented size="small" value={layout} onChange={setLayout} options={layoutOpts} />
          </div>
          <div className="omada-fp-ctl">
            <span className="omada-fp-ctllabel">{t('fp.densityLabel')}</span>
            <Segmented size="small" value={size} onChange={setSize} options={sizeOpts} />
          </div>
        </div>

        {/* the live form */}
        <ConfigProvider componentSize={size}>
          <Form
            form={form}
            layout={layout}
            className={'omada-fp-form is-' + layout}
            initialValues={{ conn: 'dhcp', band: 'both', name: 'AP-Lobby-01' }}
            requiredMark="optional"
          >
            {layout !== 'inline' ? (
              <React.Fragment>
                {/* grouped sections */}
                <Section icon="devices" title={t('fp.sec.identity')}>
                  <Form.Item name="name" label={t('fp.field.name')} rules={window.OmadaFormRules.required(t)}>
                    <Input placeholder={t('fp.ph.name')} prefixIcon="devices" />
                  </Form.Item>
                  <Form.Item name="site" label={t('fp.field.site')}
                             tooltip={t('fp.tip.site')}>
                    <Select placeholder={t('fp.ph.site')} options={[
                      { value: 'hq', label: t('fp.site.hq') },
                      { value: 'br', label: t('fp.site.branch') },
                    ]} />
                  </Form.Item>
                </Section>

                <Section icon="globe" title={t('fp.sec.network')}>
                  {/* dependent control */}
                  <Form.Item name="conn" label={t('fp.field.conn')}>
                    <Select options={connOpts} />
                  </Form.Item>
                  {/* dependent block — only when Static */}
                  {conn === 'static' ? (
                    <div className="omada-fp-depblock">
                      <Form.Item name="ip" label={t('fp.field.ip')} rules={window.OmadaFormRules.ipv4(t)}>
                        <Input placeholder="192.168.1.20" />
                      </Form.Item>
                      <Form.Item name="gw" label={t('fp.field.gw')} rules={window.OmadaFormRules.ipv4(t)}>
                        <Input placeholder="192.168.1.1" />
                      </Form.Item>
                    </div>
                  ) : (
                    <div className="omada-fp-dephint">
                      <window.OmadaIcon name="info" size={14} /> {t('fp.dhcpHint')}
                    </div>
                  )}
                  <Form.Item name="band" label={t('fp.field.band')}>
                    <Select options={bandOpts} />
                  </Form.Item>
                </Section>

                <div className="omada-fp-footer">
                  <Button variant="primary">{t('common.save')}</Button>
                  <Button variant="secondary">{t('common.cancel')}</Button>
                </div>
              </React.Fragment>
            ) : (
              /* inline — a filter bar */
              <div className="omada-fp-inline">
                <Form.Item name="name" label={t('fp.field.keyword')}>
                  <Input placeholder={t('fp.ph.keyword')} prefixIcon="search" />
                </Form.Item>
                <Form.Item name="site" label={t('fp.field.site')}>
                  <Select placeholder={t('fp.ph.site')} style={{ minWidth: 140 }} options={[
                    { value: 'hq', label: t('fp.site.hq') },
                    { value: 'br', label: t('fp.site.branch') },
                  ]} />
                </Form.Item>
                <Form.Item name="band" label={t('fp.field.band')}>
                  <Select style={{ minWidth: 120 }} options={bandOpts} />
                </Form.Item>
                <Button variant="primary"><window.OmadaIcon name="filter" size={15} /> {t('common.filter')}</Button>
              </div>
            )}
          </Form>
        </ConfigProvider>

        <div className="omada-fp-note">{t('fp.note')}</div>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.FormPatterns = OmadaFormPatterns;
})();
