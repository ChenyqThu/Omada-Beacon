/* ────────────────────────────────────────────────────────────────────────
   components/DeviceIcon/DeviceIcon.jsx — OmadaDeviceIcon

   REAL Omada device-type, client, model & dashboard icons, extracted from the
   source Figma as full-colour vector SVGs. Loaded as standalone files (they
   carry their own colours / gradients / filters — not currentColor).

   Type & client glyphs ship light + dark variants (theme auto-detected from
   the page's [data-omada-theme], or force with variant="light|dark").

   <DeviceIcon device="ap" size={40} />
   <DeviceIcon device="iphone" size={40} variant="dark" />
   <DeviceIcon device="traffic" size={28} />     // dashboard glyph
   <DeviceIcon device="eap650" size={56} showLabel />

   Exports: window.OmadaDeviceIcon, window.Omada.DeviceIcon
   ──────────────────────────────────────────────────────────────────────── */

window.OMADA_DEVICE_ICONS = {
  /* ── infrastructure (light + dark) ── */
  ap:            { f: 'ap.svg',            label: 'Access Point',  group: 'infra',  d: 1 },
  'ap-group':    { f: 'ap-group.svg',      label: 'AP Group',      group: 'infra',  d: 1 },
  switch:        { f: 'switch.svg',        label: 'Switch',        group: 'infra',  d: 1 },
  'l3-switch':   { f: 'models/l3-switch.svg', label: 'L3 Switch',  group: 'infra' },
  gateway:       { f: 'gateway.svg',       label: 'Gateway',       group: 'infra',  d: 1 },
  router:        { f: 'router.svg',        label: 'Router',        group: 'infra',  d: 1 },
  controller:    { f: 'controller.svg',    label: 'Controller',    group: 'infra',  d: 1 },
  internet:      { f: 'internet.svg',      label: 'Internet',      group: 'infra',  d: 1 },
  stack:         { f: 'stack.svg',         label: 'Stack',         group: 'infra',  d: 1 },
  nvr:           { f: 'nvr.svg',           label: 'NVR',           group: 'infra',  d: 1 },
  ipc:           { f: 'ipc.svg',           label: 'IP Camera',     group: 'infra',  d: 1 },
  'camera-group':{ f: 'camera-group.svg',  label: 'Camera Group',  group: 'infra',  d: 1 },
  'child-ipc':   { f: 'child-ipc.svg',     label: 'Child IPC',     group: 'infra',  d: 1 },
  /* ── clients (light + dark) ── */
  iphone:        { f: 'iphone.svg',        label: 'iPhone',        group: 'client', d: 1 },
  android:       { f: 'android.svg',       label: 'Android Phone', group: 'client', d: 1 },
  macbook:       { f: 'macbook.svg',       label: 'MacBook',       group: 'client', d: 1 },
  imac:          { f: 'imac.svg',          label: 'iMac',          group: 'client', d: 1 },
  computer:      { f: 'computer.svg',      label: 'Computer',      group: 'client', d: 1 },
  pad:           { f: 'pad.svg',           label: 'Tablet',        group: 'client', d: 1 },
  tv:            { f: 'tv.svg',            label: 'TV',            group: 'client', d: 1 },
  ipod:          { f: 'ipod.svg',          label: 'iPod',          group: 'client', d: 1 },
  usb:           { f: 'usb.svg',           label: 'USB',           group: 'client', d: 1 },
  harddisk:      { f: 'harddisk.svg',      label: 'Hard Disk',     group: 'client', d: 1 },
  scanner:       { f: 'scanner.svg',       label: 'Scanner',       group: 'client', d: 1 },
  'client-group':{ f: 'client-group.svg',  label: 'Client Group',  group: 'client', d: 1 },
  other:         { f: 'other.svg',         label: 'Other',         group: 'client', d: 1 },
  /* ── specific hardware models ── */
  eap650:          { f: 'models/eap650.svg',          label: 'EAP650',          group: 'model' },
  eap787:          { f: 'models/eap787.svg',          label: 'EAP787',          group: 'model' },
  'eap650-outdoor':{ f: 'models/eap650-outdoor.svg',  label: 'EAP650-Outdoor',  group: 'model' },
  'eap650-wall':   { f: 'models/eap650-wall.svg',     label: 'EAP650-Wall',     group: 'model' },
  er8411:          { f: 'models/er8411.svg',          label: 'ER8411',          group: 'model' },
  er7212:          { f: 'models/er7212.svg',          label: 'ER7212',          group: 'model' },
  'tl-er7206':     { f: 'models/tl-er7206.svg',       label: 'TL-ER7206',       group: 'model' },
  'tl-sg2008p':    { f: 'models/tl-sg2008p.svg',      label: 'TL-SG2008P',      group: 'model' },
  'tl-sg2428p':    { f: 'models/tl-sg2428p.svg',      label: 'TL-SG2428P',      group: 'model' },
  es205gp:         { f: 'models/es205gp.svg',         label: 'ES205GP',         group: 'model' },
  dr3650:          { f: 'models/dr3650.svg',          label: 'DR3650v',         group: 'model' },
  /* ── dashboard / network stat glyphs ── */
  alert:               { f: 'dashboard/alert.svg',               label: 'Alert',               group: 'dashboard' },
  traffic:             { f: 'dashboard/traffic.svg',             label: 'Traffic',             group: 'dashboard' },
  guest:               { f: 'dashboard/guest.svg',               label: 'Guest',               group: 'dashboard' },
  'channel-utilization':{ f: 'dashboard/channel-utilization.svg', label: 'Channel Util.',      group: 'dashboard' },
  client:              { f: 'dashboard/client.svg',              label: 'Client',              group: 'dashboard' },
  'client-wireless':   { f: 'dashboard/client-wireless.svg',     label: 'Wireless Client',     group: 'dashboard' },
  'wireless-device-online': { f: 'dashboard/wireless-device-online.svg', label: 'Wireless Online', group: 'dashboard' },
  'customer-network':  { f: 'dashboard/customer-network.svg',    label: 'Customer Network',    group: 'dashboard' },
  'surveillance-network':{ f: 'dashboard/surveillance-network.svg', label: 'Surveillance Net.', group: 'dashboard' },
  olt:                 { f: 'dashboard/olt.svg',                 label: 'OLT',                 group: 'dashboard' },
  site:                { f: 'dashboard/site.svg',                label: 'Site',                group: 'dashboard' },
  cloud:               { f: 'dashboard/cloud.svg',               label: 'Cloud',               group: 'dashboard' },
  'software-org':      { f: 'dashboard/software-org.svg',        label: 'Software Org',        group: 'dashboard' },
  'hardware-controller':{ f: 'dashboard/hardware-controller.svg', label: 'Hardware Controller', group: 'dashboard' },
  'cloud-standard':    { f: 'dashboard/cloud-standard.svg',      label: 'Cloud Standard',      group: 'dashboard' },
  fusion:              { f: 'dashboard/fusion.svg',              label: 'Fusion',              group: 'dashboard' },
};

