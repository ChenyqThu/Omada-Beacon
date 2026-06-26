/* ────────────────────────────────────────────────────────────────────────
   components/SortableList/SortableList.jsx — OmadaSortableList

   A drag-to-reorder LIST. antd ships no sortable primitive, so this composes
   one from native HTML5 drag-and-drop over a token-driven row — the pattern
   you reach for to reorder dashboard widgets, menu items, SSIDs, table
   columns, a port priority list.

   Behaviour:
     · Grab a row by its grip handle (or anywhere on the row when
       handle={false}); a 2px brand-green drop indicator shows exactly where
       it will land. Release to commit; onChange(nextItems) fires with the
       reordered array.
     · KEYBOARD parity: focus a handle and press ↑ / ↓ (or Alt+↑ / Alt+↓) to
       move that row one slot; Home / End send it to the ends. Focus stays on
       the moving row so a screen-reader user can chain moves. aria-grabbed +
       a polite live message announce each move.
     · The dragging row dims; the rest slide under the indicator. No layout
       library, no virtualisation — for long lists pair with VirtualList.

   It is a CONTROLLED component: pass items + onChange and own the array, or
   omit onChange to let it keep internal state (uncontrolled). renderItem lets
   the caller own row content; the chrome (handle, indicator, index badge) is
   ours.

   All chrome is theme-var driven (surface / border / handle / indicator) with
   dark twins in omada-overrides.css; the indicator + active handle use the
   brand-green token. Mirrors correctly under RTL.

   Figma: no dedicated node — a native-DnD interaction pattern. Rows reuse the
   List / Menu row language (8px radius, hairline border, grip = OmadaIcon
   grip-vertical).
   Exports: window.Omada.SortableList
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { useState, useRef, useEffect, useCallback } = React;
  const Icon = window.Omada.Icon;

  function move(arr, from, to) {
    const next = arr.slice();
    const [it] = next.splice(from, 1);
    next.splice(to, 0, it);
    return next;
  }

  function OmadaSortableList(props) {
    const className = props.className || '';
    const rest = Object.assign({}, props);
    delete rest.className; delete rest.items; delete rest.onChange;
    delete rest.renderItem; delete rest.rowKey; delete rest.handle;
    delete rest.showIndex; delete rest.ariaLabel;

    const controlled = props.items !== undefined;
    const [inner, setInner] = useState(props.items || []);
    const items = controlled ? props.items : inner;

    const rowKey = props.rowKey || 'key';
    const useHandle = props.handle === undefined ? true : props.handle;
    const showIndex = props.showIndex === undefined ? true : props.showIndex;
    const renderItem = props.renderItem || ((it) => String(it && (it.label != null ? it.label : it[rowKey])));

    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;

    const [dragIndex, setDragIndex] = useState(-1);
    const [overIndex, setOverIndex] = useState(-1); // insertion slot 0..len
    const [announce, setAnnounce] = useState('');
    const listRef = useRef(null);

    // keep uncontrolled state in sync if parent swaps the source
    useEffect(() => { if (!controlled && props.items) setInner(props.items); /* eslint-disable-next-line */ }, []);

    const commit = useCallback((next, movedKey, fromI, toI) => {
      if (!controlled) setInner(next);
      if (props.onChange) props.onChange(next, { key: movedKey, from: fromI, to: toI });
    }, [controlled, props]);

    const keyOf = (it, i) => (it && it[rowKey] != null ? it[rowKey] : i);

    const onDragStart = (e, i) => {
      setDragIndex(i);
      setOverIndex(i);
      try { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', String(i)); } catch (_) {}
    };
    const onDragOverRow = (e, i) => {
      e.preventDefault();
      try { e.dataTransfer.dropEffect = 'move'; } catch (_) {}
      const node = e.currentTarget;
      const r = node.getBoundingClientRect();
      const after = (e.clientY - r.top) > r.height / 2;
      setOverIndex(after ? i + 1 : i);
    };
    const onDrop = (e) => {
      e.preventDefault();
      if (dragIndex < 0 || overIndex < 0) { reset(); return; }
      let to = overIndex;
      if (to > dragIndex) to -= 1; // account for the removed source
      if (to !== dragIndex) {
        const next = move(items, dragIndex, to);
        commit(next, keyOf(items[dragIndex], dragIndex), dragIndex, to);
      }
      reset();
    };
    const reset = () => { setDragIndex(-1); setOverIndex(-1); };

    const moveByKeyboard = (i, dir) => {
      let to = i + dir;
      if (to < 0 || to >= items.length) return;
      const next = move(items, i, to);
      commit(next, keyOf(items[i], i), i, to);
      setAnnounce((t('srt.moved') || 'Moved to position') + ' ' + (to + 1) + ' / ' + items.length);
      // refocus the moved handle
      requestAnimationFrame(() => {
        if (!listRef.current) return;
        const handles = listRef.current.querySelectorAll('[data-srt-handle]');
        if (handles[to]) handles[to].focus();
      });
    };
    const moveToEnd = (i, end) => {
      const to = end === 'start' ? 0 : items.length - 1;
      if (to === i) return;
      const next = move(items, i, to);
      commit(next, keyOf(items[i], i), i, to);
      setAnnounce((t('srt.moved') || 'Moved to position') + ' ' + (to + 1) + ' / ' + items.length);
      requestAnimationFrame(() => {
        if (!listRef.current) return;
        const handles = listRef.current.querySelectorAll('[data-srt-handle]');
        if (handles[to]) handles[to].focus();
      });
    };
    const onHandleKey = (e, i) => {
      if (e.key === 'ArrowUp') { e.preventDefault(); moveByKeyboard(i, -1); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); moveByKeyboard(i, 1); }
      else if (e.key === 'Home') { e.preventDefault(); moveToEnd(i, 'start'); }
      else if (e.key === 'End') { e.preventDefault(); moveToEnd(i, 'end'); }
    };

    return (
      <div
        className={('omada-srt ' + className).trim()}
        ref={listRef}
        role="listbox"
        aria-label={props.ariaLabel || t('srt.aria') || 'Sortable list'}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        {...rest}
      >
        {items.map((it, i) => {
          const isDragging = i === dragIndex;
          const showBefore = overIndex === i && dragIndex >= 0;
          const showAfterLast = i === items.length - 1 && overIndex === items.length && dragIndex >= 0;
          return (
            <React.Fragment key={keyOf(it, i)}>
              {showBefore && <div className="omada-srt-drop" aria-hidden="true" />}
              <div
                role="option"
                aria-selected={isDragging}
                aria-grabbed={isDragging}
                className={'omada-srt-row' + (isDragging ? ' is-dragging' : '')}
                draggable={!useHandle}
                onDragStart={!useHandle ? (e) => onDragStart(e, i) : undefined}
                onDragOver={(e) => onDragOverRow(e, i)}
                onDragEnd={reset}
              >
                <span
                  className="omada-srt-handle"
                  data-srt-handle="true"
                  tabIndex={0}
                  role="button"
                  aria-label={(t('srt.handle') || 'Drag to reorder') + ' · ' + (i + 1)}
                  draggable={useHandle}
                  onDragStart={useHandle ? (e) => onDragStart(e, i) : undefined}
                  onDragEnd={reset}
                  onKeyDown={(e) => onHandleKey(e, i)}
                >
                  <Icon name="grip-vertical" size={18} />
                </span>
                {showIndex && <span className="omada-srt-idx">{i + 1}</span>}
                <span className="omada-srt-body">{renderItem(it, i)}</span>
              </div>
              {showAfterLast && <div className="omada-srt-drop" aria-hidden="true" />}
            </React.Fragment>
          );
        })}
        <span className="omada-srt-live" role="status" aria-live="polite">{announce}</span>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.SortableList = OmadaSortableList;
})();
