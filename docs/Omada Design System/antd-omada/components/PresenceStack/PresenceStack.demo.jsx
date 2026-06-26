/* components/PresenceStack/PresenceStack.demo.jsx — window.OmadaDemos.PresenceStack */
(function () {
  const PresenceStack = window.Omada.PresenceStack;

  function PresenceStackDemo() {
    const ctx = window.useOmada();
    const t = ctx.t;

    const team = [
      { key: 'u1', name: 'Mei Lin', tone: 'brand', status: 'active', editing: true },
      { key: 'u2', name: 'Carlos Reyes', tone: 'blue', status: 'active' },
      { key: 'u3', name: 'Aiko Tanaka', tone: 'magenta', status: 'idle' },
      { key: 'u4', name: 'Sam Patel', tone: 'orange', status: 'active' },
      { key: 'u5', name: 'Nora Schmidt', tone: 'neutral', status: 'offline' },
      { key: 'u6', name: 'Omar Haddad', tone: 'blue', status: 'idle' },
    ];

    return (
      <div className="omada-ps-demo">
        {/* in-context: a document toolbar */}
        <div className="omada-ps-toolbar">
          <div className="omada-ps-toolbarleft">
            <span className="omada-ps-doctitle">{t('ps.doc')}</span>
            <span className="omada-ps-docmeta">{t('ps.autosaved')}</span>
          </div>
          <PresenceStack users={team} max={4} />
        </div>

        {/* variants row */}
        <div className="omada-ps-variants">
          <div className="omada-ps-variant">
            <span className="omada-ps-vlabel">{t('ps.v.small')}</span>
            <PresenceStack users={team.slice(0, 3)} size={24} showLabel={false} />
          </div>
          <div className="omada-ps-variant">
            <span className="omada-ps-vlabel">{t('ps.v.large')}</span>
            <PresenceStack users={team} size={40} max={3} label={team.length + ' ' + t('ps.online')} />
          </div>
          <div className="omada-ps-variant">
            <span className="omada-ps-vlabel">{t('ps.v.solo')}</span>
            <PresenceStack users={[team[0]]} showLabel={false} />
          </div>
        </div>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.PresenceStack = PresenceStackDemo;
})();
