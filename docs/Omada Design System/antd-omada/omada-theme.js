/* ────────────────────────────────────────────────────────────────────────
   omada-theme.js — Ant Design 6 ConfigProvider theme configuration
   Exposes window.omadaThemeLight, window.omadaThemeDark, and a helper
   window.getOmadaTheme(mode) where mode is 'light' | 'dark'.

   Usage (antd@6):
     import { ConfigProvider, theme } from 'antd';
     <ConfigProvider theme={getOmadaTheme(mode)} locale={...}> … </ConfigProvider>

   Note: dark mode relies on antd's theme.darkAlgorithm, which is referenced
   here as a string 'dark' and resolved at the call site (see getOmadaTheme),
   because this UMD-friendly file cannot import the algorithm directly.
   ──────────────────────────────────────────────────────────────────────── */

const OMADA = {
  green: {
    50:  '#E5F6EE',
    100: '#C2EAD6',
    200: '#8DD6B0',
    300: '#4BC68C',
    400: '#18B782',  // hover (light)
    500: '#00A870',  // brand
    600: '#009765',  // press (light)
    700: '#008055',
    800: '#006A48',
    900: '#00543A',
  },
  // Dark mode uses a slightly brighter brand so it reads on #1A1A1A
  greenDark: {
    hover:  '#33C495',   // hover lifts lighter in dark
    base:   '#16B981',   // brand on dark
    active: '#00A870',   // press settles to canonical
  },
  teal700:  '#0A5A5A',
  lime:     '#A6EF00',
  blue:     '#0069CB',
  blueDark: '#3D9BFF',
  magenta:  '#F476FF',
  orange:   '#FF8C27',
  orangeDark: '#FFA552',
  red:      '#EE385C',
  redDark:  '#FF5C7A',
  neutral: {
    white: '#FFFFFF',
    50:    '#F7F7F7',
    100:   '#F4F4F4',
    200:   '#ECECEC',
    400:   '#CCCCCC',
    500:   '#999999',
    600:   '#636363',
    800:   '#2B2B2B',
    950:   '#1A1A1A',
  },
  // Dark surface ladder — Omada uses #1A1A1A canvas, not antd's #000
  dark: {
    canvas:    '#141414',  // app background (one notch under panel)
    surface:   '#1F1F1F',  // card / container
    elevated:  '#262626',  // dropdown / popover / modal
    spotlight: '#383838',  // tooltip
    border:    '#333333',
    borderSub: '#2A2A2A',
    hover:     '#262626',
    text:      '#E8E8E8',
    textSec:   '#A6A6A6',
    textTer:   '#737373',
    textQuat:  '#525252',
  },
};

window.OMADA = OMADA;

/* ─── Component-level overrides shared by BOTH themes ──────────────────── */
/* Colour-bearing component tokens are layered per-mode below; these are the
   structural ones (radius / height / spacing / weight) that never change.  */
