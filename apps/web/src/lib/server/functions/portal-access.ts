/**
 * Admin server function: update portal visibility (public / private).
 *
 * Phase 1 only — accepts `visibility`. Later phases can extend the input
 * to include `allowedDomains`, `widgetSignIn`, etc.
 */
import { z } from 'zod'
import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { ForbiddenError } from '@/lib/shared/errors'
import { isAdmin } from '@/lib/shared/roles'
import { requireAuth } from './auth-helpers'
import { getPortalConfig, updatePortalConfig } from '@/lib/server/domains/settings/settings.service'
import { actorFromAuth, recordAuditEvent } from '@/lib/server/audit/log'

// ---------------------------------------------------------------------------
// Zod schema
// ---------------------------------------------------------------------------

export const updatePortalVisibilitySchema = z.object({
  visibility: z.enum(['public', 'private']),
})

export type UpdatePortalVisibilityInput = z.infer<typeof updatePortalVisibilitySchema>

// ---------------------------------------------------------------------------
// Server function
// ---------------------------------------------------------------------------

export const updatePortalAccessFn = createServerFn({ method: 'POST' })
  .inputValidator(updatePortalVisibilitySchema.parse)
  .handler(async ({ data }) => {
    console.log(`[fn:portal-access] updatePortalAccessFn: visibility=${data.visibility}`)
    const auth = await requireAuth()
    if (!isAdmin(auth.principal.role)) {
      throw new ForbiddenError('FORBIDDEN', 'Admin only')
    }

    const headers = getRequestHeaders()
    const actor = actorFromAuth(auth)

    const before = await getPortalConfig()
    const updated = await updatePortalConfig({ access: { visibility: data.visibility } })

    const prevVisibility = before.access?.visibility ?? 'public'
    if (prevVisibility !== data.visibility) {
      await recordAuditEvent({
        event: 'portal.visibility.changed',
        actor,
        headers,
        target: { type: 'settings', id: 'portal-config' },
        before: { visibility: prevVisibility },
        after: { visibility: data.visibility },
      })
    }

    return { visibility: updated.access?.visibility ?? 'public' }
  })
