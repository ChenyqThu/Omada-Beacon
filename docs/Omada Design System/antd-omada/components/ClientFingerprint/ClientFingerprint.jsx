/* ────────────────────────────────────────────────────────────────────────
   components/ClientFingerprint/ClientFingerprint.jsx — OmadaClientFingerprint

   A DEVICE-IDENTITY card: what the controller believes a client is and
   HOW SURE it is. Shows the detected OS / vendor / category, the
   fingerprinting method, and a confidence meter (high ≥ 80 · medium ≥ 50
   · low). The category can be OVERRIDDEN via a Select — the card then
   flags "Manually set" with one-click reset to auto.

     · `client`     — { name, mac, os, vendor, category, confidence 0–100,
                        method: 'dhcp'|'ua'|'mdns' }
     · `override`   — category key when manually set (controlled), or null.
     · `onOverride(categoryKey | null)` — null = reset to auto.

   Category keys: laptop · phone · camera · printer · iot · unknown
   (each maps to an OmadaIcon glyph).

   Distinct from Descriptions (generic field list): this is an identity
   surface with a trust meter + correction affordance.
   Token-driven, dark twin, i18n, RTL-safe (MAC stays LTR).
   Figma: no dedicated node this session (VFS permission pending) —
   card anatomy follows Card / Descriptions tokens.
   Exports: window.Omada.ClientFingerprint
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const Icon = window.Omada.Icon;
  const { Select, Button } = window.antd;

  const CAT_ICON = {
    laptop: 'laptop', phone: 'smartphone', camera: 'camera',
    printer: 'printer', iot: 'cloud', unknown: 'help-circle',
  };
  const CATS = ['laptop', 'phone', 'camera', 'printer', 'iot', 'unknown'];

  function confLevel(c) { return c >= 80 ? 'high' : c >= 50 ? 'med' : 'low'; }

  function OmadaClientFingerprint(props) {
    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;

    const c = props.client || {};
    const overridden = props.override != null;
    const cat = overridden ? props.override : (c.category || 'unknown');
    const conf = Math.max(0, Math.min(100, c.confidence == null ? 0 : c.confidence));
    const level = confLevel(conf);

    return (
      <div className={'omada-cfp' + (props.className ? ' ' + props.className : '')}>
        <div className="omada-cfp-head">
          <span className={'omada-cfp-tile is-' + level}><Icon name={CAT_ICON[cat] || 'help-circle'} size={22} /></span>
          <div className="omada-cfp-id">
            <span className="omada-cfp-name">{c.name}</span>
            <span className="omada-cfp-mac">{c.mac}</span>
          </div>
          {overridden
            ? <span className="omada-cfp-flag is-manual"><Icon name="edit" size={11} />{t('cfp.overridden')}</span>
            : <span className="omada-cfp-flag"><Icon name="fingerprint" size={11} />{t('cfp.auto')}</span>}
        </div>

        <dl className="omada-cfp-fields">
          <div className="omada-cfp-field">
            <dt>{t('cfp.os')}</dt>
            <dd>{c.os || '—'}</dd>
          </div>
          <div className="omada-cfp-field">
            <dt>{t('cfp.vendor')}</dt>
            <dd>{c.vendor || '—'}</dd>
          </div>
          <div className="omada-cfp-field">
            <dt>{t('cfp.category')}</dt>
            <dd className="omada-cfp-catcell">
              <Icon name={CAT_ICON[cat] || 'help-circle'} size={13} />
              {t('cfp.cat.' + cat)}
            </dd>
          </div>
          <div className="omada-cfp-field">
            <dt>{t('cfp.confidence')}</dt>
            <dd className="omada-cfp-confcell">
              <span className="omada-cfp-confbar" role="img"
                    aria-label={t('cfp.confidence') + ' ' + conf + '%'}>
                <span className={'omada-cfp-conffill is-' + level} style={{ width: conf + '%' }} />
              </span>
              <span className={'omada-cfp-confpct is-' + level}>{conf}%</span>
              <span className="omada-cfp-conflevel">{t('cfp.conf.' + level)}</span>
            </dd>
          </div>
        </dl>

        <div className="omada-cfp-foot">
          <span className="omada-cfp-via">
            <Icon name="fingerprint" size={12} />
            {t('cfp.via.' + (c.method || 'dhcp'))}
          </span>
          <span className="omada-cfp-actions">
            {overridden && (
              <Button size="small" type="text" onClick={() => { if (props.onOverride) props.onOverride(null); }}>
                {t('cfp.reset')}
              </Button>
            )}
            <Select
              size="small"
              value={overridden ? cat : undefined}
              placeholder={t('cfp.override')}
              popupMatchSelectWidth={false}
              onChange={(v) => { if (props.onOverride) props.onOverride(v); }}
              options={CATS.map((k) => ({ value: k, label: t('cfp.cat.' + k) }))}
              style={{ minWidth: 132 }}
            />
          </span>
        </div>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.ClientFingerprint = OmadaClientFingerprint;
})();
