/* components/FirmwareRollout/FirmwareRollout.demo.jsx — window.OmadaDemos.FirmwareRollout */
(function () {
  const FirmwareRollout = window.Omada.FirmwareRollout;

  function makeLive(t) {
    return [
      { id: 'w1', name: t('fwr.d.w1'), devices: 12, progress: 100, state: 'done' },
      { id: 'w2', name: t('fwr.d.w2'), devices: 86, progress: 100, state: 'done' },
      { id: 'w3', name: t('fwr.d.w3'), devices: 540, progress: 62, state: 'active' },
      { id: 'w4', name: t('fwr.d.w4'), devices: 1918, progress: 0, state: 'queued' },
    ];
  }
  function makeError(t) {
    return [
      { id: 'w1', name: t('fwr.d.w1'), devices: 12, progress: 100, state: 'done' },
      { id: 'w2', name: t('fwr.d.w2'), devices: 86, progress: 38, state: 'error' },
      { id: 'w3', name: t('fwr.d.w3'), devices: 540, progress: 0, state: 'queued' },
      { id: 'w4', name: t('fwr.d.w4'), devices: 1918, progress: 0, state: 'queued' },
    ];
  }

  function FirmwareRolloutDemo() {
    const { useState, useEffect } = React;
    const ctx = window.useOmada();
    const t = ctx.t;
    const lang = ctx.lang;

    const [live, setLive] = useState(() => makeLive(t));
    const [err, setErr] = useState(() => makeError(t));

    // re-localise wave names when language flips
    useEffect(() => {
      setLive((ws) => ws.map((w, i) => Object.assign({}, w, { name: t('fwr.d.w' + (i + 1)) })));
      setErr((ws) => ws.map((w, i) => Object.assign({}, w, { name: t('fwr.d.w' + (i + 1)) })));
    }, [lang]);

    // tick the active wave forward; finish → next queued wave starts
    useEffect(() => {
      const id = setInterval(() => {
        setLive((ws) => {
          const i = ws.findIndex((w) => w.state === 'active');
          if (i < 0) return ws;
          const next = ws.slice();
          const p = Math.min(100, next[i].progress + 1);
          next[i] = Object.assign({}, next[i], { progress: p });
          if (p >= 100) {
            next[i] = Object.assign({}, next[i], { state: 'done' });
            const q = next.findIndex((w) => w.state === 'queued');
            if (q >= 0) next[q] = Object.assign({}, next[q], { state: 'active' });
          }
          return next;
        });
      }, 700);
      return () => clearInterval(id);
    }, []);

    const onLiveAction = (id, action) => {
      setLive((ws) => ws.map((w) => {
        if (w.id !== id) return w;
        if (action === 'pause') return Object.assign({}, w, { state: 'paused' });
        if (action === 'resume') return Object.assign({}, w, { state: 'active' });
        return w;
      }));
    };
    const onErrAction = (id, action) => {
      if (action !== 'retry') return;
      setErr((ws) => ws.map((w) => (w.id === id ? Object.assign({}, w, { state: 'active' }) : w)));
    };

    return (
      <div className="omada-fwr-demo">
        <div className="omada-fwr-block">
          <div className="omada-fwr-blocktitle">{t('fwr.b.live')}</div>
          <FirmwareRollout version="v5.15.20.18" waves={live} onAction={onLiveAction} />
        </div>
        <div className="omada-fwr-block">
          <div className="omada-fwr-blocktitle">{t('fwr.b.error')}</div>
          <FirmwareRollout version="v5.15.20.18" waves={err} onAction={onErrAction} />
        </div>
        <p className="omada-fwr-pagehint">{t('fwr.hint')}</p>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.FirmwareRollout = FirmwareRolloutDemo;
})();
