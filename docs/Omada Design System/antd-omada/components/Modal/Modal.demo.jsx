/* components/Modal/Modal.demo.jsx — window.OmadaDemos.Modal */
(function () {
  const { Modal, Button, Form, Input } = window.Omada;
  const { Icon } = window.Omada;
  const { Space } = window.antd;

  function ModalDemo() {
    const { lang, t } = window.useOmada();
    const { useState } = React;
    const [editOpen, setEditOpen] = useState(false);
    const { confirmDelete, confirmDiscard, info } = window.Omada.useModal();

    return (
      <>
        <div className="row">
          <span className="label">confirm</span>
          <Button variant="danger" icon={<Icon name="trash" size={16} />}
            onClick={() => confirmDelete({
              title: t('modal.deleteTitle'),
              content: t('modal.deleteBody'),
              okText: t('common.delete'),
              cancelText: t('common.cancel'),
            })}>
            {t('common.delete')}
          </Button>

          <Button variant="secondary"
            onClick={() => confirmDiscard({
              title: t('modal.unsavedTitle'),
              content: t('modal.unsavedBody'),
              okText: t('modal.discard'),
              cancelText: t('modal.keepEditing'),
            })}>
            {t('modal.unsavedTitle')}
          </Button>

          <Button variant="text" icon={<Icon name="info" size={16} />}
            onClick={() => info({ title: t('modal.infoTitle'), content: t('modal.infoBody'), okText: t('common.ok') })}>
            {t('modal.infoTitle')}
          </Button>
        </div>

        <div className="row">
          <span className="label">form modal</span>
          <Button variant="primary" onClick={() => setEditOpen(true)}>{t('drawer.editTitle')}</Button>
          <Modal
            open={editOpen}
            title={t('drawer.editTitle')}
            okText={t('common.save')}
            cancelText={t('common.cancel')}
            onOk={() => setEditOpen(false)}
            onCancel={() => setEditOpen(false)}
          >
            <Form layout="vertical" style={{ marginTop: 8 }}>
              <Form.Item label={t('field.siteName')} style={{ marginBottom: 16 }}>
                <Input defaultValue="HQ — Floor 3" />
              </Form.Item>
              <Form.Item label={t('field.email')} style={{ marginBottom: 0 }}>
                <Input placeholder={t('field.email.ph')} prefixIcon="bell" />
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Modal = ModalDemo;
})();
