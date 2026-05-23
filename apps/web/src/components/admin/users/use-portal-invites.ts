import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  sendPortalInviteFn,
  cancelPortalInviteFn,
  resendPortalInviteFn,
  fetchPortalInvitesFn,
} from '@/lib/server/functions/portal-invites'

/**
 * One invitation row as returned by `fetchPortalInvitesFn` and rendered by
 * the InviteRow component. Lives in this module so consumers don't have to
 * reach into the server-fn return type.
 */
export interface PortalInvite {
  id: string
  email: string
  status: string | null
  createdAt: string
  lastSentAt: string | null
}

export const PORTAL_INVITES_QUERY_KEY = ['portal', 'invites'] as const

/**
 * Loose-email syntax check used for client-side validation in the send form.
 * Server-side validation is the source of truth — this only catches obvious
 * typos before the round-trip.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function parseEmailList(raw: string): string[] {
  return raw
    .split(/[,;\s]+/)
    .map((s) => s.trim())
    .filter(Boolean)
}

function partitionValidEmails(items: string[]): { valid: string[]; invalid: string[] } {
  const valid: string[] = []
  const invalid: string[] = []
  for (const item of items) {
    if (EMAIL_RE.test(item)) valid.push(item)
    else invalid.push(item)
  }
  return { valid, invalid }
}

/**
 * Shared state machine + actions for the portal-invite UIs. Both the Portal
 * Settings invite section and the /admin/users Invitations view consume
 * this so the dialog, count summary, and row actions stay in lock-step.
 *
 * - `invites`/counts: live list driven by `fetchPortalInvitesFn`.
 * - `dialogOpen` + form state: the send dialog lives here so closing it
 *   resets cleanly and partial-failure can keep it open with the failed
 *   addresses re-populated.
 * - `handleSend` returns the per-address results so the caller can decide
 *   what to show (we close on full success, keep open on partial fail).
 * - `handleResend`/`handleRevoke`: row actions, with per-row busy state.
 */
export function usePortalInvites() {
  const queryClient = useQueryClient()

  const query = useQuery<PortalInvite[]>({
    queryKey: PORTAL_INVITES_QUERY_KEY,
    queryFn: () => fetchPortalInvitesFn(),
    staleTime: 30 * 1000,
  })

  const invites = query.data ?? []
  const pendingCount = invites.filter((i) => i.status === 'pending').length
  const acceptedCount = invites.filter((i) => i.status === 'accepted').length
  const expiredCount = invites.filter((i) => i.status === 'expired').length
  const canceledCount = invites.filter((i) => i.status === 'canceled').length

  const refetch = () => queryClient.invalidateQueries({ queryKey: PORTAL_INVITES_QUERY_KEY })

  // ---------- Send dialog state ----------
  const [dialogOpen, setDialogOpen] = useState(false)
  const [emailsInput, setEmailsInput] = useState('')
  const [messageInput, setMessageInput] = useState('')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [batchResults, setBatchResults] = useState<null | {
    sent: number
    failed: Array<{ email: string; error: string }>
  }>(null)
  const [sendBusy, setSendBusy] = useState(false)
  const [lastSentSummary, setLastSentSummary] = useState<string | null>(null)

  const handleDialogChange = (next: boolean) => {
    setDialogOpen(next)
    if (!next) {
      setEmailsInput('')
      setMessageInput('')
      setEmailError(null)
      setBatchResults(null)
    }
  }

  const openDialog = () => setDialogOpen(true)

  const handleSend = async () => {
    if (sendBusy) return
    setEmailError(null)
    setBatchResults(null)

    const raw = parseEmailList(emailsInput)
    if (raw.length === 0) {
      setEmailError('Enter at least one email address.')
      return
    }
    if (raw.length > 50) {
      setEmailError('You can send at most 50 invites at a time. Trim the list and try again.')
      return
    }
    const { valid, invalid } = partitionValidEmails(raw)
    if (invalid.length > 0) {
      setEmailError(`Invalid email${invalid.length > 1 ? 's' : ''}: ${invalid.join(', ')}`)
      return
    }

    setSendBusy(true)
    try {
      const message = messageInput.trim() || undefined
      const result = await sendPortalInviteFn({ data: { emails: valid, message } })
      const sent = result.results.filter((r) => r.ok).length
      const failed = result.results.filter(
        (r): r is { email: string; ok: false; error: string } => !r.ok
      )
      if (sent > 0) {
        void refetch()
      }
      // Full success → close + brief inline summary. Partial fail → keep
      // open with only the failed addresses in the textarea so retry sends
      // only those.
      if (failed.length === 0) {
        setLastSentSummary(`Sent ${sent} invite${sent === 1 ? '' : 's'}.`)
        setTimeout(() => setLastSentSummary(null), 4000)
        handleDialogChange(false)
      } else {
        setBatchResults({ sent, failed })
        setEmailsInput(failed.map((f) => f.email).join(', '))
      }
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : 'Failed to send invites.')
    } finally {
      setSendBusy(false)
    }
  }

  // ---------- Row actions ----------
  const [resendingId, setResendingId] = useState<string | null>(null)
  const [revokingId, setRevokingId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [resendConfirm, setResendConfirm] = useState<string | null>(null)

  const handleResend = async (id: string) => {
    setActionError(null)
    setResendingId(id)
    setResendConfirm(null)
    try {
      await resendPortalInviteFn({ data: { inviteId: id } })
      setResendConfirm(id)
      void refetch()
      setTimeout(() => setResendConfirm((prev) => (prev === id ? null : prev)), 3000)
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to resend invite.')
    } finally {
      setResendingId(null)
    }
  }

  const handleRevoke = async (id: string) => {
    setActionError(null)
    setRevokingId(id)
    try {
      await cancelPortalInviteFn({ data: { inviteId: id } })
      void refetch()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to revoke invite.')
    } finally {
      setRevokingId(null)
    }
  }

  return {
    // data
    invites,
    isLoading: query.isLoading,
    pendingCount,
    acceptedCount,
    expiredCount,
    canceledCount,
    // dialog
    dialogOpen,
    openDialog,
    onOpenChange: handleDialogChange,
    emailsInput,
    messageInput,
    emailError,
    batchResults,
    sendBusy,
    onEmailsChange: (v: string) => {
      setEmailsInput(v)
      if (emailError) setEmailError(null)
    },
    onMessageChange: setMessageInput,
    onSend: () => void handleSend(),
    lastSentSummary,
    // row actions
    resendingId,
    revokingId,
    actionError,
    resendConfirm,
    handleResend,
    handleRevoke,
  }
}
