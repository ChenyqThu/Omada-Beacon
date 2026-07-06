/* components/Progress/Progress.demo.jsx — window.OmadaDemos.Progress */
(function () {
  const { Progress, Icon } = window.Omada;
  const { Space } = window.antd;

  function ProgressDemo() {
    const { t } = window.useOmada();

    return (
      <>
        <div className="row"><span className="label">line</span></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 520 }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--fg-secondary)', marginBottom: 4 }}>{t('progress.uploading')}</div>
            <Progress tone="active" percent={80} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--fg-secondary)', marginBottom: 4 }}>{t('progress.complete')}</div>
            <Progress tone="success" percent={100} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--fg-secondary)', marginBottom: 4 }}>{t('progress.warning')}</div>
            <Progress tone="warning" percent={60} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--fg-secondary)', marginBottom: 4 }}>{t('progress.failed')}</div>
            <Progress tone="error" percent={60} />
          </div>
        </div>

        <div className="row" style={{ marginTop: 24 }}><span className="label">circle</span></div>
        <Space size={40} wrap align="center">
          <Progress type="circle" tone="active" percent={30} size={112} />
          <Progress type="circle" tone="success" percent={100} size={112} />
          <Progress type="circle" tone="warning" percent={68} size={112} />
          <Progress type="circle" tone="error" percent={45} size={112} />
        </Space>

        <div className="row" style={{ marginTop: 24 }}><span className="label">dashboard · small</span></div>
        <Space size={40} wrap align="center">
          <Progress type="dashboard" percent={75} size={112} />
          <Progress type="circle" percent={42} size={64} />
          <div style={{ width: 200 }}>
            <Progress percent={50} size="small" />
            <Progress percent={70} steps={5} style={{ marginTop: 10 }} />
          </div>
        </Space>
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Progress = ProgressDemo;
})();
