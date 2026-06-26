/* components/Typography/Typography.demo.jsx — window.OmadaDemos.Typography */
(function () {
  const { Title, Text, Paragraph, Link } = window.Omada;

  function TypographyDemo() {
    const { t } = window.useOmada();

    return (
      <>
        <div className="row"><span className="label">titles · h1–h5</span></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 6 }}>
          <Title level={1} style={{ margin: 0 }}>{t('type.h1')}</Title>
          <Title level={2} style={{ margin: 0 }}>{t('type.h2')}</Title>
          <Title level={3} style={{ margin: 0 }}>{t('type.h3')}</Title>
          <Title level={4} style={{ margin: 0 }}>{t('type.h4')}</Title>
          <Title level={5} style={{ margin: 0 }}>{t('type.h5')}</Title>
        </div>

        <div className="row" style={{ marginTop: 20 }}><span className="label">text · types</span></div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 20px', alignItems: 'center' }}>
          <Text>{t('type.default')}</Text>
          <Text type="secondary">{t('type.secondary')}</Text>
          <Text type="success">{t('type.success')}</Text>
          <Text type="warning">{t('type.warning')}</Text>
          <Text type="danger">{t('type.danger')}</Text>
          <Text disabled>{t('type.disabled')}</Text>
        </div>

        <div className="row" style={{ marginTop: 18 }}><span className="label">text · decoration</span></div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 20px', alignItems: 'center' }}>
          <Text strong>{t('type.strong')}</Text>
          <Text underline>{t('type.underline')}</Text>
          <Text delete>{t('type.delete')}</Text>
          <Text mark>{t('type.mark')}</Text>
          <Text code>192.168.0.1</Text>
          <Text keyboard>⌘ + S</Text>
          <Link href="#typography">{t('common.learnMore')}</Link>
        </div>

        <div className="row" style={{ marginTop: 18 }}><span className="label">paragraph · copyable · ellipsis</span></div>
        <div style={{ maxWidth: 620 }}>
          <Paragraph copyable={{ tooltips: false }}>{t('type.body')}</Paragraph>
          <Paragraph type="secondary" ellipsis={{ rows: 2 }}>{t('type.body')} {t('type.body')}</Paragraph>
        </div>
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Typography = TypographyDemo;
})();
