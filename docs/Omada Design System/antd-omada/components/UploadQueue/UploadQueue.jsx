/* ────────────────────────────────────────────────────────────────────────
   components/UploadQueue/UploadQueue.jsx — OmadaUploadQueue

   A multi-file UPLOAD / firmware-push QUEUE. antd Upload owns a single file list;
   this is the heavier transfer surface a controller shows when pushing firmware
   to a fleet or importing a batch of configs — an aggregate progress header over
   a list of per-file rows, each with its own progress bar, status and
   pause / resume / retry / cancel controls.

   Behaviour (presentational + controlled):
     · Each item is { key, name, size, progress(0–100), status } where status ∈
       queued · uploading · paused · done · error. The row maps status → a
       Progress colour (active green / paused grey / success / exception) and the
       right action set (uploading → Pause; paused/queued → Resume; error →
       Retry; any incomplete → Cancel; done → Remove).
     · The header sums the queue: overall % (mean of all bytes), a count line,
       and Pause-all / Resume-all / Clear-completed — each firing the matching
       callback. An "Add files" trigger fires onAdd.
     · The parent owns the bytes (drives progress over time, real XHR or a
       simulation); this component just renders + routes actions. No timers here.

   Thin composition over antd Progress + Omada Button / Tag / Icon. All chrome is
   theme-var driven with dark twins in omada-overrides.css; the active bar uses
   brand-green. RTL-safe.

   Figma: the firmware-push / import progress language (icon/upload 25947:12326 +
   the Firmware page 3 frame). Glyphs are OmadaIcon. No branded art.
   Exports: window.Omada.UploadQueue
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { useMemo } = React;
  const { Progress } = window.antd;
  const Icon = window.Omada.Icon;
  const Button = window.Omada.Button;
  const StatusPill = window.Omada.StatusPill;

  const STATUS_TONE = { queued: 'default', uploading: 'processing', paused: 'warning', done: 'success', error: 'error' };

  function fmtSize(bytes) {
    if (bytes == null) return '';
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + ' MB';
    if (bytes >= 1024) return (bytes / 1024).toFixed(0) + ' KB';
    return bytes + ' B';
  }

  function OmadaUploadQueue(props) {
    const className = props.className || '';
    const rest = Object.assign({}, props);
    delete rest.className; delete rest.items; delete rest.title; delete rest.onAdd;
    delete rest.onPause; delete rest.onResume; delete rest.onRetry; delete rest.onCancel;
    delete rest.onClear; delete rest.onPauseAll; delete rest.onResumeAll; delete rest.addLabel;

    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;
    const lang = ctx ? ctx.lang : 'en';

    const items = props.items || [];

    const agg = useMemo(() => {
      const a = { total: items.length, done: 0, uploading: 0, error: 0, paused: 0, queued: 0, sum: 0 };
      items.forEach((it) => {
        a.sum += (it.status === 'done' ? 100 : (it.progress || 0));
        if (a[it.status] !== undefined) a[it.status] += 1;
      });
      a.overall = items.length ? Math.round(a.sum / items.length) : 0;
      return a;
    }, [items]);

    const anyActive = agg.uploading > 0;
    const anyPausable = agg.uploading > 0;
    const anyResumable = agg.paused > 0 || agg.queued > 0;
    const anyDone = agg.done > 0;
    const allComplete = items.length > 0 && agg.done === items.length;

    const call = (fn, key) => { if (props[fn]) props[fn](key); };

    const rowActions = (it) => {
      const out = [];
      if (it.status === 'uploading') out.push(
        <button key="pause" type="button" className="omada-uq-act" onClick={() => call('onPause', it.key)} aria-label={t('uq.pause')}>
          <Icon name="pause" size={15} />
        </button>
      );
      if (it.status === 'paused' || it.status === 'queued') out.push(
        <button key="resume" type="button" className="omada-uq-act" onClick={() => call('onResume', it.key)} aria-label={t('uq.resume')}>
          <Icon name="play" size={15} />
        </button>
      );
      if (it.status === 'error') out.push(
        <button key="retry" type="button" className="omada-uq-act" onClick={() => call('onRetry', it.key)} aria-label={t('uq.retry')}>
          <Icon name="refresh" size={15} />
        </button>
      );
      out.push(
        <button key="cancel" type="button" className="omada-uq-act is-danger" onClick={() => call('onCancel', it.key)}
                aria-label={it.status === 'done' ? t('uq.remove') : t('uq.cancel')}>
          <Icon name={it.status === 'done' ? 'trash' : 'close'} size={15} />
        </button>
      );
      return out;
    };

    const progressStatus = (s) => (s === 'done' ? 'success' : (s === 'error' ? 'exception' : (s === 'paused' ? 'normal' : 'active')));
    const progressColor = (s) => {
      if (s === 'done') return undefined;
      if (s === 'error') return undefined;
      if (s === 'paused') return '#B5B5B5';
      return '#00A870';
    };

    return (
      <div className={('omada-uq ' + className).trim()} {...rest}>
        <div className="omada-uq-head">
          <div className="omada-uq-headmain">
            <span className="omada-uq-headix"><Icon name="upload" size={18} /></span>
            <div className="omada-uq-headtext">
              <div className="omada-uq-title">{props.title || t('uq.title')}</div>
              <div className="omada-uq-sub">
                {allComplete
                  ? <span className="omada-uq-alldone"><Icon name="check-circle" size={13} />{t('uq.allComplete')}</span>
                  : (agg.done + ' / ' + agg.total + ' ' + t('uq.complete')
                      + (agg.error ? ' · ' + agg.error + ' ' + t('uq.failed') : ''))}
              </div>
            </div>
          </div>
          <div className="omada-uq-headactions">
            {anyPausable && <Button variant="text" size="small" onClick={() => call('onPauseAll')}><Icon name="pause" size={14} />{t('uq.pauseAll')}</Button>}
            {anyResumable && <Button variant="text" size="small" onClick={() => call('onResumeAll')}><Icon name="play" size={14} />{t('uq.resumeAll')}</Button>}
            {anyDone && <Button variant="text" size="small" onClick={() => call('onClear')}>{t('uq.clearDone')}</Button>}
            {props.onAdd && <Button variant="outline" size="small" onClick={() => props.onAdd()}><Icon name="plus" size={14} />{props.addLabel || t('uq.add')}</Button>}
          </div>
        </div>

        <div className="omada-uq-aggbar">
          <Progress percent={agg.overall} showInfo={false} size="small"
                    status={allComplete ? 'success' : (anyActive ? 'active' : 'normal')}
                    strokeColor={allComplete ? undefined : '#00A870'} />
          <span className="omada-uq-aggpct">{agg.overall}%</span>
        </div>

        <ul className="omada-uq-list" role="list">
          {items.length === 0 && (
            <li className="omada-uq-emptyrow">{t('uq.empty')}</li>
          )}
          {items.map((it) => (
            <li key={it.key} className={'omada-uq-row is-' + it.status} role="listitem">
              <span className={'omada-uq-fileix is-' + it.status}>
                <Icon name={it.status === 'error' ? 'warning' : (it.status === 'done' ? 'check-circle' : 'file-text')} size={17} />
              </span>
              <div className="omada-uq-rowmain">
                <div className="omada-uq-rowtop">
                  <span className="omada-uq-name" title={it.name}>{it.name}</span>
                  <span className="omada-uq-size">{fmtSize(it.size)}</span>
                  <StatusPill tone={STATUS_TONE[it.status]} className="omada-uq-pill">{t('uq.st.' + it.status)}</StatusPill>
                </div>
                <Progress
                  percent={it.status === 'done' ? 100 : (it.progress || 0)}
                  showInfo={false}
                  size="small"
                  status={progressStatus(it.status)}
                  strokeColor={progressColor(it.status)}
                  className="omada-uq-rowbar"
                />
              </div>
              <span className="omada-uq-rowactions">{rowActions(it)}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.UploadQueue = OmadaUploadQueue;
})();
