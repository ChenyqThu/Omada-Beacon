import { describe, it, expect, vi, beforeEach } from 'vitest'

const publishMock = vi.fn()
vi.mock('../pubsub', () => ({ publish: (...args: unknown[]) => publishMock(...args) }))

import { publishCardUpdated } from '../chat-channels'

describe('publishCardUpdated', () => {
  beforeEach(() => publishMock.mockClear())
  it('broadcasts a card_updated event to both the conversation and inbox channels', () => {
    const card = {
      type: 'draft_post',
      status: 'published',
      boardId: 'board_1',
      title: 'X',
      content: 'y',
      postId: 'post_1',
    } as const
    publishCardUpdated('conversation_1' as any, 'chatmsg_1' as any, card as any)
    // publishChatEvent publishes to two channels → publish called twice with the event
    expect(publishMock).toHaveBeenCalledTimes(2)
    for (const call of publishMock.mock.calls) {
      expect(call[1]).toEqual({
        kind: 'card_updated',
        conversationId: 'conversation_1',
        messageId: 'chatmsg_1',
        card,
      })
    }
  })
})
