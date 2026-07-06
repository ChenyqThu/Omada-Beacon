/* ────────────────────────────────────────────────────────────────────────
   components/RadiusProfileForm/RadiusProfileForm.jsx — OmadaRadiusProfileForm

   A RADIUS PROFILE form cluster: profile name, authentication server +
   port (1812) + shared secret (password reveal), an accounting Switch
   that expands a server/port (1813) pair, and a TEST CONNECTION action
   with an idle → testing → reachable (round-trip ms) / no-response
   state pill. The default test is a deterministic simulation (fails on
   empty server/secret or a server ending in ".0"); pass `onTest` to
   supply a real probe returning `Promise<{ ok, ms }>`.

   Distinct from FormPatterns (Batch 16 — layout spec board): this is a
   purpose-built settings cluster with an async verify affordance.

   Token-driven, dark twin, i18n. IP/port fields render LTR in RTL.
   Figma: no dedicated frame — field anatomy follows Form/Input tokens.
   Exports: window.Omada.RadiusProfileForm
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { Input, InputNumber, Switch, Button } = window.antd;

  function OmadaRadiusProfileForm(props) {
    const { useState } = React;
    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;

    const [name, setName] = useState(props.defaultName || '');
    const [server, setServer] = useState(props.defaultServer || '');
    const [port, setPort] = useState(props.defaultPort || 1812);
    const [secret, setSecret] = useState(props.defaultSecret || '');
    const [acct, setAcct] = useState(!!props.defaultAccounting);
    const [acctServer, setAcctServer] = useState(props.defaultAcctServer || '');
    const [acctPort, setAcctPort] = useState(props.defaultAcctPort || 1813);
    const [test, setTest] = useState({ state: 'idle' }); // idle | testing | ok | fail

    function runTest() {
      if (test.state === 'testing') return;
      setTest({ state: 'testing' });
      const probe = props.onTest
        ? props.onTest({ server: server, port: port, secret: secret })
        : new Promise(function (resolve) {
            window.setTimeout(function () {
              const fail = !server || !secret || /\.0$/.test(server);
              resolve(fail ? { ok: false } : { ok: true, ms: 12 + ((server.length * 7) % 26) });
            }, 1300);
          });
      probe.then(function (r) {
        setTest(r && r.ok ? { state: 'ok', ms: r.ms } : { state: 'fail' });
      });
    }

    const field = function (label, control) {
      return (
        <label className="omada-radius-field">
          <span className="omada-radius-label">{label}</span>
          {control}
        </label>
      );
    };

    return (
      <div className={'omada-radius' + (props.className ? ' ' + props.className : '')}>
        <div className="omada-radius-grid">
          {field(t('radius.profile'),
            <Input value={name} onChange={function (e) { setName(e.target.value); }} placeholder="corp-wifi" />)}
          <span />
          {field(t('radius.server'),
            <Input className="omada-radius-mono" value={server}
                   onChange={function (e) { setServer(e.target.value); setTest({ state: 'idle' }); }}
                   placeholder="10.0.8.21" />)}
          {field(t('radius.port'),
            <InputNumber className="omada-radius-mono" min={1} max={65535} value={port}
                         onChange={function (v) { setPort(v); }} style={{ width: '100%' }} />)}
          {field(t('radius.secret'),
            <Input.Password className="omada-radius-mono" value={secret}
                            onChange={function (e) { setSecret(e.target.value); setTest({ state: 'idle' }); }}
                            placeholder="••••••••" />)}
          <span />
        </div>

        <div className="omada-radius-acctrow">
          <Switch size="small" checked={acct} onChange={setAcct} />
          <span className="omada-radius-acctlabel">{t('radius.acct')}</span>
        </div>
        {acct ? (
          <div className="omada-radius-grid">
            {field(t('radius.acctserver'),
              <Input className="omada-radius-mono" value={acctServer}
                     onChange={function (e) { setAcctServer(e.target.value); }} placeholder="10.0.8.21" />)}
            {field(t('radius.acctport'),
              <InputNumber className="omada-radius-mono" min={1} max={65535} value={acctPort}
                           onChange={function (v) { setAcctPort(v); }} style={{ width: '100%' }} />)}
          </div>
        ) : null}

        <div className="omada-radius-foot">
          <Button onClick={runTest} loading={test.state === 'testing'}
                  icon={<window.OmadaIcon name="server" size={14} />}>
            {test.state === 'testing' ? t('radius.testing') : t('radius.test')}
          </Button>
          {test.state === 'ok' ? (
            <span className="omada-radius-result is-ok">
              <window.OmadaIcon name="check-circle" size={14} />
              {t('radius.ok').replace('{ms}', test.ms)}
            </span>
          ) : null}
          {test.state === 'fail' ? (
            <span className="omada-radius-result is-fail">
              <window.OmadaIcon name="warning" size={14} />
              {t('radius.fail')}
            </span>
          ) : null}
        </div>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.RadiusProfileForm = OmadaRadiusProfileForm;
})();
