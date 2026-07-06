/* components/ActivityLog/ActivityLog.demo.jsx — window.OmadaDemos.ActivityLog */
(function () {
  const ActivityLog = window.Omada.ActivityLog;

  function ActivityLogDemo() {
    const ctx = window.useOmada();
    const t = ctx.t;
    const now = Date.now();
    const min = 60000, hr = 3600000, day = 86400000;

    const items = [
      { key: 'a1', icon: 'adopt', tone: 'brand', actor: 'Mei Lin', action: t('alog.e.adopted'), target: 'AP-Lobby-03', time: now - 4 * min },
      { key: 'a2', icon: 'reboot', tone: 'blue', actor: 'Carlos Reyes', action: t('alog.e.rebooted'), target: 'SW-Core-01', time: now - 38 * min },
      { key: 'a3', icon: 'upload', tone: 'orange', actor: 'system', action: t('alog.e.firmware'), target: 'Gateway-HQ', time: now - 2 * hr, meta: t('alog.e.firmwareMeta') },
      { key: 'a4', icon: 'warning', tone: 'red', actor: 'monitor', action: t('alog.e.offline'), target: 'AP-Warehouse-7', time: now - 5 * hr },
      { key: 'a5', icon: 'edit', tone: 'neutral', actor: 'Aiko Tanaka', action: t('alog.e.renamed'), target: 'Site B', time: now - day - 1 * hr },
      { key: 'a6', icon: 'user', tone: 'blue', actor: 'Sam Patel', action: t('alog.e.invited'), target: 'nora@corp.io', time: now - day - 3 * hr },
      { key: 'a7', icon: 'lock', tone: 'orange', actor: 'Mei Lin', action: t('alog.e.policy'), target: 'Guest WLAN', time: now - day - 6 * hr },
      { key: 'a8', icon: 'check-circle', tone: 'brand', actor: 'Carlos Reyes', action: t('alog.e.resolved'), target: '#4821', time: now - 2 * day },
      { key: 'a9', icon: 'download', tone: 'neutral', actor: 'Sam Patel', action: t('alog.e.exported'), target: t('alog.e.exportTarget'), time: now - 2 * day - 2 * hr },
      { key: 'a10', icon: 'disconnect', tone: 'red', actor: 'monitor', action: t('alog.e.linkdown'), target: 'Uplink WAN2', time: now - 3 * day },
    ];

    return (
      <div className="omada-alog-demo">
        <ActivityLog items={items} pageSize={5} />
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.ActivityLog = ActivityLogDemo;
})();
