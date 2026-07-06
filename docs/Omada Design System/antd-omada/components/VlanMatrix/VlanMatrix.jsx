/* ────────────────────────────────────────────────────────────────────────
   components/VlanMatrix/VlanMatrix.jsx — OmadaVlanMatrix

   A PORT × VLAN MEMBERSHIP paint grid: rows are VLANs (id chip + name),
   columns are switch ports. Each cell cycles excluded → untagged (U,
   solid green) → tagged (T, outlined) on click; pointer-drag paints the
   value chosen by the initial click across cells. Invariant: ONE
   untagged VLAN per port — painting U on a port clears that port's
   previous U. Legend + localized hint underneath; `onChange(value)`
   fires with `{ [vlanId]: { [port]: 'u'|'t' } }`.

   Distinct from SchedulePicker (Batch 25 — week×hour time-range paint)
   and PortPanel (Batch 25 — physical port status view): this edits
   logical membership.

   Token-driven, dark twin, i18n. The grid keeps LTR port order in RTL.
   Figma: icon SYMBOL 25947:12266 ("Property 1=vlan wizard") — no full
   frame; cell metrics follow SchedulePicker.
   Exports: window.Omada.VlanMatrix
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { Tooltip } = window.antd;
  const ORDER = ['x', 'u', 't'];

  function OmadaVlanMatrix(props) {
    const { useState, useRef, useEffect } = React;
    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;

    const ports = props.ports || 16;
    const vlans = props.vlans || [];
    const [val, setVal] = useState(function () { return props.defaultValue || {}; });
    const paint = useRef(null);

    useEffect(function () {
      const up = function () { paint.current = null; };
      window.addEventListener('pointerup', up);
      return function () { window.removeEventListener('pointerup', up); };
    }, []);

    function cellState(vid, p) {
      return (val[vid] && val[vid][p]) || 'x';
    }

    function applyCell(vid, p, s) {
      setVal(function (prev) {
        const next = {};
        Object.keys(prev).forEach(function (k) { next[k] = Object.assign({}, prev[k]); });
        if (!next[vid]) next[vid] = {};
        if (s === 'x') {
          delete next[vid][p];
        } else {
          if (s === 'u') {
            Object.keys(next).forEach(function (k) {
              if (k !== String(vid) && next[k][p] === 'u') delete next[k][p];
            });
          }
          next[vid][p] = s;
        }
        if (props.onChange) props.onChange(next);
        return next;
      });
    }

    function down(vid, p) {
      const s = ORDER[(ORDER.indexOf(cellState(vid, p)) + 1) % 3];
      paint.current = s;
      applyCell(vid, p, s);
    }
    function enter(vid, p) {
      if (paint.current != null) applyCell(vid, p, paint.current);
    }

    const stateLabel = function (s) {
      return s === 'u' ? t('vlanm.untagged') : s === 't' ? t('vlanm.tagged') : t('vlanm.excluded');
    };

    const portNums = [];
    for (let i = 1; i <= ports; i++) portNums.push(i);

    return (
      <div className={'omada-vlanm' + (props.className ? ' ' + props.className : '')}>
        <div className="omada-vlanm-scroll">
          <table className="omada-vlanm-table">
            <thead>
              <tr>
                <th className="omada-vlanm-vh">VLAN</th>
                {portNums.map(function (p) {
                  return <th key={p} className="omada-vlanm-ph">{p}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {vlans.map(function (v) {
                return (
                  <tr key={v.id}>
                    <th className="omada-vlanm-vlabel">
                      <span className="omada-vlanm-vid">{v.id}</span>
                      <span className="omada-vlanm-vname">{v.name}</span>
                    </th>
                    {portNums.map(function (p) {
                      const s = cellState(v.id, p);
                      return (
                        <td key={p} className="omada-vlanm-td">
                          <Tooltip
                            title={'VLAN ' + v.id + ' · ' + t('vlanm.port').replace('{n}', p) + ' · ' + stateLabel(s)}
                            mouseEnterDelay={0.25}
                          >
                            <button
                              type="button"
                              className={'omada-vlanm-cell is-' + s}
                              aria-label={'VLAN ' + v.id + ' ' + t('vlanm.port').replace('{n}', p) + ' ' + stateLabel(s)}
                              onPointerDown={function (e) { e.preventDefault(); down(v.id, p); }}
                              onPointerEnter={function () { enter(v.id, p); }}
                            >
                              {s === 'u' ? 'U' : s === 't' ? 'T' : ''}
                            </button>
                          </Tooltip>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="omada-vlanm-foot">
          <span className="omada-vlanm-legend">
            <span className="omada-vlanm-cell is-u">U</span> {t('vlanm.untagged')}
            <span className="omada-vlanm-cell is-t">T</span> {t('vlanm.tagged')}
            <span className="omada-vlanm-cell is-x" /> {t('vlanm.excluded')}
          </span>
          <span className="omada-vlanm-note">{t('vlanm.legend')}</span>
        </div>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.VlanMatrix = OmadaVlanMatrix;
})();
