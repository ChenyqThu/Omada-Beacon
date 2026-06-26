/* components/ApprovalFlow/ApprovalFlow.demo.jsx — window.OmadaDemos.ApprovalFlow */
(function () {
  const ApprovalFlow = window.Omada.ApprovalFlow;
  const { App, Segmented } = window.antd;

  function ApprovalFlowDemo() {
    const { useState } = React;
    const ctx = window.useOmada();
    const t = ctx.t;
    const appApi = App.useApp ? App.useApp() : null;
    const msg = appApi && appApi.message ? appApi.message : { success: () => {}, error: () => {} };

    // a live, still-open request the viewer can act on
    const baseStages = () => ([
      { key: 'sub', status: 'done', title: t('af.s.submitted'), actor: 'Lena Ortiz',
        role: t('af.r.requester'), actorColor: '#00A870', time: t('af.t.sub'),
        note: t('af.note.sub') },
      { key: 'rev', status: 'current', title: t('af.s.reviewing'), actor: 'You',
        role: t('af.r.approver'), actorColor: '#2A6FDB', time: t('af.t.rev') },
      { key: 'dec', status: 'pending', title: t('af.s.decision') },
    ]);

    const [stages, setStages] = useState(baseStages);
    const [outcome, setOutcome] = useState('pending');

    const onAction = (decision, note) => {
      const decided = stages.slice(0, 2).concat([{
        key: 'dec',
        status: decision === 'approve' ? 'done' : 'rejected',
        title: decision === 'approve' ? t('af.s.approved') : t('af.s.rejected'),
        actor: 'You', role: t('af.r.approver'), actorColor: '#2A6FDB', time: t('af.t.now'),
        note: note || undefined,
      }]);
      setStages(decided);
      setOutcome(decision === 'approve' ? 'approved' : 'rejected');
      if (decision === 'approve') msg.success(t('af.toast.approved'));
      else msg.error(t('af.toast.rejected'));
    };

    const reset = () => { setStages(baseStages()); setOutcome('pending'); };

    // a second, already-closed example (rejected) for the read-only state
    const closedStages = [
      { key: 'sub', status: 'done', title: t('af.s.submitted'), actor: 'Marco Reyes',
        role: t('af.r.requester'), actorColor: '#00A870', time: t('af.t.sub2'), note: t('af.note.sub2') },
      { key: 'rev', status: 'done', title: t('af.s.reviewing'), actor: 'Priya N.',
        role: t('af.r.approver'), actorColor: '#7C5CFF', time: t('af.t.rev2') },
      { key: 'dec', status: 'rejected', title: t('af.s.rejected'), actor: 'Priya N.',
        role: t('af.r.approver'), actorColor: '#7C5CFF', time: t('af.t.dec2'), note: t('af.note.rej') },
    ];

    return (
      <div className="omada-af-demo">
        <div className="omada-af-demo-card">
          <div className="omada-af-demo-toolbar">
            <span className="omada-af-demo-label">{t('af.demo.live')}</span>
            {outcome !== 'pending' && (
              <Segmented
                size="small"
                options={[{ label: t('af.demo.replay'), value: 'replay' }]}
                onChange={reset}
                value={null}
              />
            )}
          </div>
          <ApprovalFlow
            title={t('af.demo.title1')}
            meta={t('af.demo.meta1')}
            stages={stages}
            outcome={outcome}
            pendingActions
            onAction={onAction}
          />
        </div>

        <div className="omada-af-demo-card">
          <span className="omada-af-demo-label">{t('af.demo.closed')}</span>
          <ApprovalFlow
            title={t('af.demo.title2')}
            meta={t('af.demo.meta2')}
            stages={closedStages}
            outcome="rejected"
          />
        </div>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.ApprovalFlow = ApprovalFlowDemo;
})();
