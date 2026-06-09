import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

/**
 * An image thumbnail that opens a near-full-size preview in a modal on click.
 * Shared by the composer attachment tray and sent-message attachments so chat
 * images behave the same everywhere (thumbnail + click-to-enlarge).
 */
export function ZoomableImage({
  src,
  alt,
  className,
  thumbClassName,
}: {
  src: string
  alt?: string
  /** Class for the clickable thumbnail button. */
  className?: string
  /** Class for the <img> inside the thumbnail. */
  thumbClassName?: string
}) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={alt ? `Enlarge ${alt}` : 'Enlarge image'}
        className={className}
      >
        <img src={src} alt={alt ?? ''} loading="lazy" className={thumbClassName} />
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="truncate text-sm font-normal">{alt || 'Image'}</DialogTitle>
          </DialogHeader>
          <img
            src={src}
            alt={alt ?? ''}
            className="max-h-[80vh] w-full rounded-md object-contain"
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
