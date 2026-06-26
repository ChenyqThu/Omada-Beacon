/* ────────────────────────────────────────────────────────────────────────
   components/Illustration/Illustration.jsx — OmadaIllustration

   Original Omada spot illustrations for empty / error / notice states,
   transcribed to the "Illustration 插画规范" system rules (Figma 666:59603),
   NOT the branded source art:
     · style    线、面结合 — line + flat fill combined
     · corners  直角 — right-angle (square) corners, miter joins, square caps
     · colour   neutral line #999 · white surface · pale-green #E3F1EE fill,
                with a single SMALL accent pop from the Omada ramp
                (#00E194 / #A6EF00 / #0069CB / #F476FF / #FFC730 / #FF8C27)
     · view     front / slight top-down, no perspective tricks

   Built as a name registry like OmadaIcon (one entry = one scene), drawn from
   geometric primitives only (rect / line / circle / polyline) so the whole set
   stays on one grid. Theme adaptation is CSS-var driven — line / surface / fill
   flip in dark mode via omada-overrides.css; the accent is a per-instance var
   so a caller can recolour without touching the markup.

   viewBox is a 160×120 stage. Size with the `size` prop (height in px; width
   scales to the 4:3 box) or with CSS width/height.

   Figma: Illustration 插画规范 node 666:59603 + Empty-Space 图表空状态 node
   13644:14162 (page 43:34767). Original redraw — no branded artwork copied.
   Exports: window.OmadaIllustration, window.Omada.Illustration
   ──────────────────────────────────────────────────────────────────────── */

