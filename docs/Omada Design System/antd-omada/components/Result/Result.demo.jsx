/* components/Result/Result.demo.jsx — window.OmadaDemos.Result */
(function () {
  const { Result, Button } = window.Omada;

  function ResultDemo() {
    const { t } = window.useOmada();

    const card = { border: '1px solid var(--border-default,#ECECEC)', borderRadius: 12, padding: 8 };

    return (
      <div className="grid-2" style={{ alignItems: 'start', gap: '18px 28px' }}>
        <div style={card}>
          <Result
            tone="success"
            title={t('result.successTitle')}
            subTitle={t('result.successBody')}
            extra={[
              <Button variant="primary" key="view">{t('result.viewSite')}</Button>,
              <Button variant="secondary" key="home">{t('result.backHome')}</Button>,
            ]}
          />
        </div>
        <div style={card}>
          <Result
            tone="error"
            title={t('result.errorTitle')}
            subTitle={t('result.errorBody')}
            extra={[
              <Button variant="primary" key="retry">{t('result.retry')}</Button>,
              <Button variant="text" key="detail">{t('result.detail')}</Button>,
            ]}
          />
        </div>
        <div style={card}>
          <Result
            status="404"
            title={t('result.404Title')}
            subTitle={t('result.404Body')}
            extra={<Button variant="primary">{t('result.backHome')}</Button>}
          />
        </div>
        <div style={card}>
          <Result
            status="403"
            title={t('result.403Title')}
            subTitle={t('result.403Body')}
            extra={<Button variant="primary">{t('result.backHome')}</Button>}
          />
        </div>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Result = ResultDemo;
})();
