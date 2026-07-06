/* ────────────────────────────────────────────────────────────────────────
   components/DataExport/DataExport.jsx — OmadaDataExport

   Turn a table into a file. The "export this view" affordance every console
   grows — CSV for spreadsheets, JSON for scripts, clipboard for a quick paste.
   antd has no export primitive, so this composes one over the DataTable:

     · Format toggle — CSV (RFC-4180 quoting: fields with comma / quote /
       newline are wrapped, inner quotes doubled) or JSON (pretty, 2-space).
     · Scope toggle — export the whole dataset or only the rows the user
       checked in the table.
     · DOWNLOAD really downloads — builds a Blob with the right MIME
       (text/csv · application/json), object-URL + a temporary <a download>,
       then revokes the URL. Filename gets the right extension + a date stamp.
     · COPY really copies — navigator.clipboard with an execCommand fallback;
       confirms via an App-context toast (useMessage).
     · A live PREVIEW pane shows exactly what will be written (first rows),
       with a row/byte count, so there are no surprises.

   Caller passes the same columns + data they gave the table; the board renders
   a selectable DataTable beside the export controls so selection drives scope.
   Only columns with a dataIndex are serialised (action columns are skipped).

   Chrome is theme-var driven with dark twins in omada-overrides.css; the code
   preview reuses the dark "snippet" surface shared with ThemeExport /
   PrintExport. No new colour.

   Figma: no dedicated node — an export ARCHITECTURE board over the DataTable
   (Batch 2). Glyphs are OmadaIcon (file-text / braces / download / copy).
   Exports: window.Omada.DataExport
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { useState, useMemo } = React;
  const { Segmented } = window.antd;
  const Icon = window.Omada.Icon;
  const Button = window.Omada.Button;

  function csvCell(v) {
    if (v === null || v === undefined) return '';
    const s = String(v);
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }

  function buildCsv(cols, rows) {
    const header = cols.map((c) => csvCell(c.title)).join(',');
    const body = rows.map((r) => cols.map((c) => csvCell(r[c.dataIndex])).join(',')).join('\n');
    return header + '\n' + body;
  }
  function buildJson(cols, rows) {
    const keys = cols.map((c) => c.dataIndex);
    const titleByKey = {};
    cols.forEach((c) => { titleByKey[c.dataIndex] = c.title; });
    const out = rows.map((r) => {
      const o = {};
      keys.forEach((k) => { o[k] = r[k] === undefined ? null : r[k]; });
      return o;
    });
    return JSON.stringify(out, null, 2);
  }

  function byteLen(s) {
    try { return new Blob([s]).size; } catch (_) { return s.length; }
  }
  function fmtBytes(n) {
    if (n < 1024) return n + ' B';
    return (n / 1024).toFixed(1) + ' KB';
  }

  function OmadaDataExport(props) {
    const className = props.className || '';
    const rest = Object.assign({}, props);
    delete rest.className; delete rest.columns; delete rest.data;
    delete rest.filename; delete rest.previewRows;

    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;
    const msg = window.Omada.useMessage ? window.Omada.useMessage() : null;

    const columns = (props.columns || []).filter((c) => c.dataIndex);
    const data = props.data || [];
    const previewRows = props.previewRows || 4;
    const filename = props.filename || 'omada-export';

    const [format, setFormat] = useState('csv');
    const [scope, setScope] = useState('all');
    const [selectedKeys, setSelectedKeys] = useState([]);

    const rows = useMemo(() => (
      scope === 'selected' && selectedKeys.length
        ? data.filter((r) => selectedKeys.includes(r.key))
        : data
    ), [scope, selectedKeys, data]);

    const serialized = useMemo(() => (
      format === 'csv' ? buildCsv(columns, rows) : buildJson(columns, rows)
    ), [format, columns, rows]);

    const ext = format === 'csv' ? 'csv' : 'json';
    const mime = format === 'csv' ? 'text/csv;charset=utf-8' : 'application/json;charset=utf-8';
    const stamp = new Date().toISOString().slice(0, 10);
    const fullName = filename + '-' + stamp + '.' + ext;

    const download = () => {
      try {
        const blob = new Blob([serialized], { type: mime });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = fullName;
        document.body.appendChild(a); a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        if (msg) msg.success(t('dxp.downloaded') + ' · ' + fullName);
      } catch (e) {
        if (msg) msg.error(t('dxp.failed'));
      }
    };

    const copy = async () => {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(serialized);
        } else {
          const ta = document.createElement('textarea');
          ta.value = serialized; ta.style.position = 'fixed'; ta.style.opacity = '0';
          document.body.appendChild(ta); ta.select(); document.execCommand('copy');
          document.body.removeChild(ta);
        }
        if (msg) msg.success(t('dxp.copied') + ' · ' + rows.length + ' ' + t('dxp.rows'));
      } catch (e) {
        if (msg) msg.error(t('dxp.failed'));
      }
    };

    const SelectableTable = window.Omada.DataTable;
    const previewText = rows.length
      ? (format === 'csv'
          ? buildCsv(columns, rows.slice(0, previewRows)) + (rows.length > previewRows ? '\n…' : '')
          : buildJson(columns, rows.slice(0, previewRows)).replace(/\n\]$/, rows.length > previewRows ? ',\n  …\n]' : '\n]'))
      : t('dxp.noRows');

    return (
      <div className={('omada-dxp ' + className).trim()} {...rest}>
        <div className="omada-dxp-grid">

          {/* ── source table (drives selection) ── */}
          <div className="omada-dxp-tablecol">
            <div className="omada-dxp-collabel">
              <Icon name="table" size={15} />{t('dxp.source')}
            </div>
            <SelectableTable
              columns={props.columns}
              dataSource={data}
              size="small"
              pagination={false}
              rowSelection={{
                selectedRowKeys: selectedKeys,
                onChange: (keys) => { setSelectedKeys(keys); if (keys.length) setScope('selected'); },
              }}
            />
          </div>

          {/* ── export controls + preview ── */}
          <div className="omada-dxp-ctrlcol">
            <div className="omada-dxp-ctrl">
              <div className="omada-dxp-ctrllabel">{t('dxp.format')}</div>
              <Segmented
                value={format}
                onChange={setFormat}
                options={[
                  { value: 'csv',  label: <span className="omada-dxp-seg"><Icon name="file-text" size={15} />CSV</span> },
                  { value: 'json', label: <span className="omada-dxp-seg"><Icon name="braces" size={15} />JSON</span> },
                ]}
                block
              />
            </div>
            <div className="omada-dxp-ctrl">
              <div className="omada-dxp-ctrllabel">{t('dxp.scope')}</div>
              <Segmented
                value={scope}
                onChange={setScope}
                options={[
                  { value: 'all',      label: t('dxp.all') + ' (' + data.length + ')' },
                  { value: 'selected', label: t('dxp.selected') + ' (' + selectedKeys.length + ')', disabled: !selectedKeys.length },
                ]}
                block
              />
            </div>

            <div className="omada-dxp-previewwrap">
              <div className="omada-dxp-previewbar">
                <span className="omada-dxp-previewlabel">
                  <Icon name={format === 'csv' ? 'file-text' : 'braces'} size={14} />
                  <code>{fullName}</code>
                </span>
                <span className="omada-dxp-meta">{rows.length} {t('dxp.rows')} · {fmtBytes(byteLen(serialized))}</span>
              </div>
              <pre className="omada-dxp-preview"><code>{previewText}</code></pre>
            </div>

            <div className="omada-dxp-actions">
              <Button variant="primary" icon={<Icon name="download" size={16} />} onClick={download} disabled={!rows.length}>
                {t('dxp.download')}
              </Button>
              <Button variant="outline" icon={<Icon name="copy" size={16} />} onClick={copy} disabled={!rows.length}>
                {t('dxp.copy')}
              </Button>
            </div>
          </div>

        </div>
        <div className="omada-dxp-note">{t('dxp.note')}</div>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.DataExport = OmadaDataExport;
})();