const sharedComponents = {
  Button: {
    borderRadius:   3,
    borderRadiusLG: 4,
    borderRadiusSM: 3,
    controlHeight:   32,
    controlHeightLG: 40,
    controlHeightSM: 24,
    paddingInline:    16,
    paddingInlineLG:  20,
    paddingInlineSM:  10,
    fontWeight:       500,
    primaryShadow:    'none',
    defaultShadow:    'none',
    dangerShadow:     'none',
  },
  Input:       { borderRadius: 4, controlHeight: 32, paddingInline: 12 },
  InputNumber: { borderRadius: 4, controlHeight: 32 },
  Select:      { borderRadius: 4, controlHeight: 32 },
  DatePicker:  { borderRadius: 4, controlHeight: 32 },
  Switch:      { trackHeight: 20, trackHeightSM: 14, handleSize: 16, handleSizeSM: 10 },
  Checkbox:    { borderRadiusSM: 3 },
  Radio:       { dotSize: 8 },
  Tag:         { borderRadiusSM: 4, fontSize: 12, lineHeight: 1.4 },
  Badge:       { fontSize: 11, fontWeight: 700 },
  Table: {
    borderRadius: 8, borderRadiusLG: 8,
    headerSplitColor: 'transparent',
    cellPaddingBlock: 12, cellPaddingInline: 14,
    cellPaddingBlockSM: 8, cellPaddingInlineSM: 12,
    cellFontSize: 13, cellFontSizeSM: 12,
  },
  Tabs: {
    cardGutter: 4, cardPadding: '6px 16px',
    titleFontSize: 14, titleFontSizeLG: 15,
    horizontalItemPadding: '8px 0',
  },
  Menu: {
    itemHeight: 36, itemPaddingInline: 16, iconSize: 18,
    itemBorderRadius: 0,
    activeBarBorderWidth: 2, activeBarWidth: 2,
    groupTitleFontSize: 11,
  },
  Modal: {
    borderRadiusLG: 12, paddingMD: 24,
    paddingContentHorizontal: 24, titleFontSize: 18,
    headerBg: 'transparent',
  },
  Drawer:    { paddingLG: 24 },
  Tooltip:   { borderRadius: 6, fontSize: 12 },
  Popover:   { borderRadiusLG: 8 },
  Notification: { borderRadiusLG: 8, paddingMD: 16 },
  Message:   { borderRadiusLG: 6 },
  Alert:     { borderRadiusLG: 6 },
  Pagination:{ itemSize: 32 },
  Form: {
    labelFontSize: 13, labelHeight: 32,
    verticalLabelPadding: '0 0 4px', itemMarginBottom: 18,
  },
  Card: {
    borderRadiusLG: 8, headerBg: 'transparent',
    headerFontSize: 14, headerFontSizeSM: 13,
    headerHeight: 44, headerHeightSM: 36,
    paddingLG: 20, bodyPadding: 20,
  },
  Steps:     { titleLineHeight: 1.4 },
  Avatar:    {},
  Layout:    { headerHeight: 56 },

  /* ── Batch 5 — Advanced / Pro (structural) ── */
  Tree: {
    titleHeight: 32, nodeSelectedBg: 'transparent',
    directoryNodeSelectedColor: 'inherit',
  },
  TreeSelect: { borderRadius: 4 },
  Cascader: { controlWidth: 260, dropdownHeight: 240, optionPadding: '6px 12px' },
  Transfer: {
    listWidth: 240, listWidthLG: 280, listHeight: 320,
    headerHeight: 40, itemHeight: 32, itemPaddingBlock: 6, borderRadiusLG: 6,
  },
  Upload: {},
  Collapse: {
    headerPadding: '10px 16px', contentPadding: '16px 28px',
    headerBg: 'transparent', borderRadiusLG: 8, contentFontSize: 14,
  },
  Result: { iconFontSize: 64, titleFontSize: 20, extraMargin: '20px 0 0 0' },
  Empty: {},
  Segmented: {
    trackPadding: 3, itemMinHeight: 28, borderRadius: 6, borderRadiusSM: 4,
    controlHeight: 34, controlHeightSM: 26, controlHeightLG: 42, itemSelectedColor: undefined,
  },
  Slider: {
    railSize: 3, controlSize: 14, handleSize: 12, handleSizeHover: 14,
    handleLineWidth: 2, handleLineWidthHover: 2, dotSize: 8,
  },
  ColorPicker: { borderRadiusSM: 4 },

  /* ── Batch 7 — Progress, feedback & misc (structural) ── */
  Progress: { lineBorderRadius: 100, circleTextFontSize: '1em', defaultColor: OMADA.green[500] },
  Rate: { starSize: 20, starColor: '#FFCB00' },          /* Figma on-star #FFCB00 */
  Skeleton: { blockRadius: 3, titleHeight: 16, paragraphLiHeight: 16, paragraphMarginTop: 16 },
  Spin: { dotSize: 24, dotSizeSM: 16, dotSizeLG: 36 },
  Calendar: { itemActiveBg: 'rgba(0,168,112,0.10)' },
};

