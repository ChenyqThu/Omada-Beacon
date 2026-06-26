/* components/ChannelScanner/ChannelScanner.demo.jsx — window.OmadaDemos.ChannelScanner */
(function () {
  const ChannelScanner = window.Omada.ChannelScanner;

  function ChannelScannerDemo() {
    const ctx = window.useOmada();
    const t = ctx.t;
    return (
      <div className="omada-b27-demo">
        <div className="omada-b27-blocktitle">{t('chsc.b.scan')}</div>
        <ChannelScanner defaultBand="2.4" currentChannels={{ '2.4': 6, '5': 44 }} />
        <p className="omada-b27-pagehint">{t('chsc.hint')}</p>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.ChannelScanner = ChannelScannerDemo;
})();
