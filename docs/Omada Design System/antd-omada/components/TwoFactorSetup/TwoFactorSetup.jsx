/* ────────────────────────────────────────────────────────────────────────
   components/TwoFactorSetup/TwoFactorSetup.jsx — OmadaTwoFactorSetup

   A THREE-STEP two-factor enrolment card:

     1. Scan QR  — antd QRCode with the otpauth:// URI + a copyable
                   manual-entry secret for devices that can't scan.
     2. Enter code — a 6-digit SEGMENTED input: auto-advance, backspace
                   walks left, full-code paste, shake + error on reject.
     3. Recovery codes — one-time codes sheet with Copy-all and a
                   client-side .txt download, then a success state.

     · `account` — label encoded in the otpauth URI + shown in the card.
     · `secret`  — base32 secret (default demo value).
     · `issuer`  — otpauth issuer (default 'Omada').
     · `recoveryCodes` — string[8] (defaults provided).
     · `onVerify(code) => bool` — return false to reject (default
       rejects '000000' so the error path is demonstrable).
     · `onDone()` — fires from the success state.

   Code boxes and secret stay LTR/mono in RTL.
   Figma: no dedicated node this session (VFS permission pending) —
   step anatomy follows Steps; inputs follow Input tokens.
   Exports: window.Omada.TwoFactorSetup
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const Icon = window.Omada.Icon;
  const { Steps, Button, QRCode } = window.antd;

  const DEFAULT_CODES = ['7K2M-Q4DA', 'XR81-77NF', 'M0PD-2QLZ', 'A6VV-JD83', 'TT49-RB0E', 'ZK15-MWUH', 'C3QO-8YSN', 'HJ66-04KP'];

  function OmadaTwoFactorSetup(props) {
    const { useState, useRef } = React;
    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;
    const mode = ctx ? ctx.mode : 'light';

    const account = props.account || 'admin@hq-campus';
    const secret = props.secret || 'JBSWY3DPEHPK3PXP';
    const issuer = props.issuer || 'Omada';
    const codes = props.recoveryCodes || DEFAULT_CODES;
    const verify = props.onVerify || ((code) => code !== '000000');

    const [step, setStep] = useState(0); // 0 scan · 1 code · 2 recovery · 3 done
    const [digits, setDigits] = useState(['', '', '', '', '', '']);
    const [err, setErr] = useState(false);
    const [copied, setCopied] = useState(null); // 'secret' | 'codes'
    const boxes = useRef([]);

    const copy = (text, which) => {
      if (navigator.clipboard) navigator.clipboard.writeText(text);
      setCopied(which);
      setTimeout(() => setCopied(null), 1600);
    };

    const setDigit = (i, raw) => {
      const v = raw.replace(/\D/g, '');
      setErr(false);
      if (v.length > 1) { // paste path
        const arr = v.slice(0, 6).split('');
        while (arr.length < 6) arr.push('');
        setDigits(arr);
        const last = Math.min(v.length, 6) - 1;
        if (boxes.current[last]) boxes.current[last].focus();
        return;
      }
      setDigits((d) => { const n = d.slice(); n[i] = v; return n; });
      if (v && i < 5 && boxes.current[i + 1]) boxes.current[i + 1].focus();
    };
    const onKey = (i, e) => {
      if (e.key === 'Backspace' && !digits[i] && i > 0 && boxes.current[i - 1]) boxes.current[i - 1].focus();
    };

    const code = digits.join('');
    const tryVerify = () => {
      if (code.length < 6) return;
      if (verify(code)) { setStep(2); setErr(false); }
      else { setErr(true); setDigits(['', '', '', '', '', '']); if (boxes.current[0]) boxes.current[0].focus(); }
    };

    const download = () => {
      const blob = new Blob([issuer + ' recovery codes — ' + account + '\n\n' + codes.join('\n') + '\n'], { type: 'text/plain' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'omada-recovery-codes.txt';
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    };

    const uri = 'otpauth://totp/' + encodeURIComponent(issuer) + ':' + encodeURIComponent(account)
      + '?secret=' + secret + '&issuer=' + encodeURIComponent(issuer);

    return (
      <div className={'omada-tfa' + (props.className ? ' ' + props.className : '')}>
        {step < 3 && (
          <Steps
            size="small"
            current={step}
            className="omada-tfa-steps"
            items={[{ title: t('tfa.step1') }, { title: t('tfa.step2') }, { title: t('tfa.step3') }]}
          />
        )}

        {step === 0 && (
          <div className="omada-tfa-body is-scan">
            <div className="omada-tfa-qr">
              <QRCode value={uri} size={148} bordered={false}
                      color={mode === 'dark' ? '#E8E8E8' : '#2B2B2B'}
                      bgColor="transparent" />
            </div>
            <div className="omada-tfa-scantxt">
              <p className="omada-tfa-help">{t('tfa.scanhelp')}</p>
              <p className="omada-tfa-cantscan">{t('tfa.cantscan')}</p>
              <span className="omada-tfa-secret">
                <code>{secret.replace(/(.{4})/g, '$1 ').trim()}</code>
                <Button size="small" type="text"
                        icon={<Icon name={copied === 'secret' ? 'check' : 'copy'} size={13} />}
                        onClick={() => copy(secret, 'secret')}>
                  {copied === 'secret' ? t('tfa.copied') : t('tfa.copy')}
                </Button>
              </span>
              <div className="omada-tfa-nav">
                <Button type="primary" onClick={() => setStep(1)}>{t('tfa.continue')}</Button>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="omada-tfa-body is-code">
            <p className="omada-tfa-help">{t('tfa.enterhelp')}</p>
            <div className={'omada-tfa-boxes' + (err ? ' is-error' : '')}>
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => { boxes.current[i] = el; }}
                  className="omada-tfa-box"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={d}
                  aria-label={t('tfa.step2') + ' ' + (i + 1) + '/6'}
                  onChange={(e) => setDigit(i, e.target.value)}
                  onKeyDown={(e) => onKey(i, e)}
                />
              ))}
            </div>
            {err && <p className="omada-tfa-err"><Icon name="warning" size={12} />{t('tfa.invalid')}</p>}
            <div className="omada-tfa-nav">
              <Button onClick={() => { setStep(0); setErr(false); }}>{t('tfa.back')}</Button>
              <Button type="primary" disabled={code.length < 6} onClick={tryVerify}>{t('tfa.verify')}</Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="omada-tfa-body is-recovery">
            <p className="omada-tfa-help">{t('tfa.recoveryhelp')}</p>
            <div className="omada-tfa-codes">
              {codes.map((c) => <code key={c} className="omada-tfa-code">{c}</code>)}
            </div>
            <div className="omada-tfa-nav">
              <Button size="small" type="text"
                      icon={<Icon name={copied === 'codes' ? 'check' : 'copy'} size={13} />}
                      onClick={() => copy(codes.join('\n'), 'codes')}>
                {copied === 'codes' ? t('tfa.copied') : t('tfa.copyall')}
              </Button>
              <Button size="small" type="text" icon={<Icon name="download" size={13} />} onClick={download}>
                {t('tfa.download')}
              </Button>
              <span className="omada-tfa-spacer" />
              <Button type="primary" onClick={() => setStep(3)}>{t('tfa.done')}</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="omada-tfa-body is-done">
            <span className="omada-tfa-doneicon"><Icon name="shield" size={26} /></span>
            <div className="omada-tfa-donetxt">
              <span className="omada-tfa-donetitle">{t('tfa.enabled')}</span>
              <span className="omada-tfa-donesub">{t('tfa.enabledsub')}</span>
              <span className="omada-tfa-account"><Icon name="user" size={12} />{account}</span>
            </div>
            <Button onClick={() => {
              setStep(0); setDigits(['', '', '', '', '', '']);
              if (props.onDone) props.onDone();
            }}>{t('tfa.done')}</Button>
          </div>
        )}
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.TwoFactorSetup = OmadaTwoFactorSetup;
})();
