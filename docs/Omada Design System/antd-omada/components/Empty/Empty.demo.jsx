/* components/Empty/Empty.demo.jsx — window.OmadaDemos.Empty */
(function () {
  const { Empty, Button, Icon } = window.Omada;

  function EmptyDemo() {
    const { t } = window.useOmada();
    const card = { border: '1px solid var(--border-default,#ECECEC)', borderRadius: 12, padding: '28px 8px' };

    return (
      <div className="grid-3" style={{ alignItems: 'start' }}>
        <div style={card}>
          <Empty
            description={t('empty.noDevices')}
            withAction={
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 12, color: 'var(--fg-tertiary,#999)', maxWidth: 220, textAlign: 'center' }}>
                  {t('empty.noDevices.hint')}
                </span>
                <Button variant="primary" icon={<Icon name="plus" size={16} />}>{t('device.addDevice')}</Button>
              </div>
            }
          />
        </div>
        <div style={card}>
          <Empty description={t('empty.noResults')} />
        </div>
        <div style={card}>
          <Empty simple={false} description={t('empty.default')} />
        </div>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Empty = EmptyDemo;
})();
