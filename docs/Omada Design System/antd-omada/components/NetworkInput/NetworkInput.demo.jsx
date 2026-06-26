/* components/NetworkInput/NetworkInput.demo.jsx — window.OmadaDemos.NetworkInput */
(function () {
  const { IpInput, MacInput } = window.Omada;

  function Field({ label, error, children }) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontSize: 13, color: 'var(--fg-primary)' }}>{label}</span>
        {children}
        {error && <span style={{ fontSize: 12, color: 'var(--omada-red, #EE385C)' }}>{error}</span>}
      </div>
    );
  }

  function NetworkInputDemo() {
    const { t } = window.useOmada();
    const [ip, setIp] = React.useState('192.168.0.1');
    const [mac, setMac] = React.useState('');

    return (
      <>
        <div className="row"><span className="label">ip · default / done</span></div>
        <div className="grid-2" style={{ maxWidth: 720, alignItems: 'start' }}>
          <Field label={t('net.ipAddress')}>
            <IpInput value={ip} onChange={(v) => setIp(v)} />
          </Field>
          <Field label={t('net.ipAddress')}>
            <IpInput defaultValue="10.0.12.254" />
          </Field>
        </div>

        <div className="row" style={{ marginTop: 20 }}><span className="label">ip · error / disabled</span></div>
        <div className="grid-2" style={{ maxWidth: 720, alignItems: 'start' }}>
          <Field label={t('net.ipAddress')} error={t('valid.ip')}>
            <IpInput defaultValue="300.1.1.1" status="error" />
          </Field>
          <Field label={t('net.ipAddress')}>
            <IpInput defaultValue="192.168.1.1" disabled />
          </Field>
        </div>

        <div className="row" style={{ marginTop: 24 }}><span className="label">mac · default / done</span></div>
        <div className="grid-2" style={{ maxWidth: 720, alignItems: 'start' }}>
          <Field label={t('net.macAddress')}>
            <MacInput value={mac} onChange={(v) => setMac(v)} />
          </Field>
          <Field label={t('net.macAddress')}>
            <MacInput defaultValue="AC-84-C6-1B-2E-90" />
          </Field>
        </div>

        <div className="row" style={{ marginTop: 20 }}><span className="label">mac · error / disabled</span></div>
        <div className="grid-2" style={{ maxWidth: 720, alignItems: 'start' }}>
          <Field label={t('net.macAddress')} error={t('net.invalidMac')}>
            <MacInput defaultValue="ZZ-84-C6-1B-2E-90" status="error" />
          </Field>
          <Field label={t('net.macAddress')}>
            <MacInput defaultValue="AC-84-C6-1B-2E-90" disabled />
          </Field>
        </div>
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.NetworkInput = NetworkInputDemo;
})();
