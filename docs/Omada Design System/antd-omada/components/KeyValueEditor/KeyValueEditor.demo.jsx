/* components/KeyValueEditor/KeyValueEditor.demo.jsx — window.OmadaDemos.KeyValueEditor */
(function () {
  const KeyValueEditor = window.Omada.KeyValueEditor;

  function KeyValueEditorDemo() {
    const { useState } = React;
    const ctx = window.useOmada();
    const t = ctx.t;

    const [headers, setHeaders] = useState([
      { key: 'X-Site-Id', value: 'sf-hq-01' },
      { key: 'Authorization', value: 'Bearer •••••' },
      { key: 'Content-Type', value: 'application/json' },
    ]);

    const [env, setEnv] = useState([
      { key: 'CONTROLLER_URL', value: 'https://omada.local' },
      { key: 'POLL_INTERVAL', value: '30s' },
    ]);

    return (
      <div className="omada-kv-demo">
        <div className="omada-kv-block">
          <span className="omada-kv-blocktitle">{t('kv.demo.headers')}</span>
          <KeyValueEditor value={headers} onChange={setHeaders}
                          keyPlaceholder={t('kv.demo.headerkey')} valuePlaceholder={t('kv.demo.headerval')} />
        </div>
        <div className="omada-kv-block">
          <span className="omada-kv-blocktitle">{t('kv.demo.env')}</span>
          <KeyValueEditor value={env} onChange={setEnv} size="small" />
        </div>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.KeyValueEditor = KeyValueEditorDemo;
})();
