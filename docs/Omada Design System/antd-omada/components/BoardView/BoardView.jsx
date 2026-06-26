/* ────────────────────────────────────────────────────────────────────────
   components/BoardView/BoardView.jsx — OmadaBoardView

   A KANBAN board — drag cards WITHIN and BETWEEN columns. antd ships no board
   primitive, so this extends the Batch-18 SortableList mechanic from one list
   to many: native HTML5 drag-and-drop, a 2px brand-green drop indicator that
   shows the exact slot (in any column, including an empty one), and full
   keyboard parity.

   Behaviour:
     · Grab a card by its grip handle (or anywhere when handle={false}). Drag
       over any column; the indicator marks where it lands. Release to commit;
       onChange(nextColumns, meta) fires with the whole columns array.
     · KEYBOARD parity: focus a card and press ← / → to send it to the
       previous / next column (same slot, clamped), ↑ / ↓ to reorder within the
       column, Home / End to the ends. Focus follows the card; aria-live
       announces each move with column + position.
     · Per-column count badge; optional WIP limit highlights when exceeded.

   CONTROLLED: pass columns + onChange and own the array, or omit onChange for
   internal state. renderCard owns card content; the chrome (handle, indicator,
   column header) is ours.

   All chrome is theme-var driven with dark twins in omada-overrides.css; the
   indicator + active handle use the brand-green token. Mirrors under RTL
   (columns + ←/→ flip).

   Figma: no dedicated node — a native-DnD interaction pattern, sibling to
   SortableList. Cards reuse the List/Menu row language (8px radius, hairline
   border, grip = OmadaIcon grip-vertical).
   Exports: window.Omada.BoardView
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { useState, useRef, useCallback } = React;
  const Icon = window.Omada.Icon;

  function clone(cols) { return cols.map(function (c) { return Object.assign({}, c, { items: c.items.slice() }); }); }

  function OmadaBoardView(props) {
    const className = props.className || '';
    const rest = Object.assign({}, props);
    delete rest.className; delete rest.columns; delete rest.onChange;
    delete rest.renderCard; delete rest.cardKey; delete rest.handle; delete rest.ariaLabel;

    const controlled = props.columns !== undefined;
    const [inner, setInner] = useState(props.columns || []);
    const columns = controlled ? props.columns : inner;

    const cardKey = props.cardKey || 'key';
    const useHandle = props.handle === undefined ? true : props.handle;
    const renderCard = props.renderCard || function (it) { return String(it && (it.label != null ? it.label : it[cardKey])); };

    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : function (k) { return k; };

    const [drag, setDrag] = useState(null);      // { col, idx }
    const [over, setOver] = useState(null);       // { col, slot }
    const [announce, setAnnounce] = useState('');
    const boardRef = useRef(null);

    const keyOf = function (it, i) { return it && it[cardKey] != null ? it[cardKey] : i; };

    const commit = useCallback(function (next, meta) {
      if (!controlled) setInner(next);
      if (props.onChange) props.onChange(next, meta);
    }, [controlled, props]);

    // Core move: from {col,idx} → target column at slot.
    const doMove = function (fromCol, fromIdx, toCol, toSlot) {
      const next = clone(columns);
      const card = next[fromCol].items.splice(fromIdx, 1)[0];
      let slot = toSlot;
      if (fromCol === toCol && slot > fromIdx) slot -= 1;
      next[toCol].items.splice(slot, 0, card);
      commit(next, { key: keyOf(card, fromIdx), fromCol: columns[fromCol].key, toCol: columns[toCol].key, to: slot });
      return { card: card, slot: slot };
    };

    const onDragStart = function (e, col, idx) {
      setDrag({ col: col, idx: idx });
      setOver({ col: col, slot: idx });
      try { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', col + ':' + idx); } catch (_) {}
    };
    const onCardDragOver = function (e, col, idx) {
      e.preventDefault(); e.stopPropagation();
      try { e.dataTransfer.dropEffect = 'move'; } catch (_) {}
      const r = e.currentTarget.getBoundingClientRect();
      const after = (e.clientY - r.top) > r.height / 2;
      setOver({ col: col, slot: after ? idx + 1 : idx });
    };
    const onColDragOver = function (e, col) {
      e.preventDefault();
      if (!over || over.col !== col) setOver({ col: col, slot: columns[col].items.length });
    };
    const onDrop = function (e) {
      e.preventDefault();
      if (!drag || !over) { reset(); return; }
      if (!(drag.col === over.col && (over.slot === drag.idx || over.slot === drag.idx + 1))) {
        doMove(drag.col, drag.idx, over.col, over.slot);
      }
      reset();
    };
    const reset = function () { setDrag(null); setOver(null); };

    const refocus = function (col, idx) {
      requestAnimationFrame(function () {
        if (!boardRef.current) return;
        const sel = '[data-bv-card="' + col + '-' + idx + '"] [data-bv-handle]';
        const h = boardRef.current.querySelector(sel);
        if (h) h.focus();
      });
    };
    const say = function (col, slot) {
      setAnnounce(columns[col].title + ' · ' + (t('bv.position') || 'position') + ' ' + (slot + 1) + ' / ' + columns[col].items.length);
    };
    const onCardKey = function (e, col, idx) {
      const isRtl = ctx && ctx.dir === 'rtl';
      const prevCol = isRtl ? col + 1 : col - 1;
      const nextCol = isRtl ? col - 1 : col + 1;
      if (e.key === 'ArrowUp') { e.preventDefault(); if (idx > 0) { const r = doMove(col, idx, col, idx - 1); say(col, r.slot); refocus(col, r.slot); } }
      else if (e.key === 'ArrowDown') { e.preventDefault(); if (idx < columns[col].items.length - 1) { const r = doMove(col, idx, col, idx + 1); say(col, r.slot); refocus(col, r.slot); } }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); if (prevCol >= 0 && prevCol < columns.length) { const slot = Math.min(idx, columns[prevCol].items.length); const r = doMove(col, idx, prevCol, slot); say(prevCol, r.slot); refocus(prevCol, r.slot); } }
      else if (e.key === 'ArrowRight') { e.preventDefault(); if (nextCol >= 0 && nextCol < columns.length) { const slot = Math.min(idx, columns[nextCol].items.length); const r = doMove(col, idx, nextCol, slot); say(nextCol, r.slot); refocus(nextCol, r.slot); } }
      else if (e.key === 'Home') { e.preventDefault(); if (idx !== 0) { const r = doMove(col, idx, col, 0); say(col, r.slot); refocus(col, r.slot); } }
      else if (e.key === 'End') { e.preventDefault(); const last = columns[col].items.length - 1; if (idx !== last) { const r = doMove(col, idx, col, last + 1); say(col, r.slot); refocus(col, r.slot); } }
    };

    return (
      <div className={('omada-bv ' + className).trim()} ref={boardRef} role="group"
           aria-label={props.ariaLabel || t('bv.aria') || 'Board'} {...rest}>
        {columns.map(function (column, col) {
          const count = column.items.length;
          const overLimit = column.limit != null && count > column.limit;
          return (
            <section key={column.key} className="omada-bv-col"
                     onDragOver={function (e) { onColDragOver(e, col); }} onDrop={onDrop}>
              <header className="omada-bv-colhd">
                {column.accent && <span className="omada-bv-coldot" style={{ background: column.accent }} aria-hidden="true" />}
                <span className="omada-bv-coltitle">{column.title}</span>
                <span className={'omada-bv-colcount' + (overLimit ? ' is-over' : '')}>
                  {column.limit != null ? count + ' / ' + column.limit : count}
                </span>
              </header>
              <div className="omada-bv-cards">
                {count === 0 && over && over.col === col && <div className="omada-bv-drop" aria-hidden="true" />}
                {column.items.map(function (it, idx) {
                  const isDragging = drag && drag.col === col && drag.idx === idx;
                  const showBefore = over && over.col === col && over.slot === idx && drag;
                  const showAfterLast = idx === count - 1 && over && over.col === col && over.slot === count && drag;
                  return (
                    <React.Fragment key={keyOf(it, idx)}>
                      {showBefore && <div className="omada-bv-drop" aria-hidden="true" />}
                      <article
                        data-bv-card={col + '-' + idx}
                        className={'omada-bv-card' + (isDragging ? ' is-dragging' : '')}
                        draggable={!useHandle}
                        onDragStart={!useHandle ? function (e) { onDragStart(e, col, idx); } : undefined}
                        onDragOver={function (e) { onCardDragOver(e, col, idx); }}
                        onDragEnd={reset}
                      >
                        <span
                          className="omada-bv-handle" data-bv-handle="true" tabIndex={0} role="button"
                          aria-label={(t('bv.move') || 'Move card') + ' · ' + column.title + ' ' + (idx + 1)}
                          draggable={useHandle}
                          onDragStart={useHandle ? function (e) { onDragStart(e, col, idx); } : undefined}
                          onDragEnd={reset}
                          onKeyDown={function (e) { onCardKey(e, col, idx); }}
                        >
                          <Icon name="grip-vertical" size={16} />
                        </span>
                        <div className="omada-bv-cardbody">{renderCard(it, column.key, idx)}</div>
                      </article>
                      {showAfterLast && <div className="omada-bv-drop" aria-hidden="true" />}
                    </React.Fragment>
                  );
                })}
              </div>
            </section>
          );
        })}
        <span className="omada-bv-live" role="status" aria-live="polite">{announce}</span>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.BoardView = OmadaBoardView;
})();
