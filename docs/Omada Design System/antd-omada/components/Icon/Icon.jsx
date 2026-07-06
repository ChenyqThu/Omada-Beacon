/* ────────────────────────────────────────────────────────────────────────
   components/Icon/Icon.jsx — OmadaIcon
   The single icon primitive for the whole library. Renders bespoke Omada
   line icons from a name registry, on a 24-grid, driven by `currentColor`
   so colour comes from the surrounding text/token context. Sizes 16/20/24.

   Why a registry and not Lucide: the brief requires the REAL Omada icon
   set. The Figma's per-icon export is lossy (most glyphs are reconstructed
   as transformed bordered line-segments with no usable path geometry), so
   the clean source SVGs were extracted to assets/icons/_figma-source/ for
   provenance, and the set below is normalised to one consistent 24-grid,
   1.8px rounded-cap line style transcribed from those Figma designs.
   Add an icon by adding one entry to OMADA_ICONS — every component uses it.

   Exports: window.OmadaIcon, window.Omada.Icon
   ──────────────────────────────────────────────────────────────────────── */

window.OMADA_ICONS = {
  /* ── inline / actions ── */
  search:        '<circle cx="10.5" cy="10.5" r="6.5"/><line x1="15.5" y1="15.5" x2="20.5" y2="20.5"/>',
  refresh:       '<path d="M20 6.5v5h-5"/><path d="M4 17.5v-5h5"/><path d="M19.1 11.5a7.5 7.5 0 0 0-13-3.6L4 11.5M4.9 12.5a7.5 7.5 0 0 0 13 3.6L20 12.5"/>',
  plus:          '<line x1="12" y1="4.5" x2="12" y2="19.5"/><line x1="4.5" y1="12" x2="19.5" y2="12"/>',
  minus:         '<line x1="4.5" y1="12" x2="19.5" y2="12"/>',
  close:         '<line x1="5.5" y1="5.5" x2="18.5" y2="18.5"/><line x1="18.5" y1="5.5" x2="5.5" y2="18.5"/>',
  check:         '<polyline points="4.5,12.5 9.5,17.5 19.5,6.5"/>',
  'chevron-down':  '<polyline points="6,9.5 12,15.5 18,9.5"/>',
  'chevron-up':    '<polyline points="6,14.5 12,8.5 18,14.5"/>',
  'chevron-left':  '<polyline points="14.5,6 8.5,12 14.5,18"/>',
  'chevron-right': '<polyline points="9.5,6 15.5,12 9.5,18"/>',
  'arrow-right':   '<line x1="4.5" y1="12" x2="19" y2="12"/><polyline points="13,6 19.5,12 13,18"/>',
  'more-vertical':   '<circle cx="12" cy="5.5" r="1.4" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="12" cy="18.5" r="1.4" fill="currentColor" stroke="none"/>',
  'more-horizontal': '<circle cx="5.5" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="18.5" cy="12" r="1.4" fill="currentColor" stroke="none"/>',
  settings:      '<path d="M12 8.4a3.6 3.6 0 1 0 0 7.2 3.6 3.6 0 0 0 0-7.2z"/><path d="M19.4 14.3a1.4 1.4 0 0 0 .28 1.55l.05.05a1.7 1.7 0 1 1-2.4 2.4l-.05-.05a1.4 1.4 0 0 0-1.55-.28 1.4 1.4 0 0 0-.85 1.28V19.5a1.7 1.7 0 1 1-3.4 0v-.07a1.4 1.4 0 0 0-.92-1.28 1.4 1.4 0 0 0-1.55.28l-.05.05a1.7 1.7 0 1 1-2.4-2.4l.05-.05a1.4 1.4 0 0 0 .28-1.55 1.4 1.4 0 0 0-1.28-.85H4.5a1.7 1.7 0 1 1 0-3.4h.07a1.4 1.4 0 0 0 1.28-.92 1.4 1.4 0 0 0-.28-1.55l-.05-.05a1.7 1.7 0 1 1 2.4-2.4l.05.05a1.4 1.4 0 0 0 1.55.28h.06a1.4 1.4 0 0 0 .85-1.28V4.5a1.7 1.7 0 1 1 3.4 0v.07a1.4 1.4 0 0 0 .85 1.28 1.4 1.4 0 0 0 1.55-.28l.05-.05a1.7 1.7 0 1 1 2.4 2.4l-.05.05a1.4 1.4 0 0 0-.28 1.55v.06a1.4 1.4 0 0 0 1.28.85h.07a1.7 1.7 0 1 1 0 3.4h-.07a1.4 1.4 0 0 0-1.28.85z"/>',
  'settings-2':  '<line x1="5" y1="7.5" x2="19" y2="7.5"/><circle cx="9.5" cy="7.5" r="2.2" fill="var(--om-icon-bg,#fff)"/><line x1="5" y1="16.5" x2="19" y2="16.5"/><circle cx="15" cy="16.5" r="2.2" fill="var(--om-icon-bg,#fff)"/>',
  edit:          '<path d="M14.5 5.8l3.7 3.7"/><path d="M16.2 4.1a1.7 1.7 0 0 1 2.4 2.4L7.5 17.6l-3.5 1 1-3.5z"/>',
  trash:         '<polyline points="4.5,6.5 19.5,6.5"/><path d="M9 6.5V5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5v1.5"/><path d="M6.5 6.5l1 12a1.5 1.5 0 0 0 1.5 1.4h6a1.5 1.5 0 0 0 1.5-1.4l1-12"/><line x1="10" y1="10" x2="10" y2="16.5"/><line x1="14" y1="10" x2="14" y2="16.5"/>',
  download:      '<path d="M12 3.5v11"/><polyline points="7.5,10 12,14.5 16.5,10"/><path d="M4.5 16.5v2a1.5 1.5 0 0 0 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5v-2"/>',
  upload:        '<path d="M12 20.5v-11"/><polyline points="7.5,14 12,9.5 16.5,14"/><path d="M4.5 7.5v-2a1.5 1.5 0 0 1 1.5-1.5h12a1.5 1.5 0 0 1 1.5 1.5v2"/>',
  export:        '<path d="M14.5 9.5l5-5"/><polyline points="14.5,4.5 19.5,4.5 19.5,9.5"/><path d="M19 13v5.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 18.5v-11A1.5 1.5 0 0 1 6.5 6H12"/>',
  filter:        '<path d="M4.5 5.5h15l-6 7v6l-3 1.5v-7.5z" fill="currentColor" fill-opacity="0.12"/>',
  copy:          '<rect x="8.5" y="8.5" width="11" height="11" rx="1.8"/><path d="M5.5 15.5A1.5 1.5 0 0 1 4 14V5.5A1.5 1.5 0 0 1 5.5 4H14a1.5 1.5 0 0 1 1.5 1.5"/>',
  docs:          '<path d="M7 3.5h6.5L18 8v11.5a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-15a1 1 0 0 1 1-1z"/><polyline points="13,3.5 13,8.5 18,8.5"/><line x1="9" y1="12.5" x2="15" y2="12.5"/><line x1="9" y1="16" x2="13" y2="16"/>',
  eye:           '<path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z"/><circle cx="12" cy="12" r="3"/>',
  'eye-off':     '<path d="M9.5 5.3A9.9 9.9 0 0 1 12 5c6 0 9.5 7 9.5 7a16 16 0 0 1-2.7 3.6M6.3 6.3A16 16 0 0 0 2.5 12s3.5 7 9.5 7a9.5 9.5 0 0 0 4-.85"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/><line x1="4" y1="4" x2="20" y2="20"/>',
  info:          '<circle cx="12" cy="12" r="8.5"/><line x1="12" y1="11" x2="12" y2="16.5"/><circle cx="12" cy="7.8" r="1.05" fill="currentColor" stroke="none"/>',
  warning:       '<path d="M12 4.5l8.5 14.5h-17z"/><line x1="12" y1="10" x2="12" y2="14.5"/><circle cx="12" cy="16.8" r="1.05" fill="currentColor" stroke="none"/>',
  ban:           '<circle cx="12" cy="12" r="8.5"/><line x1="6" y1="6" x2="18" y2="18"/>',
  'check-circle':'<circle cx="12" cy="12" r="8.5"/><polyline points="8,12.2 11,15 16,8.8"/>',
  'help-circle': '<circle cx="12" cy="12" r="8.5"/><path d="M9.8 9.5a2.2 2.2 0 1 1 3 2.05c-.6.27-.9.6-.9 1.45v.5"/><circle cx="12" cy="16.5" r="1.05" fill="currentColor" stroke="none"/>',
  calendar:      '<rect x="4" y="5.5" width="16" height="15" rx="1.8"/><line x1="4" y1="9.5" x2="20" y2="9.5"/><line x1="8.5" y1="3.5" x2="8.5" y2="7"/><line x1="15.5" y1="3.5" x2="15.5" y2="7"/>',
  clock:         '<circle cx="12" cy="12" r="8.5"/><polyline points="12,7 12,12 15.5,14"/>',
  'external-link':'<path d="M14 5.5h4.5V10"/><line x1="18.5" y1="5.5" x2="11" y2="13"/><path d="M16 13.5v4A1.5 1.5 0 0 1 14.5 19h-8A1.5 1.5 0 0 1 5 17.5v-8A1.5 1.5 0 0 1 6.5 8h4"/>',
  /* ── theme + locale (toolbar) ── */
  sun:           '<circle cx="12" cy="12" r="4"/><line x1="12" y1="2.5" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="21.5"/><line x1="2.5" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="21.5" y2="12"/><line x1="5.3" y1="5.3" x2="7" y2="7"/><line x1="17" y1="17" x2="18.7" y2="18.7"/><line x1="5.3" y1="18.7" x2="7" y2="17"/><line x1="17" y1="7" x2="18.7" y2="5.3"/>',
  moon:          '<path d="M20 13.5A8 8 0 1 1 10.5 4 6.2 6.2 0 0 0 20 13.5z"/>',
  languages:     '<path d="M3.5 6.5h9"/><path d="M8 4v2.5"/><path d="M10.5 6.5c-.6 4-3.2 7.2-6.5 8.5M5 9.5c.7 2.3 2.8 4.3 5.5 5"/><path d="M12.5 20.5l4-9 4 9M14 17.5h5"/>',
  /* ── status / device actions ── */
  adopt:         '<path d="M4.5 6.5h11v9h-11z"/><polyline points="14,9.5 17,12.5 21,7.5"/>',
  reboot:        '<path d="M19.5 7v4h-4"/><path d="M18.4 11A7 7 0 1 0 19 15"/><line x1="12" y1="5" x2="12" y2="12"/>',
  disconnect:    '<path d="M9 9l-3.5 3.5a3.5 3.5 0 0 0 5 5L14 14"/><path d="M15 15l3.5-3.5a3.5 3.5 0 0 0-5-5L10 10"/><line x1="4" y1="4" x2="20" y2="20"/>',
  'move-to-site':'<path d="M12 21s6.5-5.5 6.5-10.5a6.5 6.5 0 1 0-13 0C5.5 15.5 12 21 12 21z"/><polyline points="9.5,10 11.5,12 15,8"/>',
  power:         '<path d="M12 4v8"/><path d="M7.5 7a7 7 0 1 0 9 0"/>',
  /* ── nav / device types ── */
  dashboard:     '<rect x="4" y="4" width="7" height="7" rx="1.4"/><rect x="13" y="4" width="7" height="7" rx="1.4"/><rect x="4" y="13" width="7" height="7" rx="1.4"/><rect x="13" y="13" width="7" height="7" rx="1.4"/>',
  devices:       '<rect x="3.5" y="6" width="17" height="6.5" rx="1.6"/><line x1="6.5" y1="9.2" x2="6.5" y2="9.3"/><circle cx="6.5" cy="9.25" r="1.05" fill="currentColor" stroke="none"/><line x1="9.5" y1="15.5" x2="9.5" y2="20.5"/><line x1="14.5" y1="15.5" x2="14.5" y2="20.5"/><path d="M6.5 12.5v1.5a1.5 1.5 0 0 0 1.5 1.5h8a1.5 1.5 0 0 0 1.5-1.5v-1.5"/>',
  clients:       '<circle cx="9" cy="8.5" r="3.2"/><path d="M3.5 19.5a5.5 5.5 0 0 1 11 0"/><path d="M15.5 5.6a3.2 3.2 0 0 1 0 5.9M16.5 14.4a5.5 5.5 0 0 1 4 5.1"/>',
  user:          '<circle cx="12" cy="8" r="3.6"/><path d="M5 20a7 7 0 0 1 14 0z"/>',
  alerts:        '<path d="M18 9.5a6 6 0 0 0-12 0c0 5-2.5 6.5-2.5 6.5h17S18 14.5 18 9.5z"/><path d="M10.3 19.5a2 2 0 0 0 3.4 0"/>',
  map:           '<polygon points="3.5,6.5 9,4 15,6.5 20.5,4 20.5,17.5 15,20 9,17.5 3.5,20"/><line x1="9" y1="4" x2="9" y2="17.5"/><line x1="15" y1="6.5" x2="15" y2="20"/>',
  insights:      '<line x1="4" y1="20" x2="20" y2="20"/><rect x="5.5" y="12" width="3" height="6"/><rect x="10.5" y="8" width="3" height="10"/><rect x="15.5" y="4.5" width="3" height="13.5"/>',
  gateway:       '<rect x="3.5" y="12.5" width="17" height="7" rx="1.6"/><circle cx="7.5" cy="16" r="1.1" fill="currentColor" stroke="none"/><line x1="12" y1="16" x2="17" y2="16"/><line x1="8" y1="12.5" x2="8" y2="6"/><line x1="16" y1="12.5" x2="16" y2="6"/><path d="M8 6l-2-2M16 6l2-2"/>',
  switch:        '<rect x="3" y="8" width="18" height="8" rx="1.6"/><line x1="6.5" y1="13" x2="6.5" y2="13.1"/><rect x="6" y="12.4" width="1.2" height="1.2" fill="currentColor" stroke="none"/><rect x="9" y="12.4" width="1.2" height="1.2" fill="currentColor" stroke="none"/><rect x="12" y="12.4" width="1.2" height="1.2" fill="currentColor" stroke="none"/><rect x="15" y="12.4" width="1.2" height="1.2" fill="currentColor" stroke="none"/><rect x="18" y="12.4" width="1.2" height="0" fill="currentColor" stroke="none"/>',
  ap:            '<circle cx="12" cy="16.5" r="2"/><path d="M8.2 12.8a5.5 5.5 0 0 1 7.6 0"/><path d="M5.4 10a9.5 9.5 0 0 1 13.2 0"/>',
  camera:        '<path d="M3.5 8.5l14-3 1.3 5.2-14 3z"/><circle cx="8.5" cy="9.2" r="2"/><line x1="5.5" y1="14" x2="6.5" y2="18.5"/><line x1="14.5" y1="11.8" x2="15.5" y2="16"/><line x1="5" y1="19" x2="16" y2="16.5"/>',
  wifi:          '<path d="M3.5 9a13 13 0 0 1 17 0"/><path d="M6.5 12.5a8.5 8.5 0 0 1 11 0"/><path d="M9.5 16a4 4 0 0 1 5 0"/><circle cx="12" cy="19" r="1.2" fill="currentColor" stroke="none"/>',
  globe:         '<circle cx="12" cy="12" r="8.5"/><line x1="3.5" y1="12" x2="20.5" y2="12"/><path d="M12 3.5c2.5 2.3 3.9 5.4 3.9 8.5s-1.4 6.2-3.9 8.5c-2.5-2.3-3.9-5.4-3.9-8.5S9.5 5.8 12 3.5z"/>',
  bell:          '<path d="M18 9.5a6 6 0 0 0-12 0c0 5-2.5 6.5-2.5 6.5h17S18 14.5 18 9.5z"/><path d="M10.3 19.5a2 2 0 0 0 3.4 0"/>',
  lock:          '<rect x="5" y="10.5" width="14" height="9.5" rx="1.8"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',
  cloud:         '<path d="M7 18.5h10a4 4 0 0 0 .5-7.97 6 6 0 0 0-11.5 1.6A3.5 3.5 0 0 0 7 18.5z"/>',
  /* ── data display (Batch 2) ── */
  'trending-up':   '<polyline points="3.5,17 9.5,11 13,14.5 20.5,7"/><polyline points="15,7 20.5,7 20.5,12.5"/>',
  'trending-down': '<polyline points="3.5,7 9.5,13 13,9.5 20.5,17"/><polyline points="15,17 20.5,17 20.5,11.5"/>',
  /* ── Batch 17 — print / shortcuts / tokens ── */
  printer:       '<path d="M7 9.5V4.5h10v5"/><rect x="4" y="9.5" width="16" height="7" rx="1.4"/><rect x="7" y="14.5" width="10" height="5"/><circle cx="17" cy="12.5" r="1" fill="currentColor" stroke="none"/>',
  keyboard:      '<rect x="3" y="6.5" width="18" height="11" rx="1.8"/><line x1="6.5" y1="10" x2="6.5" y2="10.1"/><line x1="10" y1="10" x2="10" y2="10.1"/><line x1="13.5" y1="10" x2="13.5" y2="10.1"/><line x1="17" y1="10" x2="17" y2="10.1"/><line x1="8.5" y1="14" x2="15.5" y2="14"/>',
  command:       '<path d="M9 9V7.5A2.5 2.5 0 1 0 6.5 10H9zm0 0v6m0-6h6m-6 6v1.5A2.5 2.5 0 1 1 6.5 14H9zm6-6v6m0-6h1.5A2.5 2.5 0 1 0 14 7.5V9zm0 6h1.5A2.5 2.5 0 1 1 14 17.5V16h1z"/>',
  list:          '<line x1="8.5" y1="6.5" x2="20" y2="6.5"/><line x1="8.5" y1="12" x2="20" y2="12"/><line x1="8.5" y1="17.5" x2="20" y2="17.5"/><circle cx="4.5" cy="6.5" r="1.1" fill="currentColor" stroke="none"/><circle cx="4.5" cy="12" r="1.1" fill="currentColor" stroke="none"/><circle cx="4.5" cy="17.5" r="1.1" fill="currentColor" stroke="none"/>',
  layers:        '<polygon points="12,3.5 20.5,8 12,12.5 3.5,8"/><polyline points="3.5,12 12,16.5 20.5,12"/><polyline points="3.5,16 12,20.5 20.5,16"/>',
  braces:        '<path d="M8.5 4.5A2.5 2.5 0 0 0 6 7v2.5A2 2 0 0 1 4 11.5a2 2 0 0 1 2 2V16a2.5 2.5 0 0 0 2.5 2.5"/><path d="M15.5 4.5A2.5 2.5 0 0 1 18 7v2.5a2 2 0 0 0 2 2 2 2 0 0 0-2 2V16a2.5 2.5 0 0 1-2.5 2.5"/>',
  'corner-down-left': '<polyline points="8.5,9 4.5,13 8.5,17"/><path d="M4.5 13h10A4 4 0 0 0 18.5 9V6.5"/>',
  /* ── Batch 18 — drag, inbox, export formats, panes ── */
  'grip-vertical': '<circle cx="9" cy="6" r="1.3" fill="currentColor" stroke="none"/><circle cx="15" cy="6" r="1.3" fill="currentColor" stroke="none"/><circle cx="9" cy="12" r="1.3" fill="currentColor" stroke="none"/><circle cx="15" cy="12" r="1.3" fill="currentColor" stroke="none"/><circle cx="9" cy="18" r="1.3" fill="currentColor" stroke="none"/><circle cx="15" cy="18" r="1.3" fill="currentColor" stroke="none"/>',
  inbox:         '<polyline points="3.5,13 8,13 9.5,15.5 14.5,15.5 16,13 20.5,13"/><path d="M5.2 6.5h13.6l1.7 6.5v4a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 2.5 17v-4z"/>',
  'file-text':   '<path d="M7 3.5h6.5L18 8v11.5a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-15a1 1 0 0 1 1-1z"/><polyline points="13,3.5 13,8.5 18,8.5"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="16.5" x2="15" y2="16.5"/>',
  table:         '<rect x="3.5" y="4.5" width="17" height="15" rx="1.5"/><line x1="3.5" y1="9.5" x2="20.5" y2="9.5"/><line x1="3.5" y1="14.5" x2="20.5" y2="14.5"/><line x1="9.5" y1="9.5" x2="9.5" y2="19.5"/>',
  'check-check': '<polyline points="2.5,12.5 7,17 14.5,7.5"/><polyline points="11,15 12.5,16.5 21.5,5.5"/>',
  'panel-right': '<rect x="3.5" y="4.5" width="17" height="15" rx="1.5"/><line x1="14.5" y1="4.5" x2="14.5" y2="19.5"/>',
  /* ── Batch 19 — board, filter, save, arrows, sun/moon swap ── */
  columns:       '<rect x="3.5" y="4.5" width="5" height="15" rx="1.2"/><rect x="9.5" y="4.5" width="5" height="15" rx="1.2"/><rect x="15.5" y="4.5" width="5" height="15" rx="1.2"/>',
  sliders:       '<line x1="4" y1="8" x2="20" y2="8"/><line x1="4" y1="16" x2="20" y2="16"/><circle cx="9" cy="8" r="2.4" fill="var(--om-icon-bg,#fff)"/><circle cx="15" cy="16" r="2.4" fill="var(--om-icon-bg,#fff)"/>',
  save:          '<path d="M5 4.5h11l3 3V18a1.5 1.5 0 0 1-1.5 1.5h-12A1.5 1.5 0 0 1 4 18V5.5A1 1 0 0 1 5 4.5z"/><path d="M8 4.5v4.5h7V4.5"/><rect x="8" y="12.5" width="8" height="7"/>',
  'arrow-up':    '<line x1="12" y1="19.5" x2="12" y2="5"/><polyline points="6,11 12,4.5 18,11"/>',
  'arrow-down':  '<line x1="12" y1="4.5" x2="12" y2="19"/><polyline points="6,13 12,19.5 18,13"/>',
  'arrow-left':  '<line x1="19.5" y1="12" x2="5" y2="12"/><polyline points="11,6 4.5,12 11,18"/>',
  pin:           '<path d="M9 4.5h6l-1 5 3 3v2h-5v5l-1 1-1-1v-5H4v-2l3-3-1-5z"/>',
  /* ── Batch 20 — checklist, grid, compare, queue, presence ── */
  circle:        '<circle cx="12" cy="12" r="8"/>',
  bookmark:      '<path d="M6.5 4.5h11a1 1 0 0 1 1 1v15l-6.5-4.7L5.5 20.5v-15a1 1 0 0 1 1-1z"/>',
  star:          '<path d="M12 4.2l2.42 4.9 5.4.78-3.91 3.81.92 5.38L12 16.5l-4.83 2.54.92-5.38L4.18 9.88l5.4-.78z"/>',
  flag:          '<path d="M6 4v16"/><path d="M6 5h11l-2.4 4 2.4 4H6"/>',
  compare:       '<rect x="3.5" y="4.5" width="17" height="15" rx="1.5"/><line x1="12" y1="4.5" x2="12" y2="19.5"/>',
  pause:         '<rect x="7" y="5" width="3.4" height="14" rx="1" fill="currentColor" stroke="none"/><rect x="13.6" y="5" width="3.4" height="14" rx="1" fill="currentColor" stroke="none"/>',
  play:          '<path d="M7.5 5.4v13.2l11-6.6z" fill="currentColor" stroke="none"/>',
  rocket:        '<path d="M12 3.5c3.2 1.4 5 4.4 5 8.3l-2.2 2.4H9.2L7 11.8c0-3.9 1.8-6.9 5-8.3z"/><circle cx="12" cy="9.5" r="1.6" fill="var(--om-icon-bg,#fff)"/><path d="M9.2 14.2l-2.2 1.2.8 2.6 2.4-.9M14.8 14.2l2.2 1.2-.8 2.6-2.4-.9"/>',
  /* ── Batch 25 — audit, conflict-merge, maintenance ── */
  shield:        '<path d="M12 3.5l7 2.5v5.5c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6z"/><polyline points="8.8,11.8 11.2,14.2 15.4,9.4"/>',
  merge:         '<circle cx="6.5" cy="5.8" r="1.9"/><circle cx="6.5" cy="18.2" r="1.9"/><circle cx="18" cy="12" r="1.9"/><path d="M6.5 7.7v8.6"/><path d="M6.5 9.5c0 3 2.5 4.5 5.5 4.5h4"/><polyline points="13.5,11.5 16,14 13.5,16.5"/>',
  wrench:        '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z"/>',
  /* ── Batch 26 — speed, identity, security, sites ── */
  gauge:         '<path d="M4.5 17.5a8.5 8.5 0 1 1 15 0"/><line x1="12" y1="14" x2="15.6" y2="9.2"/><circle cx="12" cy="14.5" r="1.3" fill="currentColor" stroke="none"/>',
  fingerprint:   '<path d="M12 4.5a8 8 0 0 1 8 8c0 2.4-.3 4.7-1 6.9"/><path d="M8.4 5.3A8 8 0 0 0 4 12.5c0 1.9-.25 3.7-.75 5.4"/><path d="M12 8a4.5 4.5 0 0 1 4.5 4.5c0 2.4-.3 4.7-.9 6.9"/><path d="M7.6 14.5a4.5 4.5 0 0 1-.1-2 4.5 4.5 0 0 1 1.8-2.9"/><path d="M12 11.4a1.3 1.3 0 0 1 1.3 1.3c0 2.5-.3 4.8-.9 7"/><path d="M8.9 17.5c-.3 1-.6 1.9-1 2.7"/>',
  key:           '<circle cx="8" cy="15.8" r="3.8"/><path d="M10.8 13L19.8 4"/><path d="M15.3 8.5l2.6 2.6"/><path d="M18 5.8l2 2"/>',
  building:      '<rect x="5" y="4" width="14" height="16.5" rx="1.2"/><rect x="8.2" y="7.2" width="1.7" height="1.7" fill="currentColor" stroke="none"/><rect x="14.1" y="7.2" width="1.7" height="1.7" fill="currentColor" stroke="none"/><rect x="8.2" y="11.2" width="1.7" height="1.7" fill="currentColor" stroke="none"/><rect x="14.1" y="11.2" width="1.7" height="1.7" fill="currentColor" stroke="none"/><path d="M10.4 20.5v-3.6h3.2v3.6"/>',
  laptop:        '<rect x="5" y="5.5" width="14" height="9.5" rx="1.4"/><path d="M3 18.5h18"/><path d="M5 15l-1.4 3.5M19 15l1.4 3.5"/>',
  smartphone:    '<rect x="8" y="3.5" width="8" height="17" rx="1.8"/><line x1="10.8" y1="17.6" x2="13.2" y2="17.6"/>',
  /* ── Batch 27 — voucher, capture, radius, certificates ── */
  ticket:        '<path d="M3.5 9V6.8a1.3 1.3 0 0 1 1.3-1.3h14.4a1.3 1.3 0 0 1 1.3 1.3V9a3 3 0 0 0 0 6v2.2a1.3 1.3 0 0 1-1.3 1.3H4.8a1.3 1.3 0 0 1-1.3-1.3V15a3 3 0 0 0 0-6z"/><line x1="9.5" y1="5.5" x2="9.5" y2="18.5" stroke-dasharray="2.6 2.6"/>',
  activity:      '<polyline points="3,12 7.5,12 10,5.5 14,18.5 16.5,12 21,12"/>',
  server:        '<rect x="4" y="4.5" width="16" height="6.5" rx="1.4"/><rect x="4" y="13" width="16" height="6.5" rx="1.4"/><circle cx="7.5" cy="7.75" r="1" fill="currentColor" stroke="none"/><circle cx="7.5" cy="16.25" r="1" fill="currentColor" stroke="none"/><line x1="13" y1="7.75" x2="17" y2="7.75"/><line x1="13" y1="16.25" x2="17" y2="16.25"/>',
  certificate:   '<circle cx="12" cy="9" r="4.6"/><circle cx="12" cy="9" r="1.6"/><path d="M9.6 12.9L8 20l4-2.2L16 20l-1.6-7.1"/>',
  /* ── Batch 28 — PoE bolt (normalised from Figma 25947:11987 / frame 25331:112308) ── */
  zap:           '<path d="M13.2 3.5h-3.4L7.6 12h3.2l-1.3 8.5 7.9-10.7h-4.8z"/>',
};

