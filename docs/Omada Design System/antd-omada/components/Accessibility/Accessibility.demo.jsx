/* components/Accessibility/Accessibility.demo.jsx — window.OmadaDemos.Accessibility */
(function () {
  const { Accessibility } = window.Omada;

  function AccessibilityDemo() {
    return <Accessibility />;
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Accessibility = AccessibilityDemo;
})();
