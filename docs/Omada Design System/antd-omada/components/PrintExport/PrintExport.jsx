/* ────────────────────────────────────────────────────────────────────────
   components/PrintExport/PrintExport.jsx — OmadaPrintExport

   A PRINT / EXPORT board — how a console panel becomes a clean PDF. Pairs the
   Watermark wrapper with the print-CSS mechanics that actually matter when a
   site report leaves the screen:

     · A paginated "report sheet" specimen (A4-proportioned) wrapped in
       Omada.Watermark, with a visible page-break guide between page 1 and 2 so
       the print pagination is legible on screen.
     · "Save as PDF" really prints — it sets data-omada-print="report" on
       <html>, and a scoped @media print block (in omada-overrides.css) hides
       everything except the sheet, so the browser's print dialog yields just
       the report (Save as PDF from there). Cleared on afterprint.
     · Three mechanic cards: keep-together (page-break-inside: avoid), repeat
       table headers on every page (thead display:table-header-group), and the
       tamper-evident Watermark that survives the export.
     · A copyable print-CSS snippet — the @media print rules as a token-aligned
       starting point.

   Watermark colour + report chrome are theme-var driven (dark twins in
   omada-overrides.css); print output forces a light sheet regardless of the
   on-screen theme (ink on white) via the print block.

   Figma: no dedicated node — a print/export pattern board. The watermark is the
   Watermark wrapper (confidentiality-overlay pattern); the report reuses the
   Descriptions / Table language.
   Exports: window.Omada.PrintExport
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { useEffect, useState } = React;
  const Icon = window.Omada.Icon;
  const Button = window.Omada.Button;
  const Watermark = window.Omada.Watermark;

  const PRINT_CSS =
`@media print {
  /* scope: only the report sheet prints */
  html[data-omada-print="report"] body * { visibility: hidden; }
  .omada-prx-sheet, .omada-prx-sheet * { visibility: visible; }
  .omada-prx-sheet { position: absolute; inset: 0; box-shadow: none; }

  /* keep a card / row from splitting across pages */
  .omada-prx-keep { break-inside: avoid; page-break-inside: avoid; }

  /* repeat the table header on every printed page */
  thead { display: table-header-group; }

  @page { margin: 16mm; }
}`;

  function OmadaPrintExport(props) {
    const className = props.className || '';
    const rest = Object.assign({}, props);
    delete rest.className;

    const ctx = window.useOmada();
    const t = ctx.t, lang = ctx.lang;
    const msg = window.Omada.useMessage();
    const [cssCopied, setCssCopied] = useState(false);

    // clear the print scope after the dialog closes
    useEffect(() => {
      const after = () => document.documentElement.removeAttribute('data-omada-print');
      window.addEventListener('afterprint', after);
      return () => window.removeEventListener('afterprint', after);
    }, []);

    const doPrint = () => {
      document.documentElement.setAttribute('data-omada-print', 'report');
      // let the attribute apply before the (synchronous) print dialog opens
      setTimeout(() => {
        try { window.print(); }
        finally { setTimeout(() => document.documentElement.removeAttribute('data-omada-print'), 500); }
      }, 30);
    };

    const copyCss = () => {
      try { navigator.clipboard.writeText(PRINT_CSS); } catch (e) { /* noop */ }
      setCssCopied(true); setTimeout(() => setCssCopied(false), 1100);
    };

    const ROWS = [
      { dev: 'OC-AP-1042', type: 'ap', site: t('prx.siteHQ'), uptime: '38d', clients: 86 },
      { dev: 'OC-SW-2210', type: 'switch', site: t('prx.siteHQ'), uptime: '120d', clients: 0 },
      { dev: 'OC-GW-0001', type: 'gateway', site: t('prx.siteHQ'), uptime: '120d', clients: 512 },
      { dev: 'OC-AP-1043', type: 'ap', site: t('prx.siteWh'), uptime: '12d', clients: 24 },
    ];

    const MECHANICS = [
      { icon: 'layers', titleKey: 'prx.keep.title', descKey: 'prx.keep.desc' },
      { icon: 'list',   titleKey: 'prx.thead.title', descKey: 'prx.thead.desc' },
      { icon: 'lock',   titleKey: 'prx.mark.title', descKey: 'prx.mark.desc' },
    ];

    return (
      <div className={('omada-prx ' + className).trim()} {...rest}>

        <div className="omada-prx-bar">
          <Button variant="primary" icon={<Icon name="printer" size={16} />} onClick={doPrint}>
            {t('prx.savePdf')}
          </Button>
          <Button variant="outline" icon={<Icon name="export" size={16} />}
            onClick={() => msg.info(t('prx.exportHint'))}>
            {t('prx.exportCsv')}
          </Button>
          <span className="omada-prx-barhint">{t('prx.barHint')}</span>
        </div>

        {/* ── paginated report specimen ── */}
        <div className="omada-prx-stage">
          <Watermark content={[t('prx.wmLine1'), t('prx.wmLine2')]} gap={[110, 90]}>
            <div className="omada-prx-sheet">
              <div className="omada-prx-sheethd omada-prx-keep">
                <div className="omada-prx-brand">
                  <span className="omada-prx-mark"><Icon name="dashboard" size={20} /></span>
                  <div>
                    <div className="omada-prx-title">{t('prx.reportTitle')}</div>
                    <div className="omada-prx-sub">{t('prx.reportSub')} · {t('prx.siteHQ')}</div>
                  </div>
                </div>
                <div className="omada-prx-meta">
                  <div><span>{t('prx.generated')}</span><code>2026-06-01</code></div>
                  <div><span>{t('prx.pageLabel')}</span><code>1 / 2</code></div>
                </div>
              </div>

              <div className="omada-prx-stats omada-prx-keep">
                {[['prx.stat.devices', '4'], ['prx.stat.online', '3'], ['prx.stat.clients', '622'], ['prx.stat.alerts', '1']].map(([k, v]) => (
                  <div className="omada-prx-stat" key={k}>
                    <div className="omada-prx-statn">{v}</div>
                    <div className="omada-prx-statl">{t(k)}</div>
                  </div>
                ))}
              </div>

              <table className="omada-prx-table">
                <thead>
                  <tr>
                    <th>{t('prx.col.device')}</th>
                    <th>{t('prx.col.site')}</th>
                    <th>{t('prx.col.uptime')}</th>
                    <th className="omada-prx-r">{t('prx.col.clients')}</th>
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((r) => (
                    <tr key={r.dev} className="omada-prx-keep">
                      <td><span className="omada-prx-dev"><Icon name={r.type} size={15} /><code>{r.dev}</code></span></td>
                      <td>{r.site}</td>
                      <td>{r.uptime}</td>
                      <td className="omada-prx-r">{r.clients.toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* page-break guide (screen-only) */}
              <div className="omada-prx-break" aria-hidden="true">
                <span><Icon name="docs" size={13} /> {t('prx.breakLabel')}</span>
              </div>

              <div className="omada-prx-foot">{t('prx.footer')}</div>
            </div>
          </Watermark>
        </div>

        {/* ── mechanic cards ── */}
        <div className="omada-prx-cards">
          {MECHANICS.map((m) => (
            <div className="omada-prx-card" key={m.titleKey}>
              <span className="omada-prx-cardix"><Icon name={m.icon} size={18} /></span>
              <div className="omada-prx-cardtitle">{t(m.titleKey)}</div>
              <div className="omada-prx-carddesc">{t(m.descKey)}</div>
            </div>
          ))}
        </div>

        {/* ── print CSS snippet ── */}
        <div className="omada-prx-snipbar">
          <span className="omada-prx-sniplabel"><Icon name="braces" size={15} />{t('prx.snippet')}</span>
          <button type="button" className="omada-prx-copybtn" onClick={copyCss}>
            <Icon name={cssCopied ? 'check' : 'copy'} size={15} />
            {cssCopied ? t('prx.copied') : t('prx.copy')}
          </button>
        </div>
        <pre className="omada-prx-snip"><code>{PRINT_CSS}</code></pre>

        <div className="omada-prx-note">{t('prx.note')}</div>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.PrintExport = OmadaPrintExport;
})();
