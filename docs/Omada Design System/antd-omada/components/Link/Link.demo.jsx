/* components/Link/Link.demo.jsx — window.OmadaDemos.Link */
(function () {
  const { Link, Paragraph } = window.Omada;
  const { Space } = window.antd;

  function LinkDemo() {
    const { t, lang } = window.useOmada();
    const L = (en, zh) => (lang === 'zh' ? zh : en);

    return (
      <>
        <div className="row"><span className="label">sizes</span></div>
        <Space size={20} align="center" wrap>
          <Link size="sm" href="#link">{L('Small link', '小号链接')}</Link>
          <Link href="#link">{L('Default link', '默认链接')}</Link>
          <Link size="lg" href="#link">{L('Large link', '大号链接')}</Link>
        </Space>

        <div className="row" style={{ marginTop: 22 }}><span className="label">with icon</span></div>
        <Space size={20} align="center" wrap>
          <Link href="#link" icon="docs">{t('common.docs')}</Link>
          <Link href="#link" icon="download">{t('common.download')}</Link>
          <Link href="https://www.omada.example" external>{t('common.learnMore')}</Link>
        </Space>

        <div className="row" style={{ marginTop: 22 }}><span className="label">types</span></div>
        <Space size={20} align="center" wrap>
          <Link href="#link" strong>{t('type.strong')}</Link>
          <Link href="#link" underline>{t('type.underline')}</Link>
          <Link href="#link" type="danger" icon="trash">{t('common.delete')}</Link>
          <Link href="#link" disabled>{t('common.disabled')}</Link>
        </Space>

        <div className="row" style={{ marginTop: 22 }}><span className="label">in text</span></div>
        <Paragraph style={{ maxWidth: 560, marginBottom: 0 }}>
          {L('Updates install during the maintenance window. ', '更新将在维护窗口内安装。')}
          <Link href="#link">{t('common.learnMore')}</Link>
          {L(' or ', ' 或 ')}
          <Link href="https://www.omada.example/release-notes" external>{L('view the release notes', '查看版本说明')}</Link>
          {L(' before continuing.', '后再继续。')}
        </Paragraph>
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Link = LinkDemo;
})();
