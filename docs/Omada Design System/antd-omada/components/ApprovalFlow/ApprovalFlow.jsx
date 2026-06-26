/* ────────────────────────────────────────────────────────────────────────
   components/ApprovalFlow/ApprovalFlow.jsx — OmadaApprovalFlow

   A request's life as a vertical timeline: submitted → reviewing → approved
   or rejected. Each stage carries an actor (who), a timestamp (when) and an
   optional note (why). The current stage pulses; completed stages get a tone
   rail (green done · red rejected · grey pending) and a connecting spine. An
   optional header shows the overall outcome pill, and — when `pendingActions`
   is set and the flow is still open — an Approve / Reject action pair for the
   reviewer, each routing through onAction(decision, note).

   Presentational: it renders whatever `stages` you pass. A note composer opens
   inline when the reviewer picks Reject (a reason is usually required there).

   Thin composition over Avatar + Input.TextArea + Button + OmadaIcon, on an
   antd-tokened surface. Token-driven, dark twin, i18n, RTL-mirrored.

   Figma: derived from Steps 步骤条 vertical mode + Timeline 时间轴 dot/rail
   styling. Original request-review composite.
   Exports: window.Omada.ApprovalFlow
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { Avatar, Input, Button } = window.antd;
  const Icon = window.Omada.Icon;

  const STATUS_META = {
    done:     { icon: 'check', cls: 'is-done' },
    current:  { icon: 'clock', cls: 'is-current' },
    rejected: { icon: 'close', cls: 'is-rejected' },
    pending:  { icon: 'circle', cls: 'is-pending' },
  };

  function initials(name) {
    if (!name) return '';
    const parts = String(name).trim().split(/\s+/);
    return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
  }

  function OmadaApprovalFlow(props) {
    const { useState } = React;
    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;

    const stages = props.stages || [];
    const outcome = props.outcome || 'pending';   // 'pending'|'approved'|'rejected'
    const showHeader = props.showHeader !== false;
    const pendingActions = props.pendingActions && outcome === 'pending';

    const [mode, setMode] = useState(null);       // null | 'reject' | 'approve'
    const [note, setNote] = useState('');

    const submit = (decision) => {
      if (props.onAction) props.onAction(decision, note.trim());
      setMode(null); setNote('');
    };

    const outcomeMeta =
      outcome === 'approved' ? { cls: 'is-approved', icon: 'check-circle', label: t('af.outcome.approved') } :
      outcome === 'rejected' ? { cls: 'is-rejected', icon: 'ban', label: t('af.outcome.rejected') } :
      { cls: 'is-pending', icon: 'clock', label: t('af.outcome.pending') };

    return (
      <div className="omada-af">
        {showHeader && (
          <div className="omada-af-head">
            <div className="omada-af-head-info">
              {props.title && <div className="omada-af-title">{props.title}</div>}
              {props.meta && <div className="omada-af-meta">{props.meta}</div>}
            </div>
            <span className={'omada-af-pill ' + outcomeMeta.cls}>
              <Icon name={outcomeMeta.icon} size={14} />{outcomeMeta.label}
            </span>
          </div>
        )}

        <ol className="omada-af-track">
          {stages.map((st, i) => {
            const meta = STATUS_META[st.status] || STATUS_META.pending;
            const last = i === stages.length - 1;
            return (
              <li key={st.key || i} className={'omada-af-stage ' + meta.cls}>
                <span className="omada-af-node" aria-hidden="true">
                  <Icon name={st.icon || meta.icon} size={14} />
                </span>
                {!last && <span className="omada-af-spine" aria-hidden="true" />}
                <div className="omada-af-body">
                  <div className="omada-af-row">
                    <span className="omada-af-stagetitle">{st.title}</span>
                    {st.time && <span className="omada-af-time">{st.time}</span>}
                  </div>
                  {st.actor && (
                    <div className="omada-af-actor">
                      <Avatar size={20} src={st.actorSrc}
                              style={{ background: st.actorColor || '#00A870', fontSize: 10 }}>
                        {st.actorSrc ? null : initials(st.actor)}
                      </Avatar>
                      <span className="omada-af-actorname">{st.actor}</span>
                      {st.role && <span className="omada-af-role">{st.role}</span>}
                    </div>
                  )}
                  {st.note && <p className="omada-af-note">{st.note}</p>}
                </div>
              </li>
            );
          })}
        </ol>

        {pendingActions && (
          <div className="omada-af-actions">
            {mode === 'reject' || mode === 'approve' ? (
              <div className="omada-af-composer">
                <label className="omada-af-composerlabel">
                  {mode === 'reject' ? t('af.reason.reject') : t('af.reason.approve')}
                </label>
                <Input.TextArea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={mode === 'reject' ? t('af.reason.placeholder.reject') : t('af.reason.placeholder.approve')}
                  autoSize={{ minRows: 2, maxRows: 4 }}
                  autoFocus
                />
                <div className="omada-af-composeractions">
                  <Button size="small" type="text" onClick={() => { setMode(null); setNote(''); }}>
                    {t('common.cancel')}
                  </Button>
                  <Button
                    size="small"
                    type="primary"
                    danger={mode === 'reject'}
                    disabled={mode === 'reject' && !note.trim()}
                    onClick={() => submit(mode)}
                  >
                    {mode === 'reject' ? t('af.confirm.reject') : t('af.confirm.approve')}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="omada-af-actionbar">
                <Button danger icon={<Icon name="close" size={15} />} onClick={() => setMode('reject')}>
                  {t('af.reject')}
                </Button>
                <Button type="primary" icon={<Icon name="check" size={15} />} onClick={() => setMode('approve')}>
                  {t('af.approve')}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.ApprovalFlow = OmadaApprovalFlow;
})();
