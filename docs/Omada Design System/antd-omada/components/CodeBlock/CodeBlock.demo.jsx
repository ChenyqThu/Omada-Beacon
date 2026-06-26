/* components/CodeBlock/CodeBlock.demo.jsx — window.OmadaDemos.CodeBlock */
(function () {
  const CodeBlock = window.Omada.CodeBlock;

  function CodeBlockDemo() {
    const ctx = window.useOmada();
    const t = ctx.t;

    const conf = [
      'interface vlan 20',
      '  description "Guest WiFi"',
      '  ip address 10.0.20.1/24',
      '  dhcp-relay 10.0.0.5',
      '  rate-limit downstream 50m',
      'exit',
    ].join('\n');

    const diff = [
      { type: 'ctx', text: 'interface vlan 20' },
      { type: 'ctx', text: '  description "Guest WiFi"' },
      { type: 'del', text: '  rate-limit downstream 20m' },
      { type: 'add', text: '  rate-limit downstream 50m' },
      { type: 'add', text: '  client-isolation enable' },
      { type: 'ctx', text: 'exit' },
    ];

    return (
      <div className="omada-cb-demo">
        <CodeBlock filename="vlan20.conf" code={conf} wrappable />
        <CodeBlock filename={t('cb.title.diff')} lines={diff} />
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.CodeBlock = CodeBlockDemo;
})();
