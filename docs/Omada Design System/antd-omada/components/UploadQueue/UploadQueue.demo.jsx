/* components/UploadQueue/UploadQueue.demo.jsx — window.OmadaDemos.UploadQueue */
(function () {
  const { useState, useEffect, useRef } = React;
  const UploadQueue = window.Omada.UploadQueue;

  let SEQ = 100;
  const FW = ['EAP670v2_1.0.9_Build.bin', 'TL-SG3428_2.1.4.bin', 'ER7206_1.3.0.bin', 'EAP650_3.0.2.bin', 'OC200_5.14.bin'];

  function UploadQueueDemo() {
    const ctx = window.useOmada();
    const t = ctx.t;

    const [items, setItems] = useState([
      { key: 'f1', name: 'EAP670v2_1.0.9_Build20240517.bin', size: 18.4 * 1048576, progress: 100, status: 'done' },
      { key: 'f2', name: 'TL-SG3428_2.1.4_Build20240410.bin', size: 9.2 * 1048576, progress: 62, status: 'uploading' },
      { key: 'f3', name: 'ER7206_1.3.0_Build20240221.bin', size: 24.1 * 1048576, progress: 28, status: 'uploading' },
      { key: 'f4', name: 'EAP650_3.0.2_Build20231130.bin', size: 16.0 * 1048576, progress: 0, status: 'queued' },
      { key: 'f5', name: 'OC200_5.14.30.bin', size: 41.7 * 1048576, progress: 41, status: 'error' },
    ]);
    const timer = useRef(null);

    // simulate the bytes moving — the parent owns progress, the component just renders
    useEffect(function () {
      timer.current = setInterval(function () {
        setItems(function (arr) {
          let upCount = arr.filter(function (x) { return x.status === 'uploading'; }).length;
          return arr.map(function (it) {
            if (it.status !== 'uploading') return it;
            const step = 3 + Math.random() * 7;
            const np = Math.min(100, (it.progress || 0) + step);
            if (np >= 100) return Object.assign({}, it, { progress: 100, status: 'done' });
            return Object.assign({}, it, { progress: np });
          });
        });
      }, 700);
      return function () { clearInterval(timer.current); };
    }, []);

    // when nothing is uploading, promote the next queued file
    useEffect(function () {
      const uploading = items.some(function (x) { return x.status === 'uploading'; });
      if (!uploading) {
        const nextQ = items.find(function (x) { return x.status === 'queued'; });
        if (nextQ) setItems(function (arr) { return arr.map(function (x) { return x.key === nextQ.key ? Object.assign({}, x, { status: 'uploading' }) : x; }); });
      }
    }, [items]);

    const patch = function (key, p) { setItems(function (arr) { return arr.map(function (x) { return x.key === key ? Object.assign({}, x, p) : x; }); }); };

    return (
      <UploadQueue
        items={items}
        onPause={function (k) { patch(k, { status: 'paused' }); }}
        onResume={function (k) { patch(k, { status: 'uploading' }); }}
        onRetry={function (k) { patch(k, { status: 'uploading', progress: 0 }); }}
        onCancel={function (k) { setItems(function (arr) { return arr.filter(function (x) { return x.key !== k; }); }); }}
        onClear={function () { setItems(function (arr) { return arr.filter(function (x) { return x.status !== 'done'; }); }); }}
        onPauseAll={function () { setItems(function (arr) { return arr.map(function (x) { return x.status === 'uploading' ? Object.assign({}, x, { status: 'paused' }) : x; }); }); }}
        onResumeAll={function () { setItems(function (arr) { return arr.map(function (x) { return (x.status === 'paused' || x.status === 'queued') ? Object.assign({}, x, { status: 'uploading' }) : x; }); }); }}
        onAdd={function () {
          const id = 'f' + (SEQ += 1);
          const name = FW[Math.floor(Math.random() * FW.length)];
          setItems(function (arr) { return arr.concat([{ key: id, name: name, size: (8 + Math.random() * 30) * 1048576, progress: 0, status: 'queued' }]); });
        }}
        addLabel={t('uq.addFw')}
      />
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.UploadQueue = UploadQueueDemo;
})();
