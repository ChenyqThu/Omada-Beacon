import { useCallback, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { FormattedMessage, useIntl } from 'react-intl'
import { CheckCircleIcon, PencilIcon } from '@heroicons/react/24/solid'
import { LightBulbIcon } from '@heroicons/react/24/outline'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { fetchPublicBoards } from '@/lib/server/functions/portal'
import {
  publishDraftPostFn,
  dismissDraftPostFn,
  upvotePostFromChatFn,
} from '@/lib/server/functions/chat'
import { getWidgetAuthHeaders, generateOneTimeToken } from '@/lib/client/widget-auth'
import { sendToHost } from '@/lib/client/widget-bridge'
import { buildPortalUrl } from './build-portal-url'
import { useWidgetAuth } from './widget-auth-provider'
import type { DraftPostCard as DraftPostCardData } from '@/lib/shared/db-types'

// Shared styling tokens — mirror the widget composer (widget-home-animated) and
// CSAT card so these cards render native to the chat thread.
const primaryBtn =
  'px-3 py-1 text-xs font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed'
const secondaryBtn =
  'px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed'
const fieldCls =
  'w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-primary/20'

interface Duplicate {
  id: string
  title: string
  voteCount: number
}

export function DraftPostCard({ messageId, card }: { messageId: string; card: DraftPostCardData }) {
  const intl = useIntl()
  const { isIdentified } = useWidgetAuth()

  // Boards source: the same public-boards feed the widget composer uses, fetched
  // with the visitor's Bearer identity so per-audience boards resolve correctly.
  const { data: boards } = useQuery({
    queryKey: ['widget', 'chat', 'boards'],
    queryFn: () => fetchPublicBoards({ headers: getWidgetAuthHeaders() }),
    staleTime: 5 * 60 * 1000,
  })
  const boardMap = useMemo(() => new Map((boards ?? []).map((b) => [String(b.id), b])), [boards])

  // Editable fields seed from the card; Publish always reads from these, so the
  // read-only view and the Edit form publish identical values.
  const [title, setTitle] = useState(card.title)
  const [content, setContent] = useState(card.content)
  const [boardId, setBoardId] = useState(card.boardId)

  const [editing, setEditing] = useState(false)
  const [busy, setBusy] = useState(false)
  const [duplicate, setDuplicate] = useState<Duplicate | null>(null)
  const [votedDuplicate, setVotedDuplicate] = useState(false)
  // Optimistic terminal states — the authoritative card also arrives via the
  // card_updated stream (wired in a later task), so a local flag is enough.
  const [localPublished, setLocalPublished] = useState<{
    postId: string
    boardId: string
    title: string
  } | null>(null)
  const [localDismissed, setLocalDismissed] = useState(false)

  const openPost = useCallback(
    async (postId: string, forBoardId: string) => {
      const slug = boardMap.get(forBoardId)?.slug
      if (!slug) return
      const ott = isIdentified ? await generateOneTimeToken() : null
      const url = buildPortalUrl({
        origin: window.location.origin,
        boardSlug: slug,
        postId,
        isIdentified,
        ott,
      })
      sendToHost({ type: 'quackback:navigate', url })
    },
    [boardMap, isIdentified]
  )

  const doPublish = useCallback(
    async (skipDedupe: boolean) => {
      if (busy || !title.trim() || !boardId) return
      setBusy(true)
      try {
        const res = await publishDraftPostFn({
          data: { messageId, title: title.trim(), content, boardId, skipDedupe },
          headers: getWidgetAuthHeaders(),
        })
        if (res.duplicate) {
          setDuplicate(res.duplicate)
          setEditing(false)
          return
        }
        if (res.postId) {
          setLocalPublished({ postId: res.postId, boardId, title: title.trim() })
        }
      } catch {
        // Surface nothing destructive — leave the draft in place to retry.
      } finally {
        setBusy(false)
      }
    },
    [busy, title, content, boardId, messageId]
  )

  const doDismiss = useCallback(async () => {
    if (busy) return
    setBusy(true)
    try {
      await dismissDraftPostFn({ data: { messageId }, headers: getWidgetAuthHeaders() })
      setLocalDismissed(true)
    } catch {
      // ignore — visitor can retry
    } finally {
      setBusy(false)
    }
  }, [busy, messageId])

  const addMyVote = useCallback(async () => {
    if (!duplicate || busy || votedDuplicate) return
    setBusy(true)
    try {
      await upvotePostFromChatFn({
        data: { messageId, postId: duplicate.id },
        headers: getWidgetAuthHeaders(),
      })
      setVotedDuplicate(true)
    } catch {
      // ignore — visitor can retry
    } finally {
      setBusy(false)
    }
  }, [duplicate, busy, votedDuplicate, messageId])

  // ── Terminal: dismissed ──────────────────────────────────────────────────
  if (localDismissed || card.status === 'dismissed') {
    return (
      <p className="px-1 py-0.5 text-[11px] italic text-muted-foreground/60">
        <FormattedMessage id="widget.chat.draft.dismissed" defaultMessage="Draft dismissed" />
      </p>
    )
  }

  // ── Terminal: published receipt ──────────────────────────────────────────
  const published =
    localPublished ??
    (card.status === 'published' && card.postId
      ? { postId: card.postId, boardId: card.boardId, title: card.title }
      : null)
  if (published) {
    const boardName = boardMap.get(published.boardId)?.name
    const hasLink = Boolean(boardMap.get(published.boardId)?.slug)
    return (
      <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5">
        <p className="flex items-center gap-1 text-xs font-medium text-foreground">
          <CheckCircleIcon className="size-3.5 shrink-0 text-emerald-500" />
          {boardName ? (
            <FormattedMessage
              id="widget.chat.draft.postedTo"
              defaultMessage="Posted to {board}"
              values={{ board: boardName }}
            />
          ) : (
            <FormattedMessage id="widget.chat.draft.posted" defaultMessage="Posted" />
          )}
        </p>
        <p className="mt-1 text-sm text-foreground">{published.title}</p>
        {hasLink && (
          <button
            type="button"
            onClick={() => void openPost(published.postId, published.boardId)}
            className="mt-1.5 inline-flex items-center gap-0.5 text-xs font-medium text-primary hover:underline"
          >
            <FormattedMessage id="widget.chat.draft.viewPost" defaultMessage="View post" />
            <span aria-hidden>↗</span>
          </button>
        )}
      </div>
    )
  }

  // ── Active: proposed ─────────────────────────────────────────────────────
  const boardName = boardMap.get(boardId)?.name

  return (
    <div className="rounded-lg border border-border/60 bg-card px-3 py-2.5">
      <div className="mb-1 flex items-center gap-1 text-[11px] text-muted-foreground">
        <LightBulbIcon className="size-3 shrink-0" />
        <FormattedMessage id="widget.chat.draft.suggested" defaultMessage="Suggested post" />
        {!editing && boardName && (
          <>
            <span aria-hidden>·</span>
            <span>{boardName}</span>
          </>
        )}
      </div>

      {editing ? (
        // Inline editor — title input + plain textarea + board select, matching
        // the composer fields (v1 keeps the body plain text, no rich editor).
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={intl.formatMessage({
              id: 'widget.chat.draft.titlePlaceholder',
              defaultMessage: 'Post title',
            })}
            className={fieldCls}
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            placeholder={intl.formatMessage({
              id: 'widget.chat.draft.detailsPlaceholder',
              defaultMessage: 'Add more details…',
            })}
            className={`${fieldCls} resize-none`}
          />
          <Select value={boardId} onValueChange={setBoardId}>
            <SelectTrigger size="xs" className="w-full">
              <SelectValue
                placeholder={intl.formatMessage({
                  id: 'widget.home.posting.selectBoard',
                  defaultMessage: 'Select a board',
                })}
              />
            </SelectTrigger>
            <SelectContent align="start">
              {(boards ?? []).map((b) => (
                <SelectItem key={String(b.id)} value={String(b.id)} className="text-xs py-1">
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center justify-end gap-1.5">
            <button
              type="button"
              onClick={() => setEditing(false)}
              disabled={busy}
              className={secondaryBtn}
            >
              <FormattedMessage id="widget.home.form.cancel" defaultMessage="Cancel" />
            </button>
            <button
              type="button"
              onClick={() => void doPublish(false)}
              disabled={busy || !title.trim() || !boardId}
              className={primaryBtn}
            >
              <FormattedMessage id="widget.chat.draft.publish" defaultMessage="Publish" />
              <span aria-hidden> →</span>
            </button>
          </div>
        </div>
      ) : duplicate ? (
        // Dedupe prompt — surface the existing post and let the visitor add their
        // vote to it or post their own anyway.
        <div>
          <p className="mb-1 text-[11px] text-muted-foreground">
            <FormattedMessage
              id="widget.chat.draft.duplicate"
              defaultMessage="This looks similar to an existing post:"
            />
          </p>
          <div className="flex items-center gap-2 rounded-md border border-border/60 bg-muted/20 px-2 py-1.5">
            <span className="inline-flex shrink-0 items-center gap-0.5 text-xs font-medium text-muted-foreground">
              <span aria-hidden>▲</span>
              {duplicate.voteCount}
            </span>
            <span className="line-clamp-1 text-sm text-foreground">{duplicate.title}</span>
          </div>
          {votedDuplicate ? (
            <p className="mt-2 text-xs text-muted-foreground">
              <FormattedMessage id="widget.chat.draft.voteAdded" defaultMessage="Vote added" />
            </p>
          ) : (
            <div className="mt-2 flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => void addMyVote()}
                disabled={busy}
                className={primaryBtn}
              >
                <FormattedMessage id="widget.chat.draft.addVote" defaultMessage="Add my vote" />
                <span aria-hidden> →</span>
              </button>
              <button
                type="button"
                onClick={() => void doPublish(true)}
                disabled={busy}
                className={secondaryBtn}
              >
                <FormattedMessage
                  id="widget.chat.draft.postMine"
                  defaultMessage="Post mine instead"
                />
              </button>
            </div>
          )}
        </div>
      ) : (
        // Read-only proposed view + actions.
        <>
          <p className="text-sm font-medium text-foreground">{title}</p>
          {content && (
            <p className="mt-0.5 line-clamp-4 whitespace-pre-wrap text-xs text-muted-foreground">
              {content}
            </p>
          )}
          <div className="mt-2 flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setEditing(true)}
              disabled={busy}
              className={`${secondaryBtn} inline-flex items-center gap-1`}
            >
              <PencilIcon className="size-3" />
              <FormattedMessage id="widget.chat.draft.edit" defaultMessage="Edit" />
            </button>
            <button
              type="button"
              onClick={() => void doPublish(false)}
              disabled={busy || !title.trim() || !boardId}
              className={primaryBtn}
            >
              <FormattedMessage id="widget.chat.draft.publish" defaultMessage="Publish" />
              <span aria-hidden> →</span>
            </button>
            <button
              type="button"
              onClick={() => void doDismiss()}
              disabled={busy}
              className="ms-auto inline-flex items-center gap-0.5 text-[11px] text-muted-foreground/50 hover:text-muted-foreground transition-colors disabled:opacity-40"
            >
              <FormattedMessage id="widget.chat.draft.dismiss" defaultMessage="Dismiss" />
              <span aria-hidden>×</span>
            </button>
          </div>
        </>
      )}
    </div>
  )
}
