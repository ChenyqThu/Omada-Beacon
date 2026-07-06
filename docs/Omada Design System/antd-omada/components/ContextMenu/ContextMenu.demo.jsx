/* components/ContextMenu/ContextMenu.demo.jsx — window.OmadaDemos.ContextMenu */
(function () {
  const ContextMenu = window.Omada.ContextMenu;
  const Icon = window.Omada.Icon;

  function ContextMenuDemo() {
    const { useState } = React;
    const ctx = window.useOmada();
    const t = ctx.t;

    const [last, setLast] = useState(null);

    const items = [
      { key: 'open', label: t('ctx.open'), icon: 'eye' },
      { key: 'rename', label: t('ctx.rename'), icon: 'edit' },
      { key: 'duplicate', label: t('ctx.duplicate'), icon: 'copy' },
      { type: 'divider' },
      { key: 'move', label: t('ctx.move'), icon: 'map' },
      { key: 'copylink', label: t('ctx.copylink'), icon: 'external-link' },
      { key: 'reboot', label: t('ctx.reboot'), icon: 'reboot' },
      { type: 'divider' },
      { key: 'forget', label: t('ctx.forget'), icon: 'trash', danger: true },
    ];

    const tiles = [
      { id: 'AP-Lobby-01', icon: 'ap' },
      { id: 'SW-Core-01', icon: 'switch' },
      { id: 'GW-Main', icon: 'gateway' },
    ];

    const pick = (target) => (key) => {
      const label = (items.find((i) => i.key === key) || {}).label || key;
      setLast({ a: label, t: target });
    };

    return (
      <div className="omada-ctx-demo">
        <p className="omada-ctx-hint">{t('ctx.hint')}</p>
        <div className="omada-ctx-tiles">
          {tiles.map((tile) => (
            <ContextMenu key={tile.id} items={items} selectable onSelect={pick(tile.id)} ariaLabel={tile.id}>
              <div className="omada-ctx-tile">
                <span className="omada-ctx-tileic"><Icon name={tile.icon} size={22} /></span>
                <span className="omada-ctx-tilename">{tile.id}</span>
                <Icon name="more-vertical" size={16} className="omada-ctx-tilemore" />
              </div>
            </ContextMenu>
          ))}
        </div>
        <div className="omada-ctx-result">
          {last ? t('ctx.picked').replace('{a}', last.a).replace('{t}', last.t) : t('ctx.none')}
        </div>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.ContextMenu = ContextMenuDemo;
})();
