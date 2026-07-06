/* components/Spin/Spin.demo.jsx — window.OmadaDemos.Spin */
(function () {
  const { Spin, Button, Icon } = window.Omada;
  const { Space, Divider } = window.antd;
  const { useState, useEffect } = React;

  function SpinDemo() {
    const { t, lang } = window.useOmada();
    const L = (en, zh) => (lang === 'zh' ? zh : en);

    const [blocking, setBlocking] = useState(false);
    const [pct, setPct] = useState(0);

    // blocking overlay auto-resolves
    useEffect(() => {
      if (!blocking) return undefined;
      const id = setTimeout(() => setBlocking(false), 2200);
      return () => clearTimeout(id);
    }, [blocking]);

    // a looping determinate percent for the ring
    useEffect(() => {
      const id = setInterval(() => setPct((p) => (p >= 100 ? 0 : p + 4)), 120);
      return () => clearInterval(id);
    }, []);

    return (
      <>
        <div className="row"><span className="label">sizes</span></div>
        <Space size={40} align="center">
          <Spin size="small" />
          <Spin />
          <Spin size="large" />
          <Spin tip={t('loading.tip')}>
            <div style={{ width: 150, height: 52 }} />
          </Spin>
        </Space>

        <div className="row" style={{ marginTop: 22 }}><span className="label">percent</span></div>
        <Space size={40} align="center">
          <Spin percent={pct} size="large" />
          <Spin percent="auto" size="large" />
          <span style={{ fontSize: 12, color: 'var(--fg-tertiary,#999)' }}>
            {L('determinate ', '确定进度 ')}{pct}% · {L('auto (indeterminate)', '自动（不确定）')}
          </span>
        </Space>

        <div className="row" style={{ marginTop: 22 }}><span className="label">blocking</span></div>
        <Space align="center">
          <Button variant="secondary" onClick={() => setBlocking(true)} disabled={blocking}>
            {t('loading.fetching')}
          </Button>
          <Spin spinning={blocking} tip={t('loading.fetching')}>
            <div style={{
              width: 320, height: 80, borderRadius: 8,
              border: '1px solid var(--border-default)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--fg-tertiary)', fontSize: 13,
            }}>
              {t('desc.clients')}: 128 · {t('desc.throughput')}: 1.2 Gbps
            </div>
          </Spin>
        </Space>

        <Divider style={{ margin: '24px 0 18px' }} />

        <div className="row"><span className="label">delay 300ms</span></div>
        <Space align="center" size={28}>
          <Spin spinning delay={300} size="small" />
          <span style={{ fontSize: 12, color: 'var(--fg-tertiary,#999)' }}>
            {L('skips the spinner for fast responses', '快速响应时不显示加载图标')}
          </span>
        </Space>
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Spin = SpinDemo;
})();
