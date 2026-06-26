/* components/DnsTable/DnsTable.demo.jsx — window.OmadaDemos.DnsTable */
(function () {
  const DnsTable = window.Omada.DnsTable;

  const RECORDS = [
    { id: 'r1', host: 'nas', type: 'A', value: '192.168.10.40', ttl: 300 },
    { id: 'r2', host: 'printer', type: 'A', value: '192.168.10.61', ttl: 3600 },
    { id: 'r3', host: 'web', type: 'CNAME', value: 'nas.lan.acme.local', ttl: 300 },
    { id: 'r4', host: 'ipv6-gw', type: 'AAAA', value: 'fd00:acme::1', ttl: 600 },
    { id: 'r5', host: '@', type: 'MX', value: '10 mail.acme.local', ttl: 3600 },
    { id: 'r6', host: '@', type: 'TXT', value: 'v=spf1 mx -all', ttl: 3600 },
  ];

  function DnsTableDemo() {
    const ctx = window.useOmada();
    const t = ctx.t;
    return (
      <div className="omada-b27-demo">
        <div className="omada-b27-blocktitle">{t('dnst.b.zone')}</div>
        <DnsTable defaultRecords={RECORDS} />
        <p className="omada-b27-pagehint">{t('dnst.hint')}</p>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.DnsTable = DnsTableDemo;
})();
