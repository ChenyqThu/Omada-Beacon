import { useCallback, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { FormattedMessage } from 'react-intl'
import { fetchPublicPostDetail, fetchPublicStatuses } from '@/lib/server/functions/portal'
import { upvotePostFromChatFn } from '@/lib/server/functions/chat'
import { getWidgetAuthHeaders, generateOneTimeToken } from '@/lib/client/widget-auth'
import { sendToHost } from '@/lib/client/widget-bridge'
import { buildPortalUrl } from './build-portal-url'
import { useWidgetAuth } from './widget-auth-provider'
import type { PublicPostDetailView } from '@/lib/client/queries/portal-detail'

const primaryBtn =
  'px-3 py-1 text-xs font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed'
const secondaryBtn =
  'px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed'

export function PostRefCard({ messageId, postId }: { messageId: string; postId: string }) {
  const { isIdentified, sessionVersion } = useWidgetAuth()

  // Live post data with the visitor's Bearer identity; re-keyed on
  // sessionVersion so it refetches after identify (mirrors widget-post-detail).
  const {
    data: post,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['widget', 'chat', 'postRef', postId, sessionVersion],
    queryFn: async (): Promise<PublicPostDetailView> => {
      const res = await fetchPublicPostDetail({ data: { postId }, headers: getWidgetAuthHeaders() })
      if (!res) throw new Error('Post not found')
      return res as PublicPostDetailView
    },
    staleTime: 30 * 1000,
  })

  const { data: statuses } = useQuery({
    queryKey: ['widget', 'chat', 'statuses'],
    queryFn: () => fetchPublicStatuses({ headers: getWidgetAuthHeaders() }),
    staleTime: 5 * 60 * 1000,
  })
  const status = useMemo(() => {
    if (!post?.statusId) return null
    return (statuses ?? []).find((s) => String(s.id) === String(post.statusId)) ?? null
  }, [statuses, post?.statusId])

  const [busy, setBusy] = useState(false)
  const [voted, setVoted] = useState(false)
  const [voteOverride, setVoteOverride] = useState<number | null>(null)

  const handleView = useCallback(async () => {
    if (!post) return
    const ott = isIdentified ? await generateOneTimeToken() : null
    const url = buildPortalUrl({
      origin: window.location.origin,
      boardSlug: post.board.slug,
      postId: post.id,
      isIdentified,
      ott,
    })
    sendToHost({ type: 'quackback:navigate', url })
  }, [post, isIdentified])

  const handleUpvote = useCallback(async () => {
    if (busy || voted || !post) return
    setBusy(true)
    setVoted(true)
    setVoteOverride(post.voteCount + 1) // optimistic
    try {
      const res = await upvotePostFromChatFn({
        data: { messageId, postId },
        headers: getWidgetAuthHeaders(),
      })
      setVoteOverride(res.voteCount)
    } catch {
      setVoted(false)
      setVoteOverride(null)
    } finally {
      setBusy(false)
    }
  }, [busy, voted, post, messageId, postId])

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border/60 bg-card px-3 py-2.5">
        <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
      </div>
    )
  }

  if (error || !post) {
    return (
      <p className="px-1 py-0.5 text-[11px] italic text-muted-foreground/60">
        <FormattedMessage id="widget.chat.postRef.unavailable" defaultMessage="Post unavailable" />
      </p>
    )
  }

  const voteCount = voteOverride ?? post.voteCount

  return (
    <div className="rounded-lg border border-border/60 bg-card px-3 py-2.5">
      <div className="flex items-start gap-2">
        <button
          type="button"
          onClick={() => void handleUpvote()}
          disabled={busy || voted}
          className={`flex shrink-0 flex-col items-center rounded-md border px-2 py-1 text-xs font-medium transition-colors ${
            voted
              ? 'border-primary/40 bg-primary/10 text-primary'
              : 'border-border text-muted-foreground hover:bg-muted/50 disabled:opacity-40'
          }`}
          aria-label="Upvote"
        >
          <span aria-hidden className="leading-none">
            ▲
          </span>
          <span className="leading-tight">{voteCount}</span>
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground">{post.title}</p>
          {status && (
            <span className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <span
                className="size-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: status.color }}
              />
              {status.name}
            </span>
          )}
          <div className="mt-1.5 flex items-center gap-1.5">
            <button type="button" onClick={() => void handleView()} className={secondaryBtn}>
              <FormattedMessage id="widget.chat.postRef.view" defaultMessage="View" />
              <span aria-hidden> ↗</span>
            </button>
            <button
              type="button"
              onClick={() => void handleUpvote()}
              disabled={busy || voted}
              className={primaryBtn}
            >
              {voted ? (
                <FormattedMessage id="widget.chat.postRef.upvoted" defaultMessage="Upvoted" />
              ) : (
                <FormattedMessage id="widget.chat.postRef.upvote" defaultMessage="Upvote" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
