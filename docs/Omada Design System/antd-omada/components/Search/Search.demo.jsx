/* components/Search/Search.demo.jsx — window.OmadaDemos.Search */
(function () {
  const { Search } = window.Omada;

  const DEVICES = [
    'EAP670 · 192.168.0.21', 'EAP650 · 192.168.0.22', 'ER7206 · 192.168.0.1',
    'SG2428P · 192.168.0.2', 'SG3210 · 192.168.0.3', 'OC200 · 192.168.0.10',
    'VIGI C540 · 192.168.0.51',
  ];

  function SearchDemo() {
    const { t } = window.useOmada();
    const [opts, setOpts] = React.useState([]);

    const handleSearch = (v) => {
      const q = (v || '').trim().toLowerCase();
      if (!q) { setOpts([]); return; }
      setOpts(DEVICES.filter((d) => d.toLowerCase().includes(q)).map((d) => ({ value: d })));
    };

    return (
      <>
        <div className="row"><span className="label">autocomplete</span>
          <Search options={opts} onSearch={handleSearch} debounce={250} width={300} />
        </div>

        <div className="row" style={{ marginTop: 8 }}><span className="label">plain · no list</span>
          <Search onSearch={() => {}} width={260} />
        </div>

        <div className="row" style={{ marginTop: 8 }}><span className="label">disabled</span>
          <Search disabled placeholder={t('search.disabled')} width={260} />
        </div>
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Search = SearchDemo;
})();
