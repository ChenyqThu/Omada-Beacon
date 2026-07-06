/* components/Divider/Divider.demo.jsx — window.OmadaDemos.Divider */
(function () {
  const { Divider } = window.Omada;

  function CardLike({ children }) {
    return (
      <div style={{
        border: '1px solid var(--border-default)', borderRadius: 8,
        padding: '16px 20px', background: 'var(--bg-surface, #fff)', maxWidth: 560,
      }}>{children}</div>
    );
  }

  function DividerDemo() {
    const { t } = window.useOmada();

    return (
      <>
        <div className="row"><span className="label">horizontal</span></div>
        <CardLike>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{t('form.wanSettings')}</div>
          <Divider />
          <div style={{ fontSize: 13, color: 'var(--fg-secondary)' }}>{t('div.section1')}</div>
        </CardLike>

        <div className="row" style={{ marginTop: 22 }}><span className="label">with text</span></div>
        <CardLike>
          <Divider orientation="left">{t('div.basic')}</Divider>
          <div style={{ fontSize: 13, color: 'var(--fg-secondary)' }}>{t('div.section1')}</div>
          <Divider orientation="center">{t('div.advanced')}</Divider>
          <div style={{ fontSize: 13, color: 'var(--fg-secondary)' }}>{t('div.section2')}</div>
          <Divider orientation="right" dashed>{t('div.danger')}</Divider>
        </CardLike>

        <div className="row" style={{ marginTop: 22 }}><span className="label">dashed</span></div>
        <CardLike><Divider dashed style={{ margin: '4px 0' }} /></CardLike>

        <div className="row" style={{ marginTop: 22 }}><span className="label">vertical · inline</span></div>
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 14, color: 'var(--fg-secondary)' }}>
          <span>{t('tab.overview')}</span>
          <Divider type="vertical" />
          <span>{t('tab.ports')}</span>
          <Divider type="vertical" />
          <span>{t('tab.clients')}</span>
          <Divider type="vertical" />
          <a style={{ color: 'var(--omada-green-600, #009765)' }}>{t('common.more')}</a>
        </div>
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Divider = DividerDemo;
})();
