/* components/LicenseCard/LicenseCard.demo.jsx — window.OmadaDemos.LicenseCard */
(function () {
  const LicenseCard = window.Omada.LicenseCard;

  function LicenseCardDemo() {
    const ctx = window.useOmada();
    const t = ctx.t;
    const DAY = 86400000;
    const now = Date.now();

    return (
      <div className="omada-lic-demo">
        <div className="omada-lic-blocktitle">{t('lic.b.states')}</div>
        <div className="omada-lic-grid">
          <LicenseCard license={{
            name: 'Omada Cloud Standard', edition: 'Annual · per device',
            seatsUsed: 132, seatsTotal: 500,
            start: now - 200 * DAY, end: now + 165 * DAY,
            key: 'OC1A-9F4K-22MQ-7XEX-51B0',
          }} />
          <LicenseCard license={{
            name: 'Omada Cloud Plus', edition: 'Annual · per device',
            seatsUsed: 472, seatsTotal: 500,
            start: now - 347 * DAY, end: now + 18 * DAY,
            key: 'OCPL-M2Z8-0Q4D-RR19-T6AU',
          }} />
          <LicenseCard license={{
            name: 'Hotspot Manager', edition: 'Annual · per site',
            seatsUsed: 12, seatsTotal: 25,
            start: now - 380 * DAY, end: now - 15 * DAY,
            key: 'HSMG-77NF-XR81-K2MQ-D4DA',
          }} />
          <LicenseCard license={{
            name: 'Advanced Threat Protection', edition: 'Annual · per gateway',
            status: 'inactive',
            key: 'ATPX-V0C3-QO8Y-SNHJ-6604',
          }} />
        </div>
        <p className="omada-lic-pagehint">{t('lic.hint')}</p>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.LicenseCard = LicenseCardDemo;
})();
