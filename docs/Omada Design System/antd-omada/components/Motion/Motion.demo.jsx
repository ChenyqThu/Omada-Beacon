/* components/Motion/Motion.demo.jsx — window.OmadaDemos.Motion */
(function () {
  const { Motion } = window.Omada;

  function MotionDemo() {
    return <Motion />;
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Motion = MotionDemo;
})();
