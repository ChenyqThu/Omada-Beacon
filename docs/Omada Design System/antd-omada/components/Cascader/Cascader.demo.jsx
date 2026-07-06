/* components/Cascader/Cascader.demo.jsx — window.OmadaDemos.Cascader */
(function () {
  const { Cascader } = window.Omada;

  function CascaderDemo() {
    const { t } = window.useOmada();

    const options = [
      { value: 'americas', label: t('casc.americas'), children: [
        { value: 'us', label: t('casc.us'), children: [
          { value: 'sf', label: t('casc.sf'), children: [{ value: 'siteA', label: t('casc.siteA') }] },
          { value: 'nyc', label: t('casc.nyc'), children: [{ value: 'siteB', label: t('casc.siteB') }] },
        ] },
      ] },
      { value: 'emea', label: t('casc.emea'), children: [
        { value: 'de', label: t('casc.de'), children: [
          { value: 'berlin', label: t('casc.berlin') },
          { value: 'munich', label: t('casc.munich') },
        ] },
      ] },
      { value: 'apac', label: t('casc.apac'), children: [
        { value: 'sg', label: t('casc.sg'), children: [
          { value: 'singapore', label: t('casc.singapore') },
        ] },
      ] },
    ];

    return (
      <>
        <div className="row">
          <span className="label">basic</span>
          <Cascader options={options} defaultValue={['americas', 'us', 'sf', 'siteA']}
            placeholder={t('casc.region.ph')} style={{ width: 320 }} />
        </div>
        <div className="row">
          <span className="label">changeOnSelect</span>
          <Cascader options={options} changeOnSelect allowClear
            placeholder={t('casc.region.ph')} style={{ width: 320 }} />
        </div>
        <div className="row">
          <span className="label">search</span>
          <Cascader options={options} showSearch
            placeholder={t('casc.search.ph')} style={{ width: 320 }} />
        </div>
        <div className="row">
          <span className="label">multiple</span>
          <Cascader options={options} multiple maxTagCount="responsive"
            defaultValue={[['emea', 'de', 'berlin'], ['apac', 'sg', 'singapore']]}
            placeholder={t('casc.region.ph')} style={{ width: 320 }} />
        </div>
        <div className="row">
          <span className="label">disabled</span>
          <Cascader options={options} disabled defaultValue={['apac', 'sg', 'singapore']} style={{ width: 320 }} />
        </div>
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Cascader = CascaderDemo;
})();
