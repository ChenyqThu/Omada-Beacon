/* ────────────────────────────────────────────────────────────────────────
   components/CommandBar/CommandBar.jsx — OmadaCommandBar

   The floating "you've selected things — now act on them" toolbar. Distinct
   from BulkActions (Batch 19), which pins a bar ABOVE a table replacing its
   header; CommandBar is the Linear/Notion-style pill that RISES from the
   bottom-centre of a positioned stage when a selection exists, floats over the
   content, and tucks away when the selection clears.

     · Shows a count chip ("{n} selected"), a divider, then a row of actions.
     · Actions beyond `maxVisible` collapse into an Omada Dropdown (⋮ More).
     · A trailing ✕ clears the selection (onClear).
     · Danger-toned actions render in the error colour; disabled actions grey.
     · `open` controls visibility; if omitted it derives from count > 0.
     · By default it is position:absolute and anchors to the nearest positioned
       ancestor (wrap your list area in position:relative); pass fixed to pin it
       to the viewport instead.

   Thin composition over Button + Dropdown + OmadaIcon on an antd-tokened dark
   surface. Token-driven, dark twin, i18n, RTL-mirrored (rises + mirrors).

   Figma: no dedicated node — the dark floating surface reuses the Message /
   Dropdown elevated surface (3:16099); selection-toolbar pattern is original.
   Exports: window.Omada.CommandBar
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { Dropdown, Tooltip } = window.antd;
  const Icon = window.Omada.Icon;

  function OmadaCommandBar(props) {
    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;

    const count = props.count || 0;
    const open = props.open === undefined ? count > 0 : props.open;
    const actions = props.actions || [];
    const maxVisible = props.maxVisible === undefined ? 3 : props.maxVisible;
    const placement = props.placement || 'bottom';   // 'bottom' | 'top'
    const fixed = !!props.fixed;
    const label = props.label;                         // override count text
    const onAction = props.onAction;
    const onClear = props.onClear;
    const className = props.className || '';

    const fire = (key) => { if (onAction) onAction(key); };

    const visible = actions.slice(0, maxVisible);
    const overflow = actions.slice(maxVisible);

    const cls = [
      'omada-cmdbar',
      'is-' + placement,
      fixed ? 'is-fixed' : 'is-anchored',
      open ? 'is-open' : 'is-closed',
      className,
    ].join(' ').trim();

    const countText = label != null
      ? label
      : t('cmdbar.selected').replace('{n}', count);

    const renderBtn = (a) => {
      const tone = a.tone === 'danger' ? ' is-danger' : '';
      const btn = (
        <button
          type="button"
          className={'omada-cmdbar-act' + tone}
          disabled={!!a.disabled}
          onClick={() => fire(a.key)}
        >
          {a.icon ? <Icon name={a.icon} size={16} /> : null}
          <span className="omada-cmdbar-actlabel">{a.label}</span>
        </button>
      );
      return a.tooltip
        ? <Tooltip key={a.key} title={a.tooltip}>{btn}</Tooltip>
        : <span key={a.key} className="omada-cmdbar-actwrap">{btn}</span>;
    };

    return (
      <div className={cls} role="toolbar" aria-hidden={!open} aria-label={countText}>
        <div className="omada-cmdbar-inner">
          <span className="omada-cmdbar-count">
            <span className="omada-cmdbar-countn">{count}</span>
            <span className="omada-cmdbar-countlabel">{countText}</span>
          </span>
          <span className="omada-cmdbar-div" aria-hidden="true" />
          <div className="omada-cmdbar-acts">
            {visible.map(renderBtn)}
            {overflow.length > 0 && (
              <Dropdown
                trigger={['click']}
                placement={placement === 'top' ? 'bottomRight' : 'topRight'}
                menu={{
                  items: overflow.map((a) => ({
                    key: a.key,
                    label: a.label,
                    icon: a.icon ? <Icon name={a.icon} size={15} /> : undefined,
                    danger: a.tone === 'danger',
                    disabled: !!a.disabled,
                  })),
                  onClick: (info) => fire(info.key),
                }}
              >
                <button type="button" className="omada-cmdbar-act omada-cmdbar-more">
                  <Icon name="more-horizontal" size={16} />
                  <span className="omada-cmdbar-actlabel">{t('cmdbar.more')}</span>
                </button>
              </Dropdown>
            )}
          </div>
          {onClear && (
            <button
              type="button"
              className="omada-cmdbar-clear"
              aria-label={t('cmdbar.clear')}
              onClick={onClear}
            >
              <Icon name="close" size={16} />
            </button>
          )}
        </div>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.CommandBar = OmadaCommandBar;
})();
