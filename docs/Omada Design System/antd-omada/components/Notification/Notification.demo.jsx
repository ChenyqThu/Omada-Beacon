/* components/Notification/Notification.demo.jsx — window.OmadaDemos.Notification */
(function () {
  const { Button } = window.Omada;
  const { Icon } = window.Omada;
  const { Space } = window.antd;

  function NotificationDemo() {
    const { t } = window.useOmada();
    const notify = window.Omada.useNotification();

    const firmware = () => {
      const key = 'fw-' + Date.now();
      notify.info({
        key,
        message: t('notif.firmwareTitle'),
        description: t('notif.firmwareBody'),
        btn: (
          <Space>
            <Button size="small" variant="text" onClick={() => notify.notification.destroy(key)}>{t('common.cancel')}</Button>
            <Button size="small" variant="primary" onClick={() => notify.notification.destroy(key)}>{t('alert.update')}</Button>
          </Space>
        ),
      });
    };

    return (
      <>
        <div className="row">
          <span className="label">status</span>
          <Button variant="outline" icon={<Icon name="check-circle" size={16} />}
            onClick={() => notify.success({ message: t('notif.adoptedTitle'), description: t('notif.adoptedBody') })}>
            {t('notif.adoptedTitle')}
          </Button>
          <Button variant="danger-ghost" icon={<Icon name="disconnect" size={16} />}
            onClick={() => notify.error({ message: t('notif.offlineTitle'), description: t('notif.offlineBody') })}>
            {t('notif.offlineTitle')}
          </Button>
        </div>
        <div className="row">
          <span className="label">with actions</span>
          <Button variant="primary" icon={<Icon name="download" size={16} />} onClick={firmware}>
            {t('notif.trigger.action')}
          </Button>
        </div>
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Notification = NotificationDemo;
})();
