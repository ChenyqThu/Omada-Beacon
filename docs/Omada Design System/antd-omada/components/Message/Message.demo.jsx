/* components/Message/Message.demo.jsx — window.OmadaDemos.Message */
(function () {
  const { Button } = window.Omada;
  const { Icon } = window.Omada;

  function MessageDemo() {
    const { lang, t } = window.useOmada();
    const msg = window.Omada.useMessage();

    const runLoading = () => {
      const hide = msg.loading(t('msg.rebooting'));
      setTimeout(() => { hide(); msg.success(t('msg.saved')); }, 1600);
    };

    return (
      <>
        <div className="row">
          <span className="label">status</span>
          <Button variant="outline" icon={<Icon name="check-circle" size={16} />}
            onClick={() => msg.success(t('msg.saved'))}>{t('msg.trigger.success')}</Button>
          <Button variant="danger-ghost" icon={<Icon name="ban" size={16} />}
            onClick={() => msg.error(t('msg.applyFailed'))}>{t('msg.trigger.error')}</Button>
          <Button variant="text" icon={<Icon name="info" size={16} />}
            onClick={() => msg.info(t('msg.copied'))}>{lang === 'zh' ? '显示信息' : 'Show info'}</Button>
        </div>
        <div className="row">
          <span className="label">loading</span>
          <Button variant="secondary" icon={<Icon name="reboot" size={16} />}
            onClick={runLoading}>{t('msg.trigger.loading')}</Button>
          <span style={{ fontSize: 12, color: 'var(--fg-tertiary,#999)' }}>
            {t('msg.rebooting')} → {t('msg.saved')}
          </span>
        </div>
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Message = MessageDemo;
})();
