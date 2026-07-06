/* components/VoucherPrinter/VoucherPrinter.demo.jsx — window.OmadaDemos.VoucherPrinter */
(function () {
  const VoucherPrinter = window.Omada.VoucherPrinter;

  const CODES = [
    '8C2K-94XT', '5RWQ-K03M', 'ZP6A-77DN', '4HJC-Q8VB', 'M2TX-5L9R', 'A0KF-3WPE',
    'Q7VD-N64S', 'T9BM-2XJH', '6EWL-R0CA', 'P3NY-85KQ', 'X4SG-D7MT', '0JRH-W2FZ',
    'K8CP-1QVN', 'B5XW-J6TL', 'R2DM-9HSA', 'V7QK-4EPC', '3LTN-X0WB', 'H6FJ-S5RY',
  ].map(function (code, i) { return { code: code, used: i % 5 === 3 }; });

  function VoucherPrinterDemo() {
    const ctx = window.useOmada();
    const t = ctx.t;
    return (
      <div className="omada-b27-demo">
        <div className="omada-b27-blocktitle">{t('vprint.b.batch')}</div>
        <VoucherPrinter
          batchName="Lobby Wi-Fi · June"
          codes={CODES}
          duration="8 h"
          dataLimit="2 GB"
          network="ACME Guest"
          perSheet={12}
        />
        <p className="omada-b27-pagehint">{t('vprint.hint')}</p>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.VoucherPrinter = VoucherPrinterDemo;
})();
