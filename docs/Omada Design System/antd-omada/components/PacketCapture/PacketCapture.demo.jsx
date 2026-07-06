/* components/PacketCapture/PacketCapture.demo.jsx — window.OmadaDemos.PacketCapture */
(function () {
  const PacketCapture = window.Omada.PacketCapture;

  function PacketCaptureDemo() {
    const ctx = window.useOmada();
    const t = ctx.t;
    return (
      <div className="omada-b27-demo">
        <div className="omada-b27-blocktitle">{t('pcap.b.wan')}</div>
        <PacketCapture defaultFilter="host 10.0.0.5 and port 443" />
        <p className="omada-b27-pagehint">{t('pcap.hint')}</p>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.PacketCapture = PacketCaptureDemo;
})();
