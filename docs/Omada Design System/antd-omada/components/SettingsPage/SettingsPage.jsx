/* ────────────────────────────────────────────────────────────────────────
   components/SettingsPage/SettingsPage.jsx — OmadaSettingsPage

   A sectioned SETTINGS composition with a dirty-aware STICKY SAVE BAR. The
   long-form preferences page: a left rail of section anchors, stacked titled
   sections (icon + title + description on the left, controls on the right), and
   a save bar that slides up the instant a value changes — "Unsaved changes ·
   Discard · Save".

   Behaviour:
     · One antd Form owns all sections. onValuesChange diffs against the saved
       baseline; the save bar appears only while DIRTY.
     · Save → onSave(values), the baseline resets, the bar slides away and a
       brief "Saved" pulse confirms. Discard → fields revert to the baseline.
     · The left rail scroll-spies the sections (click to jump); on narrow
       widths it collapses and the sections stack full-width.

   Sections are caller-defined: each provides render(form) so the demo owns the
   fields while the chrome (rail, section frame, save bar) is ours. Thin
   composition over antd Form + Anchor-style nav. All chrome is theme-var driven
   with dark twins in omada-overrides.css; the save bar + active rail item use
   brand-green tokens. RTL-safe.

   Figma: "页面布局-Settings" (node 12014:56155) — the sectioned form page with
   grouped blocks and a persistent action bar. Glyphs are OmadaIcon.
   Exports: window.Omada.SettingsPage
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { useState, useRef, useCallback, useEffect } = React;
  const { Form } = window.antd;
  const Icon = window.Omada.Icon;
  const Button = window.Omada.Button;

  function stable(v) {
    // order-independent stringify for a flat-ish values object
    try { return JSON.stringify(v, Object.keys(v || {}).sort()); } catch (_) { return JSON.stringify(v); }
  }

  function OmadaSettingsPage(props) {
    const className = props.className || '';
    const rest = Object.assign({}, props);
    delete rest.className; delete rest.sections; delete rest.initialValues; delete rest.onSave; delete rest.title;

    const ctx = window.useOmada();
    const t = ctx.t;
    const sections = props.sections || [];
    const initialValues = props.initialValues || {};

    const [form] = Form.useForm();
    const baseline = useRef(stable(initialValues));
    const [dirty, setDirty] = useState(false);
    const [saving, setSaving] = useState(false);
    const [savedPulse, setSavedPulse] = useState(false);
    const [activeSec, setActiveSec] = useState(sections[0] && sections[0].key);
    const bodyRef = useRef(null);
    const secRefs = useRef({});

    const recompute = useCallback(function () {
      const now = stable(form.getFieldsValue(true));
      setDirty(now !== baseline.current);
    }, [form]);

    const onSave = function () {
      setSaving(true);
      const values = form.getFieldsValue(true);
      setTimeout(function () {
        baseline.current = stable(values);
        setDirty(false);
        setSaving(false);
        setSavedPulse(true);
        setTimeout(function () { setSavedPulse(false); }, 1600);
        if (props.onSave) props.onSave(values);
      }, 480);
    };
    const onDiscard = function () {
      form.resetFields();
      form.setFieldsValue(initialValues);
      setDirty(false);
    };

    const jump = function (key) {
      setActiveSec(key);
      const el = secRefs.current[key];
      const body = bodyRef.current;
      if (el && body) { body.scrollTop = el.offsetTop - 8; }
    };

    // scroll-spy
    useEffect(function () {
      const body = bodyRef.current;
      if (!body) return;
      const onScroll = function () {
        let cur = sections[0] && sections[0].key;
        sections.forEach(function (s) {
          const el = secRefs.current[s.key];
          if (el && el.offsetTop - 16 <= body.scrollTop) cur = s.key;
        });
        setActiveSec(cur);
      };
      body.addEventListener('scroll', onScroll);
      return function () { body.removeEventListener('scroll', onScroll); };
    }, [sections]);

    return (
      <div className={('omada-set ' + className).trim()} {...rest}>
        <div className="omada-set-grid">
          <nav className="omada-set-rail" aria-label={t('set.sections')}>
            {sections.map(function (s) {
              return (
                <button key={s.key} type="button"
                        className={'omada-set-railitem' + (activeSec === s.key ? ' is-active' : '')}
                        onClick={function () { jump(s.key); }}>
                  {s.icon && <Icon name={s.icon} size={16} />}
                  <span>{s.title}</span>
                </button>
              );
            })}
          </nav>

          <div className="omada-set-bodywrap">
            <div className="omada-set-body" ref={bodyRef}>
              <Form
                form={form}
                layout="vertical"
                initialValues={initialValues}
                onValuesChange={recompute}
                className="omada-set-form"
                requiredMark={false}
              >
                {sections.map(function (s) {
                  return (
                    <section key={s.key} className="omada-set-section"
                             ref={function (el) { secRefs.current[s.key] = el; }}>
                      <div className="omada-set-secinfo">
                        <div className="omada-set-sectitle">
                          {s.icon && <span className="omada-set-secix"><Icon name={s.icon} size={18} /></span>}
                          {s.title}
                        </div>
                        {s.desc && <div className="omada-set-secdesc">{s.desc}</div>}
                      </div>
                      <div className="omada-set-secfields">
                        {s.render ? s.render(form) : null}
                      </div>
                    </section>
                  );
                })}
              </Form>
            </div>

            <div className={'omada-set-savebar' + (dirty ? ' is-visible' : '') + (savedPulse ? ' is-saved' : '')}
                 aria-hidden={!dirty && !savedPulse}>
              <span className="omada-set-savemsg">
                {savedPulse
                  ? <span className="omada-set-savedok"><Icon name="check-circle" size={16} />{t('set.saved')}</span>
                  : <span className="omada-set-savedirty"><span className="omada-set-savedot" />{t('set.unsaved')}</span>}
              </span>
              <span className="omada-set-savebtns">
                <Button variant="secondary" size="small" onClick={onDiscard} disabled={saving}>{t('set.discard')}</Button>
                <Button variant="primary" size="small" onClick={onSave} loading={saving}>
                  <Icon name="save" size={15} />{t('common.save')}
                </Button>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.SettingsPage = OmadaSettingsPage;
})();
