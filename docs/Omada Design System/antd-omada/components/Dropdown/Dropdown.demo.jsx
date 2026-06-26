/* components/Dropdown/Dropdown.demo.jsx — Mounted by index.html. window.OmadaDemos.Dropdown */
(function () {
  const { Dropdown, Button, Icon } = window.Omada;
  const { Space } = window.antd;

  function DropdownDemo() {
    const { t, lang } = window.useOmada();

    const rowActions = {
      items: [
        { key: 'view',   icon: <Icon name="eye" size={16} />,    label: t('dd.viewDetails') },
        { key: 'rename', icon: <Icon name="edit" size={16} />,   label: t('dd.rename') },
        { key: 'move',   icon: <Icon name="move-to-site" size={16} />, label: t('dd.moveToSite') },
        { type: 'divider' },
        { key: 'reboot', icon: <Icon name="reboot" size={16} />, label: t('device.reboot') },
        { key: 'forget', icon: <Icon name="trash" size={16} />,  label: t('device.forget'), danger: true },
      ],
    };

    const withSub = {
      items: [
        { key: 'dup', icon: <Icon name="copy" size={16} />, label: t('dd.duplicate') },
        {
          key: 'move', icon: <Icon name="move-to-site" size={16} />, label: t('dd.moveToSite'),
          children: [
            { key: 'hq',  label: t('shell.site') },
            { key: 'lab', label: 'Branch — Lab' },
          ],
        },
        { type: 'divider' },
        { key: 'export', icon: <Icon name="export" size={16} />, label: t('common.export') },
      ],
    };

    return (
      <>
        <div className="row">
          <span className="label">row actions</span>
          <Dropdown menu={rowActions}>
            <Button variant="secondary" icon={<Icon name="more-horizontal" size={16} />}>
              {t('dd.menu')}
            </Button>
          </Dropdown>

          <Dropdown menu={rowActions} placement="bottomRight">
            <button type="button" className="ant-btn ant-btn-text ant-btn-icon-only" aria-label={t('dd.menu')}
                    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="more-vertical" size={18} />
            </button>
          </Dropdown>
        </div>

        <div className="row" style={{ marginTop: 6 }}>
          <span className="label">submenu</span>
          <Dropdown menu={withSub}>
            <Button variant="outline">
              <Space size={6}>{t('common.more')}<Icon name="chevron-down" size={16} /></Space>
            </Button>
          </Dropdown>
        </div>

        <div className="row" style={{ marginTop: 6 }}>
          <span className="label">button</span>
          <Dropdown.Button
            menu={rowActions}
            onClick={() => {}}
            icon={<Icon name="chevron-down" size={16} />}
          >
            {t('device.adopt')}
          </Dropdown.Button>
        </div>

        <div className="row" style={{ marginTop: 6 }}>
          <span className="label">hover</span>
          <Dropdown menu={withSub} trigger={['hover']}>
            <a onClick={(e) => e.preventDefault()} style={{ color: 'var(--omada-green-600,#009765)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              {t('dd.menu')}<Icon name="chevron-down" size={16} />
            </a>
          </Dropdown>
        </div>
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Dropdown = DropdownDemo;
})();
