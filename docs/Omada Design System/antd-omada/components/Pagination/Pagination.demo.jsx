/* components/Pagination/Pagination.demo.jsx — Mounted by index.html. window.OmadaDemos.Pagination */
(function () {
  const { Pagination } = window.Omada;

  function PaginationDemo() {
    const { lang } = window.useOmada();
    const { useState } = React;
    const [page, setPage] = useState(1);
    return (
      <>
        <div className="row" style={{ display: 'block' }}>
          <span className="label" style={{ display: 'block', marginBottom: 10 }}>default · total · size changer</span>
          <Pagination lang={lang} total={200} current={page} pageSize={10}
            onChange={setPage} pageSizeOptions={[10, 20, 50, 100]} />
        </div>
        <div className="row" style={{ display: 'block', marginTop: 16 }}>
          <span className="label" style={{ display: 'block', marginBottom: 10 }}>simple</span>
          <Pagination lang={lang} simple total={200} defaultCurrent={3} showTotalText={false} />
        </div>
        <div className="row" style={{ display: 'block', marginTop: 16 }}>
          <span className="label" style={{ display: 'block', marginBottom: 10 }}>mini · with quick jumper</span>
          <Pagination lang={lang} size="small" total={84} defaultCurrent={2}
            showQuickJumper showSizeChanger={false} showTotalText={false} />
        </div>
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Pagination = PaginationDemo;
})();
