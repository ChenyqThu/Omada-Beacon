/* ────────────────────────────────────────────────────────────────────────
   components/ThemeProvider/ThemeProvider.jsx — OmadaThemeProvider

   The single source of truth for mode (light|dark) + language (en|zh).
   - Sets data-omada-theme on <html> so omada-overrides.css + page chrome react
   - Renders antd <ConfigProvider> with getOmadaTheme(mode) + the matching
     antd locale (zhCN | enUS) so antd built-ins translate
   - Persists both to localStorage
   - Exposes useOmada() → { mode, lang, setMode, setLang, toggleMode, t, OMADA }

   Wrap your app once:
     <OmadaThemeProvider><App/></OmadaThemeProvider>

   Exports: window.Omada.ThemeProvider, window.OmadaThemeProvider, window.useOmada
   ──────────────────────────────────────────────────────────────────────── */

const OmadaCtx = React.createContext(null);

function OmadaThemeProvider({ defaultMode, defaultLang, children }) {
  const { useState, useEffect, useCallback, useMemo } = React;
  const { ConfigProvider, theme, App } = window.antd;

  const [mode, setMode] = useState(
    () => localStorage.getItem('omada.mode') || defaultMode || 'light'
  );
  const [lang, setLang] = useState(
    () => localStorage.getItem('omada.lang') || defaultLang || 'en'
  );
  // dir: 'ltr' | 'rtl' — drives ConfigProvider direction + <html dir> so the
  // whole library mirrors for RTL languages (Arabic/Hebrew). See RTL demo.
  const [dir, setDir] = useState(
    () => localStorage.getItem('omada.dir') || 'ltr'
  );

  useEffect(() => {
    localStorage.setItem('omada.mode', mode);
    document.documentElement.setAttribute('data-omada-theme', mode);
    // page canvas behind antd surfaces
    document.body.style.background = mode === 'dark' ? '#141414' : '';
    document.body.style.color = mode === 'dark' ? '#E8E8E8' : '';
  }, [mode]);

  useEffect(() => { localStorage.setItem('omada.lang', lang); }, [lang]);

  useEffect(() => {
    localStorage.setItem('omada.dir', dir);
    document.documentElement.setAttribute('dir', dir);
  }, [dir]);

  // antd built-in locale (UMD exposes locales under antd.locales / antd.locale)
  const antdLocale = useMemo(() => {
    const L = window.antd.locales || window.antd.locale || {};
    if (lang === 'zh') return L.zh_CN || L.zhCN || undefined;
    return L.en_US || L.enUS || undefined;
  }, [lang]);

  const toggleMode = useCallback(() => setMode((m) => (m === 'dark' ? 'light' : 'dark')), []);
  const toggleDir = useCallback(() => setDir((d) => (d === 'rtl' ? 'ltr' : 'rtl')), []);
  const t = useCallback((key) => window.t(key, lang), [lang]);

  const value = useMemo(
    () => ({ mode, lang, dir, setMode, setLang, setDir, toggleMode, toggleDir, t, OMADA: window.OMADA }),
    [mode, lang, dir, toggleMode, toggleDir, t]
  );

  const themeConfig = window.getOmadaTheme(mode, theme.darkAlgorithm);

  // antd 6 <App> gives message/notification/modal the themed context.
  const Wrapper = App || React.Fragment;

  return (
    <OmadaCtx.Provider value={value}>
      <ConfigProvider theme={themeConfig} locale={antdLocale} direction={dir}>
        <Wrapper>{children}</Wrapper>
      </ConfigProvider>
    </OmadaCtx.Provider>
  );
}

function useOmada() {
  const ctx = React.useContext(OmadaCtx);
  if (!ctx) throw new Error('useOmada must be used inside <OmadaThemeProvider>');
  return ctx;
}

window.Omada = window.Omada || {};
window.Omada.ThemeProvider = OmadaThemeProvider;
window.OmadaThemeProvider = OmadaThemeProvider;
window.useOmada = useOmada;
