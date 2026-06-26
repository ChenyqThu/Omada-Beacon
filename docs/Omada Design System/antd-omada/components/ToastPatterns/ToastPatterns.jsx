/* ────────────────────────────────────────────────────────────────────────
   components/ToastPatterns/ToastPatterns.jsx — OmadaToastPatterns

   A FEEDBACK-PATTERN board — the "how do I toast this?" companion to the App
   context wrapper (Batch 16). antd 6 routes message / notification through
   App.useApp() so every toast inherits theme + locale + direction; this board
   shows the four patterns that actually come up in product, all on that one
   context (window.Omada.useMessage / useNotification):

     1. Promise toast — a single key transitions loading → success | error.
        One message id is reused so the spinner is REPLACED in place, never
        stacked. The canonical "saving…" → "saved" pattern.
     2. Queue & throttle — maxCount caps the stack (3 for message, 4 for
        notification); fire a burst and watch the oldest collapse out instead
        of flooding the screen. Calm stacking, per OMADA_MESSAGE defaults.
     3. Action toast — a notification that carries buttons (Undo / View) and
        a stable key so the action can dismiss its own notice.
     4. Placement — notifications honour the six antd placements; the board
        fires one to the chosen corner (mirrors correctly under RTL).

   Pure composition over existing Omada wrappers + tokens; no new colour. The
   board chrome (cards, kbd, legend) is theme-var driven with dark twins in
   omada-overrides.css.

   Figma: no dedicated node — this is an antd-6 feedback ARCHITECTURE board.
   The toasts it fires are the Message (2965:16331) / Notification (29197:52977)
   wrappers already matched to their nodes.
   Exports: window.Omada.ToastPatterns
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { useState, useRef } = React;
  const { Segmented, Space } = window.antd;
  const Icon = window.Omada.Icon;
  const Button = window.Omada.Button;

  function PatternCard(props) {
    return (
      <div className="omada-tpat-card">
        <div className="omada-tpat-cardhd">
          <span className="omada-tpat-cardix"><Icon name={props.icon} size={18} /></span>
          <div>
            <div className="omada-tpat-cardtitle">{props.title}</div>
            <div className="omada-tpat-carddesc">{props.desc}</div>
          </div>
        </div>
        <div className="omada-tpat-cardbody">{props.children}</div>
      </div>
    );
  }

  function OmadaToastPatterns(props) {
    const className = props.className || '';
    const rest = Object.assign({}, props);
    delete rest.className;

    const ctx = window.useOmada();
    const t = ctx.t;
    const msg = window.Omada.useMessage();
    const notify = window.Omada.useNotification();

    const [placement, setPlacement] = useState('topRight');
    const busyRef = useRef(false);

    /* ── 1 · promise toast ── */
    const runPromise = (ok) => {
      if (busyRef.current) return;
      busyRef.current = true;
      const key = 'tpat-save';
      msg.loading(t('tpat.saving'), { key, duration: 0 });
      setTimeout(() => {
        if (ok) msg.success(t('tpat.saved'), { key, duration: 2 });
        else msg.error(t('tpat.saveFailed'), { key, duration: 2.5 });
        busyRef.current = false;
      }, 1400);
    };

    /* ── 2 · queue / throttle ── */
    const burstMessages = () => {
      for (let i = 1; i <= 6; i++) {
        setTimeout(() => msg.info(t('tpat.queueItem') + ' ' + i), i * 140);
      }
    };

    /* ── 3 · action toast (undo) ── */
    const actionToast = () => {
      const key = 'tpat-undo';
      notify.success({
        key,
        message: t('tpat.deletedTitle'),
        description: t('tpat.deletedBody'),
        duration: 6,
        btn: (
          <Space>
            <Button size="small" variant="text"
              onClick={() => { notify.notification.destroy(key); msg.info(t('tpat.undone')); }}>
              {t('tpat.undo')}
            </Button>
            <Button size="small" variant="primary"
              onClick={() => notify.notification.destroy(key)}>
              {t('common.confirm')}
            </Button>
          </Space>
        ),
      });
    };

    /* ── 4 · placement ── */
    const firePlacement = () => {
      notify.info({
        message: t('tpat.placedTitle'),
        description: t('tpat.placedBody') + ' · ' + placement,
        placement,
        duration: 3,
      });
    };

    const PLACEMENTS = ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'];

    return (
      <div className={('omada-tpat ' + className).trim()} {...rest}>
        <div className="omada-tpat-grid">

          <PatternCard icon="refresh" title={t('tpat.promiseTitle')} desc={t('tpat.promiseDesc')}>
            <Space wrap>
              <Button variant="primary" icon={<Icon name="check" size={16} />} onClick={() => runPromise(true)}>
                {t('tpat.save')}
              </Button>
              <Button variant="danger-ghost" icon={<Icon name="ban" size={16} />} onClick={() => runPromise(false)}>
                {t('tpat.saveFail')}
              </Button>
            </Space>
            <div className="omada-tpat-hint">
              <code>message.loading(content, &#123; key &#125;)</code> → <code>message.success(content, &#123; key &#125;)</code>
            </div>
          </PatternCard>

          <PatternCard icon="layers" title={t('tpat.queueTitle')} desc={t('tpat.queueDesc')}>
            <Button variant="outline" icon={<Icon name="bell" size={16} />} onClick={burstMessages}>
              {t('tpat.queueFire')}
            </Button>
            <div className="omada-tpat-hint">
              <code>maxCount: 3</code> — {t('tpat.queueNote')}
            </div>
          </PatternCard>

          <PatternCard icon="reboot" title={t('tpat.actionTitle')} desc={t('tpat.actionDesc')}>
            <Button variant="outline" icon={<Icon name="trash" size={16} />} onClick={actionToast}>
              {t('tpat.actionFire')}
            </Button>
            <div className="omada-tpat-hint">
              <code>btn</code> + <code>key</code> — {t('tpat.actionNote')}
            </div>
          </PatternCard>

          <PatternCard icon="dashboard" title={t('tpat.placementTitle')} desc={t('tpat.placementDesc')}>
            <Segmented
              value={placement}
              onChange={setPlacement}
              options={PLACEMENTS.map((p) => ({ value: p, label: p }))}
              size="small"
            />
            <div style={{ marginTop: 12 }}>
              <Button variant="primary" icon={<Icon name="export" size={16} />} onClick={firePlacement}>
                {t('tpat.placementFire')}
              </Button>
            </div>
          </PatternCard>

        </div>
        <div className="omada-tpat-note">{t('tpat.note')}</div>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.ToastPatterns = OmadaToastPatterns;
})();
