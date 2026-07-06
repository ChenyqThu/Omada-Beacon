/* components/Popconfirm/Popconfirm.demo.jsx — window.OmadaDemos.Popconfirm */
(function () {
  const { Popconfirm, Button } = window.Omada;
  const { Icon } = window.Omada;

  function PopconfirmDemo() {
    const { t } = window.useOmada();
    return (
      <>
        <div className="row">
          <span className="label">danger</span>
          <Popconfirm
            tone="danger"
            title={t('pop.deleteTitle')}
            okText={t('common.delete')}
            cancelText={t('common.cancel')}
            placement="topLeft"
          >
            <Button variant="danger-ghost" icon={<Icon name="trash" size={16} />}>{t('common.delete')}</Button>
          </Popconfirm>
        </div>
        <div className="row">
          <span className="label">with body</span>
          <Popconfirm
            tone="warning"
            title={t('pop.forgetTitle')}
            description={t('pop.forgetBody')}
            okText={t('device.forget')}
            cancelText={t('common.cancel')}
          >
            <Button variant="outline" icon={<Icon name="disconnect" size={16} />}>{t('device.forget')}</Button>
          </Popconfirm>
        </div>
        <div className="row">
          <span className="label">info</span>
          <Popconfirm
            tone="info"
            title={t('modal.infoTitle')}
            okText={t('common.ok')}
            cancelText={t('common.cancel')}
            placement="right"
          >
            <Button variant="text" icon={<Icon name="info" size={16} />}>{t('modal.infoTitle')}</Button>
          </Popconfirm>
        </div>
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Popconfirm = PopconfirmDemo;
})();
