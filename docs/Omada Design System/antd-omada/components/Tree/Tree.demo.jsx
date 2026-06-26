/* components/Tree/Tree.demo.jsx — Mounted by index.html. window.OmadaDemos.Tree */
(function () {
  const { Tree, Icon } = window.Omada;

  function ti(name) { return <Icon name={name} size={16} className="omada-tree-icon" />; }

  function TreeDemo() {
    const { t } = window.useOmada();
    const { useState } = React;
    const [checked, setChecked] = useState(['eap670', 'eap660']);

    // device hierarchy with leading type icons
    const deviceTree = [
      { key: 'hq', title: t('tree.hq'), icon: ti('map'), children: [
        { key: 'floor3', title: t('tree.floor3'), icon: ti('dashboard'), children: [
          { key: 'gw', title: t('tree.gateways'), icon: ti('gateway'), children: [
            { key: 'er7206', title: 'ER7206', icon: ti('gateway') },
          ] },
          { key: 'aps', title: t('tree.aps'), icon: ti('ap'), children: [
            { key: 'eap670', title: 'EAP670', icon: ti('ap') },
            { key: 'eap660', title: 'EAP660 HD', icon: ti('ap') },
          ] },
        ] },
        { key: 'floor4', title: t('tree.floor4'), icon: ti('dashboard'), children: [
          { key: 'sw', title: t('tree.switches'), icon: ti('switch'), children: [
            { key: 'sg2428', title: 'SG2428P', icon: ti('switch') },
          ] },
        ] },
      ] },
    ];

    // directory-style site picker
    const siteTree = [
      { key: 'all', title: t('tree.allSites'), children: [
        { key: 'hq2', title: t('tree.hq'), children: [
          { key: 'f3', title: t('tree.floor3'), isLeaf: true },
          { key: 'f4', title: t('tree.floor4'), isLeaf: true },
        ] },
        { key: 'lab', title: t('tree.branchLab'), isLeaf: true },
      ] },
    ];

    return (
      <div className="grid-2" style={{ alignItems: 'start' }}>
        <div>
          <div className="row"><span className="label">{t('tree.checkable')}</span></div>
          <Tree
            checkable
            showIcon
            defaultExpandAll
            checkedKeys={checked}
            onCheck={(keys) => setChecked(Array.isArray(keys) ? keys : keys.checked)}
            treeData={deviceTree}
          />
        </div>
        <div>
          <div className="row"><span className="label">{t('tree.directory')}</span></div>
          <Tree.DirectoryTree
            multiple
            defaultExpandAll
            defaultSelectedKeys={['f3']}
            treeData={siteTree}
          />
        </div>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Tree = TreeDemo;
})();
