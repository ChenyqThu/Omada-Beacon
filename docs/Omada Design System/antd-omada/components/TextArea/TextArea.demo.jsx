/* components/TextArea/TextArea.demo.jsx — window.OmadaDemos.TextArea */
(function () {
  const { TextArea } = window.Omada;

  function TextAreaDemo() {
    const { lang, t } = window.useOmada();
    const ph = lang === 'zh' ? '为该站点添加备注…' : 'Add a note about this site…';
    return (
      <>
        <div className="row" style={{ alignItems: 'flex-start' }}>
          <span className="label">auto-size</span>
          <div style={{ flex: '1 1 360px', maxWidth: 460 }}>
            <TextArea placeholder={ph} />
          </div>
        </div>
        <div className="row" style={{ alignItems: 'flex-start' }}>
          <span className="label">count</span>
          <div style={{ flex: '1 1 360px', maxWidth: 460 }}>
            <TextArea placeholder={ph} maxLength={200} showCount autoSize={{ minRows: 2, maxRows: 5 }} />
          </div>
        </div>
        <div className="row" style={{ alignItems: 'flex-start' }}>
          <span className="label">fixed</span>
          <div style={{ flex: '1 1 360px', maxWidth: 460 }}>
            <TextArea placeholder={ph} autoSize={false} rows={4} />
          </div>
        </div>
        <div className="row" style={{ alignItems: 'flex-start' }}>
          <span className="label">disabled</span>
          <div style={{ flex: '1 1 360px', maxWidth: 460 }}>
            <TextArea defaultValue={t('field.notes')} disabled autoSize={{ minRows: 2 }} />
          </div>
        </div>
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.TextArea = TextAreaDemo;
})();
