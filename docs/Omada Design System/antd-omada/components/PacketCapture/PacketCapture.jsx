/* ────────────────────────────────────────────────────────────────────────
   components/PacketCapture/PacketCapture.jsx — OmadaPacketCapture

   A CAPTURE SESSION panel: interface Select + BPF-style filter Input +
   start/stop, with rolling packet/byte/duration/file-size counters while
   running (interval-driven, presentational simulation) and a pulsing
   live dot. Stopping yields a summary state with a client-side
   "Download .pcap" stub (a valid 24-byte libpcap global header Blob)
   and a reset action.

   Distinct from SpeedTest (Batch 26 — a staged throughput run machine):
   this is an open-ended record-then-export session.

   Token-driven, dark twin, i18n. Counters render LTR in RTL.
   Figma: icon SYMBOL 25947:11393 ("抓包测试Packet Capture") — no full
   frame; panel anatomy follows Card/Input tokens.
   Exports: window.Omada.PacketCapture
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { Select, Input, Button } = window.antd;

  function fmtBytes(b) {
    if (b < 1024) return b + ' B';
    if (b < 1048576) return (b / 1024).toFixed(1) + ' KB';
    return (b / 1048576).toFixed(2) + ' MB';
  }
  function fmtDur(s) {
    const m = Math.floor(s / 60), ss = s % 60;
    return (m < 10 ? '0' : '') + m + ':' + (ss < 10 ? '0' : '') + ss;
  }

  function OmadaPacketCapture(props) {
    const { useState, useRef, useEffect } = React;
    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;

    const ifaces = props.interfaces || [
      { value: 'wan1', label: 'WAN1' },
      { value: 'lan', label: 'LAN' },
      { value: 'vlan20', label: 'VLAN 20 — IoT' },
    ];
    const [state, setState] = useState('idle'); // idle | running | stopped
    const [iface, setIface] = useState(props.defaultInterface || ifaces[0].value);
    const [filter, setFilter] = useState(props.defaultFilter || '');
    const [pkts, setPkts] = useState(0);
    const [bytes, setBytes] = useState(0);
    const [secs, setSecs] = useState(0);
    const timer = useRef(null);
    const seed = useRef(7);

    useEffect(function () {
      return function () { if (timer.current) window.clearInterval(timer.current); };
    }, []);

    function rnd() {
      seed.current = (seed.current * 1103515245 + 12345) % 2147483648;
      return seed.current / 2147483648;
    }

    function start() {
      setPkts(0); setBytes(0); setSecs(0); setState('running');
      let tick = 0;
      timer.current = window.setInterval(function () {
        tick++;
        if (tick % 5 === 0) setSecs(function (s) { return s + 1; });
        const burst = 20 + Math.round(rnd() * 240);
        setPkts(function (p) { return p + burst; });
        setBytes(function (b) { return b + burst * (90 + Math.round(rnd() * 900)); });
      }, 200);
    }
    function stop() {
      window.clearInterval(timer.current); timer.current = null;
      setState('stopped');
      if (props.onStop) props.onStop({ interface: iface, filter: filter, packets: pkts, bytes: bytes, seconds: secs });
    }
    function download() {
      /* minimal libpcap global header — a valid, empty capture stub */
      const hdr = new Uint8Array([0xd4, 0xc3, 0xb2, 0xa1, 2, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0xff, 0xff, 0, 0, 1, 0, 0, 0]);
      const blob = new Blob([hdr], { type: 'application/vnd.tcpdump.pcap' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'capture-' + iface + '.pcap';
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      window.setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
    }

    const statusKey = state === 'running' ? 'pcap.running' : state === 'stopped' ? 'pcap.stopped' : 'pcap.idle';

    return (
      <div className={'omada-pcap' + (props.className ? ' ' + props.className : '')}>
        <div className="omada-pcap-controls">
          <Select
            size="middle"
            value={iface}
            onChange={setIface}
            options={ifaces}
            disabled={state === 'running'}
            style={{ minWidth: 130 }}
            aria-label={t('pcap.iface')}
          />
          <Input
            value={filter}
            onChange={function (e) { setFilter(e.target.value); }}
            placeholder={t('pcap.filter.ph')}
            disabled={state === 'running'}
            className="omada-pcap-filter"
            aria-label={t('pcap.filter')}
          />
          {state === 'running' ? (
            <Button danger onClick={stop}>{t('pcap.stop')}</Button>
          ) : (
            <Button type="primary" icon={<window.OmadaIcon name="activity" size={14} />} onClick={start}>
              {state === 'stopped' ? t('pcap.again') : t('pcap.start')}
            </Button>
          )}
        </div>

        <div className={'omada-pcap-status is-' + state}>
          <span className="omada-pcap-dot" />
          {t(statusKey)}
          {filter && state !== 'idle' ? <code className="omada-pcap-filterecho">{filter}</code> : null}
        </div>

        <div className="omada-pcap-counters">
          <div className="omada-pcap-counter">
            <span className="omada-pcap-cv">{pkts.toLocaleString()}</span>
            <span className="omada-pcap-cl">{t('pcap.packets')}</span>
          </div>
          <div className="omada-pcap-counter">
            <span className="omada-pcap-cv">{fmtBytes(bytes)}</span>
            <span className="omada-pcap-cl">{t('pcap.bytes')}</span>
          </div>
          <div className="omada-pcap-counter">
            <span className="omada-pcap-cv">{fmtDur(secs)}</span>
            <span className="omada-pcap-cl">{t('pcap.duration')}</span>
          </div>
          <div className="omada-pcap-counter">
            <span className="omada-pcap-cv">{fmtBytes(bytes === 0 ? 0 : bytes + pkts * 16 + 24)}</span>
            <span className="omada-pcap-cl">{t('pcap.filesize')}</span>
          </div>
        </div>

        {state === 'stopped' ? (
          <div className="omada-pcap-foot">
            <Button icon={<window.OmadaIcon name="download" size={14} />} onClick={download}>
              {t('pcap.download')}
            </Button>
          </div>
        ) : null}
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.PacketCapture = OmadaPacketCapture;
})();
