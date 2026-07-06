/* components/CommentThread/CommentThread.demo.jsx — window.OmadaDemos.CommentThread */
(function () {
  const CommentThread = window.Omada.CommentThread;
  const Pin = CommentThread.Pin;

  function CommentThreadDemo() {
    const ctx = window.useOmada();
    const t = ctx.t;
    const now = Date.now(), min = 60000, hr = 3600000;

    const seed = [
      { key: 'c1', author: 'Mei Lin', tone: 'blue', time: now - 3 * hr, body: t('ct.s.1') },
      { key: 'c2', author: 'Carlos Reyes', tone: 'magenta', time: now - 90 * min, body: t('ct.s.2') },
      { key: 'c3', author: 'Aiko Tanaka', tone: 'orange', time: now - 12 * min, body: t('ct.s.3') },
    ];
    const seed2 = [
      { key: 'd1', author: 'Sam Patel', tone: 'neutral', time: now - 26 * hr, body: t('ct.s.4') },
    ];

    return (
      <div className="omada-ct-demo">
        {/* inline-cue: pins dropped on a config row */}
        <div className="omada-ct-cue">
          <div className="omada-ct-cuerow">
            <span className="omada-ct-cuelabel">{t('ct.cue.port')} 3 · VLAN 20 · PoE on</span>
            <Pin title={t('ct.cue.port') + ' 3'} defaultComments={seed} youName="You" placement="leftTop" />
          </div>
          <div className="omada-ct-cuerow">
            <span className="omada-ct-cuelabel">{t('ct.cue.port')} 4 · VLAN 1 · PoE off</span>
            <Pin title={t('ct.cue.port') + ' 4'} defaultComments={seed2} resolved youName="You" placement="leftTop" />
          </div>
          <div className="omada-ct-cuerow">
            <span className="omada-ct-cuelabel">{t('ct.cue.port')} 5 · trunk</span>
            <Pin title={t('ct.cue.port') + ' 5'} defaultComments={[]} youName="You" placement="leftTop" />
          </div>
        </div>

        {/* expanded panel inline (as in a side drawer) */}
        <div className="omada-ct-inline">
          <CommentThread title={t('ct.cue.port') + ' 3'} defaultComments={seed} youName="You" />
        </div>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.CommentThread = CommentThreadDemo;
})();
