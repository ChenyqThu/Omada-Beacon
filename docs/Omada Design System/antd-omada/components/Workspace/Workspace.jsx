/* ────────────────────────────────────────────────────────────────────────
   components/Workspace/Workspace.jsx — OmadaWorkspace

   A three-pane WORKSPACE — list ↔ detail ↔ inspector — composed from NESTED
   antd Splitters. The "mail / IDE / device-console" layout: pick something on
   the left, read it in the middle, tweak it on the right, and drag the seams
   to rebalance. It extends the Splitter wrapper (Batch 9) rather than
   re-skinning drag bars again.

   Structure:
     ┌────────┬───────────────┬──────────┐
     │  list  │    detail     │ inspector│   outer Splitter [ list | rest ]
     │ (nav)  │   (content)   │ (collap.)│   inner Splitter [ detail | inspector ]
     └────────┴───────────────┴──────────┘

   Behaviour:
     · The left list is a single-select nav; choosing a row updates the detail
       and inspector (caller owns row + detail + inspector renderers).
     · The right inspector pane is COLLAPSIBLE — a panel-toggle in the detail
       header (and the Splitter's own collapse affordance) hides/show it; the
       detail reclaims the width. State is the wrapper's.
     · Every seam drags within sensible min/max so no pane disappears by
       accident; sizes persist for the session.
     · Panes scroll independently; the chrome is a single bordered card so the
       three regions read as one surface.

   Pure COMPOSITION over Omada.Splitter + Icon + Button; the only new CSS is
   pane padding / list-row / header chrome, theme-var driven with dark twins in
   omada-overrides.css. Drag bars inherit the green-on-hover hairline from the
   Splitter wrapper. Mirrors under RTL (panes reorder start→end).

   Figma: master/detail layout from /Layout (node 3:64434) — the same node the
   Splitter wrapper cites, extended to three panes.
   Exports: window.Omada.Workspace
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { useState } = React;
  const { Splitter } = window.antd;
  const Icon = window.Omada.Icon;
  const Button = window.Omada.Button;

  function OmadaWorkspace(props) {
    const className = props.className || '';
    const rest = Object.assign({}, props);
    delete rest.className; delete rest.items; delete rest.rowKey;
    delete rest.renderRow; delete rest.renderDetail; delete rest.renderInspector;
    delete rest.listTitle; delete rest.inspectorTitle; delete rest.detailTitle;
    delete rest.selectedKey; delete rest.onSelect; delete rest.height;

    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;

    const items = props.items || [];
    const rowKey = props.rowKey || 'key';
    const keyOf = (it, i) => (it && it[rowKey] != null ? it[rowKey] : i);

    const controlled = props.selectedKey !== undefined;
    const [innerSel, setInnerSel] = useState(items.length ? keyOf(items[0], 0) : null);
    const selected = controlled ? props.selectedKey : innerSel;
    const select = (k) => { if (!controlled) setInnerSel(k); if (props.onSelect) props.onSelect(k); };

    const [inspectorOpen, setInspectorOpen] = useState(true);

    const selItem = items.find((it, i) => keyOf(it, i) === selected) || items[0];

    const renderRow = props.renderRow || ((it) => (
      <span className="omada-ws-rowdefault">{String(it && (it.label != null ? it.label : it[rowKey]))}</span>
    ));

    return (
      <div className={('omada-ws ' + className).trim()} {...rest}
        style={Object.assign({ height: props.height || 460 }, props.style)}>
        <Splitter className="omada-ws-splitter">
          {/* ── list pane ── */}
          <Splitter.Panel defaultSize={232} min={168} max={340} className="omada-ws-panel omada-ws-listpanel">
            <div className="omada-ws-panehd">
              <span className="omada-ws-panehdix"><Icon name="list" size={15} /></span>
              {props.listTitle || t('ws.list')}
              <span className="omada-ws-panecount">{items.length}</span>
            </div>
            <div className="omada-ws-list">
              {items.map((it, i) => {
                const k = keyOf(it, i);
                return (
                  <button
                    key={k}
                    type="button"
                    className={'omada-ws-row' + (k === selected ? ' is-active' : '')}
                    aria-current={k === selected}
                    onClick={() => select(k)}
                  >
                    {renderRow(it, i)}
                  </button>
                );
              })}
            </div>
          </Splitter.Panel>

          {/* ── detail + inspector (nested) ── */}
          <Splitter.Panel min={320} className="omada-ws-panel omada-ws-restpanel">
            <Splitter>
              <Splitter.Panel min={280} className="omada-ws-panel omada-ws-detailpanel">
                <div className="omada-ws-panehd">
                  <span className="omada-ws-panehdix"><Icon name="docs" size={15} /></span>
                  {props.detailTitle || t('ws.detail')}
                  <span className="omada-ws-panehdspacer" />
                  <button
                    type="button"
                    className={'omada-ws-paneltoggle' + (inspectorOpen ? ' is-on' : '')}
                    aria-pressed={inspectorOpen}
                    title={t('ws.toggleInspector')}
                    onClick={() => setInspectorOpen((o) => !o)}
                  >
                    <Icon name="panel-right" size={16} />
                  </button>
                </div>
                <div className="omada-ws-panebody">
                  {props.renderDetail ? props.renderDetail(selItem) : null}
                </div>
              </Splitter.Panel>

              {inspectorOpen && (
                <Splitter.Panel defaultSize={260} min={200} max={360} collapsible
                  className="omada-ws-panel omada-ws-inspectorpanel">
                  <div className="omada-ws-panehd">
                    <span className="omada-ws-panehdix"><Icon name="settings" size={15} /></span>
                    {props.inspectorTitle || t('ws.inspector')}
                    <span className="omada-ws-panehdspacer" />
                    <button type="button" className="omada-ws-paneclose"
                      aria-label={t('ws.hideInspector')} onClick={() => setInspectorOpen(false)}>
                      <Icon name="close" size={14} />
                    </button>
                  </div>
                  <div className="omada-ws-panebody">
                    {props.renderInspector ? props.renderInspector(selItem) : null}
                  </div>
                </Splitter.Panel>
              )}
            </Splitter>
          </Splitter.Panel>
        </Splitter>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.Workspace = OmadaWorkspace;
})();
