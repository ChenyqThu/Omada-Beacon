/* components/Avatar/Avatar.demo.jsx — Mounted by index.html. window.OmadaDemos.Avatar */
(function () {
  const { Avatar } = window.Omada;

  function AvatarDemo() {
    return (
      <>
        <div className="row">
          <span className="label">size</span>
          <Avatar size={24} />
          <Avatar size={32} />
          <Avatar size={40} />
          <Avatar size={48} />
          <Avatar size={64} />
        </div>
        <div className="row">
          <span className="label">initials</span>
          <Avatar tone="brand">SJ</Avatar>
          <Avatar tone="blue">KM</Avatar>
          <Avatar tone="magenta">AL</Avatar>
          <Avatar tone="orange">RP</Avatar>
          <Avatar tone="neutral">TW</Avatar>
        </div>
        <div className="row">
          <span className="label">image</span>
          <Avatar size={32} src="../assets/omada-app-icon.png" />
          <Avatar size={48} src="../assets/omada-app-icon.png" />
          <Avatar size={48} shape="square" src="../assets/omada-app-icon.png" />
        </div>
        <div className="row">
          <span className="label">group</span>
          <Avatar.Group max={{ count: 3 }}>
            <Avatar tone="brand">SJ</Avatar>
            <Avatar tone="blue">KM</Avatar>
            <Avatar tone="magenta">AL</Avatar>
            <Avatar tone="orange">RP</Avatar>
            <Avatar tone="neutral">TW</Avatar>
          </Avatar.Group>
        </div>
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Avatar = AvatarDemo;
})();
