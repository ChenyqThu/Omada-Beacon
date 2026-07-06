/* components/Grid/Grid.demo.jsx — window.OmadaDemos.Grid */
(function () {
  const { Row, Col } = window.Omada;

  function Block({ children, accent }) {
    return (
      <div style={{
        height: 56, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 12, fontFamily: 'var(--font-mono, monospace)',
        background: accent ? 'var(--omada-green-50, #E5F6EE)' : 'var(--grey-100, #F4F4F4)',
        color: accent ? 'var(--omada-green-700, #008055)' : 'var(--fg-secondary)',
        border: '1px solid ' + (accent ? 'var(--omada-green-100, #C2EAD6)' : 'var(--border-default)'),
      }}>{children}</div>
    );
  }

  function GridDemo() {
    const { t } = window.useOmada();

    return (
      <>
        <div className="row"><span className="label">24-col · spans</span></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 6 }}>
          <Row><Col span={24}><Block>span 24</Block></Col></Row>
          <Row>
            <Col span={12}><Block>span 12</Block></Col>
            <Col span={12}><Block>span 12</Block></Col>
          </Row>
          <Row>
            <Col span={8}><Block>8</Block></Col>
            <Col span={8}><Block>8</Block></Col>
            <Col span={8}><Block>8</Block></Col>
          </Row>
          <Row>
            <Col span={6}><Block>6</Block></Col>
            <Col span={6}><Block>6</Block></Col>
            <Col span={6}><Block>6</Block></Col>
            <Col span={6}><Block>6</Block></Col>
          </Row>
        </div>

        <div className="row" style={{ marginTop: 18 }}><span className="label">offset · justify</span></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Row>
            <Col span={8}><Block accent>span 8</Block></Col>
            <Col span={8} offset={8}><Block accent>offset 8</Block></Col>
          </Row>
          <Row justify="space-between">
            <Col span={5}><Block>5</Block></Col>
            <Col span={5}><Block>5</Block></Col>
            <Col span={5}><Block>5</Block></Col>
          </Row>
        </div>

        <div className="row" style={{ marginTop: 18 }}><span className="label">responsive · resize the pane</span></div>
        <Row>
          <Col xs={24} sm={12} md={8} lg={6}><Block accent>{t('chart.dev.ap')}</Block></Col>
          <Col xs={24} sm={12} md={8} lg={6}><Block accent>{t('chart.dev.switch')}</Block></Col>
          <Col xs={24} sm={12} md={8} lg={6}><Block accent>{t('chart.dev.gateway')}</Block></Col>
          <Col xs={24} sm={12} md={24} lg={6}><Block accent>{t('chart.dev.camera')}</Block></Col>
        </Row>
        <div style={{ fontSize: 11, color: 'var(--fg-tertiary)', marginTop: 8, fontFamily: 'var(--font-mono, monospace)' }}>
          xs=24 · sm=12 · md=8 · lg=6
        </div>
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Grid = GridDemo;
})();
