/* ────────────────────────────────────────────────────────────────────────
   components/AutoSave/AutoSave.jsx — OmadaAutoSave

   The "your work is being kept" cue for any auto-saving surface. A compact
   inline status chip cycles through idle → saving → saved (with a relative
   "Saved 4s ago" timestamp that ticks) and surfaces two failure paths:
     · error  — the save request failed; a Retry action sits in the chip.
     · conflict — the record changed underneath you; the chip turns amber and
       a resolution bar offers Keep mine / Use theirs / Review changes.

   `OmadaAutoSave` is presentational — it renders whatever `status` you pass.
   `useAutoSave(saveFn, { delay })` is the optional companion hook that debounces
   a change, drives the status, and exposes { status, savedAt, schedule, retry }.

   Thin composition over Button + OmadaIcon. Token-driven, dark twin.

   Figma: derived from Alert 警告提示 (3:25828) tone system + the Message status
   glyphs. Original status-cue pattern.
   Exports: window.Omada.AutoSave, window.useAutoSave
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { Button } = window.antd;
  const Icon = window.Omada.Icon;

  function relAgo(ts, t) {
    if (!ts) return '';
    const s = Math.max(0, Math.round((Date.now() - ts) / 1000));
    if (s < 5) return t('as.savedjustnow');
    if (s < 60) return t('as.savedsecs').replace('{n}', s);
    const m = Math.floor(s / 60);
    return t('as.savedmins').replace('{n}', m);
  }

  function OmadaAutoSave(props) {
    const { useState, useEffect } = React;
    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;
    const status = props.status || 'idle';

    // tick so the "saved 4s ago" label stays fresh
    const [, force] = useState(0);
    useEffect(() => {
      if (status !== 'saved') return;
      const id = setInterval(() => force((n) => n + 1), 5000);
      return () => clearInterval(id);
    }, [status, props.savedAt]);

    const chipState =
      status === 'saving' ? { cls: 'is-saving', icon: 'refresh', spin: true, label: t('as.saving') } :
      status === 'saved' ? { cls: 'is-saved', icon: 'check-circle', label: relAgo(props.savedAt, t) } :
      status === 'error' ? { cls: 'is-error', icon: 'warning', label: t('as.error') } :
      status === 'conflict' ? { cls: 'is-conflict', icon: 'warning', label: t('as.conflict') } :
      { cls: 'is-idle', icon: 'check', label: t('as.idle') };

    return (
      <div className="omada-as">
        <span className={'omada-as-chip ' + chipState.cls} role="status" aria-live="polite">
          <Icon name={chipState.icon} size={14} className={chipState.spin ? 'omada-as-spin' : ''} />
          <span className="omada-as-label">{chipState.label}</span>
          {status === 'error' && (
            <button type="button" className="omada-as-inlinebtn" onClick={props.onRetry}>{t('as.retry')}</button>
          )}
        </span>

        {status === 'conflict' && (
          <div className="omada-as-conflict" role="alertdialog" aria-label={t('as.conflict')}>
            <div className="omada-as-cf-body">
              <span className="omada-as-cf-title">{t('as.conflict')}</span>
              <p className="omada-as-cf-desc">{t('as.conflict.desc')}</p>
            </div>
            <div className="omada-as-cf-actions">
              <Button size="small" type="text" onClick={() => props.onResolve && props.onResolve('review')}>
                {t('as.review')}
              </Button>
              <Button size="small" onClick={() => props.onResolve && props.onResolve('theirs')}>
                {t('as.usetheirs')}
              </Button>
              <Button size="small" type="primary" onClick={() => props.onResolve && props.onResolve('mine')}>
                {t('as.keepmine')}
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Optional hook: debounce a change → drive status. saveFn may throw / reject.
  function useAutoSave(saveFn, opts) {
    const { useState, useRef, useCallback } = React;
    const o = opts || {};
    const delay = o.delay == null ? 900 : o.delay;
    const [status, setStatus] = useState('idle');
    const [savedAt, setSavedAt] = useState(null);
    const timer = useRef(null);
    const lastPayload = useRef(null);

    const run = useCallback(async (payload) => {
      setStatus('saving');
      try {
        const res = await Promise.resolve(saveFn ? saveFn(payload) : null);
        if (res === 'conflict') { setStatus('conflict'); return; }
        setStatus('saved'); setSavedAt(Date.now());
      } catch (e) {
        setStatus('error');
      }
    }, [saveFn]);

    const schedule = useCallback((payload) => {
      lastPayload.current = payload;
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => run(payload), delay);
    }, [delay, run]);

    const retry = useCallback(() => run(lastPayload.current), [run]);
    const set = useCallback((s) => setStatus(s), []);

    return { status, savedAt, schedule, retry, setStatus: set };
  }

  window.Omada = window.Omada || {};
  window.Omada.AutoSave = OmadaAutoSave;
  window.useAutoSave = useAutoSave;
})();
