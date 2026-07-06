/* components/Steps/Steps.demo.jsx — Mounted by index.html. window.OmadaDemos.Steps */
(function () {
  const { Steps, Button, Icon } = window.Omada;
  const { Space } = window.antd;

  function StepsDemo() {
    const { t, lang } = window.useOmada();
    const [current, setCurrent] = React.useState(1);

    const wizard = [
      { title: t('steps.select'),    description: t('steps.select.desc') },
      { title: t('steps.configure'), description: t('steps.configure.desc') },
      { title: t('steps.review'),    description: t('steps.review.desc') },
      { title: t('steps.done'),      description: t('steps.done.desc') },
    ];

    return (
      <>
        <div className="row"><span className="label">horizontal</span></div>
        <Steps current={current} items={wizard} style={{ maxWidth: 760 }} />
        <div className="row" style={{ marginTop: 14 }}>
          <Space>
            <Button variant="secondary" disabled={current === 0}
                    icon={<Icon name="chevron-left" size={16} />}
                    onClick={() => setCurrent((c) => Math.max(0, c - 1))}>
              {t('steps.prev')}
            </Button>
            <Button variant="primary" disabled={current >= wizard.length - 1}
                    onClick={() => setCurrent((c) => Math.min(wizard.length - 1, c + 1))}>
              {t('steps.next')}
            </Button>
          </Space>
        </div>

        <div className="row" style={{ marginTop: 22 }}><span className="label">small · error</span></div>
        <Steps size="small" current={1} status="error" style={{ maxWidth: 620 }}
          items={[
            { title: t('steps.select') },
            { title: t('steps.configure') },
            { title: t('steps.review') },
            { title: t('steps.done') },
          ]} />

        <div className="row" style={{ marginTop: 22 }}><span className="label">loading</span></div>
        <Steps current={1} style={{ maxWidth: 620 }}
          items={[
            { title: t('steps.select') },
            { title: t('steps.configure'), icon: <Icon name="refresh" size={22} className="omada-spin" /> },
            { title: t('steps.review') },
          ]} />

        <div className="row" style={{ marginTop: 22 }}><span className="label">vertical</span></div>
        <Steps direction="vertical" current={1} items={wizard} style={{ maxWidth: 420 }} />
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Steps = StepsDemo;
})();
