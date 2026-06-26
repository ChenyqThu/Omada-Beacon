/* components/IconBoard/IconBoard.demo.jsx — window.OmadaDemos.IconBoard */
(function () {
  const { IconBoard } = window.Omada;

  function IconBoardDemo() {
    const { lang } = window.useOmada();
    const L = (en, zh) => (lang === 'zh' ? zh : en);
    return (
      <>
        <div className="row"><span className="label">{L('searchable specimen', '可搜索图标规范')}</span></div>
        <IconBoard size={24} />

        <div className="row" style={{ marginTop: 26 }}>
          <span className="label">{L('compact · 20px · fixed columns', '紧凑 · 20px · 固定列数')}</span>
        </div>
        <IconBoard size={20} columns={6} filter="" showCount={false} />
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.IconBoard = IconBoardDemo;
})();
