/* components/Skeleton/Skeleton.demo.jsx — window.OmadaDemos.Skeleton */
(function () {
  const { Skeleton, Button, Icon } = window.Omada;
  const { Space, Divider, Switch } = window.antd;
  const { useState } = React;

  function SkeletonDemo() {
    const { t, lang } = window.useOmada();
    const L = (en, zh) => (lang === 'zh' ? zh : en);
    const [active, setActive] = useState(true);

    return (
      <>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <span className="label">shimmer</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--fg-secondary,#636363)' }}>
            {L('Active shimmer', '微光动画')}
            <Switch size="small" checked={active} onChange={setActive} />
          </span>
        </div>

        <div className="grid-2" style={{ marginTop: 4 }}>
          <div>
            <div className="row"><span className="label">paragraph</span></div>
            <Skeleton active={active} paragraph={{ rows: 3 }} />
          </div>
          <div>
            <div className="row"><span className="label">avatar + title</span></div>
            <Skeleton active={active} avatar paragraph={{ rows: 2 }} />
          </div>
        </div>

        <Divider style={{ margin: '22px 0 18px' }} />

        <div className="row"><span className="label">blocks</span></div>
        <Space wrap size={16} align="center">
          <Skeleton.Button active={active} />
          <Skeleton.Button active={active} shape="round" />
          <Skeleton.Avatar active={active} />
          <Skeleton.Avatar active={active} shape="square" />
          <Skeleton.Input active={active} />
          <Skeleton.Image active={active} />
        </Space>

        <Divider style={{ margin: '22px 0 18px' }} />

        <div className="row"><span className="label">card shell</span></div>
        <div style={{
          maxWidth: 420, padding: 18, borderRadius: 8,
          border: '1px solid var(--border-default)',
        }}>
          <Skeleton.Node active={active} style={{ width: '100%', height: 96, borderRadius: 6 }}>
            <Icon name="insights" size={28} style={{ color: 'var(--fg-quaternary,#CCC)' }} />
          </Skeleton.Node>
          <div style={{ marginTop: 14 }}>
            <Skeleton active={active} title={false} paragraph={{ rows: 2, width: ['100%', '60%'] }} />
          </div>
        </div>
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Skeleton = SkeletonDemo;
})();
