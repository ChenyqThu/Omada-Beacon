/* components/Responsive/Responsive.demo.jsx — window.OmadaDemos.Responsive */
(function () {
  const { Responsive } = window.Omada;

  function ResponsiveDemo() {
    return <Responsive />;
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Responsive = ResponsiveDemo;
})();
