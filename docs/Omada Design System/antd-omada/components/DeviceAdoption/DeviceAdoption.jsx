/* ────────────────────────────────────────────────────────────────────────
   components/DeviceAdoption/DeviceAdoption.jsx — OmadaDeviceAdoption

   PENDING-DEVICE ADOPTION: discovered devices (model · MAC · IP) each
   walk a live state machine — discovered → adopting → provisioning →
   connected — with a three-dot inline progress strip and a status
   chip per row. One demo device fails during provisioning the first
   time; RETRY re-runs provisioning only and succeeds. ADOPT ALL
   staggers the remaining discovered rows.

   Distinct from FirmwareRollout (staged updates to devices already
   adopted) and WanFailover (link state machine): this is the
   day-zero onboarding flow.

   Token-driven, dark twin, i18n. Figma: SYMBOL 25947:11537
   ("Adopt 收养"); row metrics follow CertManager list rows.
   Exports: window.Omada.DeviceAdoption
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { Button, Tooltip } = window.antd;

  const DEFAULT_DEVICES = [
    { id: 'd1', model: 'AP-650',   mac: '9C-53-22-1A-04-7B', ip: '192.168.0.112', icon: 'ap' },
    { id: 'd2', model: 'SW-2210P', mac: '54-AF-97-30-B2-11', ip: '192.168.0.113', icon: 'switch' },
    { id: 'd3', model: 'AP-610',   mac: '9C-53-22-77-C0-3E', ip: '192.168.0.118', icon: 'ap', failOnce: true },
  ];

  const STEP = { adopting: 1, provisioning: 2, connected: 3, failed: 2 };

  function OmadaDeviceAdoption(props) {
    const { useState, useRef, useEffect } = React;
    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;

    const devices = props.devices || DEFAULT_DEVICES;
    const [st, setSt] = useState(function () {
      const o = {};
      devices.forEach(function (d) { o[d.id] = { phase: 'discovered', retried: false }; });
      return o;
    });
    const timers = useRef([]);
    useEffect(function () {
      return function () { timers.current.forEach(function (id) { window.clearTimeout(id); }); };
    }, []);
    function later(ms, fn) { timers.current.push(window.setTimeout(fn, ms)); }
    function setPhase(id, delta) {
      setSt(function (s) {
        const next = Object.assign({}, s);
        next[id] = Object.assign({}, s[id], delta);
        return next;
      });
    }

    function provision(d) {
      setPhase(d.id, { phase: 'provisioning' });
      later(1300, function () {
        setSt(function (s) {
          const cur = s[d.id];
          if (cur.phase !== 'provisioning') return s;
          const fail = d.failOnce && !cur.retried;
          const next = Object.assign({}, s);
          next[d.id] = Object.assign({}, cur, { phase: fail ? 'failed' : 'connected' });
          return next;
        });
      });
    }

    function adopt(d) {
      setPhase(d.id, { phase: 'adopting' });
      later(900, function () { provision(d); });
    }

    function retry(d) {
      setPhase(d.id, { retried: true });
      provision(d);
    }

    function adoptAll() {
      let i = 0;
      devices.forEach(function (d) {
        if (st[d.id].phase !== 'discovered') return;
        later(i * 300, function () { adopt(d); });
        i += 1;
      });
    }

    const anyDiscovered = devices.some(function (d) { return st[d.id].phase === 'discovered'; });

    return (
      <div className={'omada-dadopt' + (props.className ? ' ' + props.className : '')}>
        <div className="omada-dadopt-head">
          <span className="omada-dadopt-count">
            {devices.filter(function (d) { return st[d.id].phase !== 'connected'; }).length}
          </span>
          <Button size="small" type="primary" disabled={!anyDiscovered} onClick={adoptAll}>
            {t('dadopt.adoptAll')}
          </Button>
        </div>
        <div className="omada-dadopt-rows">
          {devices.map(function (d) {
            const phase = st[d.id].phase;
            const busy = phase === 'adopting' || phase === 'provisioning';
            const step = STEP[phase] || 0;
            return (
              <div key={d.id} className={'omada-dadopt-row st-' + phase}>
                <span className="omada-dadopt-icon"><window.OmadaIcon name={d.icon} size={18} /></span>
                <span className="omada-dadopt-id">
                  <b>{d.model}</b>
                  <span className="omada-dadopt-meta">{d.mac} · {d.ip}</span>
                </span>
                <span className="omada-dadopt-steps" aria-hidden="true">
                  {[1, 2, 3].map(function (n) {
                    let cls = 'omada-dadopt-dot';
                    if (phase === 'failed' && n === 2) cls += ' is-fail';
                    else if (n < step || phase === 'connected') cls += ' is-done';
                    else if (n === step && busy) cls += ' is-live';
                    return <i key={n} className={cls} />;
                  })}
                </span>
                <span className={'omada-dadopt-chip st-' + phase}>
                  {busy ? <i className="omada-dadopt-pulse" /> : null}
                  {t('dadopt.st.' + phase)}
                </span>
                {phase === 'discovered' ? (
                  <Button size="small" onClick={function () { adopt(d); }}>{t('dadopt.adopt')}</Button>
                ) : phase === 'failed' ? (
                  <Tooltip title={t('dadopt.fail.tip')}>
                    <Button size="small" danger onClick={function () { retry(d); }}>{t('dadopt.retry')}</Button>
                  </Tooltip>
                ) : <span className="omada-dadopt-actionspacer" />}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.DeviceAdoption = OmadaDeviceAdoption;
})();
