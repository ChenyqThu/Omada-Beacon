/* ────────────────────────────────────────────────────────────────────────
   components/WidgetGrid/WidgetGrid.jsx — OmadaWidgetGrid

   A re-orderable, RESIZABLE dashboard. antd has no tile-grid primitive, so this
   composes one over native HTML5 drag-and-drop (the same engine as SortableList,
   lifted into 2D) plus a width control on every tile — the "customise dashboard"
   surface where an operator drags KPI / chart / list cards around and sets each
   one to span 1, 2 or 3 columns.

   Behaviour:
     · The grid is a CSS grid of `columns` tracks (default 3). Each tile sets
       grid-column: span N (1..columns). Drag a tile by its header grip onto
       another tile; a brand-green ring marks the drop target and release inserts
       before it. onChange(nextTiles, meta) fires with the reordered array.
     · RESIZE: the header width control (S / M / L segmented, or ⌘-free [ / ])
       cycles the span; spans clamp to `columns`. The same onChange fires.
     · KEYBOARD parity on the grip: ←/→ move a tile one slot, ↑/↓ jump a row
       (= ±columns), Home/End to the ends; "[" / "]" shrink / grow the span.
       Focus follows the tile so moves chain; a polite live region announces.
     · Tiles render their own body via `renderTile(tile)`; the chrome (header,
       grip, width control, remove) is ours. Remove fires onRemove(key).

   Controlled (pass tiles + onChange) or uncontrolled (internal state). All
   chrome is theme-var driven with dark twins in omada-overrides.css; the drop
   ring + active grip use brand-green. Mirrors under RTL.

   Figma: no dedicated node — a native-DnD dashboard pattern; tiles reuse the
   Card language (8px radius, hairline border) and the SortableList grip.
   Exports: window.Omada.WidgetGrid
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { useState, useRef } = React;
  const { Segmented } = window.antd;
  const Icon = window.Omada.Icon;

  function move(arr, from, to) {
    const next = arr.slice();
    const [it] = next.splice(from, 1);
    next.splice(to, 0, it);
    return next;
  }
  function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }

  function OmadaWidgetGrid(props) {
    const className = props.className || '';
    const rest = Object.assign({}, props);
    delete rest.className; delete rest.tiles; delete rest.onChange; delete rest.onRemove;
    delete rest.renderTile; delete rest.columns; delete rest.rowHeight; delete rest.removable;

    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;

    const columns = props.columns || 3;
    const rowHeight = props.rowHeight || 132;
    const removable = props.removable === undefined ? true : props.removable;
    const renderTile = props.renderTile || ((it) => String(it.title || it.key));

    const controlled = props.onChange !== undefined;
    const [inner, setInner] = useState(props.tiles || []);
    const tiles = controlled ? (props.tiles || []) : inner;

    const [dragIndex, setDragIndex] = useState(-1);
    const [overIndex, setOverIndex] = useState(-1);
    const [announce, setAnnounce] = useState('');
    const gridRef = useRef(null);

    const commit = (next, meta) => {
      if (!controlled) setInner(next);
      if (props.onChange) props.onChange(next, meta || {});
    };

    const onDragStart = (e, i) => {
      setDragIndex(i); setOverIndex(i);
      try { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', String(i)); } catch (_) {}
    };
    const onDragOverTile = (e, i) => {
      e.preventDefault();
      try { e.dataTransfer.dropEffect = 'move'; } catch (_) {}
      if (i !== overIndex) setOverIndex(i);
    };
    const onDrop = (e) => {
      e.preventDefault();
      if (dragIndex < 0 || overIndex < 0) { reset(); return; }
      let to = overIndex;
      if (to !== dragIndex) {
        const next = move(tiles, dragIndex, to > dragIndex ? to : to);
        commit(next, { key: tiles[dragIndex].key, from: dragIndex, to: to, type: 'move' });
      }
      reset();
    };
    const reset = () => { setDragIndex(-1); setOverIndex(-1); };

    const setSpan = (i, span) => {
      const sp = clamp(span, 1, columns);
      if (sp === tiles[i].span) return;
      const next = tiles.map((x, j) => (j === i ? Object.assign({}, x, { span: sp }) : x));
      commit(next, { key: tiles[i].key, span: sp, type: 'resize' });
    };
    const removeTile = (i) => {
      const key = tiles[i].key;
      const next = tiles.filter((_, j) => j !== i);
      commit(next, { key: key, type: 'remove' });
      if (props.onRemove) props.onRemove(key);
    };

    const focusGrip = (idx) => requestAnimationFrame(() => {
      if (!gridRef.current) return;
      const grips = gridRef.current.querySelectorAll('[data-wg-grip]');
      if (grips[idx]) grips[idx].focus();
    });
    const announceMove = (to) => setAnnounce((t('wg.moved') || 'Moved to') + ' ' + (to + 1) + ' / ' + tiles.length);

    const moveBy = (i, delta) => {
      const to = clamp(i + delta, 0, tiles.length - 1);
      if (to === i) return;
      commit(move(tiles, i, to), { key: tiles[i].key, from: i, to: to, type: 'move' });
      announceMove(to); focusGrip(to);
    };
    const moveEnd = (i, end) => {
      const to = end === 'start' ? 0 : tiles.length - 1;
      if (to === i) return;
      commit(move(tiles, i, to), { key: tiles[i].key, from: i, to: to, type: 'move' });
      announceMove(to); focusGrip(to);
    };
    const onGripKey = (e, i) => {
      const k = e.key;
      if (k === 'ArrowLeft') { e.preventDefault(); moveBy(i, -1); }
      else if (k === 'ArrowRight') { e.preventDefault(); moveBy(i, 1); }
      else if (k === 'ArrowUp') { e.preventDefault(); moveBy(i, -columns); }
      else if (k === 'ArrowDown') { e.preventDefault(); moveBy(i, columns); }
      else if (k === 'Home') { e.preventDefault(); moveEnd(i, 'start'); }
      else if (k === 'End') { e.preventDefault(); moveEnd(i, 'end'); }
      else if (k === '[') { e.preventDefault(); setSpan(i, (tiles[i].span || 1) - 1); }
      else if (k === ']') { e.preventDefault(); setSpan(i, (tiles[i].span || 1) + 1); }
    };

    const sizeOpts = [
      { label: 'S', value: 1 },
      { label: 'M', value: 2 },
      { label: 'L', value: 3 },
    ].filter((o) => o.value <= columns);

    return (
      <div
        className={('omada-wg ' + className).trim()}
        ref={gridRef}
        style={{ gridTemplateColumns: 'repeat(' + columns + ', minmax(0, 1fr))' }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        {...rest}
      >
        {tiles.map((it, i) => {
          const span = clamp(it.span || 1, 1, columns);
          const isDragging = i === dragIndex;
          const isOver = i === overIndex && dragIndex >= 0 && dragIndex !== i;
          return (
            <section
              key={it.key}
              className={'omada-wg-tile' + (isDragging ? ' is-dragging' : '') + (isOver ? ' is-over' : '')}
              style={{ gridColumn: 'span ' + span, minHeight: rowHeight }}
              onDragOver={(e) => onDragOverTile(e, i)}
            >
              <header className="omada-wg-head">
                <span
                  className="omada-wg-grip"
                  data-wg-grip="true"
                  tabIndex={0}
                  role="button"
                  aria-label={(t('wg.grip') || 'Drag to move') + ' · ' + (it.title || it.key)}
                  draggable
                  onDragStart={(e) => onDragStart(e, i)}
                  onDragEnd={reset}
                  onKeyDown={(e) => onGripKey(e, i)}
                >
                  <Icon name="grip-vertical" size={16} />
                </span>
                {it.icon && <span className="omada-wg-headix"><Icon name={it.icon} size={15} /></span>}
                <span className="omada-wg-title">{it.title}</span>
                <span className="omada-wg-tools">
                  <Segmented
                    size="small"
                    value={span}
                    onChange={(v) => setSpan(i, v)}
                    options={sizeOpts}
                    className="omada-wg-size"
                    aria-label={t('wg.size')}
                  />
                  {removable && (
                    <button type="button" className="omada-wg-remove" onClick={() => removeTile(i)} aria-label={t('wg.remove')}>
                      <Icon name="close" size={15} />
                    </button>
                  )}
                </span>
              </header>
              <div className="omada-wg-body">{renderTile(it, i)}</div>
            </section>
          );
        })}
        <span className="omada-wg-live" role="status" aria-live="polite">{announce}</span>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.WidgetGrid = OmadaWidgetGrid;
})();