window.OMADA_ILLUS = {
  /* ── no data — an open carton, emptied ── */
  'no-data': {
    accent: '#00E194',
    svg: `
      <rect x="46" y="102" width="68" height="4" fill="var(--om-illus-fill)" stroke="none"/>
      <path d="M48 58 H112 L106 100 H54 Z" fill="var(--om-illus-surface)"/>
      <path d="M57 65 H103 L98 93 H62 Z" fill="var(--om-illus-fill)" stroke="none"/>
      <path d="M48 58 L37 49 M112 58 L123 49"/>
      <path d="M37 49 L44 42 M123 49 L116 42"/>
      <rect x="73" y="34" width="14" height="14" fill="var(--om-illus-accent)" stroke="none"/>
    `,
  },

  /* ── no results — a record card searched, nothing found ── */
  'no-results': {
    accent: '#0069CB',
    svg: `
      <rect x="32" y="30" width="74" height="60" fill="var(--om-illus-surface)"/>
      <rect x="42" y="42" width="40" height="6" fill="var(--om-illus-fill)" stroke="none"/>
      <rect x="42" y="55" width="54" height="6" fill="var(--om-illus-fill)" stroke="none"/>
      <rect x="42" y="68" width="28" height="6" fill="var(--om-illus-fill)" stroke="none"/>
      <circle cx="104" cy="80" r="17" fill="var(--om-illus-surface)"/>
      <circle cx="104" cy="80" r="8" fill="none" stroke="var(--om-illus-accent)"/>
      <line x1="116" y1="92" x2="128" y2="104"/>
    `,
  },

  /* ── no devices — an empty rack slot ── */
  'no-devices': {
    accent: '#A6EF00',
    svg: `
      <rect x="40" y="34" width="80" height="58" fill="var(--om-illus-surface)"/>
      <rect x="48" y="42" width="64" height="14" fill="var(--om-illus-fill)" stroke="none"/>
      <circle cx="56" cy="49" r="2.4" fill="var(--om-illus-accent)" stroke="none"/>
      <rect x="48" y="64" width="64" height="20" fill="none" stroke-dasharray="5 5"/>
      <line x1="68" y1="74" x2="92" y2="74" stroke="var(--om-illus-line)"/>
      <line x1="80" y1="62" x2="80" y2="86" stroke="var(--om-illus-line)" opacity="0"/>
      <line x1="74" y1="74" x2="86" y2="74"/>
      <line x1="80" y1="68" x2="80" y2="80"/>
    `,
  },

  /* ── offline — an unplugged connector ── */
  offline: {
    accent: '#FF8C27',
    svg: `
      <rect x="34" y="104" width="92" height="3" fill="var(--om-illus-fill)" stroke="none"/>
      <path d="M44 56 H70 V72 A13 13 0 0 1 44 72 Z" fill="var(--om-illus-surface)"/>
      <line x1="50" y1="44" x2="50" y2="56"/>
      <line x1="64" y1="44" x2="64" y2="56"/>
      <path d="M116 80 H90 V64 A13 13 0 0 1 116 64 Z" fill="var(--om-illus-surface)"/>
      <line x1="110" y1="92" x2="110" y2="80"/>
      <line x1="96" y1="92" x2="96" y2="80"/>
      <line x1="71" y1="68" x2="80" y2="68" stroke="var(--om-illus-accent)"/>
      <line x1="80" y1="68" x2="89" y2="68" stroke="var(--om-illus-accent)"/>
      <path d="M77 60 L72 68 L77 76" fill="none" stroke="var(--om-illus-accent)"/>
      <path d="M83 60 L88 68 L83 76" fill="none" stroke="var(--om-illus-accent)"/>
    `,
  },

  /* ── success — done, all clear ── */
  success: {
    accent: '#00E194',
    svg: `
      <rect x="50" y="34" width="60" height="60" fill="var(--om-illus-surface)"/>
      <rect x="50" y="34" width="60" height="14" fill="var(--om-illus-fill)" stroke="none"/>
      <polyline points="66,68 76,78 96,56" fill="none" stroke="var(--om-illus-accent)" stroke-width="3"/>
      <circle cx="58" cy="41" r="2.2" fill="var(--om-illus-line)" stroke="none"/>
      <circle cx="66" cy="41" r="2.2" fill="var(--om-illus-line)" stroke="none"/>
    `,
  },

  /* ── error — a document rejected ── */
  error: {
    accent: '#EE385C',
    svg: `
      <path d="M52 30 H92 L108 46 V98 H52 Z" fill="var(--om-illus-surface)"/>
      <path d="M92 30 V46 H108 Z" fill="var(--om-illus-fill)" stroke="none"/>
      <rect x="62" y="58" width="36" height="5" fill="var(--om-illus-fill)" stroke="none"/>
      <rect x="62" y="70" width="24" height="5" fill="var(--om-illus-fill)" stroke="none"/>
      <circle cx="100" cy="92" r="14" fill="var(--om-illus-surface)" stroke="var(--om-illus-accent)"/>
      <line x1="95" y1="87" x2="105" y2="97" stroke="var(--om-illus-accent)"/>
      <line x1="105" y1="87" x2="95" y2="97" stroke="var(--om-illus-accent)"/>
    `,
  },

  /* ── notice — a message waiting ── */
  notice: {
    accent: '#FFC730',
    svg: `
      <rect x="40" y="42" width="80" height="56" fill="var(--om-illus-surface)"/>
      <polyline points="40,42 80,74 120,42" fill="none"/>
      <rect x="40" y="42" width="80" height="56" fill="none"/>
      <circle cx="112" cy="42" r="8" fill="var(--om-illus-accent)" stroke="none"/>
    `,
  },

  /* ════════════════════════════════════════════════════════════════════
     FUNCTION + STATUS scenes (Figma "功能插图" / "状态插图", node 666:59603).
     Front-view (正视图) compositions — feature-specific. Same line+flat,
     square-corner system; one small accent each. Original redraw.
     ════════════════════════════════════════════════════════════════════ */

  /* ── dns — a browser resolving a name against the cloud ── */
  dns: {
    accent: '#0069CB',
    svg: `
      <path d="M38 72 H108 L114 80 H32 Z" fill="var(--om-illus-surface)"/>
      <rect x="44" y="28" width="64" height="42" fill="var(--om-illus-surface)"/>
      <rect x="44" y="28" width="64" height="9" fill="var(--om-illus-fill)" stroke="none"/>
      <circle cx="49" cy="32.5" r="1.3" fill="var(--om-illus-line)" stroke="none"/>
      <circle cx="54" cy="32.5" r="1.3" fill="var(--om-illus-line)" stroke="none"/>
      <circle cx="59" cy="32.5" r="1.3" fill="var(--om-illus-line)" stroke="none"/>
      <text x="76" y="57" text-anchor="middle" font-family="Manrope, sans-serif" font-size="15" font-weight="700" letter-spacing="1" fill="var(--om-illus-accent)" stroke="none">DNS</text>
      <path d="M94 90 q-7 0 -7 -7 q0 -6 6 -6.6 q1 -7 9 -7 q7 0 8 7 q6 0 6 6.6 q0 7 -7 7 Z" fill="var(--om-illus-fill)"/>
    `,
  },

  /* ── email — an open envelope with a letter rising out ── */
  email: {
    accent: '#00A870',
    svg: `
      <rect x="40" y="54" width="80" height="44" fill="var(--om-illus-surface)"/>
      <rect x="56" y="28" width="48" height="44" fill="var(--om-illus-surface)"/>
      <rect x="56" y="28" width="48" height="9" fill="var(--om-illus-fill)" stroke="none"/>
      <rect x="93" y="32" width="8" height="8" fill="var(--om-illus-accent)" stroke="none"/>
      <line x1="62" y1="48" x2="98" y2="48" stroke="var(--om-illus-line)"/>
      <line x1="62" y1="56" x2="90" y2="56" stroke="var(--om-illus-line)"/>
      <path d="M40 98 L80 72 L120 98 Z" fill="var(--om-illus-fill)"/>
      <polyline points="40,54 80,82 120,54" fill="none"/>
      <rect x="40" y="54" width="80" height="44" fill="none"/>
    `,
  },

  /* ── email-sent — envelope confirmed, a green check badge ── */
  'email-sent': {
    accent: '#00E194',
    svg: `
      <rect x="36" y="50" width="76" height="44" fill="var(--om-illus-surface)"/>
      <rect x="50" y="26" width="48" height="42" fill="var(--om-illus-surface)"/>
      <rect x="50" y="26" width="48" height="9" fill="var(--om-illus-fill)" stroke="none"/>
      <line x1="56" y1="45" x2="92" y2="45" stroke="var(--om-illus-line)"/>
      <line x1="56" y1="53" x2="84" y2="53" stroke="var(--om-illus-line)"/>
      <path d="M36 94 L74 68 L112 94 Z" fill="var(--om-illus-fill)"/>
      <polyline points="36,50 74,78 112,50" fill="none"/>
      <rect x="36" y="50" width="76" height="44" fill="none"/>
      <circle cx="116" cy="90" r="12" fill="var(--om-illus-surface)" stroke="var(--om-illus-accent)"/>
      <polyline points="110,90 114,94.5 122,85" fill="none" stroke="var(--om-illus-accent)" stroke-width="2.4"/>
    `,
  },

  /* ── bind-list — a roster linked to a site location ── */
  'bind-list': {
    accent: '#00A870',
    svg: `
      <rect x="30" y="30" width="56" height="60" fill="var(--om-illus-surface)"/>
      <rect x="30" y="30" width="56" height="11" fill="var(--om-illus-fill)" stroke="none"/>
      <rect x="38" y="50" width="5" height="5" fill="var(--om-illus-accent)" stroke="none"/>
      <line x1="48" y1="52.5" x2="78" y2="52.5" stroke="var(--om-illus-line)"/>
      <rect x="38" y="62" width="5" height="5" fill="var(--om-illus-fill)" stroke="none"/>
      <line x1="48" y1="64.5" x2="78" y2="64.5" stroke="var(--om-illus-line)"/>
      <rect x="38" y="74" width="5" height="5" fill="var(--om-illus-fill)" stroke="none"/>
      <line x1="48" y1="76.5" x2="70" y2="76.5" stroke="var(--om-illus-line)"/>
      <line x1="88" y1="56" x2="97" y2="56" stroke="var(--om-illus-accent)" stroke-dasharray="3 3"/>
      <path d="M119 54 a11 11 0 1 0 -22 0 c0 8 11 20 11 20 s11 -12 11 -20 Z" fill="var(--om-illus-fill)"/>
      <circle cx="108" cy="54" r="4.4" fill="var(--om-illus-surface)" stroke="var(--om-illus-accent)"/>
    `,
  },

  /* ── download-failed — a download halted, a red error badge ── */
  'download-failed': {
    accent: '#EE385C',
    svg: `
      <path d="M34 74 H116 L122 82 H28 Z" fill="var(--om-illus-surface)"/>
      <rect x="40" y="28" width="70" height="46" fill="var(--om-illus-surface)"/>
      <rect x="40" y="28" width="70" height="9" fill="var(--om-illus-fill)" stroke="none"/>
      <circle cx="45" cy="32.5" r="1.3" fill="var(--om-illus-line)" stroke="none"/>
      <circle cx="50" cy="32.5" r="1.3" fill="var(--om-illus-line)" stroke="none"/>
      <circle cx="55" cy="32.5" r="1.3" fill="var(--om-illus-line)" stroke="none"/>
      <path d="M67 53 q-6 0 -6 -5.6 q0 -4.6 5 -5.2 q1 -5.6 7.4 -5.6 q5.6 0 6.6 5.6 q4.6 0 4.6 5.2 q0 5.6 -5.6 5.6 Z" fill="var(--om-illus-fill)"/>
      <line x1="75" y1="50" x2="75" y2="63"/>
      <polyline points="70,58 75,63 80,58" fill="none"/>
      <circle cx="108" cy="72" r="12" fill="var(--om-illus-surface)" stroke="var(--om-illus-accent)"/>
      <line x1="103.5" y1="67.5" x2="112.5" y2="76.5" stroke="var(--om-illus-accent)"/>
      <line x1="112.5" y1="67.5" x2="103.5" y2="76.5" stroke="var(--om-illus-accent)"/>
    `,
  },

  /* ── world — globe with a connectivity ping (no internet) ── */
  world: {
    accent: '#00A870',
    svg: `
      <ellipse cx="74" cy="66" rx="40" ry="12" fill="none" stroke-dasharray="3 4"/>
      <circle cx="74" cy="64" r="30" fill="var(--om-illus-surface)"/>
      <ellipse cx="74" cy="64" rx="14" ry="30" fill="none"/>
      <line x1="44" y1="64" x2="104" y2="64"/>
      <path d="M50 52 H98 M50 76 H98"/>
      <path d="M104 40 a14 14 0 0 1 16 0" fill="none" stroke="var(--om-illus-accent)"/>
      <path d="M108 44 a8 8 0 0 1 8 0" fill="none" stroke="var(--om-illus-accent)"/>
      <circle cx="112" cy="48" r="1.8" fill="var(--om-illus-accent)" stroke="none"/>
    `,
  },

  /* ── report — a summary sheet with a small chart (no report) ── */
  report: {
    accent: '#00A870',
    svg: `
      <rect x="46" y="30" width="64" height="64" fill="var(--om-illus-surface)"/>
      <rect x="68" y="25" width="20" height="9" fill="var(--om-illus-fill)" stroke="none"/>
      <rect x="54" y="42" width="30" height="6" fill="var(--om-illus-fill)" stroke="none"/>
      <line x1="54" y1="80" x2="102" y2="80"/>
      <rect x="56" y="66" width="8" height="14" fill="none"/>
      <rect x="69" y="58" width="8" height="22" fill="none"/>
      <rect x="82" y="62" width="8" height="18" fill="none"/>
      <path d="M94 56 a9 9 0 1 0 -9 9" fill="none" stroke="var(--om-illus-accent)" stroke-width="3"/>
    `,
  },

  /* ── lock-failed — a padlock rejected, a red error badge (状态插图) ── */
  'lock-failed': {
    accent: '#EE385C',
    svg: `
      <rect x="54" y="56" width="44" height="40" fill="var(--om-illus-surface)"/>
      <path d="M62 56 V46 a14 14 0 0 1 28 0 V56" fill="none"/>
      <rect x="72" y="68" width="8" height="16" fill="var(--om-illus-fill)" stroke="none"/>
      <circle cx="76" cy="72" r="3.4" fill="var(--om-illus-surface)" stroke="var(--om-illus-line)"/>
      <circle cx="106" cy="92" r="13" fill="var(--om-illus-surface)" stroke="var(--om-illus-accent)"/>
      <line x1="101" y1="87" x2="111" y2="97" stroke="var(--om-illus-accent)"/>
      <line x1="111" y1="87" x2="101" y2="97" stroke="var(--om-illus-accent)"/>
    `,
  },

  /* ── power-failed — a battery critically low, a red error badge (状态插图) ── */
  'power-failed': {
    accent: '#EE385C',
    svg: `
      <rect x="34" y="46" width="60" height="40" fill="var(--om-illus-surface)"/>
      <rect x="94" y="58" width="6" height="16" fill="var(--om-illus-fill)" stroke="none"/>
      <rect x="40" y="52" width="13" height="28" fill="var(--om-illus-accent)" stroke="none"/>
      <line x1="58" y1="66" x2="76" y2="66" stroke="var(--om-illus-line)" stroke-dasharray="3 4"/>
      <circle cx="104" cy="92" r="13" fill="var(--om-illus-surface)" stroke="var(--om-illus-accent)"/>
      <line x1="99" y1="87" x2="109" y2="97" stroke="var(--om-illus-accent)"/>
      <line x1="109" y1="87" x2="99" y2="97" stroke="var(--om-illus-accent)"/>
    `,
  },

  /* ── maintenance — two gears, the small one accent (状态插图: under maintenance) ── */
  maintenance: {
    accent: '#FF8C27',
    svg: `
      <circle cx="66" cy="58" r="16" fill="var(--om-illus-surface)"/>
      <circle cx="66" cy="58" r="6" fill="var(--om-illus-fill)" stroke="none"/>
      <line x1="66" y1="38" x2="66" y2="44"/>
      <line x1="66" y1="72" x2="66" y2="78"/>
      <line x1="46" y1="58" x2="52" y2="58"/>
      <line x1="80" y1="58" x2="86" y2="58"/>
      <line x1="52" y1="44" x2="56" y2="48"/>
      <line x1="76" y1="68" x2="80" y2="72"/>
      <line x1="80" y1="44" x2="76" y2="48"/>
      <line x1="56" y1="68" x2="52" y2="72"/>
      <circle cx="98" cy="84" r="10" fill="var(--om-illus-surface)" stroke="var(--om-illus-accent)"/>
      <circle cx="98" cy="84" r="3.4" fill="var(--om-illus-fill)" stroke="var(--om-illus-accent)"/>
      <line x1="98" y1="70" x2="98" y2="74" stroke="var(--om-illus-accent)"/>
      <line x1="98" y1="94" x2="98" y2="98" stroke="var(--om-illus-accent)"/>
      <line x1="84" y1="84" x2="88" y2="84" stroke="var(--om-illus-accent)"/>
      <line x1="108" y1="84" x2="112" y2="84" stroke="var(--om-illus-accent)"/>
    `,
  },

  /* ── no-permission — a shield + lock, a red no-entry badge (状态插图) ── */
  'no-permission': {
    accent: '#EE385C',
    svg: `
      <path d="M74 28 L100 38 V60 C100 78 74 90 74 90 C74 90 48 78 48 60 V38 Z" fill="var(--om-illus-surface)"/>
      <rect x="66" y="54" width="16" height="13" fill="var(--om-illus-fill)" stroke="none"/>
      <path d="M69 54 V50 a5 5 0 0 1 10 0 V54" fill="none"/>
      <circle cx="103" cy="84" r="13" fill="var(--om-illus-surface)" stroke="var(--om-illus-accent)"/>
      <line x1="94" y1="84" x2="112" y2="84" stroke="var(--om-illus-accent)"/>
    `,
  },

  /* ── inbox-empty — a tray, caught up, a green check badge (功能插图) ── */
  'inbox-empty': {
    accent: '#00A870',
    svg: `
      <rect x="38" y="44" width="84" height="50" fill="var(--om-illus-surface)"/>
      <path d="M38 74 H58 L64 82 H96 L102 74 H122" fill="none"/>
      <rect x="38" y="44" width="84" height="50" fill="none"/>
      <line x1="56" y1="56" x2="104" y2="56" stroke="var(--om-illus-fill)"/>
      <line x1="56" y1="64" x2="92" y2="64" stroke="var(--om-illus-fill)"/>
      <circle cx="108" cy="46" r="9" fill="var(--om-illus-surface)" stroke="var(--om-illus-accent)"/>
      <polyline points="103,46 107,50 113,42" fill="none" stroke="var(--om-illus-accent)" stroke-width="2.2"/>
    `,
  },

  /* ── firmware-update — a chip with an up arrow (功能插图: update available) ── */
  'firmware-update': {
    accent: '#0069CB',
    svg: `
      <rect x="52" y="44" width="56" height="52" fill="var(--om-illus-surface)"/>
      <line x1="62" y1="44" x2="62" y2="38"/>
      <line x1="74" y1="44" x2="74" y2="38"/>
      <line x1="86" y1="44" x2="86" y2="38"/>
      <line x1="98" y1="44" x2="98" y2="38"/>
      <line x1="62" y1="96" x2="62" y2="102"/>
      <line x1="74" y1="96" x2="74" y2="102"/>
      <line x1="86" y1="96" x2="86" y2="102"/>
      <line x1="98" y1="96" x2="98" y2="102"/>
      <line x1="52" y1="58" x2="46" y2="58"/>
      <line x1="52" y1="70" x2="46" y2="70"/>
      <line x1="52" y1="82" x2="46" y2="82"/>
      <line x1="108" y1="58" x2="114" y2="58"/>
      <line x1="108" y1="70" x2="114" y2="70"/>
      <line x1="108" y1="82" x2="114" y2="82"/>
      <rect x="64" y="56" width="32" height="28" fill="var(--om-illus-fill)" stroke="none"/>
      <line x1="80" y1="86" x2="80" y2="62" stroke="var(--om-illus-accent)"/>
      <polyline points="71,71 80,62 89,71" fill="none" stroke="var(--om-illus-accent)" stroke-width="2.4"/>
    `,
  },

  /* ── timeout — a clock with a warning badge (状态插图: request timed out) ── */
  timeout: {
    accent: '#FF8C27',
    svg: `
      <circle cx="72" cy="58" r="28" fill="var(--om-illus-surface)"/>
      <line x1="72" y1="34" x2="72" y2="38"/>
      <line x1="72" y1="78" x2="72" y2="82"/>
      <line x1="48" y1="58" x2="52" y2="58"/>
      <line x1="92" y1="58" x2="96" y2="58"/>
      <line x1="72" y1="58" x2="72" y2="44"/>
      <line x1="72" y1="58" x2="84" y2="62"/>
      <circle cx="72" cy="58" r="2.4" fill="var(--om-illus-line)" stroke="none"/>
      <path d="M104 68 L117 92 H91 Z" fill="var(--om-illus-surface)" stroke="var(--om-illus-accent)"/>
      <line x1="104" y1="77" x2="104" y2="84" stroke="var(--om-illus-accent)"/>
      <circle cx="104" cy="88" r="1.2" fill="var(--om-illus-accent)" stroke="none"/>
    `,
  },

  /* ── print — a sheet feeding through a printer (功能插图: print / export) ── */
  print: {
    accent: '#0069CB',
    svg: `
      <rect x="52" y="28" width="40" height="22" fill="var(--om-illus-surface)"/>
      <line x1="58" y1="36" x2="86" y2="36" stroke="var(--om-illus-line)"/>
      <line x1="58" y1="42" x2="78" y2="42" stroke="var(--om-illus-line)"/>
      <rect x="40" y="50" width="64" height="30" fill="var(--om-illus-surface)"/>
      <rect x="48" y="58" width="48" height="14" fill="var(--om-illus-fill)" stroke="none"/>
      <circle cx="94" cy="58" r="2.2" fill="var(--om-illus-accent)" stroke="none"/>
      <rect x="52" y="80" width="40" height="20" fill="var(--om-illus-surface)"/>
      <line x1="58" y1="88" x2="86" y2="88" stroke="var(--om-illus-line)"/>
      <line x1="58" y1="94" x2="80" y2="94" stroke="var(--om-illus-line)"/>
    `,
  },

  /* ── shortcuts — a keyboard with one accent key (功能插图: keyboard / palette) ── */
  shortcuts: {
    accent: '#00E194',
    svg: `
      <rect x="30" y="42" width="100" height="48" fill="var(--om-illus-surface)"/>
      <rect x="40" y="52" width="10" height="10" fill="var(--om-illus-fill)" stroke="none"/>
      <rect x="56" y="52" width="10" height="10" fill="var(--om-illus-accent)" stroke="none"/>
      <rect x="72" y="52" width="10" height="10" fill="var(--om-illus-fill)" stroke="none"/>
      <rect x="88" y="52" width="10" height="10" fill="var(--om-illus-fill)" stroke="none"/>
      <rect x="104" y="52" width="10" height="10" fill="var(--om-illus-fill)" stroke="none"/>
      <rect x="40" y="68" width="10" height="10" fill="var(--om-illus-fill)" stroke="none"/>
      <rect x="56" y="68" width="58" height="10" fill="var(--om-illus-fill)" stroke="none"/>
    `,
  },

  /* ── export-done — a sheet with a down arrow + green check (状态插图) ── */
  'export-done': {
    accent: '#00E194',
    svg: `
      <path d="M48 28 H86 L102 44 V96 H48 Z" fill="var(--om-illus-surface)"/>
      <path d="M86 28 V44 H102 Z" fill="var(--om-illus-fill)" stroke="none"/>
      <line x1="58" y1="58" x2="92" y2="58" stroke="var(--om-illus-line)"/>
      <line x1="58" y1="68" x2="84" y2="68" stroke="var(--om-illus-line)"/>
      <line x1="75" y1="74" x2="75" y2="90" stroke="var(--om-illus-accent)"/>
      <polyline points="68,83 75,90 82,83" fill="none" stroke="var(--om-illus-accent)" stroke-width="2.4"/>
      <circle cx="104" cy="92" r="12" fill="var(--om-illus-surface)" stroke="var(--om-illus-accent)"/>
      <polyline points="98,92 102,96.5 110,87" fill="none" stroke="var(--om-illus-accent)" stroke-width="2.4"/>
    `,
  },
};

