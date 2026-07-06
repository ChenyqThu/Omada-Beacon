/* Omada login — split-screen, teal art on the left, white form on the right. */

function LoginScreen({ onSignIn }) {
  const [email, setEmail] = useState('admin@nyc.omada');
  const [pwd, setPwd] = useState('••••••••');
  const [remember, setRemember] = useState(true);
  useLucide();

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr 1fr',
      width: '100%', height: '100%', background: '#fff'
    }}>
      {/* Brand side */}
      <div style={{
        background: 'linear-gradient(135deg, #0A5A5A 0%, #0E8C8C 100%)',
        color: '#fff', padding: '60px 56px',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        position: 'relative', overflow: 'hidden'
      }}>
        {/* Soft brand-mark decoration */}
        <img src="../../assets/omada-mark.svg"
          style={{
            position: 'absolute', right: -120, top: -100, width: 520, opacity: 0.05
          }} alt=""/>
        <OmadaWordmark dark height={32}/>
        <div>
          <div style={{ fontSize: 30, fontWeight: 700, lineHeight: 1.15, marginBottom: 14, letterSpacing: '-0.01em' }}>
            One platform.<br/>Every device.
          </div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.78)', maxWidth: 380, lineHeight: 1.6 }}>
            Manage your entire Omada network — gateways, switches, access points and VIGI cameras — from a single browser tab.
          </div>
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>
          © 2026 TP-Link Corporation Limited.  Omada is a trademark of TP-Link.
        </div>
      </div>

      {/* Form side */}
      <div style={{
        padding: '60px 80px',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 24
      }}>
        <div>
          <div style={{ fontSize: 13, color: 'var(--fg-tertiary)', marginBottom: 6 }}>Cloud-Based System</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--fg-primary)', letterSpacing: '-0.02em' }}>
            Sign in
          </div>
        </div>

        <Field label="TP-Link ID / Email">
          <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
        </Field>
        <Field label="Password">
          <input className="input" type="text" value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="••••••••" />
        </Field>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--fg-secondary)' }}>
            <Switch on={remember} onChange={setRemember}/>
            Remember me on this device
          </label>
          <a className="t-link" style={{ fontSize: 13 }}>Forgot password?</a>
        </div>

        <Button variant="primary" onClick={onSignIn} style={{ width: '100%', height: 42, justifyContent: 'center', fontSize: 15 }}>
          Sign In
        </Button>

        <div style={{
          textAlign: 'center', color: 'var(--fg-tertiary)', fontSize: 13, marginTop: 4
        }}>
          New to Omada? <a className="t-link">Create an account →</a>
        </div>

        <div style={{
          marginTop: 'auto', display: 'flex', justifyContent: 'center', gap: 18,
          fontSize: 12, color: 'var(--fg-tertiary)'
        }}>
          <a>Privacy</a><span>·</span><a>Terms</a><span>·</span><a>English</a>
        </div>
      </div>
    </div>
  );
}

window.LoginScreen = LoginScreen;
