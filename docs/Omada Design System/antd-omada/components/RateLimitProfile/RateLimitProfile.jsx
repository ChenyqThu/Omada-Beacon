/* ────────────────────────────────────────────────────────────────────────
   components/RateLimitProfile/RateLimitProfile.jsx — OmadaRateLimitProfile

   BANDWIDTH PROFILES: a profile rail (Guest / Staff / IoT, each pill
   summarising ↓/↑ caps and SSID count) over an editor panel — down/up
   caps as InputNumbers in Mbps, an allow-burst switch expanding a
   burst-size field, and apply-to-SSID chips. An SSID belongs to ONE
   profile: chips owned by the active profile render filled green,
   chips owned elsewhere show their owner and clicking one MOVES it
   to the active profile; unassigned chips are dashed.

   Distinct from UsageMeter (displays consumption against a quota;
   this EDITS the caps) and AlarmRules (thresholds → alerts).

   Token-driven, dark twin, i18n. Figma: no dedicated frame — pill
   rail follows NetworkSelector, chips follow Tag metrics (radius 4).
   Exports: window.Omada.RateLimitProfile
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { InputNumber, Switch, Tooltip } = window.antd;

  const DEFAULT_PROFILES = [
    { id: 'guest', name: 'rlp.profile.guest', down: 10,  up: 5,  burst: true,  burstMB: 50,  ssids: ['Acme-Guest'] },
    { id: 'staff', name: 'rlp.profile.staff', down: 100, up: 50, burst: false, burstMB: 100, ssids: ['Acme-Staff', 'Acme-Lab'] },
    { id: 'iot',   name: 'rlp.profile.iot',   down: 2,   up: 1,  burst: false, burstMB: 20,  ssids: ['Acme-IoT'] },
  ];
  const SSIDS = ['Acme-Guest', 'Acme-Staff', 'Acme-IoT', 'Acme-Lab'];

  function OmadaRateLimitProfile(props) {
    const { useState } = React;
    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;

    const [profiles, setProfiles] = useState(props.profiles || DEFAULT_PROFILES);
    const [activeId, setActiveId] = useState((props.profiles || DEFAULT_PROFILES)[0].id);
    const active = profiles.filter(function (p) { return p.id === activeId; })[0];

    function patch(id, delta) {
      setProfiles(function (ps) {
        return ps.map(function (p) { return p.id === id ? Object.assign({}, p, delta) : p; });
      });
    }

    function ownerOf(ssid) {
      return profiles.filter(function (p) { return p.ssids.indexOf(ssid) !== -1; })[0] || null;
    }

    function toggleSsid(ssid) {
      setProfiles(function (ps) {
        const owner = ps.filter(function (p) { return p.ssids.indexOf(ssid) !== -1; })[0];
        return ps.map(function (p) {
          let next = p.ssids.filter(function (s) { return s !== ssid; });
          if (p.id === activeId && (!owner || owner.id !== activeId)) next = next.concat([ssid]);
          return Object.assign({}, p, { ssids: next });
        });
      });
    }

    return (
      <div className={'omada-rlp' + (props.className ? ' ' + props.className : '')}>
        <div className="omada-rlp-rail" role="tablist">
          {profiles.map(function (p) {
            return (
              <button key={p.id} type="button" role="tab" aria-selected={p.id === activeId}
                      className={'omada-rlp-pill' + (p.id === activeId ? ' is-on' : '')}
                      onClick={function () { setActiveId(p.id); }}>
                <b>{t(p.name)}</b>
                <span>↓ {p.down} · ↑ {p.up} Mbps · {t('rlp.summary.ssids').replace('{n}', p.ssids.length)}</span>
              </button>
            );
          })}
        </div>

        <div className="omada-rlp-editor">
          <div className="omada-rlp-caps">
            <label className="omada-rlp-field">
              <span>{t('rlp.down')}</span>
              <InputNumber size="small" min={1} max={10000} value={active.down}
                           onChange={function (v) { if (v != null) patch(activeId, { down: v }); }}
                           suffix="Mbps" style={{ width: 130 }} />
            </label>
            <label className="omada-rlp-field">
              <span>{t('rlp.up')}</span>
              <InputNumber size="small" min={1} max={10000} value={active.up}
                           onChange={function (v) { if (v != null) patch(activeId, { up: v }); }}
                           suffix="Mbps" style={{ width: 130 }} />
            </label>
            <div className="omada-rlp-field">
              <span>{t('rlp.burst')}</span>
              <div className="omada-rlp-burst">
                <Switch size="small" checked={active.burst}
                        onChange={function (v) { patch(activeId, { burst: v }); }} />
                {active.burst ? (
                  <InputNumber size="small" min={10} max={1000} step={10} value={active.burstMB}
                               onChange={function (v) { if (v != null) patch(activeId, { burstMB: v }); }}
                               suffix="MB" style={{ width: 110 }} aria-label={t('rlp.burstSize')} />
                ) : null}
              </div>
            </div>
          </div>

          <div className="omada-rlp-ssids">
            <span className="omada-rlp-ssidlabel">{t('rlp.ssids')}</span>
            <div className="omada-rlp-chips">
              {SSIDS.map(function (s) {
                const owner = ownerOf(s);
                const mine = owner && owner.id === activeId;
                const cls = 'omada-rlp-chip' + (mine ? ' is-mine' : owner ? ' is-other' : ' is-free');
                const chip = (
                  <button key={s} type="button" className={cls} onClick={function () { toggleSsid(s); }}>
                    {mine ? <window.OmadaIcon name="check" size={11} /> : null}
                    {s}
                    {owner && !mine ? <em>{t('rlp.in.profile').replace('{p}', t(owner.name))}</em> : null}
                  </button>
                );
                return owner && !mine
                  ? <Tooltip key={s} title={t('rlp.ssids.note')}>{chip}</Tooltip>
                  : chip;
              })}
            </div>
            <p className="omada-rlp-note">{t('rlp.ssids.note')}</p>
          </div>
        </div>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.RateLimitProfile = OmadaRateLimitProfile;
})();
