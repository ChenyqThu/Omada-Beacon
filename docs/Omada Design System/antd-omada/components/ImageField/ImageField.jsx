/* ────────────────────────────────────────────────────────────────────────
   components/ImageField/ImageField.jsx — OmadaImageField

   A preview-first image input — drop or pick images and SEE them immediately,
   as a round avatar or a reorderable gallery. Distinct from Upload (Batch 5, a
   generic antd file list / dragger) and UploadQueue (Batch 20, multi-file
   transfer progress): the ImageField is image-specific and preview-first, with
   no real network transfer — it surfaces local previews (FileReader data URLs)
   the form submits later. Cropper-less: images cover their frame via object-fit.

     · mode 'avatar' — one circular/rounded slot; drop or click to set/replace,
       hover to change or remove.
     · mode 'gallery' — a tile grid with an add tile, per-tile remove, and
       native drag-to-reorder; `max` caps the count.
     · Drag-over highlights the zone. Type (image/*) and `maxSizeMB` are
       validated; rejects call onError and toast nothing on their own.
     · Controlled `value` / `onChange` (items: { id, url, name, size }) or
       uncontrolled `defaultValue`.

   Thin composition over OmadaIcon + Button on antd-tokened surfaces. Token-driven,
   dark twin, i18n, RTL-mirrored.

   Figma: no dedicated node — picture-card Upload language (Upload 3:17xxx);
   the preview-first avatar/gallery field is original.
   Exports: window.Omada.ImageField
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const Icon = window.Omada.Icon;
  let uid = 0;

  function readImage(file) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve({ id: 'img-' + (++uid) + '-' + Date.now(), url: r.result, name: file.name, size: file.size });
      r.onerror = reject;
      r.readAsDataURL(file);
    });
  }

  function OmadaImageField(props) {
    const { useState, useRef } = React;
    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;

    const mode = props.mode || 'gallery';
    const controlled = props.value !== undefined;
    const [inner, setInner] = useState(() => {
      const dv = props.defaultValue;
      if (dv == null) return [];
      return Array.isArray(dv) ? dv : [{ id: 'img-0', url: typeof dv === 'string' ? dv : dv.url, name: dv.name }];
    });
    const raw = controlled ? props.value : inner;
    const items = Array.isArray(raw) ? raw : (raw ? [typeof raw === 'string' ? { id: 'v', url: raw } : raw] : []);
    const emit = (next) => {
      if (!controlled) setInner(next);
      if (props.onChange) props.onChange(mode === 'avatar' ? (next[0] || null) : next);
    };

    const max = mode === 'avatar' ? 1 : (props.max == null ? 8 : props.max);
    const shape = props.shape || (mode === 'avatar' ? 'circle' : 'rounded');
    const accept = props.accept || 'image/*';
    const maxSizeMB = props.maxSizeMB == null ? 5 : props.maxSizeMB;
    const tile = props.size == null ? (mode === 'avatar' ? 104 : 92) : props.size;

    const [dragOver, setDragOver] = useState(false);
    const [dragIdx, setDragIdx] = useState(null);
    const fileRef = useRef(null);

    const reject = (reason, file) => { if (props.onError) props.onError(reason, file); };

    const accLargest = (files) => {
      const arr = Array.from(files).filter((f) => {
        if (!f.type.startsWith('image/')) { reject('type', f); return false; }
        if (maxSizeMB && f.size > maxSizeMB * 1024 * 1024) { reject('size', f); return false; }
        return true;
      });
      if (!arr.length) return;
      const room = mode === 'avatar' ? 1 : Math.max(0, max - items.length);
      const take = mode === 'avatar' ? arr.slice(0, 1) : arr.slice(0, room);
      if (mode !== 'avatar' && arr.length > room) reject('max');
      Promise.all(take.map(readImage)).then((imgs) => {
        emit(mode === 'avatar' ? imgs : items.concat(imgs));
      });
    };

    const onPick = (e) => { if (e.target.files && e.target.files.length) accLargest(e.target.files); e.target.value = ''; };
    const openPicker = () => { if (fileRef.current) fileRef.current.click(); };
    const onDrop = (e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files && e.dataTransfer.files.length) accLargest(e.dataTransfer.files); };
    const remove = (id) => emit(items.filter((x) => x.id !== id));

    // gallery reorder (native DnD)
    const onTileDragStart = (i) => setDragIdx(i);
    const onTileDragOver = (e) => e.preventDefault();
    const onTileDrop = (i) => {
      if (dragIdx == null || dragIdx === i) { setDragIdx(null); return; }
      const next = items.slice();
      const [moved] = next.splice(dragIdx, 1);
      next.splice(i, 0, moved);
      setDragIdx(null);
      emit(next);
    };

    const fileInput = (
      <input ref={fileRef} type="file" accept={accept} multiple={mode !== 'avatar'}
             className="omada-imgf-input" onChange={onPick} tabIndex={-1} />
    );

    const cls = 'omada-imgf is-' + mode + ' shape-' + shape + (props.className ? ' ' + props.className : '');

    if (mode === 'avatar') {
      const img = items[0];
      return (
        <div className={cls}>
          <div
            className={'omada-imgf-avatar' + (dragOver ? ' is-dragover' : '') + (img ? ' has-img' : '')}
            style={{ width: tile, height: tile }}
            onClick={openPicker}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            role="button" tabIndex={0}
            aria-label={t('imgf.avatar.aria')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPicker(); } }}
          >
            {img
              ? <img className="omada-imgf-img" src={img.url} alt={img.name || ''} />
              : <span className="omada-imgf-ph"><Icon name="user" size={tile * 0.34} /></span>}
            <span className="omada-imgf-avoverlay">
              <Icon name={img ? 'edit' : 'upload'} size={18} />
              <span>{img ? t('imgf.change') : t('imgf.upload')}</span>
            </span>
          </div>
          {img && (
            <button type="button" className="omada-imgf-avremove" onClick={() => remove(img.id)}>
              <Icon name="trash" size={13} />{t('imgf.remove')}
            </button>
          )}
          {fileInput}
        </div>
      );
    }

    // gallery
    const canAdd = items.length < max;
    return (
      <div className={cls}>
        <div
          className={'omada-imgf-grid' + (dragOver ? ' is-dragover' : '')}
          onDragOver={(e) => { if (dragIdx == null) { e.preventDefault(); setDragOver(true); } }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { if (dragIdx == null) onDrop(e); }}
        >
          {items.map((img, i) => (
            <div
              key={img.id}
              className={'omada-imgf-tile' + (dragIdx === i ? ' is-dragging' : '')}
              style={{ width: tile, height: tile }}
              draggable
              onDragStart={() => onTileDragStart(i)}
              onDragOver={onTileDragOver}
              onDrop={() => onTileDrop(i)}
              onDragEnd={() => setDragIdx(null)}
            >
              <img className="omada-imgf-img" src={img.url} alt={img.name || ''} />
              <button type="button" className="omada-imgf-tileremove"
                      aria-label={t('imgf.remove')} onClick={() => remove(img.id)}>
                <Icon name="close" size={13} />
              </button>
              {i === 0 && props.showPrimary !== false && (
                <span className="omada-imgf-primary">{t('imgf.primary')}</span>
              )}
            </div>
          ))}
          {canAdd && (
            <button type="button" className="omada-imgf-add" style={{ width: tile, height: tile }}
                    onClick={openPicker}>
              <Icon name="plus" size={20} />
              <span>{t('imgf.add')}</span>
            </button>
          )}
        </div>
        <div className="omada-imgf-foot">
          <span className="omada-imgf-hint">
            {t('imgf.foot').replace('{max}', max).replace('{mb}', maxSizeMB)}
          </span>
          <span className="omada-imgf-count">{items.length} / {max}</span>
        </div>
        {fileInput}
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.ImageField = OmadaImageField;
})();
