/* components/Content/Content.demo.jsx — window.OmadaDemos.Content */
(function () {
  const { Content } = window.Omada;

  function ContentDemo() {
    return <Content />;
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Content = ContentDemo;
})();
