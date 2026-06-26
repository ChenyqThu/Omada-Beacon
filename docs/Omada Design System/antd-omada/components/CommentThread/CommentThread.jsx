/* ────────────────────────────────────────────────────────────────────────
   components/CommentThread/CommentThread.jsx — OmadaCommentThread

   An inline ANNOTATION / comment-thread cue — the "someone left a note on this"
   pattern. A numbered pin marker that, on click, opens a Popover holding the
   thread: an anchor header (what it's pinned to + a resolve toggle), the comment
   list (avatar · author · relative time · body), and a reply composer.

   Two surfaces from one component:
     · `<CommentThread.Pin>` — the small numbered marker you drop onto a target
       (a port, a row, a map node). Shows the comment count; tinted by resolved
       state; opens the panel in a Popover.
     · `<CommentThread>` — the panel itself (also usable inline in a drawer):
       header + list + composer. Keeps its own draft + optimistic comments in
       state for the demo; real apps pass `comments` + `onAdd` / `onResolve`.

   Behaviour:
     · Composer: Cmd/Ctrl+Enter or the Comment button posts; empty is disabled.
       Your own comments tint with the brand avatar; "you" is localized.
     · Resolve flips the header to a calm "resolved" state and the pin to grey-
       green; reopen restores. `@`-style mentions in the body render as chips.
     · RTL-safe; the composer textarea is the antd control (locale-aware).

   Thin composition over OmadaAvatar + Popover + antd Input.TextArea + Button +
   OmadaIcon. All chrome is theme-var driven with a dark twin.

   Figma: collaboration/annotation pattern — no single node (extends the Popover
   气泡卡片 3:25129 confirm bubble + Avatar 头像 2985:128851). Original redraw.
   Exports: window.Omada.CommentThread (+ .Pin)
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { Input, Button } = window.antd;
  const Avatar = window.Omada.Avatar;
  const Popover = window.Omada.Popover;
  const Icon = window.Omada.Icon;

  const TONES = ['blue', 'magenta', 'orange', 'neutral', 'brand'];
  function initials(name) {
    const p = String(name || '').trim().split(/\s+/);
    return (p.length === 1 ? p[0].slice(0, 2) : p[0][0] + p[p.length - 1][0]).toUpperCase();
  }
  function rel(time, lang) {
    const diff = Math.max(0, Date.now() - new Date(time).getTime());
    const m = Math.floor(diff / 60000), h = Math.floor(diff / 3600000), d = Math.floor(diff / 86400000);
    if (m < 1) return lang === 'zh' ? '刚刚' : 'now';
    if (m < 60) return m + (lang === 'zh' ? '分钟前' : 'm');
    if (h < 24) return h + (lang === 'zh' ? '小时前' : 'h');
    return d + (lang === 'zh' ? '天前' : 'd');
  }
  // split "@Name" runs into mention chips
  function renderBody(body) {
    const parts = String(body || '').split(/(@[\w][\w .-]*?)(?=[,.!?\s]|$)/g);
    return parts.map((p, i) => p.startsWith('@')
      ? <span className="omada-ct-mention" key={i}>{p}</span>
      : <React.Fragment key={i}>{p}</React.Fragment>);
  }

  function ThreadPanel(props) {
    const { useState } = React;
    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;
    const lang = ctx ? ctx.lang : 'en';

    const controlled = props.comments != null;
    const [localComments, setLocal] = useState(props.defaultComments || []);
    const comments = controlled ? props.comments : localComments;
    const [resolved, setResolved] = useState(!!props.resolved);
    const [draft, setDraft] = useState('');

    const post = () => {
      const text = draft.trim();
      if (!text) return;
      const c = { key: 'c' + Date.now(), author: props.youName || t('ct.you'), you: true, tone: 'brand', time: Date.now(), body: text };
      if (props.onAdd) props.onAdd(c);
      if (!controlled) setLocal((arr) => arr.concat(c));
      setDraft('');
    };
    const toggleResolve = () => {
      const next = !resolved; setResolved(next);
      if (props.onResolve) props.onResolve(next);
    };
    const onKey = (e) => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); post(); } };

    return (
      <div className={'omada-ct' + (resolved ? ' is-resolved' : '')}>
        <header className="omada-ct-head">
          <span className="omada-ct-anchor">
            <Icon name={resolved ? 'check-circle' : 'pin'} size={15} />
            <span className="omada-ct-anchorname">{props.title || t('ct.anchor')}</span>
          </span>
          <button type="button" className="omada-ct-resolve" onClick={toggleResolve}>
            {resolved ? t('ct.reopen') : t('ct.resolve')}
          </button>
        </header>

        <ul className="omada-ct-list" role="list">
          {comments.map((c, i) => (
            <li className="omada-ct-comment" key={c.key != null ? c.key : i}>
              <Avatar size={26} tone={c.tone || TONES[i % TONES.length]} src={c.src} style={{ fontSize: 11, fontWeight: 600 }}>
                {!c.src && initials(c.author)}
              </Avatar>
              <div className="omada-ct-cbody">
                <div className="omada-ct-cmeta">
                  <span className="omada-ct-author">{c.author}{c.you && <span className="omada-ct-youtag">{t('ct.youtag')}</span>}</span>
                  <time className="omada-ct-time">{rel(c.time, lang)}</time>
                </div>
                <p className="omada-ct-ctext">{renderBody(c.body)}</p>
              </div>
            </li>
          ))}
          {comments.length === 0 && <li className="omada-ct-empty">{t('ct.empty')}</li>}
        </ul>

        {!resolved && (
          <div className="omada-ct-composer">
            <Avatar size={26} tone="brand" style={{ fontSize: 11, fontWeight: 600 }}>{initials(props.youName || t('ct.you'))}</Avatar>
            <div className="omada-ct-field">
              <Input.TextArea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={onKey}
                placeholder={t('ct.placeholder')}
                autoSize={{ minRows: 1, maxRows: 4 }}
                variant="filled"
              />
              <div className="omada-ct-actions">
                <span className="omada-ct-hint">{t('ct.kbd')}</span>
                <Button type="primary" size="small" disabled={!draft.trim()} onClick={post}>{t('ct.send')}</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  function CommentPin(props) {
    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;
    const count = props.count != null ? props.count : (props.comments ? props.comments.length : 0);
    const resolved = !!props.resolved;
    const panel = (
      <ThreadPanel title={props.title} comments={props.comments} defaultComments={props.defaultComments}
                   resolved={props.resolved} youName={props.youName} onAdd={props.onAdd} onResolve={props.onResolve} />
    );
    return (
      <Popover content={panel} trigger="click" placement={props.placement || 'rightTop'}
               overlayClassName="omada-ct-pop" {...(props.popoverProps || {})}>
        <button type="button"
          className={'omada-ct-pin' + (resolved ? ' is-resolved' : '')}
          style={props.style}
          aria-label={t('ct.open')}>
          <Icon name={resolved ? 'check' : 'docs'} size={13} />
          {count > 0 && <span className="omada-ct-pincount">{count}</span>}
        </button>
      </Popover>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.CommentThread = ThreadPanel;
  window.Omada.CommentThread.Pin = CommentPin;
})();
