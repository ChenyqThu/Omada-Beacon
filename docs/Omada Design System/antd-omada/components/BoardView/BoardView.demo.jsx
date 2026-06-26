/* components/BoardView/BoardView.demo.jsx — window.OmadaDemos.BoardView */
(function () {
  const { useState } = React;
  const Icon = window.Omada.Icon;
  const BoardView = window.Omada.BoardView;

  function BoardViewDemo() {
    const ctx = window.useOmada();
    const t = ctx.t;

    const initial = [
      { key: 'backlog', title: t('bv.c.backlog'), accent: '#999999', items: [
        { key: 'd1', name: 'AP-Lobby-07',  type: 'ap',      model: 'EAP670',  prio: 'med' },
        { key: 'd2', name: 'SW-IDF-04',    type: 'switch',  model: 'SG3428',  prio: 'low' },
      ] },
      { key: 'provision', title: t('bv.c.provision'), accent: '#FF8C27', limit: 3, items: [
        { key: 'd3', name: 'GW-Edge-02',   type: 'gateway', model: 'ER8411',  prio: 'high' },
        { key: 'd4', name: 'AP-Floor3-01', type: 'ap',      model: 'EAP650',  prio: 'med' },
      ] },
      { key: 'online', title: t('bv.c.online'), accent: '#00A870', items: [
        { key: 'd5', name: 'AP-Lobby-01',  type: 'ap',      model: 'EAP670',  prio: 'low' },
        { key: 'd6', name: 'SW-Core-01',   type: 'switch',  model: 'SG3428X', prio: 'low' },
        { key: 'd7', name: 'AP-Cafe-02',   type: 'ap',      model: 'EAP610',  prio: 'low' },
      ] },
      { key: 'issues', title: t('bv.c.issues'), accent: '#EE385C', items: [
        { key: 'd8', name: 'AP-Patio-02',  type: 'ap',      model: 'EAP610',  prio: 'high' },
      ] },
    ];

    const [cols, setCols] = useState(initial);

    const prioTone = { high: 'error', med: 'warning', low: 'info' };

    return (
      <BoardView
        columns={cols}
        onChange={setCols}
        cardKey="key"
        renderCard={function (d, colKey) {
          return (
            <div className="omada-bv-dev">
              <span className="omada-bv-devix"><Icon name={d.type} size={16} /></span>
              <span className="omada-bv-devtxt">
                <span className="omada-bv-devname">{d.name}</span>
                <span className="omada-bv-devmodel">{d.model}</span>
              </span>
              <span className={'omada-bv-prio tone-' + prioTone[d.prio]}>{t('bv.p.' + d.prio)}</span>
            </div>
          );
        }}
      />
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.BoardView = BoardViewDemo;
})();
