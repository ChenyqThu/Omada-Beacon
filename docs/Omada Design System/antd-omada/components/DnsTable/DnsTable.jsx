/* ────────────────────────────────────────────────────────────────────────
   components/DnsTable/DnsTable.jsx — OmadaDnsTable

   A RECORD-TYPE-AWARE editable DNS table: rows show host (mono) ·
   type chip (tone per type) · value (mono) · TTL · edit/delete. Editing
   (or adding) swaps the row for inline controls where the TYPE drives
   the value field's placeholder AND validation — A → IPv4, AAAA → IPv6,
   CNAME → hostname, MX → "priority host", TXT → free text. Invalid
   values show a localized reason and block save.

   Distinct from DataGrid (Batch 20 — generic spreadsheet inline-edit)
   and TableInlineCreate (Batch 24): the schema, not the grid, is the
   point — per-type editors and validators.

   Token-driven, dark twin, i18n. Hosts/values render LTR in RTL.
   Figma: no dedicated frame — row anatomy follows Table/Tag tokens.
   Exports: window.Omada.DnsTable
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { Select, Input, InputNumber, Button, Tooltip } = window.antd;

  const TYPES = ['A', 'AAAA', 'CNAME', 'MX', 'TXT'];
  const PLACEHOLDER = {
    A: '192.168.0.10',
    AAAA: 'fd00::10',
    CNAME: 'web.acme.local',
    MX: '10 mail.acme.local',
    TXT: 'v=spf1 mx -all',
  };
  const V4 = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  const V6 = /^([0-9a-fA-F]{0,4}:){1,7}[0-9a-fA-F]{0,4}$/;
  const HOST = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.?$/;

  function validate(type, value) {
    if (!value) return 'dnst.invalid.empty';
    if (type === 'A') {
      const m = V4.exec(value);
      if (!m) return 'dnst.invalid.a';
      for (let i = 1; i <= 4; i++) { if (+m[i] > 255) return 'dnst.invalid.a'; }
      return null;
    }
    if (type === 'AAAA') return V6.test(value) && value.indexOf(':') >= 0 ? null : 'dnst.invalid.aaaa';
    if (type === 'CNAME') return HOST.test(value) ? null : 'dnst.invalid.host';
    if (type === 'MX') {
      const m = /^(\d{1,3})\s+(\S+)$/.exec(value);
      return m && HOST.test(m[2]) ? null : 'dnst.invalid.mx';
    }
    return null;
  }

  function OmadaDnsTable(props) {
    const { useState } = React;
    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;

    const [records, setRecords] = useState(function () { return props.defaultRecords || []; });
    const [editId, setEditId] = useState(null);   // record id | 'new' | null
    const [draft, setDraft] = useState(null);
    const [touched, setTouched] = useState(false);

    function startEdit(rec) {
      setEditId(rec.id);
      setDraft({ host: rec.host, type: rec.type, value: rec.value, ttl: rec.ttl });
      setTouched(false);
    }
    function startAdd() {
      setEditId('new');
      setDraft({ host: '', type: 'A', value: '', ttl: 300 });
      setTouched(false);
    }
    function cancel() { setEditId(null); setDraft(null); }
    function remove(id) {
      const next = records.filter(function (r) { return r.id !== id; });
      setRecords(next);
      if (props.onChange) props.onChange(next);
    }
    function save() {
      setTouched(true);
      if (!draft.host || validate(draft.type, draft.value)) return;
      let next;
      if (editId === 'new') {
        next = records.concat([Object.assign({ id: 'r' + Date.now() }, draft)]);
      } else {
        next = records.map(function (r) { return r.id === editId ? Object.assign({}, r, draft) : r; });
      }
      setRecords(next);
      if (props.onChange) props.onChange(next);
      cancel();
    }

    const valueError = draft && touched ? validate(draft.type, draft.value) : null;
    const hostError = draft && touched && !draft.host ? 'dnst.invalid.empty' : null;

    function editorRow() {
      return (
        <tr className="omada-dnst-editrow">
          <td>
            <Input
              className={'omada-dnst-mono' + (hostError ? ' omada-dnst-haserr' : '')}
              value={draft.host} placeholder="nas"
              onChange={function (e) { setDraft(Object.assign({}, draft, { host: e.target.value })); }}
            />
            {hostError ? <div className="omada-dnst-err">{t(hostError)}</div> : null}
          </td>
          <td>
            <Select
              value={draft.type} style={{ width: '100%' }}
              options={TYPES.map(function (x) { return { value: x, label: x }; })}
              onChange={function (v) { setDraft(Object.assign({}, draft, { type: v, value: '' })); setTouched(false); }}
            />
          </td>
          <td>
            <Input
              className={'omada-dnst-mono' + (valueError ? ' omada-dnst-haserr' : '')}
              value={draft.value} placeholder={PLACEHOLDER[draft.type]}
              onChange={function (e) { setDraft(Object.assign({}, draft, { value: e.target.value })); }}
            />
            {valueError ? <div className="omada-dnst-err">{t(valueError)}</div> : null}
          </td>
          <td>
            <InputNumber
              className="omada-dnst-mono" min={30} max={86400} step={30}
              value={draft.ttl} style={{ width: '100%' }}
              onChange={function (v) { setDraft(Object.assign({}, draft, { ttl: v })); }}
            />
          </td>
          <td className="omada-dnst-actions">
            <Button size="small" type="primary" onClick={save}>{t('common.save')}</Button>
            <Button size="small" onClick={cancel}>{t('common.cancel')}</Button>
          </td>
        </tr>
      );
    }

    return (
      <div className={'omada-dnst' + (props.className ? ' ' + props.className : '')}>
        <table className="omada-dnst-table">
          <thead>
            <tr>
              <th>{t('dnst.host')}</th>
              <th>{t('dnst.type')}</th>
              <th>{t('dnst.value')}</th>
              <th>TTL</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {records.map(function (r) {
              if (editId === r.id) return <React.Fragment key={r.id}>{editorRow()}</React.Fragment>;
              return (
                <tr key={r.id}>
                  <td className="omada-dnst-mono omada-dnst-host">{r.host}</td>
                  <td><span className={'omada-dnst-type is-' + r.type.toLowerCase()}>{r.type}</span></td>
                  <td className="omada-dnst-mono omada-dnst-val">{r.value}</td>
                  <td className="omada-dnst-mono omada-dnst-ttl">{r.ttl}</td>
                  <td className="omada-dnst-actions">
                    <Tooltip title={t('common.edit')}>
                      <button type="button" className="omada-dnst-iconbtn" aria-label={t('common.edit')}
                              onClick={function () { startEdit(r); }} disabled={editId != null}>
                        <window.OmadaIcon name="edit" size={14} />
                      </button>
                    </Tooltip>
                    <Tooltip title={t('common.delete')}>
                      <button type="button" className="omada-dnst-iconbtn is-danger" aria-label={t('common.delete')}
                              onClick={function () { remove(r.id); }} disabled={editId != null}>
                        <window.OmadaIcon name="trash" size={14} />
                      </button>
                    </Tooltip>
                  </td>
                </tr>
              );
            })}
            {editId === 'new' ? editorRow() : null}
          </tbody>
        </table>
        <div className="omada-dnst-foot">
          <Button size="small" icon={<window.OmadaIcon name="plus" size={13} />}
                  onClick={startAdd} disabled={editId != null}>
            {t('dnst.add')}
          </Button>
        </div>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.DnsTable = OmadaDnsTable;
})();
