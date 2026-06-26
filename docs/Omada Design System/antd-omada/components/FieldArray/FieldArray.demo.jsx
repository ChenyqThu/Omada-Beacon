/* components/FieldArray/FieldArray.demo.jsx — window.OmadaDemos.FieldArray */
(function () {
  const FieldArray = window.Omada.FieldArray;
  const Icon = window.Omada.Icon;
  const { Button, App } = window.antd;

  function FieldArrayDemo() {
    const { useState } = React;
    const ctx = window.useOmada();
    const t = ctx.t;
    const appApi = App.useApp ? App.useApp() : null;
    const msg = appApi && appApi.message ? appApi.message : { success: () => {}, error: () => {} };

    const protoOpts = [
      { label: 'TCP', value: 'tcp' },
      { label: 'UDP', value: 'udp' },
      { label: 'TCP/UDP', value: 'both' },
    ];

    const fields = [
      { name: 'name', label: t('fa.f.name'), type: 'text', placeholder: t('fa.f.name.ph'), required: true },
      { name: 'ext', label: t('fa.f.ext'), type: 'number', placeholder: '0', min: 1, max: 65535, width: '110px', required: true },
      { name: 'int', label: t('fa.f.int'), type: 'number', placeholder: '0', min: 1, max: 65535, width: '110px', required: true },
      { name: 'proto', label: t('fa.f.proto'), type: 'select', options: protoOpts, width: '130px' },
    ];

    const [rows, setRows] = useState([
      { name: 'Web server', ext: 8080, int: 80, proto: 'tcp' },
      { name: 'RTSP camera', ext: 554, int: 554, proto: 'both' },
    ]);
    const [showVal, setShowVal] = useState(false);

    const newRow = () => ({ name: '', ext: null, int: null, proto: 'tcp' });

    const save = () => {
      const bad = rows.some((r) => !r.name || r.ext == null || r.int == null);
      setShowVal(true);
      if (bad) { msg.error(t('fa.toast.invalid')); return; }
      msg.success(t('fa.toast.saved').replace('{n}', rows.length));
    };

    return (
      <div className="omada-fa-demo">
        <span className="omada-fa-blocktitle">{t('fa.demo.title')}</span>
        <FieldArray
          fields={fields}
          value={rows}
          onChange={(next) => { setRows(next); }}
          newRow={newRow}
          min={1}
          max={8}
          showValidation={showVal}
          addLabel={t('fa.f.addrule')}
        />
        <div className="omada-fa-savebar">
          <Button type="text" size="small" icon={<Icon name="refresh" size={14} />}
                  onClick={() => { setRows([newRow()]); setShowVal(false); }}>
            {t('fa.demo.reset')}
          </Button>
          <Button type="primary" icon={<Icon name="save" size={15} />} onClick={save}>
            {t('fa.demo.save')}
          </Button>
        </div>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.FieldArray = FieldArrayDemo;
})();
