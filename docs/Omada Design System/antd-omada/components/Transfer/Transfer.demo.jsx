/* components/Transfer/Transfer.demo.jsx — window.OmadaDemos.Transfer */
(function () {
  const { Transfer } = window.Omada;

  function TransferDemo() {
    const { t } = window.useOmada();
    const { useState } = React;

    const data = [
      { key: '1', title: 'EAP670' }, { key: '2', title: 'EAP660 HD' },
      { key: '3', title: 'ER7206' }, { key: '4', title: 'SG2428P' },
      { key: '5', title: 'EAP650' }, { key: '6', title: 'OC200' },
      { key: '7', title: 'ER605' }, { key: '8', title: 'SG2008P' },
      { key: '9', title: 'EAP610' }, { key: '10', title: 'VIGI C540' },
    ];

    const [target, setTarget] = useState(['1', '2', '3']);
    const [selected, setSelected] = useState([]);
    const [targetOne, setTargetOne] = useState(['1']);

    return (
      <>
        <div className="row" style={{ alignItems: 'flex-start' }}>
          <span className="label">assign</span>
          <Transfer
            dataSource={data}
            targetKeys={target}
            selectedKeys={selected}
            onChange={setTarget}
            onSelectChange={(s, t2) => setSelected([...s, ...t2])}
            render={(item) => item.title}
            titles={[t('transfer.source'), t('transfer.target')]}
            locale={{ searchPlaceholder: t('transfer.search.ph') }}
          />
        </div>
        <div className="row" style={{ alignItems: 'flex-start', marginTop: 18 }}>
          <span className="label">one-way</span>
          <Transfer
            oneWay
            dataSource={data.slice(0, 6)}
            targetKeys={targetOne}
            onChange={setTargetOne}
            render={(item) => item.title}
            titles={[t('transfer.source'), t('transfer.target')]}
            locale={{ searchPlaceholder: t('transfer.search.ph') }}
          />
        </div>
        <div className="row" style={{ alignItems: 'flex-start', marginTop: 18 }}>
          <span className="label">disabled</span>
          <Transfer
            disabled
            dataSource={data.slice(0, 5)}
            targetKeys={['1']}
            render={(item) => item.title}
            titles={[t('transfer.source'), t('transfer.target')]}
          />
        </div>
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Transfer = TransferDemo;
})();
