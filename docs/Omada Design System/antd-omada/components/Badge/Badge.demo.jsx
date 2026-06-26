/* components/Badge/Badge.demo.jsx — Mounted by index.html. window.OmadaDemos.Badge */
(function () {
  const { Badge, Button } = window.Omada;
  const { Icon } = window.Omada;
  const { Space } = window.antd;

  function IconPlate({ name }) {
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: 36, height: 36, borderRadius: 8,
        background: 'rgba(127,127,127,0.14)', color: 'inherit',
      }}>
        <Icon name={name} size={20} />
      </span>
    );
  }

  function BadgeDemo() {
    const { t } = window.useOmada();
    return (
      <>
        <div className="row">
          <span className="label">count</span>
          <Badge count={5}><IconPlate name="bell" /></Badge>
          <Badge count={25}><IconPlate name="alerts" /></Badge>
          <Badge count={99}><IconPlate name="devices" /></Badge>
          <Badge count={128} overflowCount={99}><IconPlate name="clients" /></Badge>
        </div>
        <div className="row">
          <span className="label">dot</span>
          <Badge dot><IconPlate name="bell" /></Badge>
          <Badge dot tone="success"><IconPlate name="cloud" /></Badge>
          <Badge dot tone="warning"><IconPlate name="gateway" /></Badge>
        </div>
        <div className="row">
          <span className="label">standalone</span>
          <Badge count={8} />
          <Badge count={42} tone="success" />
          <Badge count={6} tone="warning" />
          <Badge count={17} tone="error" />
          <Badge count={0} showZero />
        </div>
        <div className="row">
          <span className="label">status</span>
          <Space size={18} wrap>
            <Badge status="success" text={t('status.online')} />
            <Badge status="processing" text={t('status.adopting')} />
            <Badge status="warning" text={t('status.pending')} />
            <Badge status="error" text={t('status.disconnected')} />
            <Badge status="default" text={t('status.offline')} />
          </Space>
        </div>
        <div className="row">
          <span className="label">ribbon</span>
          <Badge.Ribbon text="PRO" color="#0069CB">
            <div style={{ width: 200, height: 56, borderRadius: 8, border: '1px solid var(--border-default,#ECECEC)' }} />
          </Badge.Ribbon>
        </div>
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Badge = BadgeDemo;
})();
