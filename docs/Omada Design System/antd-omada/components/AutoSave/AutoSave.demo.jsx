/* components/AutoSave/AutoSave.demo.jsx — window.OmadaDemos.AutoSave */
(function () {
  const AutoSave = window.Omada.AutoSave;
  const { Input, Button } = window.antd;

  function AutoSaveDemo() {
    const { useState, useRef } = React;
    const ctx = window.useOmada();
    const t = ctx.t;

    const [text, setText] = useState('Closet rack B · uplink to core SW-Core-01 · do not power-cycle during business hours.');
    const [status, setStatus] = useState('saved');
    const [savedAt, setSavedAt] = useState(Date.now() - 8000);
    const timer = useRef(null);

    const onType = (e) => {
      setText(e.target.value);
      setStatus('saving');
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => { setStatus('saved'); setSavedAt(Date.now()); }, 1100);
    };

    const simConflict = () => { if (timer.current) clearTimeout(timer.current); setStatus('conflict'); };
    const simError = () => { if (timer.current) clearTimeout(timer.current); setStatus('error'); };
    const reset = () => { setStatus('saved'); setSavedAt(Date.now()); };

    const onResolve = (choice) => {
      // mine/theirs commit, review would open a DiffView in a real app
      if (choice === 'review') { setStatus('conflict'); return; }
      setStatus('saved'); setSavedAt(Date.now());
    };

    return (
      <div className="omada-as-demo">
        <div className="omada-as-editor">
          <div className="omada-as-editorhead">
            <span className="omada-as-fieldlabel">{t('as.demo.label')}</span>
            <AutoSave status={status} savedAt={savedAt} onResolve={onResolve} onRetry={reset} />
          </div>
          <Input.TextArea value={text} onChange={onType} autoSize={{ minRows: 3, maxRows: 6 }}
                          placeholder={t('as.demo.placeholder')} variant="filled" />
        </div>

        <div className="omada-as-controls">
          <span className="omada-as-controlslabel">{t('as.demo.try')}</span>
          <Button size="small" onClick={simConflict}>{t('as.demo.conflict')}</Button>
          <Button size="small" onClick={simError}>{t('as.demo.errsim')}</Button>
          <Button size="small" type="text" onClick={reset}>{t('as.demo.reset')}</Button>
        </div>

        {/* a static row of every chip state for the spec */}
        <div className="omada-as-states">
          {['idle', 'saving', 'saved', 'error'].map((s) => (
            <div className="omada-as-statecell" key={s}>
              <AutoSave status={s} savedAt={Date.now() - 12000} onRetry={() => {}} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.AutoSave = AutoSaveDemo;
})();
