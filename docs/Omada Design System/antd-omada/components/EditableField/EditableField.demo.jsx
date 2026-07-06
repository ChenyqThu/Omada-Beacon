/* components/EditableField/EditableField.demo.jsx — window.OmadaDemos.EditableField */
(function () {
  const EditableField = window.Omada.EditableField;

  function EditableFieldDemo() {
    const { useState } = React;
    const ctx = window.useOmada();
    const t = ctx.t;

    const [rec, setRec] = useState({
      name: 'SW-Core-01',
      location: 'IDF-2 · Rack B',
      role: 'core',
      ports: 28,
      notes: '',
    });
    const set = (k) => (v) => setRec((r) => Object.assign({}, r, { [k]: v }));

    const roleOpts = [
      { value: 'core', label: t('ef.role.core') },
      { value: 'access', label: t('ef.role.access') },
      { value: 'edge', label: t('ef.role.edge') },
    ];

    const reqText = (v) => (!v || !String(v).trim() ? t('ef.required') : null);
    const portRule = (v) => (v == null || v < 0 || v > 48 ? t('ef.invalidports') : null);

    const rows = [
      { label: t('ef.f.name'), node: <EditableField value={rec.name} validate={reqText} onCommit={set('name')} /> },
      { label: t('ef.f.location'), node: <EditableField value={rec.location} onCommit={set('location')} /> },
      { label: t('ef.f.role'), node: <EditableField type="select" value={rec.role} options={roleOpts} onCommit={set('role')} /> },
      { label: t('ef.f.ports'), node: <EditableField type="number" value={rec.ports} min={0} max={48} validate={portRule} onCommit={set('ports')} /> },
      { label: t('ef.f.notes'), node: <EditableField value={rec.notes} placeholder={t('ef.f.notesph')} onCommit={set('notes')} /> },
    ];

    return (
      <div className="omada-ef-demo">
        <div className="omada-ef-card">
          {rows.map((r, i) => (
            <div className="omada-ef-listrow" key={i}>
              <span className="omada-ef-listlabel">{r.label}</span>
              <span className="omada-ef-listval">{r.node}</span>
            </div>
          ))}
        </div>
        <p className="omada-ef-hint">{t('ef.hint')}</p>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.EditableField = EditableFieldDemo;
})();
