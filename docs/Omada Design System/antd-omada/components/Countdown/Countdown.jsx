/* ────────────────────────────────────────────────────────────────────────
   components/Countdown/Countdown.jsx — OmadaCountdown

   Thin wrapper over antd's Statistic timer family — the antd-6 primitive the
   library was still missing. One component, two directions:

     · type="down"  → a deadline countdown (maintenance window, session expiry,
                      firmware rollout). Uses Statistic.Timer type="countdown"
                      when present, else the stable Statistic.Countdown.
     · type="up"    → elapsed time (uptime, provisioning). Uses Statistic.Timer
                      type="countup" when present, else a small interval-driven
                      fallback so count-up works on any antd 6 build.

   Omada conveniences on top of the plain value display:
     · icon     — a leading OmadaIcon composed into the title (KPI tiles)
     · type/value/format/onFinish forwarded straight through

   `value` is an absolute timestamp (ms) so the figure stays correct across
   re-renders; `format` follows dayjs tokens (HH:mm:ss, D[d] HH:mm:ss). Colour
   comes from antd tokens, so dark mode + the Theming hue-swap follow for free.

   antd has no dedicated Figma node here; metrics follow the Statistic type
   scale (value = fontSizeHeading2, title = colorTextSecondary).
   Exports: window.Omada.Countdown
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { useState, useEffect } = React;

  function pad(n) { return String(n).padStart(2, '0'); }

  // format an elapsed/remaining ms span against a dayjs-style token string
  function formatSpan(ms, format) {
    const total = Math.max(0, Math.floor(ms / 1000));
    const days = Math.floor(total / 86400);
    const hrsAbs = Math.floor(total / 3600);
    const hrs = format.indexOf('D') >= 0 ? Math.floor((total % 86400) / 3600) : hrsAbs;
    const mins = Math.floor((total % 3600) / 60);
    const secs = total % 60;
    let out = format;
    out = out.replace(/D/g, String(days));
    out = out.replace(/HH/g, pad(hrs)).replace(/H/g, String(hrs));
    out = out.replace(/mm/g, pad(mins)).replace(/m/g, String(mins));
    out = out.replace(/ss/g, pad(secs)).replace(/s/g, String(secs));
    out = out.replace(/\[(.*?)\]/g, '$1'); // dayjs literal escapes
    return out;
  }

  // fallback count-up: ticks once a second from an absolute start timestamp
  function ManualCountUp(props) {
    const start = props.value;
    const format = props.format || 'HH:mm:ss';
    const [now, setNow] = useState(Date.now());
    useEffect(() => {
      const id = setInterval(() => setNow(Date.now()), 1000);
      return () => clearInterval(id);
    }, []);
    const { Statistic } = window.antd;
    return (
      <Statistic
        title={props.title}
        value={formatSpan(now - start, format)}
        valueStyle={props.valueStyle}
      />
    );
  }

  function OmadaCountdown(props) {
    const type = props.type || 'down';
    const value = props.value;
    const format = props.format || 'HH:mm:ss';
    const title = props.title;
    const icon = props.icon;
    const onFinish = props.onFinish;
    const valueStyle = props.valueStyle;

    const rest = Object.assign({}, props);
    delete rest.type; delete rest.value; delete rest.format;
    delete rest.title; delete rest.icon; delete rest.onFinish; delete rest.valueStyle;

    const { Statistic } = window.antd;
    const Timer = Statistic.Timer;
    const AntCountdown = Statistic.Countdown;

    const composedTitle = icon
      ? (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <window.OmadaIcon name={icon} size={16} style={{ opacity: 0.8 }} />
          <span>{title}</span>
        </span>
      )
      : title;

    if (type === 'up') {
      if (Timer) {
        return <Timer type="countup" title={composedTitle} value={value}
                      format={format} valueStyle={valueStyle} {...rest} />;
      }
      return <ManualCountUp title={composedTitle} value={value} format={format} valueStyle={valueStyle} />;
    }

    // countdown
    if (Timer) {
      return <Timer type="countdown" title={composedTitle} value={value} format={format}
                    onFinish={onFinish} valueStyle={valueStyle} {...rest} />;
    }
    return <AntCountdown title={composedTitle} value={value} format={format}
                         onFinish={onFinish} valueStyle={valueStyle} {...rest} />;
  }

  window.Omada = window.Omada || {};
  window.Omada.Countdown = OmadaCountdown;
})();
