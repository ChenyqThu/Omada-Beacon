/* ────────────────────────────────────────────────────────────────────────
   components/TopologyMap/TopologyMap.jsx — OmadaTopologyMap

   A connection / network TOPOLOGY mini-map. Device nodes (gateway · switch · ap
   · client · cloud) laid out over a canvas, joined by status-coloured links,
   each node a selectable chip (type glyph + label + status ring). A legend maps
   the link/node statuses; selecting a node lifts it and reports via onSelect.

   Behaviour:
     · `nodes`: { id, type, label, x, y, status } — x/y are 0..1 normalised
       positions on the canvas (top-left origin). `type` is an OmadaIcon device
       glyph; `status` ∈ up/degraded/down/idle tints the ring + dot.
     · `links`: { from, to, status } — drawn as SVG lines under the nodes, in a
       viewBox that maps 1:1 to the node percentage grid (so a line endpoint sits
       exactly under its node). `down` links render dashed; status colours come
       from semantic tokens.
     · Selection: click (or Enter/Space) selects a node; the selected id lifts
       with a brand ring and dims the rest. Controlled (`selected`/`onSelect`)
       or uncontrolled. `aspect` sets the canvas height ratio.
     · RTL-safe (the canvas mirrors via direction; labels stay readable).

   Links are the only SVG (straight lines) — nodes are real <button>s positioned
   with logical percentages, so they stay crisp + keyboard reachable. All chrome
   theme-var driven with a dark twin.

   Figma: topology/connection-map pattern — composes the device glyphs (icon set)
   + Card surface; no single node. Original layout.
   Exports: window.Omada.TopologyMap
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const Icon = window.Omada.Icon;

  const STATUSES = ['up', 'degraded', 'down', 'idle'];

  function OmadaTopologyMap(props) {
    const { useState } = React;
    const className = props.className || '';
    const rest = Object.assign({}, props);
    delete rest.className; delete rest.nodes; delete rest.links; delete rest.selected;
    delete rest.onSelect; delete rest.aspect; delete rest.legend; delete rest.style;

    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;

    const nodes = props.nodes || [];
    const links = props.links || [];
    const controlled = props.selected !== undefined;
    const [selS, setSelS] = useState(props.defaultSelected || null);
    const selected = controlled ? props.selected : selS;
    const showLegend = props.legend === undefined ? true : props.legend;
    const aspect = props.aspect || 0.52;   // height = width * aspect

    const byId = {};
    nodes.forEach((n) => { byId[n.id] = n; });

    const select = (id) => {
      const next = id === selected ? null : id;
      if (props.onSelect) props.onSelect(next ? byId[next] : null, next);
      if (!controlled) setSelS(next);
    };

    return (
      <div className={('omada-topo ' + className).trim()} style={props.style} {...rest}>
        <div className="omada-topo-canvas" style={{ '--om-topo-aspect': aspect }}>
          <svg className="omada-topo-links" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {links.map((lk, i) => {
              const a = byId[lk.from], b = byId[lk.to];
              if (!a || !b) return null;
              const dim = selected && lk.from !== selected && lk.to !== selected;
              return (
                <line
                  key={i}
                  x1={a.x * 100} y1={a.y * 100} x2={b.x * 100} y2={b.y * 100}
                  className={'omada-topo-link is-' + (lk.status || 'up') + (dim ? ' is-dim' : '')}
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
          </svg>

          {nodes.map((n) => {
            const isSel = n.id === selected;
            const dim = selected && !isSel;
            return (
              <button
                key={n.id}
                type="button"
                className={'omada-topo-node is-' + (n.status || 'up') + (isSel ? ' is-selected' : '') + (dim ? ' is-dim' : '')}
                style={{ left: (n.x * 100) + '%', top: (n.y * 100) + '%' }}
                onClick={() => select(n.id)}
                aria-pressed={isSel}
                aria-label={n.label}
              >
                <span className="omada-topo-disc">
                  <Icon name={n.type || 'devices'} size={18} />
                  <span className="omada-topo-dot" aria-hidden="true" />
                </span>
                <span className="omada-topo-label">{n.label}</span>
              </button>
            );
          })}
        </div>

        {showLegend && (
          <div className="omada-topo-legend">
            {STATUSES.map((s) => (
              <span className="omada-topo-leg" key={s}>
                <span className={'omada-topo-legdot is-' + s} />
                {t('topo.s.' + s)}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.TopologyMap = OmadaTopologyMap;
})();
