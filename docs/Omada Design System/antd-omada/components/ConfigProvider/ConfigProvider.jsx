/* ────────────────────────────────────────────────────────────────────────
   components/ConfigProvider/ConfigProvider.jsx — OmadaConfigProvider

   A thin convenience over antd's <ConfigProvider> for SCOPED presets. The app
   is already wrapped once by <OmadaThemeProvider> (which owns the Omada theme,
   locale and direction); this wrapper nests *inside* that to override a region
   without re-declaring the whole theme — antd merges nested ConfigProviders.

   Convenience props (all optional, all map to real antd props/tokens):
     • size     → componentSize  ('small' | 'middle' | 'large')   — resizes
                  every control in the subtree in one shot.
     • compact  → layers theme.compactAlgorithm on top of the inherited
                  algorithm for dense panels (read from window.antd.theme).
     • wave     → forwards antd 6's wave config. Pass `false` to disable the
                  click ripple, or an object { disabled, showEffect }. The
                  Omada default tints the ripple brand-green.
     • disabled → componentDisabled — freezes the whole subtree.

   Everything else (theme, locale, direction, getPopupContainer, form, space,
   …) is forwarded straight through. No brand hex in the JSX — the green wave
   pulls from window.OMADA so it tracks light/dark.

   antd primitive (no dedicated Figma frame): pairs with the theme token board
   (Color node 3:64240) and the Driver/Shadow spec pages. Theme source of
   truth is omada-theme.js → getOmadaTheme().
   Exports: window.Omada.ConfigProvider
   ──────────────────────────────────────────────────────────────────────── */

const { ConfigProvider: AntConfigProvider, theme: antThemeNS } = window.antd;

function OmadaConfigProvider(props) {
  const size = props.size;
  const compact = props.compact;
  const wave = props.wave;
  const disabled = props.disabled;
  const incomingTheme = props.theme;

  const rest = Object.assign({}, props);
  delete rest.size; delete rest.compact; delete rest.wave;
  delete rest.disabled; delete rest.theme; delete rest.children;

  // Merge the compact algorithm onto whatever the parent provider set.
  let theme = incomingTheme;
  if (compact && antThemeNS && antThemeNS.compactAlgorithm) {
    const algos = [antThemeNS.compactAlgorithm];
    theme = Object.assign({}, incomingTheme, {
      algorithm: incomingTheme && incomingTheme.algorithm
        ? [].concat(incomingTheme.algorithm, algos)
        : algos,
    });
  }

  const extra = {};
  if (size !== undefined) extra.componentSize = size;
  if (disabled !== undefined) extra.componentDisabled = disabled;
  if (wave !== undefined) {
    // antd's default ripple already derives from colorPrimary (brand green),
    // so `wave={true}` just keeps the default; `false` disables it; an object
    // ({ disabled, showEffect }) is forwarded verbatim.
    extra.wave = wave === true ? { disabled: false }
               : wave === false ? { disabled: true }
               : wave;
  }
  if (theme !== undefined) extra.theme = theme;

  return <AntConfigProvider {...extra} {...rest}>{props.children}</AntConfigProvider>;
}

window.Omada = window.Omada || {};
window.Omada.ConfigProvider = OmadaConfigProvider;
