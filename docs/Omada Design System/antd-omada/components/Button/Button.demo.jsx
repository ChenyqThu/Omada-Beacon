/* components/Button/Button.demo.jsx — every variant / size / state, both themes.
   Mounted by index.html. Exposes window.OmadaDemos.Button */
(function () {
  const { Button, IconButton, Icon } = window.Omada;
  const { Space } = window.antd;

  function ButtonDemo() {
    const { t, mode } = window.useOmada();
    return (
      <>
        <div className="row">
          <span className="label">variant</span>
          <Button variant="primary">{t('common.apply')}</Button>
          <Button variant="secondary">{t('common.cancel')}</Button>
          <Button variant="outline">{t('device.adopt')}</Button>
          <Button variant="dashed" icon="plus">{t('device.addDevice')}</Button>
          <Button variant="text">{t('common.more')}</Button>
          <Button variant="link" icon="external-link">{t('common.docs')}</Button>
        </div>
        <div className="row">
          <span className="label">with icon</span>
          <Button variant="primary" icon="plus">{t('device.addDevice')}</Button>
          <Button variant="secondary" icon="refresh">{t('common.refresh')}</Button>
          <Button variant="outline" icon="download">{t('common.export')}</Button>
        </div>
        <div className="row">
          <span className="label">size</span>
          <Button variant="primary" size="large">{t('common.signIn')}</Button>
          <Button variant="primary">{t('common.apply')}</Button>
          <Button variant="primary" size="small">{t('common.apply')}</Button>
        </div>
        <div className="row">
          <span className="label">state</span>
          <Button variant="primary" loading>{t('common.saving')}</Button>
          <Button variant="primary" disabled>{t('common.apply')}</Button>
          <Button variant="secondary" disabled>{t('common.cancel')}</Button>
          <Button variant="outline" disabled>{t('device.adopt')}</Button>
        </div>
        <div className="row">
          <span className="label">danger</span>
          <Button variant="danger" icon="trash">{t('common.delete')}</Button>
          <Button variant="danger-outline">{t('device.forget')}</Button>
          <Button variant="danger-text">{t('common.remove')}</Button>
        </div>
        <div className="row">
          <span className="label">icon-only</span>
          <IconButton icon="search" label={t('common.search')} />
          <IconButton icon="refresh" label={t('common.refresh')} />
          <IconButton icon="settings" label="Settings" />
          <IconButton icon="more-vertical" label={t('common.more')} />
          <IconButton icon="plus" label={t('common.add')} variant="primary" shape="circle" />
        </div>
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Button = ButtonDemo;
})();
