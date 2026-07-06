/* ────────────────────────────────────────────────────────────────────────
   components/ChannelScanner/ChannelScanner.jsx — OmadaChannelScanner

   An RF ENVIRONMENT scan: 2.4 / 5 GHz band Segmented over per-channel
   utilization bars (deterministic seeded values — 2.4 GHz is crowded
   around 1/6/11, 5 GHz is lighter with DFS dips). The RECOMMENDED
   channel (lowest utilization) is highlighted brand-green with a flag;
   the radio's CURRENT channel is outlined and labelled. Tooltip per
   bar: channel · utilization % · APs heard. RESCAN regenerates the
   seed behind a brief scanning shimmer; bars ease to their new heights.

   Distinct from BarChart (Batch 6 — ECharts wrapper for arbitrary
   data): this is a purpose-built spectrum strip with a built-in
   recommendation rule, no chart engine.

   Token-driven, dark twin, i18n. Channel order stays LTR in RTL.
   Figma: icon SYMBOL 25947:10047 ("channel utilization") — no full
   frame; bars follow TrafficSparkline/UsageMeter metrics.
   Exports: window.Omada.ChannelScanner
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { Segmented, Button, Tooltip } = window.antd;

  const CH24 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  const CH5 = [36, 40, 44, 48, 52, 56, 60, 64, 100, 108, 116, 124, 132, 140, 149, 157, 165];

  function gen(band, scanId) {
    let seed = 1234 + scanId * 7919 + (band === '2.4' ? 11 : 55);
    const rnd = function () { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
    const chans = band === '2.4' ? CH24 : CH5;
    return chans.map(function (ch) {
      let base;
      if (band === '2.4') {
        const d = Math.min(Math.abs(ch - 1), Math.abs(ch - 6), Math.abs(ch - 11));
        base = 55 - d * 9; // busy at 1/6/11, quieter between
      } else {
        base = ch >= 52 && ch <= 140 ? 14 : 30; // DFS range quieter
      }
      const util = Math.max(3, Math.min(96, Math.round(base + rnd() * 28)));
      const aps = Math.max(0, Math.round(util / 14 + rnd() * 3 - 1));
      return { ch: ch, util: util, aps: aps };
    });
  }

  function OmadaChannelScanner(props) {
    const { useState, useRef, useEffect, useMemo } = React;
    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;

    const [band, setBand] = useState(props.defaultBand || '2.4');
    const [scanId, setScanId] = useState(0);
    const [scanning, setScanning] = useState(false);
    const timer = useRef(null);

    useEffect(function () {
      return function () { if (timer.current) window.clearTimeout(timer.current); };
    }, []);

    const current = (props.currentChannels || { '2.4': 6, '5': 44 })[band];
    const bars = useMemo(function () { return gen(band, scanId); }, [band, scanId]);
    const recommended = useMemo(function () {
      let best = bars[0];
      bars.forEach(function (b) { if (b.util < best.util) best = b; });
      return best.ch;
    }, [bars]);

    function rescan() {
      if (scanning) return;
      setScanning(true);
      timer.current = window.setTimeout(function () {
        setScanId(function (n) { return n + 1; });
        setScanning(false);
        if (props.onScan) props.onScan();
      }, 900);
    }

    return (
      <div className={'omada-chsc' + (props.className ? ' ' + props.className : '')}>
        <div className="omada-chsc-head">
          <Segmented
            size="small"
            value={band}
            onChange={setBand}
            options={[{ value: '2.4', label: '2.4 GHz' }, { value: '5', label: '5 GHz' }]}
          />
          <Button size="small" loading={scanning} onClick={rescan}
                  icon={<window.OmadaIcon name="refresh" size={13} />}>
            {scanning ? t('chsc.scanning') : t('chsc.rescan')}
          </Button>
        </div>

        <div className={'omada-chsc-bars' + (scanning ? ' is-scanning' : '')}>
          {bars.map(function (b) {
            const isRec = b.ch === recommended;
            const isCur = b.ch === current;
            return (
              <Tooltip
                key={b.ch}
                title={t('chsc.channel').replace('{n}', b.ch) + ' · ' + t('chsc.utilization') + ' ' + b.util + '% · ' + t('chsc.aps').replace('{n}', b.aps)}
                mouseEnterDelay={0.1}
              >
                <div className={'omada-chsc-col' + (isRec ? ' is-rec' : '') + (isCur ? ' is-cur' : '')}>
                  {isRec ? (
                    <span className="omada-chsc-recflag">
                      <window.OmadaIcon name="star" size={11} />
                    </span>
                  ) : null}
                  <div className="omada-chsc-barwrap">
                    <div className="omada-chsc-bar" style={{ height: b.util + '%' }} />
                  </div>
                  <span className="omada-chsc-ch">{b.ch}</span>
                </div>
              </Tooltip>
            );
          })}
        </div>

        <div className="omada-chsc-foot">
          <span className="omada-chsc-key is-rec">
            <i /> {t('chsc.recommended')}: <b>{t('chsc.channel').replace('{n}', recommended)}</b>
          </span>
          <span className="omada-chsc-key is-cur">
            <i /> {t('chsc.current')}: <b>{t('chsc.channel').replace('{n}', current)}</b>
          </span>
        </div>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.ChannelScanner = OmadaChannelScanner;
})();
