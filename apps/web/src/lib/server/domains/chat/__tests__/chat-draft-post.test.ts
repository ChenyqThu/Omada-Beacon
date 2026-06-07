/**
 * Card-in-chat sends: proposePost inserts an agent message carrying a
 * draft_post card; sharePost inserts one carrying a post_ref card. Both mirror
 * sendAgentMessage (server-decided 'agent' sender, conversation touch, realtime
 * broadcast) but stash the card under metadata.card so it flows to the DTO.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { PrincipalId, ConversationId, BoardId, PostId } from '@quackback/ids'
import type { Actor } from '@/lib/server/policy/types'
import { ForbiddenError } from '@/lib/shared/errors'

const insertedMessages: Record<string, unknown>[] = []
const publishChatEvent = vi.fn()
const publishConversationUpdate = vi.fn()

// Hoisted so the (also-hoisted) vi.mock factory can reference the spy bag.
const emit = vi.hoisted(() => ({
  emitConversationCreated: vi.fn(),
  emitMessageCreated: vi.fn(),
  emitMessageNoteCreated: vi.fn(),
  emitMessageDeleted: vi.fn(),
  emitConversationStatusChanged: vi.fn(),
  emitConversationAssigned: vi.fn(),
  emitConversationPriorityChanged: vi.fn(),
  emitConversationCsatSubmitted: vi.fn(),
}))
vi.mock('../chat.webhooks', () => emit)

vi.mock('@/lib/server/realtime/chat-channels', () => ({
  publishChatEvent: (...args: unknown[]) => publishChatEvent(...args),
  publishAgentChatEvent: vi.fn(),
  publishConversationUpdate: (...args: unknown[]) => publishConversationUpdate(...args),
}))

vi.mock('@/lib/server/config', () => ({
  config: { s3PublicUrl: undefined, baseUrl: 'http://localhost:3000' },
  getBaseUrl: () => 'http://localhost:3000',
}))

vi.mock('../chat.query', () => ({
  conversationToDTO: vi.fn(async (c: { id: string; status: string }) => ({
    id: c.id,
    status: c.status,
  })),
  // Project the fields the assertions read: server-decided senderType and the
  // card stashed under metadata.card (mirrors the real toMessageDTO).
  toMessageDTO: vi.fn((m: Record<string, unknown>) => ({
    id: m.id,
    conversationId: m.conversationId,
    senderType: m.senderType,
    content: m.content,
    author: { principalId: m.principalId, displayName: null, avatarUrl: null },
    card: (m.metadata as { card?: unknown } | null)?.card ?? null,
  })),
  resolveAuthor: vi.fn(async (a: { principalId: string }) => ({
    principalId: a.principalId,
    displayName: null,
    avatarUrl: null,
  })),
  authorFromInput: vi.fn((a: { principalId: string }) => ({
    principalId: a.principalId,
    displayName: null,
    avatarUrl: null,
  })),
  loadAuthors: vi.fn(async () => new Map()),
}))

vi.mock('@/lib/server/db', () => {
  const conversationRow = {
    id: 'conversation_1' as unknown as ConversationId,
    visitorPrincipalId: 'principal_visitor',
    assignedAgentPrincipalId: null,
    status: 'open',
    subject: null,
    lastMessagePreview: null,
    lastMessageAt: new Date(),
    visitorLastReadAt: null,
    agentLastReadAt: null,
    createdAt: new Date(),
    updatedAt: null,
  }

  function chain(label: string) {
    const c: Record<string, unknown> = {}
    c.values = vi.fn((row: Record<string, unknown>) => {
      if (label === 'chat_messages') insertedMessages.push(row)
      return c
    })
    c.set = vi.fn(() => c)
    c.from = vi.fn(() => c)
    c.where = vi.fn(() => c)
    // The in-transaction conversation lookup resolves to an existing row.
    c.limit = vi.fn(async () => [conversationRow])
    c.orderBy = vi.fn(() => c)
    c.returning = vi.fn(async () => {
      if (label === 'chat_messages') {
        const last = insertedMessages.at(-1) ?? {}
        return [{ ...last, id: 'chat_msg_new', createdAt: new Date() }]
      }
      if (label === 'conversations') {
        return [{ ...conversationRow }]
      }
      return []
    })
    return c
  }

  const tx = {
    select: () => chain('select'),
    insert: (table: { __name?: string }) => chain(table?.__name ?? 'unknown'),
    update: (table: { __name?: string }) => chain(table?.__name ?? 'unknown'),
  }

  return {
    db: {
      transaction: vi.fn(async (fn: (t: unknown) => Promise<unknown>) => fn(tx)),
      select: vi.fn(() => chain('select')),
      insert: vi.fn((table: { __name?: string }) => chain(table?.__name ?? 'unknown')),
      update: vi.fn((table: { __name?: string }) => chain(table?.__name ?? 'unknown')),
    },
    eq: vi.fn(),
    conversations: { __name: 'conversations', id: 'id' },
    chatMessages: { __name: 'chat_messages', id: 'id' },
  }
})

import { proposePost, sharePost } from '../chat.draft-post'

const conversationId = 'conversation_1' as ConversationId
const boardId = 'board_1' as BoardId
const postId = 'post_1' as PostId
const agentPrincipalId = 'principal_agent' as PrincipalId
const agent = {
  principalId: agentPrincipalId,
  displayName: 'Jane',
  email: null,
}
const agentActor: Actor = {
  principalId: agentPrincipalId,
  role: 'admin',
  principalType: 'user',
  segmentIds: new Set(),
}
const visitorActor: Actor = {
  principalId: 'principal_visitor' as PrincipalId,
  role: 'user',
  principalType: 'anonymous',
  segmentIds: new Set(),
}

beforeEach(() => {
  insertedMessages.length = 0
  vi.clearAllMocks()
})

describe('proposePost', () => {
  it('inserts an agent message carrying a draft_post card', async () => {
    const { message } = await proposePost(
      { conversationId, boardId, title: 'Dark mode', content: 'A dark theme…' },
      { agentActor, agentPrincipalId, agent }
    )
    expect(message.senderType).toBe('agent')
    expect(message.card).toEqual({
      type: 'draft_post',
      status: 'proposed',
      boardId,
      title: 'Dark mode',
      content: 'A dark theme…',
    })
    // The stored row is agent-typed and stashes the card under metadata.card.
    expect(insertedMessages).toHaveLength(1)
    expect(insertedMessages[0]).toMatchObject({
      conversationId,
      principalId: agentPrincipalId,
      senderType: 'agent',
      metadata: {
        card: { type: 'draft_post', status: 'proposed', boardId, title: 'Dark mode' },
      },
    })
  })

  it('refuses a non-agent actor before any write', async () => {
    await expect(
      proposePost(
        { conversationId, boardId, title: 'Dark mode', content: 'x' },
        { agentActor: visitorActor, agentPrincipalId, agent }
      )
    ).rejects.toBeInstanceOf(ForbiddenError)
    expect(insertedMessages).toHaveLength(0)
  })
})

describe('sharePost', () => {
  it('inserts an agent message carrying a post_ref card', async () => {
    const shared = await sharePost(
      { conversationId, postId },
      { agentActor, agentPrincipalId, agent }
    )
    expect(shared.message.senderType).toBe('agent')
    expect(shared.message.card).toEqual({ type: 'post_ref', postId })
    expect(insertedMessages[0]).toMatchObject({
      senderType: 'agent',
      metadata: { card: { type: 'post_ref', postId } },
    })
  })
})
