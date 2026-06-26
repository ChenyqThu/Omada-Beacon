/* ────────────────────────────────────────────────────────────────────────
   components/Accessibility/Accessibility.jsx — OmadaAccessibility

   An ACCESSIBILITY SPEC BOARD — the live specimen counterpart to the Motion
   and ColorTokens boards. It renders the three accessibility floors from
   COMPONENT_SPEC §0 as things you can actually tab through and inspect, so the
   guidance can never drift from the components:

     1. Focus states — real Omada controls you Tab into; the 3px green focus
        ring (token controlOutline 12% / 22% in dark) is the same one every
        wrapper ships, not a re-draw.
     2. Hit targets — primary ≥44px, standard ≥32px, compact 24px, each drawn
        at its real control height with a measured overlay.
     3. Names, roles & states — an icon-only button (aria-label), a required
        field (aria-required), a Switch (role=switch + aria-checked) and a
        polite live region, each paired with a code tag naming the attribute
        that carries the semantics.

   This is NOT a new primitive — it composes the existing Button / Input /
   Toggle wrappers. All colour/surfaces are theme vars with dark twins in
   omada-overrides.css; the focus ring comes from the antd token, no brand hex
   in the JSX.

   Figma: no dedicated a11y frame exists; the values are the COMPONENT_SPEC §0
   accessibility floor (3px focus ring · ≥44/≥32px hit targets · forwarded
   aria-*), which live in omada-theme.js → token (controlOutline / controlHeight).
   Exports: window.Omada.Accessibility
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { useState, useEffect, useRef } = React;
  const OmadaIcon = window.OmadaIcon;

  function OmadaAccessibility(props) {
    const className = props.className || '';
    const rest = Object.assign({}, props);
    delete rest.className;

    const ctx = window.useOmada ? window.useOmada() : { t: (k) => k, lang: 'en' };
    const t = ctx.t;

    const Button = window.Omada.Button;
    const Input = window.Omada.Input;
    const { Switch } = window.antd;

    // live-region demo: flips a count so screen readers announce it politely
    const [liveOn, setLiveOn] = useState(false);
    const [checked, setChecked] = useState(true);

    const HITS = [
      { key: 'primary',   px: 44, useKey: 'a11y.primary' },
      { key: 'secondary', px: 32, useKey: 'a11y.secondary' },
      { key: 'compact',   px: 24, useKey: 'a11y.compact' },
    ];

    return (
      <div className={('omada-a11y ' + className).trim()} {...rest}>

        {/* ── focus states ── */}
        <div className="omada-a11y-sub">{t('a11y.focus')}</div>
        <div className="omada-a11y-desc">{t('a11y.focusDesc')}</div>
        <div className="omada-a11y-focusrow">
          <Button variant="primary">{t('common.apply')}</Button>
          <Button variant="secondary">{t('common.cancel')}</Button>
          <Input style={{ width: 180 }} placeholder={t('field.siteName.ph')} aria-label={t('field.siteName')} />
          <label className="omada-a11y-inline">
            <input type="checkbox" className="omada-a11y-native" defaultChecked />
            <span>{t('common.enabled')}</span>
          </label>
          <a href="#accessibility" className="omada-a11y-link" onClick={(e) => e.preventDefault()}>
            {t('common.learnMore')}
          </a>
        </div>
        <div className="omada-a11y-hint">
          <OmadaIcon name="info" size={13} /> {t('a11y.tabHint')}
        </div>

        {/* ── hit targets ── */}
        <div className="omada-a11y-sub">{t('a11y.hit')}</div>
        <div className="omada-a11y-desc">{t('a11y.hitDesc')}</div>
        <div className="omada-a11y-hits">
          {HITS.map((h) => (
            <div key={h.key} className="omada-a11y-hitcard">
              <div className="omada-a11y-hitstage">
                <span className="omada-a11y-target" style={{ height: h.px, minWidth: h.px }}>
                  <span className="omada-a11y-dim">{h.px}px</span>
                </span>
              </div>
              <div className="omada-a11y-hituse">{t(h.useKey)}</div>
              <code className="omada-a11y-hittok">min-height: {h.px}px</code>
            </div>
          ))}
        </div>

        {/* ── names, roles & states ── */}
        <div className="omada-a11y-sub">{t('a11y.aria')}</div>
        <div className="omada-a11y-desc">{t('a11y.ariaDesc')}</div>
        <div className="omada-a11y-aria">

          {/* icon-only button → aria-label */}
          <div className="omada-a11y-acard">
            <div className="omada-a11y-aspec">
              <Button variant="secondary" aria-label={t('a11y.iconBtnNote')}
                      style={{ width: 40, height: 40, padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <OmadaIcon name="reboot" size={18} />
              </Button>
            </div>
            <div className="omada-a11y-aname">{t('a11y.iconBtn')}</div>
            <code className="omada-a11y-atok">aria-label="{t('a11y.iconBtnNote')}"</code>
          </div>

          {/* required field → aria-required */}
          <div className="omada-a11y-acard">
            <div className="omada-a11y-aspec">
              <Input style={{ width: '100%' }} required aria-required="true"
                     defaultValue="HQ — Floor 3" aria-label={t('field.siteName')} />
            </div>
            <div className="omada-a11y-aname">
              {t('a11y.req')} <span className="omada-a11y-star">*</span>
            </div>
            <code className="omada-a11y-atok">aria-required="true"</code>
          </div>

          {/* switch → role + aria-checked */}
          <div className="omada-a11y-acard">
            <div className="omada-a11y-aspec">
              <Switch checked={checked} onChange={setChecked}
                      aria-label={t('a11y.toggleName')} />
              <span className="omada-a11y-aval">{checked ? t('common.enabled') : t('common.disabled')}</span>
            </div>
            <div className="omada-a11y-aname">{t('a11y.toggleName')}</div>
            <code className="omada-a11y-atok">role="switch" aria-checked="{String(checked)}"</code>
          </div>

          {/* live region → aria-live polite */}
          <div className="omada-a11y-acard">
            <div className="omada-a11y-aspec">
              <Button variant="secondary" onClick={() => setLiveOn((v) => !v)}>
                <OmadaIcon name="adopt" size={16} /> {t('device.adopt')}
              </Button>
              <span className="omada-a11y-liveout" role="status" aria-live="polite">
                {liveOn ? t('a11y.liveMsg') : ''}
              </span>
            </div>
            <div className="omada-a11y-aname">{t('a11y.live')}</div>
            <code className="omada-a11y-atok">aria-live="polite"</code>
          </div>

        </div>

        <div className="omada-a11y-note">{t('a11y.note')}</div>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.Accessibility = OmadaAccessibility;
})();
