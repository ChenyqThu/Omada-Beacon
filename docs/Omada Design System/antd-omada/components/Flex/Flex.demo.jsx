/* components/Flex/Flex.demo.jsx — window.OmadaDemos.Flex */
(function () {
  const { Flex } = window.Omada;
  const OmadaIcon = window.OmadaIcon;

  // demo blocks — sized chips so the flex behaviour is legible
  function Box({ children, w = 56, h = 40, solid }) {
    return (
      <div className={'omada-flex-box' + (solid ? ' is-solid' : '')} style={{ width: w, height: h }}>
        {children}
      </div>
    );
  }
  function Track({ children, style }) {
    return <div className="omada-flex-track" style={style}>{children}</div>;
  }
  function L({ children }) {
    return <span className="label" style={{ width: 'auto', marginRight: 10 }}>{children}</span>;
  }

  function FlexDemo() {
    const { t } = window.useOmada();

    return (
      <>
        {/* justify */}
        <div className="row"><span className="label">justify</span></div>
        {['flex-start', 'center', 'space-between', 'space-around'].map((j) => (
          <div className="row" key={j}>
            <L>{j}</L>
            <Track>
              <Flex justify={j} style={{ width: '100%' }}>
                <Box solid>1</Box><Box>2</Box><Box>3</Box>
              </Flex>
            </Track>
          </div>
        ))}

        {/* align */}
        <div className="row" style={{ marginTop: 10 }}><span className="label">align</span></div>
        {['flex-start', 'center', 'flex-end'].map((a) => (
          <div className="row" key={a}>
            <L>{a}</L>
            <Track style={{ height: 76 }}>
              <Flex align={a} gap="middle" style={{ width: '100%', height: '100%' }}>
                <Box h={28}>1</Box><Box h={52} solid>2</Box><Box h={40}>3</Box>
              </Flex>
            </Track>
          </div>
        ))}

        {/* gap steps */}
        <div className="row" style={{ marginTop: 10 }}><span className="label">gap</span></div>
        {['small', 'middle', 'large'].map((g) => (
          <div className="row" key={g}>
            <L>{g}</L>
            <Track>
              <Flex gap={g}>
                <Box>1</Box><Box>2</Box><Box>3</Box><Box>4</Box>
              </Flex>
            </Track>
          </div>
        ))}

        {/* vertical + wrap */}
        <div className="grid-2" style={{ marginTop: 12, alignItems: 'start' }}>
          <div>
            <div className="row"><span className="label">vertical</span></div>
            <Track style={{ height: 'auto' }}>
              <Flex vertical gap="small">
                <Box w={120} solid><OmadaIcon name="dashboard" size={16} /></Box>
                <Box w={120}>2</Box>
                <Box w={120}>3</Box>
              </Flex>
            </Track>
          </div>
          <div>
            <div className="row"><span className="label">wrap</span></div>
            <Track style={{ height: 'auto' }}>
              <Flex wrap="wrap" gap="small">
                {Array.from({ length: 9 }).map((_, i) => <Box key={i} w={64}>{i + 1}</Box>)}
              </Flex>
            </Track>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 14, color: 'var(--fg-tertiary)', fontSize: 12 }}>
          <OmadaIcon name="info" size={14} />
          {t('flex.hint')}
        </div>
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Flex = FlexDemo;
})();
