/* ────────────────────────────────────────────────────────────────────────
   components/IconBoard/IconBoard.jsx — OmadaIconBoard

   A searchable SPECIMEN board for the bespoke Omada icon set. Not a new icon
   primitive — it reads the live window.OMADA_ICONS registry and presents every
   glyph as a copy-to-clipboard tile, so the DS surface stays in sync with the
   set automatically (add an icon to OMADA_ICONS → it appears here).

   This is the "Icon-UI" specimen frame from the Figma (node 638:55811): a
   filterable glyph board with a count, a size switch (16 / 20 / 24) and a
   live name filter. Every tile renders OmadaIcon (never Lucide). Copying puts
   the icon NAME on the clipboard.

   Convenience props (all optional):
     • size      — initial glyph size (16 | 20 | 24). Default 24.
     • columns   — fixed column count; default is responsive auto-fill.
     • filter    — initial search string.
     • showCount — show the "{n} icons" tally (default true).
     • onCopy(name) — fired after a tile is copied.

   Visuals are token-driven (border / surface / text from the theme via CSS
   vars in omada-overrides.css, dark twin included). Strings via window.t().

   Figma: Icon-UI 图标规范 node 638:55811.
   Exports: window.Omada.IconBoard
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { useState, useMemo, useCallback } = React;
  const OmadaIcon = window.OmadaIcon;

  function OmadaIconBoard(props) {
    const size = props.size || 24;
    const columns = props.columns;
    const initialFilter = props.filter || '';
    const showCount = props.showCount !== false;
    const onCopy = props.onCopy;

    const rest = Object.assign({}, props);
    delete rest.size; delete rest.columns; delete rest.filter;
    delete rest.showCount; delete rest.onCopy;

    const ctx = window.useOmada ? window.useOmada() : { t: (k) => k, lang: 'en' };
    const t = ctx.t;

    const [q, setQ] = useState(initialFilter);
    const [glyph, setGlyph] = useState(size);
    const [copied, setCopied] = useState(null);

    const names = useMemo(() => Object.keys(window.OMADA_ICONS || {}).sort(), []);
    const shown = useMemo(() => {
      const needle = q.trim().toLowerCase();
      return needle ? names.filter((n) => n.toLowerCase().indexOf(needle) >= 0) : names;
    }, [names, q]);

    const copy = useCallback((name) => {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(name);
        }
      } catch (e) { /* ignore — copy is best-effort in the gallery */ }
      setCopied(name);
      if (onCopy) onCopy(name);
      window.clearTimeout(OmadaIconBoard._t);
      OmadaIconBoard._t = window.setTimeout(() => setCopied(null), 1100);
    }, [onCopy]);

    const gridStyle = columns
      ? { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }
      : undefined;

    return (
      <div className="omada-iconboard" {...rest}>
        <div className="omada-iconboard-bar">
          <div className="omada-iconboard-search">
            <OmadaIcon name="search" size={16} />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t('iconboard.search')}
              aria-label={t('iconboard.search')}
            />
            {q && (
              <button type="button" className="omada-iconboard-clear"
                onClick={() => setQ('')} aria-label="clear">
                <OmadaIcon name="close" size={14} />
              </button>
            )}
          </div>
          <div className="omada-iconboard-sizes" role="group" aria-label="glyph size">
            {[16, 20, 24].map((s) => (
              <button key={s} type="button"
                className={'omada-iconboard-size' + (glyph === s ? ' is-active' : '')}
                onClick={() => setGlyph(s)}>{s}</button>
            ))}
          </div>
          {showCount && (
            <span className="omada-iconboard-count">
              {t('iconboard.count').replace('{n}', String(shown.length))}
            </span>
          )}
        </div>

        {shown.length === 0 ? (
          <div className="omada-iconboard-empty">{t('iconboard.noMatch')}</div>
        ) : (
          <div className="omada-iconboard-grid" style={gridStyle}>
            {shown.map((name) => (
              <button
                key={name}
                type="button"
                className={'omada-iconboard-cell' + (copied === name ? ' is-copied' : '')}
                onClick={() => copy(name)}
                title={name}
              >
                <span className="omada-iconboard-glyph">
                  <OmadaIcon name={name} size={glyph} />
                </span>
                <code className="omada-iconboard-label">{name}</code>
                {copied === name && (
                  <span className="omada-iconboard-copied">
                    <OmadaIcon name="check" size={12} /> {t('iconboard.copied')}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.IconBoard = OmadaIconBoard;
})();