/* ─── Shared seed tokens (mode-independent) ────────────────────────────── */
const sharedToken = {
  // Brand stays the same hue; per-mode hover/active layered below
  colorPrimary:       OMADA.green[500],

  // Type
  fontFamily:       "'Manrope', -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', 'Hiragino Sans GB', sans-serif",
  fontSize:         14,
  fontSizeHeading1: 36,
  fontSizeHeading2: 24,
  fontSizeHeading3: 20,
  fontSizeHeading4: 16,
  fontSizeHeading5: 14,

  // Radii
  borderRadius:   4,
  borderRadiusLG: 8,
  borderRadiusSM: 3,
  borderRadiusXS: 2,

  // Control sizes
  controlHeight:   36,
  controlHeightSM: 28,
  controlHeightLG: 44,
  paddingContentHorizontal: 12,

  // Motion
  motionDurationFast: '120ms',
  motionDurationMid:  '180ms',
  motionDurationSlow: '240ms',
  motionEaseOut:      'cubic-bezier(0.16, 1, 0.3, 1)',

  // Focus
  controlOutline:      'rgba(0,168,112,0.12)',
  controlOutlineWidth: 3,

  zIndexBase: 0,
  zIndexPopupBase: 1000,
  wireframe: false,
};

/* ═══════════════════════════════════════════════════════════════════════
   LIGHT THEME
   ═══════════════════════════════════════════════════════════════════════ */
