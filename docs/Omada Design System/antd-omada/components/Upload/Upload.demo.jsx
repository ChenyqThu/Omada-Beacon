/* components/Upload/Upload.demo.jsx — window.OmadaDemos.Upload */
(function () {
  const { Upload, Button, Icon } = window.Omada;

  function UploadDemo() {
    const { t } = window.useOmada();

    const seededList = [
      { uid: '1', name: 'ER7206_1.3.0.bin', status: 'done' },
      { uid: '2', name: 'site-config.cfg', status: 'uploading', percent: 42 },
      { uid: '3', name: 'eap670_backup.cfg', status: 'error' },
    ];
    const pics = [
      { uid: 'p1', name: 'floorplan.png', status: 'done', thumbUrl: '../assets/omada-app-icon.png' },
    ];

    return (
      <>
        <div className="row">
          <span className="label">button</span>
          <Upload defaultFileList={seededList}>
            <Button variant="outline" icon={<Icon name="upload" size={16} />}>{t('upload.button')}</Button>
          </Upload>
        </div>

        <div className="row" style={{ alignItems: 'flex-start', marginTop: 6 }}>
          <span className="label">drag</span>
          <div style={{ width: 460 }}>
            <Upload variant="drag" multiple defaultFileList={[seededList[0]]}>
              <p style={{ margin: 0 }}>
                <span className="omada-upload-icon"><Icon name="upload" size={36} /></span>
              </p>
              <p style={{ fontSize: 14, fontWeight: 500, margin: '10px 0 4px' }}>{t('upload.drag')}</p>
              <p style={{ fontSize: 12, color: 'var(--fg-tertiary,#999)', margin: 0 }}>{t('upload.hint')}</p>
            </Upload>
          </div>
        </div>

        <div className="row" style={{ alignItems: 'flex-start', marginTop: 6 }}>
          <span className="label">picture</span>
          <Upload listType="picture-card" defaultFileList={pics}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <Icon name="plus" size={18} />
              <span style={{ fontSize: 12 }}>{t('common.upload')}</span>
            </div>
          </Upload>
        </div>

        <div className="row">
          <span className="label">disabled</span>
          <Upload disabled defaultFileList={[seededList[0]]}>
            <Button variant="outline" disabled icon={<Icon name="upload" size={16} />}>{t('upload.button')}</Button>
          </Upload>
        </div>
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Upload = UploadDemo;
})();
