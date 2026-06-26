/* components/App/App.demo.jsx — window.OmadaDemos.App */
(function () {
  const { useState } = React;

  // Inner panel — lives under the root <App> (ThemeProvider) so useOmadaApp()
  // returns LIVE message/notification/modal that inherit theme + locale + dir.
  function ContextPanel(props) {
    const t = props.t;
    const Button = window.Omada.Button;
    const app = window.useOmadaApp();   // { message, notification, modal }

    return (
      <div className="omada-appx-row">
        <Button variant="secondary"
                onClick={() => app.message.success(t('app.msgSaved'))}>
          <window.OmadaIcon name="check-circle" size={15} /> {t('app.fireSuccess')}
        </Button>
        <Button variant="secondary"
                onClick={() => app.message.error(t('app.msgFailed'))}>
          <window.OmadaIcon name="warning" size={15} /> {t('app.fireError')}
        </Button>
        <Button variant="secondary"
                onClick={() => app.notification.open({
                  message: t('app.notifTitle'),
                  description: t('app.notifBody'),
                  icon: <window.OmadaIcon name="adopt" size={20} />,
                })}>
          <window.OmadaIcon name="bell" size={15} /> {t('app.fireNotif')}
        </Button>
        <Button variant="danger"
                onClick={() => app.modal.confirm({
                  title: t('app.modalTitle'),
                  content: t('app.modalBody'),
                  okText: t('common.delete'),
                  okButtonProps: { danger: true },
                  cancelText: t('common.cancel'),
                  icon: null,
                })}>
          <window.OmadaIcon name="trash" size={15} /> {t('app.fireModal')}
        </Button>
      </div>
    );
  }

  // Scoped boundary — a NESTED OmadaApp overrides defaults for just this subtree
  // (here: stack notifications bottom-right). Proves defaults compose by scope.
  function ScopedPanel(props) {
    const t = props.t;
    const Button = window.Omada.Button;
    const app = window.useOmadaApp();
    return (
      <div className="omada-appx-row">
        <Button variant="secondary"
                onClick={() => app.notification.open({
                  message: t('app.scopedTitle'),
                  description: t('app.scopedBody'),
                  icon: <window.OmadaIcon name="map" size={20} />,
                })}>
          <window.OmadaIcon name="bell" size={15} /> {t('app.fireScoped')}
        </Button>
      </div>
    );
  }

  function AppDemo() {
    const ctx = window.useOmada ? window.useOmada() : { t: (k) => k };
    const t = ctx.t;
    const { App } = window.Omada;

    return (
      <div className="omada-appx">
        <div className="omada-appx-card">
          <div className="omada-appx-tag">{t('app.contextual')}</div>
          <div className="omada-appx-desc">{t('app.contextualDesc')}</div>
          <ContextPanel t={t} />
        </div>

        <div className="omada-appx-card">
          <div className="omada-appx-tag">{t('app.scoped')}</div>
          <div className="omada-appx-desc">{t('app.scopedDesc')}</div>
          {/* nested boundary — only this subtree gets bottom-right notifications */}
          <App notification={{ placement: 'bottomRight' }}>
            <ScopedPanel t={t} />
          </App>
        </div>

        <div className="omada-appx-note">{t('app.note')}</div>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.App = AppDemo;
})();
