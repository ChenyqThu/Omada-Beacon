/* ────────────────────────────────────────────────────────────────────────
   components/LicenseCard/LicenseCard.jsx — OmadaLicenseCard

   A SEAT/TERM license tile. One card = one license: edition name,
   activation state pill, seat usage meter, term dates with a days-left
   chip, masked license key with reveal + copy, and a state-appropriate
   CTA (Activate · Renew · Manage).

   States (derived from `license.status` or computed from `end`):
     active     — quiet pill, Manage text CTA
     expiring   — warning pill + days-left chip, primary Renew CTA
     expired    — red pill, primary (danger) Renew CTA
     inactive   — neutral pill, primary Activate CTA

   Distinct from UsageMeter (Batch 24 — a generic threshold meter):
   this is a commerce/entitlement tile where the meter is one row among
   term, key and CTA.

     · `license` — { name, edition, seatsUsed, seatsTotal, start, end,
                     status?, key }
     · `onRenew()` / `onActivate()` / `onManage()`

   Token-driven, dark twin, i18n, RTL-safe (key/dates LTR).
   Figma: no dedicated node this session (VFS permission pending) —
   tile anatomy follows Card tokens; pills follow Tag.
   Exports: window.Omada.LicenseCard
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const Icon = window.Omada.Icon;
  const { Button, Tooltip } = window.antd;

  const DAY = 86400000;

  function OmadaLicenseCard(props) {
    const { useState } = React;
    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;
    const lang = ctx ? ctx.lang : 'en';

    const lic = props.license || {};
    const now = Date.now();
    const end = lic.end ? new Date(lic.end).getTime() : null;
    const daysLeft = end == null ? null : Math.ceil((end - now) / DAY);

    let status = lic.status;
    if (!status) {
      if (end == null) status = 'inactive';
      else if (daysLeft <= 0) status = 'expired';
      else if (daysLeft <= 30) status = 'expiring';
      else status = 'active';
    }

    const [revealed, setRevealed] = useState(false);
    const [copied, setCopied] = useState(false);
    const copyKey = () => {
      if (navigator.clipboard && lic.key) navigator.clipboard.writeText(lic.key);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    };
    const maskKey = (k) => {
      if (!k) return '—';
      if (revealed) return k;
      const parts = k.split('-');
      return parts.map((p, i) => (i < parts.length - 1 ? '••••' : p)).join('-');
    };

    const fmtDate = (d) => (d == null ? '—' :
      new Date(d).toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' }));

    const used = lic.seatsUsed || 0;
    const total = lic.seatsTotal || 0;
    const pct = total > 0 ? Math.min(100, Math.round((used / total) * 100)) : 0;

    const inactive = status === 'inactive';

    return (
      <div className={'omada-lic is-' + status + (props.className ? ' ' + props.className : '')}>
        <div className="omada-lic-head">
          <div className="omada-lic-names">
            <span className="omada-lic-name">{lic.name}</span>
            {lic.edition && <span className="omada-lic-edition">{lic.edition}</span>}
          </div>
          <span className={'omada-lic-pill is-' + status}>{t('lic.st.' + status)}</span>
        </div>

        <div className="omada-lic-rows">
          <div className="omada-lic-row">
            <span className="omada-lic-label">{t('lic.seats')}</span>
            <span className="omada-lic-cell">
              {inactive ? <span className="omada-lic-dim">—</span> : (
                <React.Fragment>
                  <span className="omada-lic-seatmeter" aria-hidden="true">
                    <span className={'omada-lic-seatfill' + (pct >= 90 ? ' is-hot' : '')} style={{ width: pct + '%' }} />
                  </span>
                  <span className="omada-lic-seattxt">
                    {t('lic.of').replace('{a}', used).replace('{b}', total)}
                  </span>
                </React.Fragment>
              )}
            </span>
          </div>
          <div className="omada-lic-row">
            <span className="omada-lic-label">{t('lic.term')}</span>
            <span className="omada-lic-cell">
              {inactive ? <span className="omada-lic-dim">—</span> : (
                <React.Fragment>
                  <span className="omada-lic-dates">{fmtDate(lic.start)} – {fmtDate(lic.end)}</span>
                  {status === 'expiring' && daysLeft != null && (
                    <span className="omada-lic-chip is-expiring"><Icon name="clock" size={11} />{t('lic.daysleft').replace('{n}', daysLeft)}</span>
                  )}
                  {status === 'expired' && (
                    <span className="omada-lic-chip is-expired"><Icon name="warning" size={11} />{t('lic.st.expired')}</span>
                  )}
                </React.Fragment>
              )}
            </span>
          </div>
          <div className="omada-lic-row">
            <span className="omada-lic-label">{t('lic.key')}</span>
            <span className="omada-lic-cell">
              <code className="omada-lic-key">{maskKey(lic.key)}</code>
              <Tooltip title={revealed ? t('lic.hide') : t('lic.reveal')}>
                <Button size="small" type="text" aria-label={revealed ? t('lic.hide') : t('lic.reveal')}
                        icon={<Icon name={revealed ? 'eye-off' : 'eye'} size={13} />}
                        onClick={() => setRevealed(!revealed)} />
              </Tooltip>
              <Tooltip title={copied ? t('tfa.copied') : t('tfa.copy')}>
                <Button size="small" type="text" aria-label={t('tfa.copy')}
                        icon={<Icon name={copied ? 'check' : 'copy'} size={13} />} onClick={copyKey} />
              </Tooltip>
            </span>
          </div>
        </div>

        <div className="omada-lic-foot">
          {status === 'inactive' && (
            <Button type="primary" onClick={props.onActivate}>{t('lic.activate')}</Button>
          )}
          {(status === 'expiring' || status === 'expired') && (
            <Button type="primary" danger={status === 'expired'} onClick={props.onRenew}>{t('lic.renew')}</Button>
          )}
          {status === 'active' && (
            <Button onClick={props.onManage}>{t('lic.manage')}</Button>
          )}
        </div>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.LicenseCard = OmadaLicenseCard;
})();
