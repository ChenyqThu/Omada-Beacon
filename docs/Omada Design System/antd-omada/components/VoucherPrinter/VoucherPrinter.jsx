/* ────────────────────────────────────────────────────────────────────────
   components/VoucherPrinter/VoucherPrinter.jsx — OmadaVoucherPrinter

   A HOTSPOT VOUCHER BATCH panel: header with batch name + duration/data/
   network meta chips and an unused/used tally, then two views via
   Segmented — a CODE GRID of ticket chips (used codes dimmed + struck)
   and a PRINT SHEET preview (miniature A4, `perSheet` tickets laid out
   with network · code · validity). The print CTA runs an idle → printing
   → queued stub (calls `onPrint(unusedCodes)` if given).

   Distinct from LicenseCard (Batch 26 — a single entitlement card):
   this is a bulk credential batch with a physical print artefact.

   Token-driven, dark twin, i18n. Codes render LTR mono in RTL.
   Figma: no dedicated frame — ticket anatomy follows Card/Tag tokens.
   Exports: window.Omada.VoucherPrinter
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { Segmented, Button } = window.antd;

  function OmadaVoucherPrinter(props) {
    const { useState } = React;
    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;

    const codes = props.codes || [];
    const perSheet = props.perSheet || 12;
    const batchName = props.batchName || '';
    const [view, setView] = useState('grid');
    const [printState, setPrintState] = useState('idle'); // idle | printing | done

    const unusedCodes = codes.filter(function (c) { return !c.used; });
    const sheets = Math.max(1, Math.ceil(unusedCodes.length / perSheet));

    function doPrint() {
      if (printState !== 'idle') return;
      setPrintState('printing');
      window.setTimeout(function () {
        setPrintState('done');
        if (props.onPrint) props.onPrint(unusedCodes.map(function (c) { return c.code; }));
        window.setTimeout(function () { setPrintState('idle'); }, 2400);
      }, 1100);
    }

    const printLabel = printState === 'printing' ? t('vprint.printing')
      : printState === 'done' ? t('vprint.printed') : t('vprint.print');

    return (
      <div className={'omada-vprint' + (props.className ? ' ' + props.className : '')}>
        <div className="omada-vprint-head">
          <div className="omada-vprint-title">
            <window.OmadaIcon name="ticket" size={16} />
            <span>{batchName}</span>
            <span className="omada-vprint-tally">
              <i className="is-unused" /> {unusedCodes.length} {t('vprint.unused')}
              <i className="is-used" /> {codes.length - unusedCodes.length} {t('vprint.used')}
            </span>
          </div>
          <Segmented
            size="small"
            value={view}
            onChange={setView}
            options={[
              { value: 'grid', label: t('vprint.view.grid') },
              { value: 'sheet', label: t('vprint.view.sheet') },
            ]}
          />
        </div>
        <div className="omada-vprint-meta">
          {props.duration ? <span>{t('vprint.duration')}: <b>{props.duration}</b></span> : null}
          {props.dataLimit ? <span>{t('vprint.data')}: <b>{props.dataLimit}</b></span> : null}
          {props.network ? <span>{t('vprint.network')}: <b>{props.network}</b></span> : null}
        </div>

        {view === 'grid' ? (
          <div className="omada-vprint-grid">
            {codes.map(function (c) {
              return (
                <span key={c.code} className={'omada-vprint-chip' + (c.used ? ' is-used' : '')}>
                  {c.code}
                </span>
              );
            })}
          </div>
        ) : (
          <div className="omada-vprint-sheetwrap">
            <div className="omada-vprint-sheet">
              {unusedCodes.slice(0, perSheet).map(function (c) {
                return (
                  <div key={c.code} className="omada-vprint-ticket">
                    <span className="omada-vprint-tnet">{props.network || batchName}</span>
                    <span className="omada-vprint-tcode">{c.code}</span>
                    <span className="omada-vprint-tvalid">{t('vprint.valid').replace('{d}', props.duration || '—')}</span>
                  </div>
                );
              })}
            </div>
            <div className="omada-vprint-sheetinfo">
              {t('vprint.sheetinfo').replace('{n}', perSheet).replace('{s}', sheets)}
            </div>
          </div>
        )}

        <div className="omada-vprint-foot">
          <Button
            type="primary"
            icon={<window.OmadaIcon name="printer" size={14} />}
            loading={printState === 'printing'}
            onClick={doPrint}
          >
            {printLabel}
          </Button>
        </div>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.VoucherPrinter = OmadaVoucherPrinter;
})();