function OmadaIcon({ name, size = 16, strokeWidth, color, className, style, title, ...rest }) {
  delete rest.name; delete rest.size; delete rest.strokeWidth;

  // ── Real Omada icons (extracted from Figma) take priority over the legacy
  //    hand-drawn set. Each carries its own viewBox; mono glyphs paint with
  //    currentColor, coloured glyphs keep their own fills. A small alias map
  //    upgrades legacy hand-drawn keys to their real equivalents so existing
  //    component call-sites auto-correct without edits. ──
  const ICON_ALIAS = {
    plus: 'add', trash: 'delete', printer: 'print',
    'more-vertical': 'more', 'more-horizontal': 'more', 'eye-off': 'eyes-closed',
  };
  const set = window.OMADA_ICON_SET;
  const realName = set ? (set[name] ? name : (ICON_ALIAS[name] && set[ICON_ALIAS[name]] ? ICON_ALIAS[name] : null)) : null;
  const real = realName && set[realName];
  if (real) {
    return (
      <svg
        role="img"
        aria-hidden={title ? undefined : true}
        aria-label={title}
        className={className}
        width={size}
        height={size}
        viewBox={real.viewBox}
        fill="none"
        style={{ display: 'inline-block', flexShrink: 0, verticalAlign: 'middle', ...(color ? { color } : null), ...style }}
        dangerouslySetInnerHTML={{ __html: (title ? `<title>${title}</title>` : '') + real.inner }}
        {...rest}
      />
    );
  }

  const inner = window.OMADA_ICONS[name];
  const sw = strokeWidth != null ? strokeWidth : 1.8;
  if (!inner) {
    // Visible-but-quiet fallback so a missing name never crashes a layout.
    if (window.__omadaIconWarned !== name) { console.warn('[OmadaIcon] unknown icon:', name); window.__omadaIconWarned = name; }
    return (
      <span role="img" aria-label={name} className={className}
            style={{ display: 'inline-block', width: size, height: size, ...style }}/>
    );
  }
  return (
    <svg
      role="img"
      aria-hidden={title ? undefined : true}
      aria-label={title}
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color || 'currentColor'}
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'inline-block', flexShrink: 0, verticalAlign: 'middle', ...style }}
      dangerouslySetInnerHTML={{ __html: (title ? `<title>${title}</title>` : '') + inner }}
      {...rest}
    />
  );
}

window.Omada = window.Omada || {};
window.Omada.Icon = OmadaIcon;
window.OmadaIcon = OmadaIcon;
