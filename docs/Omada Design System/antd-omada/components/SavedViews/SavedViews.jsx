/* ────────────────────────────────────────────────────────────────────────
   components/SavedViews/SavedViews.jsx — OmadaSavedViews

   A global FILTER BAR with SAVED VIEWS. FilterBuilder builds one compound query;
   this is the layer above it — a row of named views (All devices · Offline APs ·
   High traffic …) that each remember a query, persisted to localStorage, with a
   dirty-aware "Update / Save as new" affordance and per-view rename / duplicate /
   delete. The "advanced filter + saved segments" toolbar of a device/log table.

   Behaviour:
     · Pick a view → its query loads into the FilterBuilder and onChange(view)
       fires so a table can re-filter. Editing the query marks the active view
       DIRTY; an "Update" button writes the change back, "Save as new" forks a
       fresh view (prompted name), and "Reset" reverts to the saved query.
     · Views persist to localStorage under `storageKey` (so a refresh keeps
       them); the seed `views` are used only on first run. A built-in "All"
       view (empty query) can't be deleted.
     · Each non-default view carries a ⋯ menu: Rename · Duplicate · Delete.

   Thin composition over OmadaFilterBuilder + antd Dropdown + Omada Button / Icon.
   All chrome is theme-var driven with dark twins in omada-overrides.css; the
   active view pill + dirty dot use brand-green. RTL-safe.

   Figma: the Table-toolbar filter + saved-segment language (page 43:34741);
   pills reuse the Segmented / Tag radius. Glyphs are OmadaIcon (bookmark / star
   / sliders / more-horizontal).
   Exports: window.Omada.SavedViews
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { useState, useRef, useEffect } = React;
  const { Dropdown, Modal, Input } = window.antd;
  const Icon = window.Omada.Icon;
  const Button = window.Omada.Button;
  const FilterBuilder = window.Omada.FilterBuilder;

  let NONCE = 0;

  function normalize(rows) {
    return JSON.stringify((rows || []).map((r) => ({ field: r.field, op: r.op, value: r.value })));
  }

  function OmadaSavedViews(props) {
    const className = props.className || '';
    const rest = Object.assign({}, props);
    delete rest.className; delete rest.fields; delete rest.views; delete rest.storageKey;
    delete rest.onChange; delete rest.defaultActive;

    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;

    const fields = props.fields || [];
    const storageKey = props.storageKey || 'omada.savedViews';

    const seed = props.views || [];
    const [views, setViews] = useState(() => {
      try {
        const raw = localStorage.getItem(storageKey);
        if (raw) { const v = JSON.parse(raw); if (Array.isArray(v) && v.length) return v; }
      } catch (_) {}
      return seed;
    });
    const [activeId, setActiveId] = useState(() => props.defaultActive || (views[0] && views[0].id) || 'all');
    const [draftRows, setDraftRows] = useState(() => {
      const v = views.find((x) => x.id === (props.defaultActive || (views[0] && views[0].id)));
      return (v && v.rows) ? v.rows : [];
    });
    const [fbKey, setFbKey] = useState(() => 'fb' + (NONCE += 1));
    const [open, setOpen] = useState(false); // filter editor expanded
    const [renameId, setRenameId] = useState(null);
    const [renameVal, setRenameVal] = useState('');
    const firstRun = useRef(true);

    // persist
    useEffect(() => {
      try { localStorage.setItem(storageKey, JSON.stringify(views)); } catch (_) {}
    }, [views, storageKey]);

    const active = views.find((v) => v.id === activeId) || views[0];
    const dirty = active ? normalize(draftRows) !== normalize(active.rows) : false;

    const emit = (view, rows) => { if (props.onChange) props.onChange({ view, rows }); };

    const selectView = (id) => {
      const v = views.find((x) => x.id === id);
      if (!v) return;
      setActiveId(id);
      setDraftRows(v.rows || []);
      setFbKey('fb' + (NONCE += 1)); // remount FilterBuilder with the new seed
      emit(v, v.rows || []);
    };

    const onFilterChange = (payload) => {
      // FilterBuilder gives committed rows; keep them as the draft
      const rows = (payload.rows || []).map((r) => ({ field: r.field, op: r.op, value: r.value }));
      setDraftRows(rows);
      emit(active, rows);
    };

    const updateView = () => {
      setViews((vs) => vs.map((v) => (v.id === activeId ? Object.assign({}, v, { rows: draftRows }) : v)));
    };
    const resetView = () => {
      setDraftRows(active.rows || []);
      setFbKey('fb' + (NONCE += 1));
      emit(active, active.rows || []);
    };
    const saveAsNew = () => {
      const id = 'v' + Date.now();
      const name = t('sv.newView') + ' ' + (views.length);
      const v = { id, name, rows: draftRows, icon: 'bookmark' };
      setViews((vs) => vs.concat([v]));
      setActiveId(id);
      setRenameId(id); setRenameVal(name);
    };
    const duplicateView = (v) => {
      const id = 'v' + Date.now();
      const copy = { id, name: v.name + ' ' + t('sv.copy'), rows: v.rows, icon: 'bookmark' };
      setViews((vs) => vs.concat([copy]));
      setActiveId(id); setDraftRows(v.rows || []); setFbKey('fb' + (NONCE += 1));
    };
    const deleteView = (v) => {
      setViews((vs) => vs.filter((x) => x.id !== v.id));
      if (activeId === v.id) { const first = views[0]; if (first) selectView(first.id); }
    };
    const commitRename = () => {
      const name = renameVal.trim() || t('sv.untitled');
      setViews((vs) => vs.map((v) => (v.id === renameId ? Object.assign({}, v, { name }) : v)));
      setRenameId(null); setRenameVal('');
    };

    // initial emit
    useEffect(() => {
      if (firstRun.current) { firstRun.current = false; emit(active, draftRows); }
      // eslint-disable-next-line
    }, []);

    const menuFor = (v) => ({
      items: [
        { key: 'rename', label: t('sv.rename'), icon: <Icon name="edit" size={14} /> },
        { key: 'duplicate', label: t('sv.duplicate'), icon: <Icon name="copy" size={14} /> },
        { type: 'divider' },
        { key: 'delete', label: t('sv.delete'), danger: true, icon: <Icon name="trash" size={14} /> },
      ],
      onClick: (info) => {
        if (info.key === 'rename') { setRenameId(v.id); setRenameVal(v.name); }
        else if (info.key === 'duplicate') duplicateView(v);
        else if (info.key === 'delete') deleteView(v);
      },
    });

    const countLabel = draftRows.length;

    return (
      <div className={('omada-sv ' + className).trim()} {...rest}>
        <div className="omada-sv-bar">
          <div className="omada-sv-views" role="tablist" aria-label={t('sv.aria')}>
            {views.map((v) => {
              const isActive = v.id === activeId;
              return (
                <span key={v.id} className={'omada-sv-pillwrap' + (isActive ? ' is-active' : '')}>
                  <button type="button" role="tab" aria-selected={isActive}
                          className="omada-sv-pill" onClick={() => selectView(v.id)}>
                    <Icon name={v.icon || (v.id === 'all' ? 'list' : 'bookmark')} size={14} />
                    <span className="omada-sv-pilltext">{v.name}</span>
                    {isActive && dirty && <span className="omada-sv-dot" title={t('sv.dirty')} />}
                  </button>
                  {isActive && v.id !== 'all' && (
                    <Dropdown menu={menuFor(v)} trigger={['click']} placement="bottomRight">
                      <button type="button" className="omada-sv-pillmenu" aria-label={t('sv.more')}>
                        <Icon name="more-horizontal" size={15} />
                      </button>
                    </Dropdown>
                  )}
                </span>
              );
            })}
          </div>
          <div className="omada-sv-baractions">
            <Button variant="text" size="small" className="omada-sv-edit" onClick={() => setOpen((o) => !o)}>
              <Icon name="sliders" size={15} />{t('sv.editFilters')}
              {countLabel > 0 && <span className="omada-sv-countbadge">{countLabel}</span>}
              <Icon name={open ? 'chevron-up' : 'chevron-down'} size={14} />
            </Button>
          </div>
        </div>

        {open && (
          <div className="omada-sv-editor">
            <FilterBuilder
              key={fbKey}
              fields={fields}
              defaultRows={(active && active.rows && active.rows.length) ? active.rows : undefined}
              onChange={onFilterChange}
            />
            <div className="omada-sv-editfoot">
              {dirty
                ? <span className="omada-sv-dirtynote"><span className="omada-sv-dot" />{t('sv.unsaved')}</span>
                : <span className="omada-sv-cleannote"><Icon name="check" size={13} />{t('sv.synced')}</span>}
              <span className="omada-sv-editactions">
                {dirty && <Button variant="text" size="small" onClick={resetView}>{t('sv.reset')}</Button>}
                <Button variant="outline" size="small" onClick={saveAsNew}>
                  <Icon name="plus" size={14} />{t('sv.saveAsNew')}
                </Button>
                <Button variant="primary" size="small" disabled={!dirty || active.id === 'all'} onClick={updateView}>
                  <Icon name="save" size={14} />{t('sv.update')}
                </Button>
              </span>
            </div>
          </div>
        )}

        <Modal
          open={renameId !== null}
          title={t('sv.renameTitle')}
          onCancel={() => setRenameId(null)}
          onOk={commitRename}
          okText={t('common.save')}
          cancelText={t('common.cancel')}
          width={380}
          destroyOnClose
        >
          <Input value={renameVal} onChange={(e) => setRenameVal(e.target.value)}
                 onPressEnter={commitRename} autoFocus maxLength={40} />
        </Modal>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.SavedViews = OmadaSavedViews;
})();
