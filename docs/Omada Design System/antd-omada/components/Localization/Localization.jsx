/* ────────────────────────────────────────────────────────────────────────
   components/Localization/Localization.jsx — OmadaLocalization

   An i18n / LOCALIZATION board — the internationalization counterpart to the
   RTL demo and the Content board. It stress-tests the three things that break
   when a UI meets a second language:

     1. String expansion — the SAME label drawn in EN / 中文 / Deutsch so the
        ~35% German growth and shorter CJK are visible. Chips size to content
        (min-width), proving you must never fix a control to its English label.
     2. Bidirectional & CJK — one label:value row rendered LTR and again inside
        a direction="rtl" ConfigProvider, so icon side, alignment and padding
        mirror through antd, not bespoke CSS.
     3. Number / date / currency — one instant and one number formatted per
        locale with the real Intl APIs: ISO 8601 (numeric, 24h), the EU order,
        the US 12-hour clock and the Chinese 年月日 form. Values are computed
        live, so they are authoritative rather than transcribed.

   NOT a primitive — a spec board composing Intl + antd ConfigProvider + the
   Omada Input/Icon wrappers. Surfaces are theme vars with dark twins.

   Figma: the date-format rules are the Chart 国际化 note (node Axes, page
   Chart) — ISO 8601 numeric/24h, EU DD/MM, US 12h+AM/PM, CN 年月日, pad single
   digits. Original synthesis.
   Exports: window.Omada.Localization
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const OmadaIcon = window.OmadaIcon;

  // fixed reference instant + values (UTC so the table is deterministic)
  const REF = new Date(Date.UTC(2025, 2, 12, 12, 22, 0)); // 2025-03-12 12:22
  const NUM = 1250.5;
  const RATE = 942.7;

  function pad(n) { return String(n).padStart(2, '0'); }
  function iso(d) {
    return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate())
      + ' ' + pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes());
  }
  function fmtDate(loc) {
    try {
      return new Intl.DateTimeFormat(loc, {
        year: 'numeric', month: loc === 'zh-CN' ? 'long' : 'short', day: 'numeric',
        hour: 'numeric', minute: '2-digit', hour12: loc === 'en-US', timeZone: 'UTC',
      }).format(REF);
    } catch (e) { return iso(REF); }
  }
  function fmtNum(loc, v) {
    try { return new Intl.NumberFormat(loc).format(v); } catch (e) { return String(v); }
  }

  // three-language expansion specimens (DE included as the long-string stress;
  // not a supported app language, so it lives here as a specimen only)
  const EXPAND = [
    { en: 'Add device',             zh: '添加设备', de: 'Gerät hinzufügen' },
    { en: 'Maintenance window',     zh: '维护窗口', de: 'Wartungsfenster' },
    { en: 'Adopt selected devices', zh: '接入所选设备', de: 'Ausgewählte Geräte übernehmen' },
  ];
  const LANGCOLS = [
    { key: 'en', name: 'EN' },
    { key: 'zh', name: '中文' },
    { key: 'de', name: 'Deutsch' },
  ];

  const ROWS = [
    { tag: 'ISO 8601', loc: null,     date: iso(REF),        head: true },
    { tag: 'en-US',    loc: 'en-US' },
    { tag: 'en-GB',    loc: 'en-GB' },
    { tag: 'de-DE',    loc: 'de-DE' },
    { tag: 'zh-CN',    loc: 'zh-CN' },
  ];

  function BidiPanel(props) {
    const dir = props.dir, t = props.t, ConfigProvider = props.ConfigProvider, Input = props.Input;
    return (
      <ConfigProvider direction={dir}>
        <div className="omada-l10n-bidi-panel" dir={dir}>
          <div className="omada-l10n-bidi-tag">{dir === 'rtl' ? t('l10n.rtl') : t('l10n.ltr')}</div>
          <div className="omada-l10n-bidi-field">
            <span className="omada-l10n-bidi-label">
              <OmadaIcon name="globe" size={15} /> {t('l10n.bidiLabel')}
            </span>
            <Input defaultValue={t('l10n.bidiValue')} style={{ maxWidth: 200 }}
                   prefix={<OmadaIcon name="map" size={14} />} />
          </div>
        </div>
      </ConfigProvider>
    );
  }

  function OmadaLocalization(props) {
    const className = props.className || '';
    const rest = Object.assign({}, props);
    delete rest.className;

    const ctx = window.useOmada ? window.useOmada() : { t: (k) => k, lang: 'en' };
    const t = ctx.t;
    const { ConfigProvider } = window.antd;
    const Input = window.Omada.Input;

    return (
      <div className={('omada-l10n ' + className).trim()} {...rest}>

        {/* ── string expansion ── */}
        <div className="omada-l10n-sub">{t('l10n.expansion')}</div>
        <div className="omada-l10n-desc">{t('l10n.expansionDesc')}</div>
        <div className="omada-l10n-expand">
          <div className="omada-l10n-expand-head">
            {LANGCOLS.map((c) => <div key={c.key} className="omada-l10n-expand-h">{c.name}</div>)}
          </div>
          {EXPAND.map((row, i) => (
            <div key={i} className="omada-l10n-expand-row">
              {LANGCOLS.map((c) => (
                <div key={c.key} className="omada-l10n-expand-cell">
                  <span className="omada-l10n-chip">{row[c.key]}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* ── bidirectional & CJK ── */}
        <div className="omada-l10n-sub">{t('l10n.bidi')}</div>
        <div className="omada-l10n-desc">{t('l10n.bidiDesc')}</div>
        <div className="omada-l10n-bidi">
          <BidiPanel dir="ltr" t={t} ConfigProvider={ConfigProvider} Input={Input} />
          <BidiPanel dir="rtl" t={t} ConfigProvider={ConfigProvider} Input={Input} />
        </div>

        {/* ── number / date / currency ── */}
        <div className="omada-l10n-sub">{t('l10n.format')}</div>
        <div className="omada-l10n-desc">{t('l10n.formatDesc')}</div>
        <div className="omada-l10n-table" role="table">
          <div className="omada-l10n-trow is-head" role="row">
            <div className="omada-l10n-tc is-loc" role="columnheader">{t('l10n.col.locale')}</div>
            <div className="omada-l10n-tc" role="columnheader">{t('l10n.col.date')}</div>
            <div className="omada-l10n-tc is-num" role="columnheader">{t('l10n.col.number')}</div>
            <div className="omada-l10n-tc is-num" role="columnheader">{t('l10n.col.rate')}</div>
          </div>
          {ROWS.map((r) => (
            <div key={r.tag} className={'omada-l10n-trow' + (r.head ? ' is-iso' : '')} role="row">
              <div className="omada-l10n-tc is-loc" role="cell"><code>{r.tag}</code></div>
              <div className="omada-l10n-tc" role="cell">{r.loc ? fmtDate(r.loc) : r.date}</div>
              <div className="omada-l10n-tc is-num" role="cell">{r.loc ? fmtNum(r.loc, NUM) : NUM.toFixed(1)}</div>
              <div className="omada-l10n-tc is-num" role="cell">{(r.loc ? fmtNum(r.loc, RATE) : RATE.toFixed(1)) + ' Mbps'}</div>
            </div>
          ))}
        </div>

        <div className="omada-l10n-note">{t('l10n.note')}</div>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.Localization = OmadaLocalization;
})();
