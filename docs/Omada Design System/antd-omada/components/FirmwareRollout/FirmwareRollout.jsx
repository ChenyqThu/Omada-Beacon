/* ────────────────────────────────────────────────────────────────────────
   components/FirmwareRollout/FirmwareRollout.jsx — OmadaFirmwareRollout

   A STAGED firmware rollout tracker. A rollout moves through ordered
   WAVES (lab ring → canary sites → regional → everything); each wave
   shows its device count, live progress and state, and can be paused /
   resumed / retried individually. A failed wave blocks the waves after
   it (they stay queued and show a blocked tint).

     · `version`  — firmware version string (mono chip in the header).
     · `waves`    — [{ id, name, devices, progress 0–100,
                       state: 'done'|'active'|'paused'|'queued'|'error' }]
     · `onAction(id, 'pause'|'resume'|'retry')` — controls live upstream.

   Header aggregates: overall % (device-weighted) + waves-complete count.
   Distinct from UploadQueue (per-file transfers) and Steps (static nav):
   this is an operational fleet-progress surface with per-wave control.

   Token-driven, dark twin, i18n, RTL-safe (numbers stay LTR).
   Figma: no dedicated node this session (VFS permission pending) —
   anatomy follows Steps / Progress + the UploadQueue row precedent.
   Exports: window.Omada.FirmwareRollout
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const Icon = window.Omada.Icon;
  const { Progress, Button, Tooltip } = window.antd;

  const STATE_ICON = { done: 'check', active: null, paused: 'pause', queued: 'clock', error: 'warning' };

  function OmadaFirmwareRollout(props) {
    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;

    const waves = props.waves || [];
    const totalDev = waves.reduce((s, w) => s + (w.devices || 0), 0) || 1;
    const overall = Math.round(waves.reduce((s, w) => s + (w.progress || 0) * (w.devices || 0), 0) / totalDev);
    const doneCount = waves.filter((w) => w.state === 'done').length;
    const errorIdx = waves.findIndex((w) => w.state === 'error');

    const act = (id, action) => { if (props.onAction) props.onAction(id, action); };

    return (
      <div className={'omada-fwr' + (props.className ? ' ' + props.className : '')}>
        <div className="omada-fwr-head">
          <span className="omada-fwr-headicon"><Icon name="rocket" size={18} /></span>
          <div className="omada-fwr-headmain">
            <div className="omada-fwr-headrow">
              <span className="omada-fwr-title">{t('fwr.firmware')}</span>
              <span className="omada-fwr-ver">{props.version}</span>
              <span className="omada-fwr-wavesdone">
                {t('fwr.wavesdone').replace('{a}', doneCount).replace('{b}', waves.length)}
              </span>
            </div>
            <div className="omada-fwr-overall">
              <span className="omada-fwr-overalllabel">{t('fwr.overall')}</span>
              <Progress percent={overall} showInfo={false} size={{ height: 6 }}
                        status={errorIdx >= 0 ? 'exception' : undefined} />
              <span className="omada-fwr-pct">{overall}%</span>
            </div>
          </div>
        </div>

        <ol className="omada-fwr-waves">
          {waves.map((w, i) => {
            const blocked = errorIdx >= 0 && i > errorIdx && w.state === 'queued';
            const stIcon = STATE_ICON[w.state];
            return (
              <li key={w.id} className={'omada-fwr-wave is-' + w.state + (blocked ? ' is-blocked' : '')}>
                <span className="omada-fwr-dot" aria-hidden="true">
                  {w.state === 'done' ? <Icon name="check" size={11} strokeWidth={2.4} />
                    : w.state === 'error' ? <Icon name="close" size={10} strokeWidth={2.4} />
                    : <span className="omada-fwr-dotnum">{i + 1}</span>}
                </span>
                <div className="omada-fwr-wavemain">
                  <div className="omada-fwr-waverow">
                    <span className="omada-fwr-wavename">{w.name}</span>
                    <span className="omada-fwr-wavedev">{t('fwr.devices').replace('{n}', w.devices)}</span>
                    <span className={'omada-fwr-pill is-' + w.state}>
                      {stIcon ? <Icon name={stIcon} size={11} /> : <span className="omada-fwr-livedot" aria-hidden="true" />}
                      {t('fwr.st.' + w.state)}
                    </span>
                  </div>
                  <div className="omada-fwr-wavebar">
                    <Progress
                      percent={w.progress}
                      showInfo={false}
                      size={{ height: 4 }}
                      status={w.state === 'error' ? 'exception' : w.state === 'done' ? 'success' : 'normal'}
                      strokeColor={w.state === 'paused' ? '#B9BDC4' : undefined}
                    />
                    <span className="omada-fwr-wavepct">{w.progress}%</span>
                  </div>
                </div>
                <span className="omada-fwr-act">
                  {w.state === 'active' && (
                    <Tooltip title={t('fwr.pause')}>
                      <Button size="small" type="text" aria-label={t('fwr.pause')}
                              icon={<Icon name="pause" size={13} />} onClick={() => act(w.id, 'pause')} />
                    </Tooltip>
                  )}
                  {w.state === 'paused' && (
                    <Tooltip title={t('fwr.resume')}>
                      <Button size="small" type="text" aria-label={t('fwr.resume')}
                              icon={<Icon name="play" size={13} />} onClick={() => act(w.id, 'resume')} />
                    </Tooltip>
                  )}
                  {w.state === 'error' && (
                    <Button size="small" danger onClick={() => act(w.id, 'retry')}>{t('fwr.retry')}</Button>
                  )}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.FirmwareRollout = OmadaFirmwareRollout;
})();