function OmadaIllustration(props) {
  const name = props.name;
  const size = props.size || 120;          // height in px; width scales 4:3
  const accent = props.accent;             // override the scene default
  const className = props.className || '';
  const style = props.style;
  const title = props.title;

  const rest = Object.assign({}, props);
  delete rest.name; delete rest.size; delete rest.accent;
  delete rest.className; delete rest.style; delete rest.title;
  delete rest.variant; delete rest.theme; delete rest.base; delete rest.width;

  // ── Real Omada illustrations (extracted from Figma, light + dark) take
  //    priority over the legacy hand-drawn scenes. File-based; theme picked
  //    from `variant`/`theme` prop, else the page's [data-omada-theme]. ──
  const ILLUS_ALIAS = {
    'no-results': 'no-search', 'email-sent': 'email-success',
    'power-failed': 'device-power-low', 'lock-failed': 'no-permission',
    'firmware-update': 'upgrade',
  };
  const realSet = window.OMADA_ILLUS_SET;
  const realKey = realSet ? (realSet[name] ? name : (ILLUS_ALIAS[name] && realSet[ILLUS_ALIAS[name]] ? ILLUS_ALIAS[name] : null)) : null;
  if (realKey) {
    const e = realSet[realKey];
    let mode = props.variant || props.theme;
    if (!mode) mode = (typeof document !== 'undefined' && document.querySelector('[data-omada-theme="dark"]')) ? 'dark' : 'light';
    const folder = (mode === 'dark' && e.d) || (!e.l && e.d) ? 'dark' : 'light';
    const base = props.base || window.OMADA_ILLUS_BASE || 'assets/illustrations/';
    return (
      <img
        src={base + folder + '/' + realKey + '.svg'}
        alt={title || name}
        className={['omada-illus', className].filter(Boolean).join(' ')}
        style={{ height: size, width: props.width || 'auto', display: 'inline-block', verticalAlign: 'middle', ...style }}
        {...rest}
      />
    );
  }

  const scene = window.OMADA_ILLUS[name];
  if (!scene) {
    if (window.__omadaIllusWarned !== name) {
      console.warn('[OmadaIllustration] unknown illustration:', name);
      window.__omadaIllusWarned = name;
    }
    return <span role="img" aria-label={name} className={className}
                 style={{ display: 'inline-block', width: size * 4 / 3, height: size, ...style }} />;
  }

  const cls = ['omada-illus', className].filter(Boolean).join(' ');
  const mergedStyle = Object.assign(
    { '--om-illus-accent': accent || scene.accent, width: size * 4 / 3, height: size },
    style
  );

  return (
    <svg
      role="img"
      aria-hidden={title ? undefined : true}
      aria-label={title}
      className={cls}
      viewBox="0 0 160 120"
      fill="none"
      stroke="var(--om-illus-line)"
      strokeWidth="2"
      strokeLinecap="square"
      strokeLinejoin="miter"
      style={mergedStyle}
      dangerouslySetInnerHTML={{ __html: (title ? `<title>${title}</title>` : '') + scene.svg }}
      {...rest}
    />
  );
}

window.Omada = window.Omada || {};
window.Omada.Illustration = OmadaIllustration;
window.OmadaIllustration = OmadaIllustration;
