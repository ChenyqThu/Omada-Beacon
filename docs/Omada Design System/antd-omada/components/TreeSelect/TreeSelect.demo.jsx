/* components/TreeSelect/TreeSelect.demo.jsx — window.OmadaDemos.TreeSelect */
(function () {
  const { TreeSelect } = window.Omada;

  function TreeSelectDemo() {
    const { t } = window.useOmada();
    const { useState } = React;
    const [single, setSingle] = useState('f3');
    const [multi, setMulti] = useState(['f3', 'f4']);

    const treeData = [
      { value: 'all', title: t('tree.allSites'), children: [
        { value: 'hq', title: t('tree.hq'), children: [
          { value: 'f3', title: t('tree.floor3') },
          { value: 'f4', title: t('tree.floor4') },
        ] },
        { value: 'lab', title: t('tree.branchLab') },
      ] },
    ];

    const common = { treeData, treeDefaultExpandAll: true, style: { width: 280 } };

    return (
      <>
        <div className="row">
          <span className="label">single</span>
          <TreeSelect {...common} value={single} onChange={setSingle}
            placeholder={t('ts.assignSite.ph')} />
        </div>
        <div className="row">
          <span className="label">multiple</span>
          <TreeSelect {...common} multiple treeCheckable
            showCheckedStrategy={TreeSelect.SHOW_PARENT}
            value={multi} onChange={setMulti}
            placeholder={t('ts.multiple.ph')}
            maxTagCount="responsive" />
        </div>
        <div className="row">
          <span className="label">search</span>
          <TreeSelect {...common} showSearch treeNodeFilterProp="title"
            defaultValue="lab" placeholder={t('casc.search.ph')} allowClear />
        </div>
        <div className="row">
          <span className="label">disabled</span>
          <TreeSelect {...common} disabled defaultValue="f3" />
        </div>
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.TreeSelect = TreeSelectDemo;
})();
