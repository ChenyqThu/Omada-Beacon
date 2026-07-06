/* ────────────────────────────────────────────────────────────────────────
   components/CodeBlock/CodeBlock.jsx — OmadaCodeBlock

   A read-only config / code viewer for the controller's "view raw" surfaces —
   firmware config dumps, CLI snippets, API payloads, and unified diffs. A
   header carries an optional filename + language tag and a copy button (flips
   to "Copied" for ~1.5s); the body shows monospace lines with optional gutter
   line numbers and a wrap toggle. Pass `code` (a string) for plain viewing, or
   `lines` (`[{ text, type:'add'|'del'|'ctx' }]`) to render a diff with green/
   red tinted rows, +/- gutter marks, and an added/removed count in the header.

   Pure presentational primitive — no syntax-highlight engine (intentionally
   calm); tone comes only from diff classification. Token-driven, dark twin.

   Figma: no dedicated node — derived from the mono type token + the DiffView
   (Batch 20) row classification. Original.
   Exports: window.Omada.CodeBlock
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const Icon = window.Omada.Icon;

  function OmadaCodeBlock(props) {
    const { useState } = React;
    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;

    const isDiff = Array.isArray(props.lines);
    const lines = isDiff
      ? props.lines
      : String(props.code || '').replace(/\n$/, '').split('\n').map((text) => ({ text, type: 'ctx' }));

    const [copied, setCopied] = useState(false);
    const [wrap, setWrap] = useState(!!props.defaultWrap);

    const plain = isDiff
      ? lines.map((l) => (l.type === 'add' ? '+' : l.type === 'del' ? '-' : ' ') + l.text).join('\n')
      : (props.code || '');

    const copy = () => {
      const write = navigator.clipboard && navigator.clipboard.writeText
        ? navigator.clipboard.writeText(plain) : Promise.reject();
      Promise.resolve(write).then(() => {
        setCopied(true); setTimeout(() => setCopied(false), 1500);
      }).catch(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); });
    };

    const added = isDiff ? lines.filter((l) => l.type === 'add').length : 0;
    const removed = isDiff ? lines.filter((l) => l.type === 'del').length : 0;
    const showNums = props.showLineNumbers !== false;

    let n = 0;
    return (
      <div className="omada-cb">
        <div className="omada-cb-head">
          <span className="omada-cb-name">
            {props.filename && <Icon name="file-text" size={14} />}
            {props.filename || props.lang || 'text'}
          </span>
          <span className="omada-cb-spacer" />
          {isDiff && (
            <span className="omada-cb-diffstat">
              <span className="omada-cb-add">+{added}</span>
              <span className="omada-cb-del">−{removed}</span>
            </span>
          )}
          {props.wrappable && (
            <button type="button" className={'omada-cb-wrap' + (wrap ? ' is-on' : '')} onClick={() => setWrap((w) => !w)}>
              <Icon name="corner-down-left" size={14} />{t('cb.wrap')}
            </button>
          )}
          {props.copyable !== false && (
            <button type="button" className={'omada-cb-copy' + (copied ? ' is-copied' : '')} onClick={copy}>
              <Icon name={copied ? 'check' : 'copy'} size={14} />{copied ? t('cb.copied') : t('cb.copy')}
            </button>
          )}
        </div>
        <div className={'omada-cb-body' + (wrap ? ' is-wrap' : '')}>
          <pre className="omada-cb-pre"><code>
            {lines.map((l, i) => {
              if (l.type !== 'del') n += 1;
              return (
                <span className={'omada-cb-line is-' + l.type} key={i}>
                  {showNums && <span className="omada-cb-num">{isDiff ? '' : n}</span>}
                  {isDiff && <span className="omada-cb-sign">{l.type === 'add' ? '+' : l.type === 'del' ? '−' : ' '}</span>}
                  <span className="omada-cb-text">{l.text || '\u00A0'}</span>
                </span>
              );
            })}
          </code></pre>
        </div>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.CodeBlock = OmadaCodeBlock;
})();
