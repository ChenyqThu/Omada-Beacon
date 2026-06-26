/* ────────────────────────────────────────────────────────────────────────
   components/Topbar/Topbar.jsx — OmadaTopbar

   A responsive application COMMAND BAR. The generic, un-branded sibling of the
   green AppShell header: a surface-coloured bar with a leading slot (title +
   optional text-nav tabs) and a right-aligned cluster of icon actions that
   COLLAPSE INTO A "more" overflow Dropdown as the bar narrows.

   Behaviour:
     · A ResizeObserver measures the bar; given the leading slot's width and a
       fixed per-action width, it computes how many action buttons fit and
       pushes the remainder into an overflow Dropdown (kebab). Reserves one
       slot for the overflow trigger so the last action is never clipped.
     · Each action: { key, icon, label, onClick, tone?, badge?, disabled?,
       divider? }. Labels show inline while there's room (the `labels` prop /
       auto), and always show inside the overflow menu.
     · Optional `nav` text tabs ({ key, label, icon }) with an active ink — the
       whole lead group is given to the overflow calc as one measured block.
     · RTL-safe (flips lead/actions sides via logical props); keyboard-reachable
       (every action is a real <button>; overflow is an antd Dropdown menu).

   Thin composition over antd Dropdown + Badge + OmadaIcon. Bar height, border,
   ink and hover all come from tokens / omada-overrides.css (with a dark twin).

   Figma: Top Bar 顶部栏 node 285:6342 + the right-info action cluster
   (类型=icon) node 1274:31319 — search · add · refresh · theme · account ·
   more(overflow), 32px glyphs, gap 8/16, right-aligned. Original un-branded
   redraw (no TP/Omada logo chrome — that frame is IP-bound).
   Exports: window.Omada.Topbar
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { Dropdown, Badge } = window.antd;
  const Icon = window.Omada.Icon;
  const Tooltip = window.Omada.Tooltip;

  const ACTION_W = 44;   // hit target + gap budget per icon action
  const MORE_W = 44;     // reserved width for the overflow trigger

  function OmadaTopbar(props) {
    const { useState, useRef, useLayoutEffect, useCallback } = React;
    const className = props.className || '';
    const rest = Object.assign({}, props);
    delete rest.className; delete rest.title; delete rest.subtitle; delete rest.brand;
    delete rest.nav; delete rest.activeKey; delete rest.onNavChange; delete rest.actions;
    delete rest.labels; delete rest.minVisible; delete rest.style;

    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;

    const actions = props.actions || [];
    const nav = props.nav || [];
    const showLabels = props.labels === undefined ? false : props.labels;
    const minVisible = props.minVisible === undefined ? 1 : props.minVisible;

    const barRef = useRef(null);
    const leadRef = useRef(null);
    const [visible, setVisible] = useState(actions.length);

    const measure = useCallback(() => {
      const bar = barRef.current, lead = leadRef.current;
      if (!bar) return;
      const total = bar.clientWidth;
      const leadW = lead ? lead.scrollWidth : 0;
      const pad = 24; // bar inline padding + gap breathing room
      let avail = total - leadW - pad;
      let fit = Math.floor(avail / ACTION_W);
      if (fit >= actions.length) { setVisible(actions.length); return; }
      // need an overflow trigger → reserve a slot
      fit = Math.floor((avail - MORE_W) / ACTION_W);
      setVisible(Math.max(minVisible, Math.max(0, fit)));
    }, [actions.length, minVisible]);

    useLayoutEffect(() => {
      measure();
      const bar = barRef.current;
      if (!bar || typeof ResizeObserver === 'undefined') return;
      const ro = new ResizeObserver(measure);
      ro.observe(bar);
      return () => ro.disconnect();
    }, [measure]);

    const shown = actions.slice(0, visible);
    const overflow = actions.slice(visible);

    const fireAction = (a) => { if (a && !a.disabled && a.onClick) a.onClick(a); };

    const renderIconBtn = (a) => {
      const tone = a.tone === 'danger' ? 'omada-topbar-act--danger'
                 : a.tone === 'brand' ? 'omada-topbar-act--brand' : '';
      const btn = (
        <button
          type="button"
          className={('omada-topbar-act ' + tone).trim() + (showLabels && a.label ? ' has-label' : '')}
          onClick={() => fireAction(a)}
          disabled={a.disabled}
          aria-label={a.label}
        >
          {a.badge != null
            ? <Badge count={a.badge} size="small" offset={[2, -2]}><Icon name={a.icon} size={18} /></Badge>
            : <Icon name={a.icon} size={18} />}
          {showLabels && a.label && <span className="omada-topbar-actlabel">{a.label}</span>}
        </button>
      );
      if (showLabels && a.label) return <span key={a.key}>{btn}</span>;
      return <Tooltip key={a.key} title={a.label}>{btn}</Tooltip>;
    };

    const overflowItems = overflow.map((a) => (
      a.divider
        ? { type: 'divider', key: a.key + '-d' }
        : {
            key: a.key,
            label: a.label,
            icon: <Icon name={a.icon} size={16} />,
            danger: a.tone === 'danger',
            disabled: a.disabled,
          }
    ));

    const onOverflowClick = (info) => {
      const a = overflow.find((x) => x.key === info.key);
      fireAction(a);
    };

    const lead = props.brand !== undefined ? props.brand : (
      <React.Fragment>
        {(props.title || props.subtitle) && (
          <span className="omada-topbar-titles">
            {props.title && <span className="omada-topbar-title">{props.title}</span>}
            {props.subtitle && <span className="omada-topbar-sub">{props.subtitle}</span>}
          </span>
        )}
        {nav.length > 0 && (
          <nav className="omada-topbar-nav" role="tablist">
            {nav.map((n) => (
              <button
                key={n.key}
                type="button"
                role="tab"
                aria-selected={props.activeKey === n.key}
                className={'omada-topbar-tab' + (props.activeKey === n.key ? ' is-active' : '')}
                onClick={() => props.onNavChange && props.onNavChange(n.key)}
              >
                {n.icon && <Icon name={n.icon} size={16} />}
                <span>{n.label}</span>
              </button>
            ))}
          </nav>
        )}
      </React.Fragment>
    );

    return (
      <div className={('omada-topbar ' + className).trim()} ref={barRef} style={props.style} {...rest}>
        <div className="omada-topbar-lead" ref={leadRef}>{lead}</div>
        <div className="omada-topbar-actions">
          {shown.map((a) => (a.divider
            ? <span key={a.key} className="omada-topbar-divider" aria-hidden="true" />
            : renderIconBtn(a)))}
          {overflow.length > 0 && (
            <Dropdown
              menu={{ items: overflowItems, onClick: onOverflowClick }}
              trigger={['click']}
              placement="bottomRight"
            >
              <button type="button" className="omada-topbar-act omada-topbar-more" aria-label={t('common.more')}>
                <Icon name="more-vertical" size={18} />
              </button>
            </Dropdown>
          )}
        </div>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.Topbar = OmadaTopbar;
})();
