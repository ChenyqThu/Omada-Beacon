/* components/DhcpReservation/DhcpReservation.demo.jsx — window.OmadaDemos.DhcpReservation */
(function () {
  const DhcpReservation = window.Omada.DhcpReservation;

  function DhcpReservationDemo() {
    const ctx = window.useOmada();
    const t = ctx.t;
    return (
      <div className="omada-b28-demo">
        <div className="omada-b28-blocktitle">{t('dhcpr.b.scope')}</div>
        <DhcpReservation />
        <p className="omada-b28-pagehint">{t('dhcpr.hint')}</p>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.DhcpReservation = DhcpReservationDemo;
})();
