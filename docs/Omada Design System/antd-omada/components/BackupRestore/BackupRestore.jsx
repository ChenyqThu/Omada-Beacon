/* ────────────────────────────────────────────────────────────────────────
   components/BackupRestore/BackupRestore.jsx — OmadaBackupRestore

   CONFIGURATION BACKUPS: a newest-first list (name · auto/manual
   chip · locale-formatted timestamp · size) with per-row DOWNLOAD
   (client-side .cfg blob stub) and RESTORE behind a Popconfirm —
   confirming runs a brief restoring progress fill, then a green
   "restored from" banner. BACK UP NOW spins ~1.2 s and prepends a
   manual entry timestamped now; UPLOAD BACKUP is a labelled stub.

   Distinct from CertManager (credential inventory) and DataExport
   (CSV/JSON of table data): this is whole-config snapshots with a
   destructive-restore confirm.

   Token-driven, dark twin, i18n (timestamps via toLocaleString with
   the active locale). Figma: no dedicated frame — list rows follow
   CertManager, banner follows MaintenanceBanner tone.
   Exports: window.Omada.BackupRestore
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { Button, Popconfirm } = window.antd;

  const DAY = 86400000;
  function defaults(now) {
    return [
      { id: 'b1', name: 'bkr.n.auto',       type: 'auto',   ts: now - DAY,      size: '2.4 MB' },
      { id: 'b2', name: 'bkr.n.preupgrade', type: 'manual', ts: now - 6 * DAY,  size: '2.3 MB' },
      { id: 'b3', name: 'bkr.n.initial',    type: 'manual', ts: now - 30 * DAY, size: '1.1 MB' },
    ];
  }

  function OmadaBackupRestore(props) {
    const { useState, useRef, useEffect } = React;
    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;
    const lang = ctx ? ctx.lang : 'en';

    const [list, setList] = useState(function () { return props.backups || defaults(Date.now()); });
    const [busy, setBusy] = useState(false);            // back up now
    const [restoringId, setRestoringId] = useState(null);
    const [banner, setBanner] = useState(null);         // restored-from name
    const [note, setNote] = useState(false);            // upload stub note
    const timers = useRef([]);
    const counter = useRef(0);
    useEffect(function () {
      return function () { timers.current.forEach(function (id) { window.clearTimeout(id); }); };
    }, []);
    function later(ms, fn) { timers.current.push(window.setTimeout(fn, ms)); }

    function fmt(ts) {
      try {
        return new Date(ts).toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US',
          { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
      } catch (e) { return new Date(ts).toLocaleString(); }
    }
    function nameOf(b) { return b.name.indexOf('bkr.') === 0 ? t(b.name) : b.name; }

    function backupNow() {
      if (busy) return;
      setBusy(true);
      later(1200, function () {
        counter.current += 1;
        setList(function (l) {
          return [{ id: 'm' + counter.current, name: 'bkr.n.manual', type: 'manual', ts: Date.now(), size: '2.4 MB' }].concat(l);
        });
        setBusy(false);
      });
    }

    function download(b) {
      const blob = new Blob(['# omada controller config snapshot (demo stub)\nname=' + nameOf(b) + '\n'], { type: 'application/octet-stream' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'omada-backup-' + b.id + '.cfg';
      a.click();
      window.setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
    }

    function restore(b) {
      setBanner(null);
      setRestoringId(b.id);
      later(1600, function () {
        setRestoringId(null);
        setBanner(nameOf(b));
        later(3600, function () { setBanner(null); });
      });
    }

    function uploadStub() {
      setNote(true);
      later(3000, function () { setNote(false); });
    }

    return (
      <div className={'omada-bkr' + (props.className ? ' ' + props.className : '')}>
        <div className="omada-bkr-head">
          <Button size="small" type="primary" loading={busy}
                  icon={busy ? null : <window.OmadaIcon name="save" size={13} />}
                  onClick={backupNow}>
            {busy ? t('bkr.backingUp') : t('bkr.backupNow')}
          </Button>
          <Button size="small" icon={<window.OmadaIcon name="upload" size={13} />} onClick={uploadStub}>
            {t('bkr.upload')}
          </Button>
          {note ? <span className="omada-bkr-note">{t('bkr.uploadStub')}</span> : null}
        </div>

        {banner ? (
          <div className="omada-bkr-banner">
            <window.OmadaIcon name="check-circle" size={14} />
            {t('bkr.restored').replace('{name}', banner)}
          </div>
        ) : null}

        <div className="omada-bkr-rows">
          {list.map(function (b) {
            const restoring = restoringId === b.id;
            return (
              <div key={b.id} className={'omada-bkr-row' + (restoring ? ' is-restoring' : '')}>
                <span className="omada-bkr-icon"><window.OmadaIcon name="file-text" size={16} /></span>
                <span className="omada-bkr-id">
                  <b>{nameOf(b)}</b>
                  <span className="omada-bkr-meta">{fmt(b.ts)} · {b.size}</span>
                </span>
                <span className={'omada-bkr-type is-' + b.type}>{t('bkr.type.' + b.type)}</span>
                {restoring ? (
                  <span className="omada-bkr-progress"><i /><em>{t('bkr.restoring')}</em></span>
                ) : (
                  <span className="omada-bkr-actions">
                    <Button size="small" type="text"
                            icon={<window.OmadaIcon name="download" size={13} />}
                            aria-label={t('bkr.download')}
                            onClick={function () { download(b); }} />
                    <Popconfirm title={t('bkr.confirm')} okText={t('bkr.restore')} cancelText={t('common.cancel')}
                                okButtonProps={{ danger: true }}
                                onConfirm={function () { restore(b); }}>
                      <Button size="small" disabled={restoringId != null}>{t('bkr.restore')}</Button>
                    </Popconfirm>
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.BackupRestore = OmadaBackupRestore;
})();
