/* components/CommandPalette/CommandPalette.demo.jsx — window.OmadaDemos.CommandPalette */
(function () {
  const { CommandPalette } = window.Omada;

  function CommandPaletteDemo() {
    return <CommandPalette />;
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.CommandPalette = CommandPaletteDemo;
})();
