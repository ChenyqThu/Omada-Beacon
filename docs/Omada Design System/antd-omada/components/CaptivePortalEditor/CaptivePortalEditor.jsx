/* ────────────────────────────────────────────────────────────────────────
   components/CaptivePortalEditor/CaptivePortalEditor.jsx — OmadaCaptivePortalEditor

   A SPLASH/LOGIN PAGE BUILDER for hotspot captive portals: a control
   column (welcome title + message, auth method radio — none / simple
   password / voucher —, curated accent swatches from the OMADA ramp,
   show-logo and require-terms switches) driving a live miniature
   phone-frame preview on the right. The preview re-renders per
   keystroke: logo placeholder disc, welcome copy, the auth control
   the guest would see, terms row, and a Connect button tinted with
   the chosen accent (dark variants swap in automatically).

   Distinct from VoucherPrinter (prints codes; this designs the page
   guests see) and ThemeProvider/Theming boards (app theme, not
   guest-facing page).

   Token-driven (accents read from window.OMADA), dark twin, i18n.
   Figma: SYMBOL 25947:12260 ("Property 1=portal") — no full frame;
   phone metrics follow TwoFactorSetup card scale.
   Exports: window.Omada.CaptivePortalEditor
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { Input, Radio, Switch } = window.antd;

  function OmadaCaptivePortalEditor(props) {
    const { useState } = React;
    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;
    const mode = ctx ? ctx.mode : 'light';

    const O = window.OMADA;
    const ACCENTS = [
      { id: 'green',   light: O.green[500], dark: O.greenDark.base },
      { id: 'blue',    light: O.blue,       dark: O.blueDark },
      { id: 'orange',  light: O.orange,     dark: O.orangeDark },
      { id: 'magenta', light: O.magenta,    dark: O.magenta },
    ];

    const [title, setTitle] = useState(null);   // null → localized default
    const [msg, setMsg] = useState(null);
    const [auth, setAuth] = useState(props.defaultAuth || 'voucher');
    const [accentId, setAccentId] = useState('green');
    const [logo, setLogo] = useState(true);
    const [terms, setTerms] = useState(true);

    const accent = ACCENTS.filter(function (a) { return a.id === accentId; })[0];
    const accentColor = mode === 'dark' ? accent.dark : accent.light;
    const shownTitle = title != null ? title : t('cpe.defTitle');
    const shownMsg = msg != null ? msg : t('cpe.defMsg');

    return (
      <div className={'omada-cpe' + (props.className ? ' ' + props.className : '')}>
        <div className="omada-cpe-form">
          <label className="omada-cpe-field">
            <span>{t('cpe.welcomeTitle')}</span>
            <Input size="small" value={shownTitle} maxLength={40}
                   onChange={function (e) { setTitle(e.target.value); }} />
          </label>
          <label className="omada-cpe-field">
            <span>{t('cpe.welcomeMsg')}</span>
            <Input size="small" value={shownMsg} maxLength={80}
                   onChange={function (e) { setMsg(e.target.value); }} />
          </label>
          <div className="omada-cpe-field">
            <span>{t('cpe.auth')}</span>
            <Radio.Group value={auth} onChange={function (e) { setAuth(e.target.value); }}
                         className="omada-cpe-radios">
              <Radio value="none">{t('cpe.auth.none')}</Radio>
              <Radio value="password">{t('cpe.auth.password')}</Radio>
              <Radio value="voucher">{t('cpe.auth.voucher')}</Radio>
            </Radio.Group>
          </div>
          <div className="omada-cpe-field">
            <span>{t('cpe.accent')}</span>
            <div className="omada-cpe-swatches">
              {ACCENTS.map(function (a) {
                const c = mode === 'dark' ? a.dark : a.light;
                return (
                  <button key={a.id} type="button" aria-label={a.id}
                          className={'omada-cpe-swatch' + (a.id === accentId ? ' is-on' : '')}
                          style={{ background: c }}
                          onClick={function () { setAccentId(a.id); }} />
                );
              })}
            </div>
          </div>
          <div className="omada-cpe-switchrow">
            <span>{t('cpe.logo')}</span>
            <Switch size="small" checked={logo} onChange={setLogo} />
          </div>
          <div className="omada-cpe-switchrow">
            <span>{t('cpe.terms')}</span>
            <Switch size="small" checked={terms} onChange={setTerms} />
          </div>
        </div>

        <div className="omada-cpe-previewcol">
          <div className="omada-cpe-previewlabel">{t('cpe.preview')}</div>
          <div className="omada-cpe-phone">
            <div className="omada-cpe-notch" />
            <div className="omada-cpe-screen">
              {logo ? <div className="omada-cpe-logo" style={{ borderColor: accentColor, color: accentColor }}>LOGO</div> : null}
              <div className="omada-cpe-title">{shownTitle}</div>
              <div className="omada-cpe-msg">{shownMsg}</div>
              {auth === 'password' ? (
                <div className="omada-cpe-input">{t('cpe.ph.password')}</div>
              ) : null}
              {auth === 'voucher' ? (
                <div className="omada-cpe-input is-mono">{t('cpe.ph.voucher')}</div>
              ) : null}
              {terms ? (
                <div className="omada-cpe-termsrow">
                  <span className="omada-cpe-box" style={{ borderColor: accentColor }}>
                    <window.OmadaIcon name="check" size={9} color={accentColor} />
                  </span>
                  {t('cpe.agree')}
                </div>
              ) : null}
              <div className="omada-cpe-connect" style={{ background: accentColor }}>{t('cpe.connect')}</div>
              <div className="omada-cpe-session">{t('cpe.session')}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.CaptivePortalEditor = OmadaCaptivePortalEditor;
})();
