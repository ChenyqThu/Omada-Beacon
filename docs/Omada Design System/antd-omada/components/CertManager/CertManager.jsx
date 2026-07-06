/* ────────────────────────────────────────────────────────────────────────
   components/CertManager/CertManager.jsx — OmadaCertManager

   A CONTROLLER CERTIFICATE inventory: rows show name + CN (mono),
   issuer, a type chip (server / CA / client), expiry date with a
   derived status chip — valid (> 30 d), "expires in {d} d" (≤ 30 d,
   warning) or expired (error) — plus a SHA-256 fingerprint with copy.
   Expiring/expired rows get a per-row RENEW action (renewing… spinner →
   +1 year); the header UPLOAD action stubs an import that prepends a
   fresh row tagged "Imported just now".

   Distinct from LicenseCard (Batch 26 — one entitlement with seats):
   this is a multi-row PKI inventory keyed on expiry windows.

   Token-driven, dark twin, i18n. Fingerprints render LTR in RTL.
   Figma: icon SYMBOLs 25947:12688 ("certificate-authority") and
   25947:10070 ("证书") — no full frame; rows follow Table/Tag tokens.
   Exports: window.Omada.CertManager
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { Button, Tooltip } = window.antd;
  const DAY = 86400000;

  function OmadaCertManager(props) {
    const { useState } = React;
    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;
    const lang = ctx ? ctx.lang : 'en';
    const locale = lang === 'zh' ? 'zh-CN' : 'en-US';

    const [certs, setCerts] = useState(function () { return props.defaultCerts || []; });
    const [renewing, setRenewing] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [copied, setCopied] = useState(null);

    function statusOf(c) {
      const days = Math.floor((new Date(c.expires).getTime() - Date.now()) / DAY);
      if (days < 0) return { key: 'expired', days: days };
      if (days <= 30) return { key: 'expiring', days: days };
      return { key: 'valid', days: days };
    }

    function renew(id) {
      setRenewing(id);
      window.setTimeout(function () {
        setCerts(function (prev) {
          return prev.map(function (c) {
            if (c.id !== id) return c;
            const base = Math.max(Date.now(), new Date(c.expires).getTime());
            return Object.assign({}, c, { expires: new Date(base + 365 * DAY).toISOString(), fresh: false });
          });
        });
        setRenewing(null);
        if (props.onRenew) props.onRenew(id);
      }, 1200);
    }

    function upload() {
      if (uploading) return;
      setUploading(true);
      window.setTimeout(function () {
        setCerts(function (prev) {
          return [{
            id: 'c' + Date.now(),
            name: 'gateway.acme.local.pem',
            cn: 'gateway.acme.local',
            issuer: 'ACME Internal CA',
            type: 'server',
            expires: new Date(Date.now() + 397 * DAY).toISOString(),
            fp: 'B4:1F:09:7C:2E:55:D0:8A:91:36:AF:6B:0D:C2:78:E3',
            fresh: true,
          }].concat(prev);
        });
        setUploading(false);
        if (props.onUpload) props.onUpload();
      }, 1000);
    }

    function copyFp(c) {
      if (navigator.clipboard) navigator.clipboard.writeText(c.fp);
      setCopied(c.id);
      window.setTimeout(function () { setCopied(null); }, 1600);
    }

    return (
      <div className={'omada-cert' + (props.className ? ' ' + props.className : '')}>
        <div className="omada-cert-head">
          <span className="omada-cert-count">{certs.length}</span>
          <Button size="small" loading={uploading} onClick={upload}
                  icon={<window.OmadaIcon name="upload" size={13} />}>
            {t('cert.upload')}
          </Button>
        </div>
        <ul className="omada-cert-list">
          {certs.map(function (c) {
            const st = statusOf(c);
            return (
              <li key={c.id} className={'omada-cert-row is-' + st.key}>
                <span className="omada-cert-glyph">
                  <window.OmadaIcon name="certificate" size={18} />
                </span>
                <span className="omada-cert-main">
                  <span className="omada-cert-name">
                    {c.name}
                    <span className={'omada-cert-type is-' + c.type}>{t('cert.type.' + c.type)}</span>
                    {c.fresh ? <span className="omada-cert-freshtag">{t('cert.uploaded')}</span> : null}
                  </span>
                  <span className="omada-cert-sub">
                    <span className="omada-cert-cn">{c.cn}</span>
                    <span className="omada-cert-issuer">{t('cert.issuer')}: {c.issuer}</span>
                  </span>
                  <span className="omada-cert-fp">
                    SHA-256 <code>{c.fp}</code>
                    <Tooltip title={copied === c.id ? '✓' : t('cert.copyfp')}>
                      <button type="button" className="omada-cert-copybtn" aria-label={t('cert.copyfp')}
                              onClick={function () { copyFp(c); }}>
                        <window.OmadaIcon name={copied === c.id ? 'check' : 'copy'} size={12} />
                      </button>
                    </Tooltip>
                  </span>
                </span>
                <span className="omada-cert-side">
                  <span className={'omada-cert-status is-' + st.key}>
                    {st.key === 'valid' ? t('cert.status.valid')
                      : st.key === 'expiring' ? t('cert.status.expiring').replace('{d}', st.days)
                      : t('cert.status.expired')}
                  </span>
                  <span className="omada-cert-date">
                    {t('cert.expires')} · {new Date(c.expires).toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                  {st.key !== 'valid' ? (
                    <Button size="small" type="primary" ghost
                            loading={renewing === c.id}
                            onClick={function () { renew(c.id); }}>
                      {renewing === c.id ? t('cert.renewing') : t('cert.renew')}
                    </Button>
                  ) : null}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.CertManager = OmadaCertManager;
})();