function OmadaDeviceIcon(props) {
  const device = props.device;
  const size = props.size || 40;
  const base = props.base || window.OMADA_DEVICE_BASE || 'assets/device-icons/';
  const showLabel = props.showLabel;
  const className = props.className || '';
  const style = props.style;

  const rest = Object.assign({}, props);
  ['device', 'size', 'base', 'showLabel', 'className', 'style', 'variant', 'theme'].forEach((k) => delete rest[k]);

  const entry = window.OMADA_DEVICE_ICONS[device];
  if (!entry) {
    if (window.__omadaDeviceWarned !== device) {
      console.warn('[OmadaDeviceIcon] unknown device:', device);
      window.__omadaDeviceWarned = device;
    }
    return <span role="img" aria-label={device} className={className}
                 style={{ display: 'inline-block', width: size, height: size, ...style }} />;
  }

  // dark variant for type/client glyphs
  let mode = props.variant || props.theme;
  if (!mode) mode = (typeof document !== 'undefined' && document.querySelector('[data-omada-theme="dark"]')) ? 'dark' : 'light';
  const file = (mode === 'dark' && entry.d) ? 'dark/' + entry.f : entry.f;

  const img = (
    <img
      src={base + file}
      alt={props.title || entry.label}
      height={size}
      className={className}
      style={{ width: 'auto', maxWidth: size * 1.6, objectFit: 'contain', display: 'block', ...(showLabel ? null : style) }}
      {...rest}
    />
  );

  if (!showLabel) return img;
  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 6, ...style }}>
      {img}
      <span style={{ fontSize: 11, color: 'var(--fg-secondary, #999)', whiteSpace: 'nowrap' }}>{entry.label}</span>
    </span>
  );
}

window.Omada = window.Omada || {};
window.Omada.DeviceIcon = OmadaDeviceIcon;
window.OmadaDeviceIcon = OmadaDeviceIcon;