window.omadaThemeLight = {
  token: {
    ...sharedToken,
    colorPrimaryHover:  OMADA.green[400],
    colorPrimaryActive: OMADA.green[600],
    colorPrimaryBg:     OMADA.green[50],
    colorPrimaryBgHover:'#D6F0E2',
    colorPrimaryBorder: OMADA.green[200],
    colorPrimaryBorderHover: OMADA.green[300],
    colorPrimaryText:   OMADA.green[700],

    colorSuccess:       OMADA.green[500],
    colorSuccessBg:     OMADA.green[50],
    colorSuccessBgHover:'#D6F0E2',
    colorSuccessBorder: OMADA.green[100],
    colorSuccessText:   '#008055',
    colorWarning:       OMADA.orange,
    colorWarningBg:     '#FFF1E0',
    colorWarningBorder: '#FFD9B0',
    colorWarningText:   '#C46315',
    colorError:         OMADA.red,
    colorErrorBg:       '#FCE0E6',
    colorErrorBorder:   '#FAB6C4',
    colorErrorText:     '#C82748',
    colorInfo:          OMADA.blue,
    colorInfoBg:        '#E0EFFB',
    colorInfoBorder:    '#BFDDF7',
    colorInfoText:      '#0050A3',

    colorTextBase:        OMADA.neutral[800],
    colorText:            OMADA.neutral[800],
    colorTextSecondary:   OMADA.neutral[600],
    colorTextTertiary:    OMADA.neutral[500],
    colorTextQuaternary:  OMADA.neutral[400],
    colorTextDescription: OMADA.neutral[600],
    colorTextPlaceholder: OMADA.neutral[500],

    colorBgBase:      OMADA.neutral.white,
    colorBgContainer: OMADA.neutral.white,
    colorBgElevated:  OMADA.neutral.white,
    colorBgLayout:    OMADA.neutral[50],
    colorBgSpotlight: OMADA.neutral[800],

    colorBorder:          OMADA.neutral[200],
    colorBorderSecondary: OMADA.neutral[100],

    boxShadow:          '0 4px 10px 0 rgba(43,43,43,0.10)',
    boxShadowSecondary: '-4px 2px 24px 0 rgba(43,43,43,0.10)',
    boxShadowTertiary:  '0 2px 16px 0 rgba(43,43,43,0.14)',
  },
  components: {
    ...sharedComponents,
    Button:  { ...sharedComponents.Button },
    Input:   { ...sharedComponents.Input,
               activeShadow: '0 0 0 3px rgba(0,168,112,0.12)',
               activeBorderColor: OMADA.green[500], hoverBorderColor: OMADA.neutral[400] },
    Select:  { ...sharedComponents.Select,
               optionSelectedBg: OMADA.green[50], optionSelectedColor: OMADA.green[700],
               optionActiveBg: OMADA.neutral[50] },
    DatePicker: { ...sharedComponents.DatePicker,
               activeBorderColor: OMADA.green[500], cellActiveWithRangeBg: OMADA.green[50],
               cellHoverBg: OMADA.neutral[100] },
    Switch:  { ...sharedComponents.Switch, colorPrimary: OMADA.green[500], colorPrimaryHover: OMADA.green[400] },
    Checkbox:{ ...sharedComponents.Checkbox, colorPrimary: OMADA.green[500] },
    Radio:   { ...sharedComponents.Radio, colorPrimary: OMADA.green[500] },
    Tag:     { ...sharedComponents.Tag, defaultBg: OMADA.neutral[100], defaultColor: OMADA.neutral[600] },
    Badge:   { ...sharedComponents.Badge, colorBgContainer: '#fff' },
    Table:   { ...sharedComponents.Table,
               headerBg: OMADA.neutral[50], headerColor: OMADA.neutral[600],
               headerSortHoverBg: OMADA.neutral[100], headerSortActiveBg: OMADA.neutral[100],
               rowHoverBg: OMADA.neutral[50], rowSelectedBg: OMADA.green[50], rowSelectedHoverBg: '#D6F0E2' },
    Tabs:    { ...sharedComponents.Tabs, cardBg: OMADA.neutral[50],
               itemActiveColor: OMADA.green[600], itemHoverColor: OMADA.green[400],
               itemSelectedColor: OMADA.green[600], inkBarColor: OMADA.green[500] },
    Menu:    { ...sharedComponents.Menu,
               itemActiveBg: 'rgba(0,168,112,0.08)', itemSelectedBg: 'rgba(0,168,112,0.08)',
               itemSelectedColor: OMADA.green[600], itemHoverBg: OMADA.neutral[50],
               groupTitleColor: OMADA.neutral[500] },
    Modal:   { ...sharedComponents.Modal, contentBg: '#fff' },
    Tooltip: { ...sharedComponents.Tooltip, colorBgSpotlight: 'rgba(43,43,43,0.92)' },
    Alert:   { ...sharedComponents.Alert,
               colorInfoBg: '#E0EFFB', colorInfoBorder: '#BFDDF7',
               colorSuccessBg: OMADA.green[50], colorSuccessBorder: OMADA.green[100],
               colorWarningBg: '#FFF1E0', colorWarningBorder: '#FFD9B0',
               colorErrorBg: '#FCE0E6', colorErrorBorder: '#FAB6C4' },
    Pagination: { ...sharedComponents.Pagination, itemActiveBg: OMADA.green[500],
               itemActiveColorDisabled: OMADA.neutral[400], colorPrimary: '#fff' },
    Form:    { ...sharedComponents.Form, labelColor: OMADA.neutral[800], labelRequiredMarkColor: OMADA.red },
    Breadcrumb: { itemColor: OMADA.neutral[600], lastItemColor: OMADA.neutral[800],
               separatorColor: OMADA.neutral[400], linkColor: OMADA.neutral[600], linkHoverColor: OMADA.green[500] },
    Divider: { colorSplit: OMADA.neutral[200] },
    Steps:   { ...sharedComponents.Steps, colorPrimary: OMADA.green[500] },
    Avatar:  { groupBorderColor: '#fff' },
    Layout:  { ...sharedComponents.Layout, headerBg: OMADA.green[500], headerColor: '#fff',
               siderBg: '#fff', bodyBg: OMADA.neutral[50] },

    /* ── Batch 5 (light colours) ── */
    Tree:    { ...sharedComponents.Tree, nodeHoverBg: OMADA.neutral[50],
               nodeSelectedBg: OMADA.green[50], colorPrimary: OMADA.green[500],
               directoryNodeSelectedBg: 'rgba(0,168,112,0.08)', directoryNodeSelectedColor: OMADA.green[700] },
    TreeSelect: { ...sharedComponents.TreeSelect, nodeHoverBg: OMADA.neutral[50],
               nodeSelectedBg: OMADA.green[50] },
    Cascader: { ...sharedComponents.Cascader, optionSelectedBg: OMADA.green[50],
               controlItemBgActive: OMADA.green[50], controlItemBgHover: OMADA.neutral[50] },
    Transfer: { ...sharedComponents.Transfer, headerHeightSM: 36 },
    Collapse: { ...sharedComponents.Collapse, headerBg: '#fff',
               contentBg: OMADA.neutral[50], colorBorder: OMADA.neutral[200] },
    Segmented: { ...sharedComponents.Segmented, itemSelectedBg: '#fff',
               itemColor: OMADA.neutral[600], itemSelectedColor: OMADA.green[600],
               itemHoverColor: OMADA.neutral[800], trackBg: OMADA.neutral[100] },
    Slider:  { ...sharedComponents.Slider, railBg: OMADA.neutral[200], railHoverBg: OMADA.neutral[400],
               trackBg: OMADA.green[500], trackHoverBg: OMADA.green[400],
               handleColor: OMADA.green[500], handleActiveColor: OMADA.green[600],
               dotBorderColor: OMADA.neutral[200], dotActiveBorderColor: OMADA.green[500] },

    /* ── Batch 7 (light colours) ── */
    Progress: { ...sharedComponents.Progress, remainingColor: OMADA.neutral[200], circleTextColor: OMADA.neutral[800] },
    Rate:     { ...sharedComponents.Rate, starBg: OMADA.neutral[400] },
    Skeleton: { ...sharedComponents.Skeleton, gradientFromColor: 'rgba(0,0,0,0.06)', gradientToColor: 'rgba(0,0,0,0.015)' },
    Calendar: { ...sharedComponents.Calendar, fullBg: '#fff', fullPanelBg: '#fff',
               itemActiveBg: OMADA.green[50], colorPrimary: OMADA.green[500] },
  },
};

