/* ────────────────────────────────────────────────────────────────────────
   components/Inspector/Inspector.jsx — OmadaInspector

   A read-only JSON / config tree inspector — the "show me the raw device
   config / API payload / theme token object" viewer. Distinct from Tree
   (Batch 5, a selectable data-tree control) and CodeBlock (Batch 22, raw
   monospace text): the Inspector understands JS values and renders them as a
   collapsible, type-coloured tree.

     · Recursive nodes: objects / arrays collapse behind a chevron with a
       summary ({…} 4 keys · […] 6 items); primitives are type-coloured
       (string · number · boolean · null).
     · Click any row to COPY ITS PATH (network.vlans[0].id) — the headline
       feature for "tell support exactly which key is wrong". A hover copy-value
       button copies the JSON value.
     · Expand-all / collapse-all + a path/value search that filters the tree to
       matching branches and force-expands them.
     · `defaultExpandDepth` controls the initial open depth.

   Thin composition over OmadaIcon + Input on antd-tokened surfaces. The clipboard
   uses navigator.clipboard with a textarea fallback. Token-driven, dark twin,
   i18n, RTL-safe (the tree itself stays LTR — paths are code).

   Figma: no dedicated node — code/token surface family (CodeBlock 3:16xxx);
   the JSON-tree inspector is original.
   Exports: window.Omada.Inspector
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { Input, Tooltip } = window.antd;
  const Icon = window.Omada.Icon;

  function valueType(v) {
    if (v === null) return 'null';
    if (Array.isArray(v)) return 'array';
    return typeof v;   // 'object' | 'string' | 'number' | 'boolean' | 'undefined'
  }
  function isBranch(v) { const tt = valueType(v); return tt === 'object' || tt === 'array'; }

  function childPath(parent, key, isIndex) {
    if (isIndex) return parent + '[' + key + ']';
    const safe = /^[A-Za-z_$][\w$]*$/.test(key);
    if (!parent) return safe ? key : "['" + key + "']";
    return safe ? parent + '.' + key : parent + "['" + key + "']";
  }

  function copyText(text) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text);
    } catch (e) {}
    const ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
    return Promise.resolve();
  }

  // does this value (or any descendant key/value) contain the search term?
  function deepMatch(key, value, term) {
    if (String(key).toLowerCase().indexOf(term) !== -1) return true;
    if (!isBranch(value)) return String(value).toLowerCase().indexOf(term) !== -1;
    const entries = Array.isArray(value) ? value.map((v, i) => [i, v]) : Object.entries(value);
    return entries.some(([k, v]) => deepMatch(k, v, term));
  }

  function Node(props) {
    const { value, k, path, depth, isIndex, ctx } = props;
    const branch = isBranch(value);
    const tt = valueType(value);
    const opened = ctx.expanded.has(path);
    const term = ctx.term;

    // search filter
    if (term && !deepMatch(k, value, term)) return null;
    const selfMatch = term && String(k).toLowerCase().indexOf(term) !== -1;
    const forceOpen = term ? true : opened;

    const onCopyPath = (e) => { e.stopPropagation(); copyText(path); ctx.onCopied(path, 'path'); };
    const onCopyVal = (e) => {
      e.stopPropagation();
      copyText(typeof value === 'string' ? value : JSON.stringify(value, null, 2));
      ctx.onCopied(path, 'value');
    };

    let preview = null;
    if (branch) {
      const n = Array.isArray(value) ? value.length : Object.keys(value).length;
      const label = Array.isArray(value)
        ? ctx.t('insp.items').replace('{n}', n)
        : ctx.t('insp.keys').replace('{n}', n);
      preview = (
        <span className={'omada-insp-summary' + (forceOpen ? ' is-open' : '')}>
          <span className="omada-insp-brace">{Array.isArray(value) ? '[' : '{'}</span>
          {!forceOpen && <span className="omada-insp-count">{label}</span>}
          {!forceOpen && <span className="omada-insp-brace">{Array.isArray(value) ? ']' : '}'}</span>}
        </span>
      );
    } else {
      const cls = 'omada-insp-val is-' + tt;
      const text = tt === 'string' ? '"' + value + '"' : String(value);
      preview = <span className={cls}>{text}</span>;
    }

    const copiedHere = ctx.copied && ctx.copied.path === path;

    return (
      <div className={'omada-insp-node' + (selfMatch ? ' is-match' : '')}>
        <div
          className={'omada-insp-line' + (branch ? ' is-branch' : '') + (copiedHere ? ' is-copied' : '')}
          style={{ paddingInlineStart: depth * 16 + 8 }}
          onClick={branch ? () => ctx.toggle(path) : onCopyPath}
          role="treeitem"
          aria-expanded={branch ? forceOpen : undefined}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); branch ? ctx.toggle(path) : onCopyPath(e); }
          }}
        >
          <span className="omada-insp-tw">
            {branch
              ? <Icon name={forceOpen ? 'chevron-down' : 'chevron-right'} size={14} />
              : <span className="omada-insp-dot" />}
          </span>
          {k != null && (
            <span className={'omada-insp-key' + (isIndex ? ' is-index' : '')}>{isIndex ? k : '"' + k + '"'}</span>
          )}
          {k != null && <span className="omada-insp-colon">:</span>}
          {preview}
          <span className="omada-insp-tools">
            {copiedHere
              ? <span className="omada-insp-copied">{ctx.t(ctx.copied.kind === 'value' ? 'insp.copiedval' : 'insp.copiedpath')}</span>
              : (
                <React.Fragment>
                  <Tooltip title={ctx.t('insp.copypath')}>
                    <button type="button" className="omada-insp-tbtn" onClick={onCopyPath} aria-label={ctx.t('insp.copypath')}>
                      <Icon name="corner-down-left" size={13} />
                    </button>
                  </Tooltip>
                  <Tooltip title={ctx.t('insp.copyval')}>
                    <button type="button" className="omada-insp-tbtn" onClick={onCopyVal} aria-label={ctx.t('insp.copyval')}>
                      <Icon name="copy" size={13} />
                    </button>
                  </Tooltip>
                </React.Fragment>
              )}
          </span>
        </div>

        {branch && forceOpen && (
          <div className="omada-insp-children" role="group">
            {(Array.isArray(value) ? value.map((v, i) => [i, v, true]) : Object.entries(value).map(([kk, vv]) => [kk, vv, false]))
              .map(([ck, cv, idx]) => (
                <Node key={path + '|' + ck} value={cv} k={ck} isIndex={idx}
                      path={childPath(path, ck, idx)} depth={depth + 1} ctx={ctx} />
              ))}
          </div>
        )}
      </div>
    );
  }

  function collectPaths(value, path, depth, maxDepth, acc) {
    if (!isBranch(value)) return acc;
    if (depth <= maxDepth) acc.push(path);
    const entries = Array.isArray(value) ? value.map((v, i) => [i, v, true]) : Object.entries(value).map(([k, v]) => [k, v, false]);
    entries.forEach(([k, v, idx]) => collectPaths(v, childPath(path, k, idx), depth + 1, maxDepth, acc));
    return acc;
  }

  function OmadaInspector(props) {
    const { useState, useMemo, useEffect } = React;
    const omada = window.useOmada ? window.useOmada() : null;
    const t = omada ? omada.t : (k) => k;

    const data = props.data;
    const rootPath = props.rootLabel || '';
    const defaultExpandDepth = props.defaultExpandDepth == null ? 1 : props.defaultExpandDepth;

    const initial = useMemo(
      () => new Set(collectPaths(data, rootPath, 0, defaultExpandDepth, [])),
      [data, defaultExpandDepth]   // rootPath stable
    );
    const [expanded, setExpanded] = useState(initial);
    useEffect(() => { setExpanded(initial); }, [initial]);

    const [copied, setCopied] = useState(null);
    const [term, setTerm] = useState('');

    const toggle = (p) => setExpanded((s) => {
      const n = new Set(s);
      if (n.has(p)) n.delete(p); else n.add(p);
      return n;
    });
    const expandAll = () => setExpanded(new Set(collectPaths(data, rootPath, 0, Infinity, [])));
    const collapseAll = () => setExpanded(new Set());
    const onCopied = (p, kind) => {
      setCopied({ path: p, kind });
      if (props.onCopyPath && kind === 'path') props.onCopyPath(p);
      clearTimeout(OmadaInspector._t);
      OmadaInspector._t = setTimeout(() => setCopied(null), 1300);
    };

    const ctx = {
      expanded, toggle, copied, onCopied, t,
      term: term.trim().toLowerCase(),
    };

    const cls = 'omada-insp' + (props.className ? ' ' + props.className : '');

    return (
      <div className={cls}>
        <div className="omada-insp-toolbar">
          {props.searchable !== false && (
            <Input allowClear size="small" value={term} onChange={(e) => setTerm(e.target.value)}
                   placeholder={t('insp.search')} prefix={<Icon name="search" size={14} />}
                   className="omada-insp-search" />
          )}
          <div className="omada-insp-tbgroup">
            <button type="button" className="omada-insp-toolbtn" onClick={expandAll}>
              <Icon name="chevron-down" size={14} />{t('insp.expandall')}
            </button>
            <button type="button" className="omada-insp-toolbtn" onClick={collapseAll}>
              <Icon name="chevron-up" size={14} />{t('insp.collapseall')}
            </button>
          </div>
        </div>
        <div className="omada-insp-tree" role="tree" dir="ltr">
          <Node value={data} k={props.rootKey != null ? props.rootKey : null}
                path={rootPath} depth={0} ctx={ctx} />
        </div>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.Inspector = OmadaInspector;
})();
