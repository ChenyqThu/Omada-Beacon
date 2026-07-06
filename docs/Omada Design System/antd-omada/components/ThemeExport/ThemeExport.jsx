/* ────────────────────────────────────────────────────────────────────────
   components/ThemeExport/ThemeExport.jsx — OmadaThemeExport

   A TOKEN-EXPORT / DIFF board — the "hand the theme to engineering" companion
   to ColorTokens / ChartTokens / Theming. It reads the REAL config objects
   (window.omadaThemeLight / omadaThemeDark via getOmadaTheme) so what it shows
   and copies can never drift from what ConfigProvider actually applies.

   Two views (Segmented):
     1. Diff — a curated set of seed tokens grouped (brand / semantic / text /
        surface / border / radius+motion), each row showing the LIGHT value and
        the DARK value side by side with a colour swatch; rows whose value
        changes between modes get a "differs" marker, so the light↔dark
        contract is auditable at a glance. Click any value to copy it.
     2. JSON — the active mode's full token block pretty-printed and copyable in
        one click (the exact object you'd paste into a real `theme={{ token }}`).

   No new colour — swatches are the token values themselves; chrome is theme-var
   driven with dark twins in omada-overrides.css.

   Figma: no node — a token-architecture board over omada-theme.js (the same
   source the whole library themes from).
   Exports: window.Omada.ThemeExport
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { useState, useMemo } = React;
  const { Segmented } = window.antd;
  const Icon = window.Omada.Icon;

  const isColor = (v) => typeof v === 'string' && (/^#|rgb|rgba|hsl/.test(v));

  // curated token rows by group — keys read off the real config objects
  const GROUPS = [
    { key: 'teg.brand', tokens: ['colorPrimary', 'colorPrimaryHover', 'colorPrimaryActive', 'colorPrimaryBg', 'colorPrimaryText'] },
    { key: 'teg.semantic', tokens: ['colorSuccess', 'colorWarning', 'colorError', 'colorInfo'] },
    { key: 'teg.text', tokens: ['colorText', 'colorTextSecondary', 'colorTextTertiary', 'colorTextPlaceholder'] },
    { key: 'teg.surface', tokens: ['colorBgBase', 'colorBgContainer', 'colorBgElevated', 'colorBgLayout', 'colorBgSpotlight'] },
    { key: 'teg.border', tokens: ['colorBorder', 'colorBorderSecondary', 'boxShadow'] },
    { key: 'teg.shape', tokens: ['borderRadius', 'borderRadiusLG', 'borderRadiusSM', 'controlHeight', 'motionDurationMid', 'motionEaseOut'] },
  ];

  function CopyVal(props) {
    const [copied, setCopied] = useState(false);
    const copy = () => {
      try { navigator.clipboard.writeText(String(props.value)); } catch (e) { /* noop */ }
      setCopied(true); setTimeout(() => setCopied(false), 900);
    };
    return (
      <button type="button" className="omada-teg-val" onClick={copy} title={String(props.value)}>
        {isColor(props.value) && <span className="omada-teg-swatch" style={{ background: props.value }} />}
        <code>{copied ? props.copiedLabel : String(props.value)}</code>
      </button>
    );
  }

  function OmadaThemeExport(props) {
    const className = props.className || '';
    const rest = Object.assign({}, props);
    delete rest.className;

    const ctx = window.useOmada();
    const t = ctx.t, mode = ctx.mode;

    const [view, setView] = useState('diff');
    const [jsonCopied, setJsonCopied] = useState(false);

    const light = window.omadaThemeLight.token;
    const dark = window.omadaThemeDark.token;
    const copiedLabel = t('teg.copied');

    const activeToken = mode === 'dark' ? dark : light;
    const jsonText = useMemo(
      () => JSON.stringify({ token: activeToken }, null, 2),
      [activeToken]
    );

    const copyJson = () => {
      try { navigator.clipboard.writeText(jsonText); } catch (e) { /* noop */ }
      setJsonCopied(true); setTimeout(() => setJsonCopied(false), 1100);
    };

    const diffCount = useMemo(() => {
      let n = 0;
      GROUPS.forEach((g) => g.tokens.forEach((k) => { if (String(light[k]) !== String(dark[k])) n++; }));
      return n;
    }, [light, dark]);

    return (
      <div className={('omada-teg ' + className).trim()} {...rest}>

        <div className="omada-teg-bar">
          <Segmented
            value={view}
            onChange={setView}
            options={[
              { value: 'diff', label: <span className="omada-teg-segopt"><Icon name="layers" size={15} />{t('teg.viewDiff')}</span> },
              { value: 'json', label: <span className="omada-teg-segopt"><Icon name="braces" size={15} />{t('teg.viewJson')}</span> },
            ]}
          />
          <span className="omada-teg-summary">
            {t('teg.activeMode')}: <strong>{mode === 'dark' ? t('teg.dark') : t('teg.light')}</strong>
            <span className="omada-teg-dot">·</span>
            {diffCount} {t('teg.diffCount')}
          </span>
        </div>

        {view === 'diff' ? (
          <div className="omada-teg-groups">
            <div className="omada-teg-head">
              <span className="omada-teg-hkey">{t('teg.token')}</span>
              <span className="omada-teg-hcol"><Icon name="sun" size={13} />{t('teg.light')}</span>
              <span className="omada-teg-hcol"><Icon name="moon" size={13} />{t('teg.dark')}</span>
            </div>
            {GROUPS.map((g) => (
              <div className="omada-teg-group" key={g.key}>
                <div className="omada-teg-grouptitle">{t(g.key)}</div>
                {g.tokens.map((k) => {
                  const differs = String(light[k]) !== String(dark[k]);
                  return (
                    <div className={'omada-teg-row' + (differs ? ' is-diff' : '')} key={k}>
                      <code className="omada-teg-name">
                        {k}
                        {differs && <span className="omada-teg-flag" title={t('teg.differs')}>Δ</span>}
                      </code>
                      <CopyVal value={light[k]} copiedLabel={copiedLabel} />
                      <CopyVal value={dark[k]} copiedLabel={copiedLabel} />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        ) : (
          <div className="omada-teg-jsonwrap">
            <div className="omada-teg-jsonbar">
              <span className="omada-teg-jsonlabel">
                getOmadaTheme(<code>'{mode}'</code>).token
              </span>
              <button type="button" className="omada-teg-copybtn" onClick={copyJson}>
                <Icon name={jsonCopied ? 'check' : 'copy'} size={15} />
                {jsonCopied ? t('teg.copiedJson') : t('teg.copyJson')}
              </button>
            </div>
            <pre className="omada-teg-json"><code>{jsonText}</code></pre>
          </div>
        )}

        <div className="omada-teg-note">{t('teg.note')}</div>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.ThemeExport = OmadaThemeExport;
})();