/* ═══════════════════════════════════════════════════════════════════════
   DARK THEME  — pair with theme.darkAlgorithm (see getOmadaTheme)
   ═══════════════════════════════════════════════════════════════════════ */
const D = OMADA.dark;
window.omadaThemeDark = {
  token: {
    ...sharedToken,
    colorPrimary:        OMADA.greenDark.base,
    colorPrimaryHover:   OMADA.greenDark.hover,
    colorPrimaryActive:  OMADA.greenDark.active,
    colorPrimaryBg:      'rgba(0,168,112,0.16)',
    colorPrimaryBgHover: 'rgba(0,168,112,0.24)',
    colorPrimaryBorder:  'rgba(0,168,112,0.40)',
    colorPrimaryBorderHover: 'rgba(0,168,112,0.55)',
    colorPrimaryText:    '#5FD3A6',

    colorSuccess:       OMADA.greenDark.base,
    colorSuccessBg:     'rgba(0,168,112,0.16)',
    colorSuccessBorder: 'rgba(0,168,112,0.36)',
    colorSuccessText:   '#5FD3A6',
    colorWarning:       OMADA.orangeDark,
    colorWarningBg:     'rgba(255,140,39,0.16)',
    colorWarningBorder: 'rgba(255,140,39,0.36)',
    colorWarningText:   '#FFB877',
    colorError:         OMADA.redDark,
    colorErrorBg:       'rgba(238,56,92,0.16)',
    colorErrorBorder:   'rgba(238,56,92,0.36)',
    colorErrorText:     '#FF889E',
    colorInfo:          OMADA.blueDark,
    colorInfoBg:        'rgba(0,105,203,0.16)',
    colorInfoBorder:    'rgba(0,105,203,0.40)',
    colorInfoText:      '#7FB8FF',

    colorTextBase:        D.text,
    colorText:            D.text,
    colorTextSecondary:   D.textSec,
    colorTextTertiary:    D.textTer,
    colorTextQuaternary:  D.textQuat,
    colorTextDescription: D.textSec,
    colorTextPlaceholder: D.textTer,

    colorBgBase:      D.canvas,
    colorBgContainer: D.surface,
    colorBgElevated:  D.elevated,
    colorBgLayout:    D.canvas,
    colorBgSpotlight: D.spotlight,

    colorBorder:          D.border,
    colorBorderSecondary: D.borderSub,

    boxShadow:          '0 4px 12px 0 rgba(0,0,0,0.45)',
    boxShadowSecondary: '-4px 2px 28px 0 rgba(0,0,0,0.50)',
    boxShadowTertiary:  '0 2px 16px 0 rgba(0,0,0,0.55)',
  },
  components: {
    ...sharedComponents,
    Button:  { ...sharedComponents.Button },
    Input:   { ...sharedComponents.Input,
               activeShadow: '0 0 0 3px rgba(0,168,112,0.22)',
               activeBorderColor: OMADA.greenDark.base, hoverBorderColor: '#4D4D4D' },
    Select:  { ...sharedComponents.Select,
               optionSelectedBg: 'rgba(0,168,112,0.20)', optionSelectedColor: '#5FD3A6',
               optionActiveBg: D.hover },
    DatePicker: { ...sharedComponents.DatePicker,
               activeBorderColor: OMADA.greenDark.base, cellActiveWithRangeBg: 'rgba(0,168,112,0.20)',
               cellHoverBg: D.hover },
    Switch:  { ...sharedComponents.Switch, colorPrimary: OMADA.greenDark.base,
               colorPrimaryHover: OMADA.greenDark.hover, colorTextQuaternary: '#4D4D4D', colorTextTertiary: '#5C5C5C' },
    Checkbox:{ ...sharedComponents.Checkbox, colorPrimary: OMADA.greenDark.base },
    Radio:   { ...sharedComponents.Radio, colorPrimary: OMADA.greenDark.base },
    Tag:     { ...sharedComponents.Tag, defaultBg: '#2A2A2A', defaultColor: D.textSec },
    Badge:   { ...sharedComponents.Badge, colorBgContainer: D.surface },
    Table:   { ...sharedComponents.Table,
               headerBg: '#222222', headerColor: D.textSec,
               headerSortHoverBg: '#2A2A2A', headerSortActiveBg: '#2A2A2A',
               rowHoverBg: D.hover, rowSelectedBg: 'rgba(0,168,112,0.14)', rowSelectedHoverBg: 'rgba(0,168,112,0.20)' },
    Tabs:    { ...sharedComponents.Tabs, cardBg: D.canvas,
               itemActiveColor: '#5FD3A6', itemHoverColor: OMADA.greenDark.hover,
               itemSelectedColor: '#5FD3A6', inkBarColor: OMADA.greenDark.base },
    Menu:    { ...sharedComponents.Menu,
               itemActiveBg: 'rgba(0,168,112,0.16)', itemSelectedBg: 'rgba(0,168,112,0.16)',
               itemSelectedColor: '#5FD3A6', itemHoverBg: D.hover,
               groupTitleColor: D.textTer },
    Modal:   { ...sharedComponents.Modal, contentBg: D.elevated },
    Tooltip: { ...sharedComponents.Tooltip, colorBgSpotlight: D.spotlight },
    Alert:   { ...sharedComponents.Alert,
               colorInfoBg: 'rgba(0,105,203,0.14)', colorInfoBorder: 'rgba(0,105,203,0.34)',
               colorSuccessBg: 'rgba(0,168,112,0.14)', colorSuccessBorder: 'rgba(0,168,112,0.34)',
               colorWarningBg: 'rgba(255,140,39,0.14)', colorWarningBorder: 'rgba(255,140,39,0.34)',
               colorErrorBg: 'rgba(238,56,92,0.14)', colorErrorBorder: 'rgba(238,56,92,0.34)' },
    Pagination: { ...sharedComponents.Pagination, itemActiveBg: OMADA.greenDark.base,
               itemActiveColorDisabled: D.textQuat, colorPrimary: '#fff' },
    Form:    { ...sharedComponents.Form, labelColor: D.text, labelRequiredMarkColor: OMADA.redDark },
    Breadcrumb: { itemColor: D.textSec, lastItemColor: D.text,
               separatorColor: D.textTer, linkColor: D.textSec, linkHoverColor: '#5FD3A6' },
    Divider: { colorSplit: D.border },
    Steps:   { ...sharedComponents.Steps, colorPrimary: OMADA.greenDark.base },
    Avatar:  { groupBorderColor: D.surface },
    // Top bar stays Omada green in dark mode for brand continuity
    Layout:  { ...sharedComponents.Layout, headerBg: OMADA.green[600], headerColor: '#fff',
               siderBg: D.surface, bodyBg: D.canvas },

    /* ── Batch 5 (dark colours) ── */
    Tree:    { ...sharedComponents.Tree, nodeHoverBg: D.hover,
               nodeSelectedBg: 'rgba(0,168,112,0.16)', colorPrimary: OMADA.greenDark.base,
               directoryNodeSelectedBg: 'rgba(0,168,112,0.16)', directoryNodeSelectedColor: '#5FD3A6' },
    TreeSelect: { ...sharedComponents.TreeSelect, nodeHoverBg: D.hover,
               nodeSelectedBg: 'rgba(0,168,112,0.16)' },
    Cascader: { ...sharedComponents.Cascader, optionSelectedBg: 'rgba(0,168,112,0.16)',
               controlItemBgActive: 'rgba(0,168,112,0.16)', controlItemBgHover: D.hover },
    Transfer: { ...sharedComponents.Transfer, headerHeightSM: 36 },
    Collapse: { ...sharedComponents.Collapse, headerBg: D.surface,
               contentBg: D.canvas, colorBorder: D.border },
    Segmented: { ...sharedComponents.Segmented, itemSelectedBg: D.elevated,
               itemColor: D.textSec, itemSelectedColor: '#5FD3A6',
               itemHoverColor: D.text, trackBg: '#2A2A2A' },
    Slider:  { ...sharedComponents.Slider, railBg: '#3A3A3A', railHoverBg: '#4D4D4D',
               trackBg: OMADA.greenDark.base, trackHoverBg: OMADA.greenDark.hover,
               handleColor: OMADA.greenDark.base, handleActiveColor: OMADA.greenDark.hover,
               dotBorderColor: '#3A3A3A', dotActiveBorderColor: OMADA.greenDark.base },

    /* ── Batch 7 (dark colours) ── */
    Progress: { ...sharedComponents.Progress, defaultColor: OMADA.greenDark.base,
               remainingColor: '#333333', circleTextColor: D.text },
    Rate:     { ...sharedComponents.Rate, starBg: '#3A3A3A' },
    Skeleton: { ...sharedComponents.Skeleton, gradientFromColor: 'rgba(255,255,255,0.10)', gradientToColor: 'rgba(255,255,255,0.03)' },
    Calendar: { ...sharedComponents.Calendar, fullBg: D.surface, fullPanelBg: D.surface,
               itemActiveBg: 'rgba(0,168,112,0.16)', colorPrimary: OMADA.greenDark.base },
  },
};

/* ─── Helper: resolve a full theme config for a mode ───────────────────── */
/* Pass antd's theme.darkAlgorithm in as `darkAlgorithm` (from the caller),
   since the UMD global exposes it as antd.theme.darkAlgorithm.            */
window.getOmadaTheme = function (mode, darkAlgorithm) {
  if (mode === 'dark') {
    return { ...window.omadaThemeDark, algorithm: darkAlgorithm };
  }
  return window.omadaThemeLight;
};

/* Back-compat: keep window.omadaTheme pointing at the light config */
window.omadaTheme = window.omadaThemeLight;
