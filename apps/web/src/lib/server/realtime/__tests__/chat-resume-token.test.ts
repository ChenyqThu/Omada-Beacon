/**
 * Resume tokens are a capability (like a magic link), so the security-critical
 * properties are pinned here: round-trips, rejects tampering, rejects expiry,
 * and never cross-accepts a stream token signed under the same secret.
 */
import { describe, it, expect, vi } from 'vitest'

vi.mock('../../config', () => ({ config: { secretKey: 'test-secret-key' } }))

import { mintConversationResumeToken, verifyConversationResumeToken } from '../chat-resume-token'
import { mintStreamToken } from '../stream-token'
import type { ConversationId, PrincipalId } from '@quackback/ids'

const conversationId = 'conversation_abc' as ConversationId
const principalId = 'principal_xyz' as PrincipalId

describe('conversation resume token', () => {
  it('round-trips the conversation + principal claims', () => {
    const token = mintConversationResumeToken(conversationId, principalId)
    expect(verifyConversationResumeToken(token)).toEqual({ conversationId, principalId })
  })

  it('rejects a tampered payload', () => {
    const token = mintConversationResumeToken(conversationId, principalId)
    const tampered = 'x' + token.slice(1)
    expect(verifyConversationResumeToken(tampered)).toBeNull()
  })

  it('rejects an expired token', () => {
    const token = mintConversationResumeToken(conversationId, principalId, -1000)
    expect(verifyConversationResumeToken(token)).toBeNull()
  })

  it('rejects null / malformed input', () => {
    expect(verifyConversationResumeToken(null)).toBeNull()
    expect(verifyConversationResumeToken('')).toBeNull()
    expect(verifyConversationResumeToken('garbage')).toBeNull()
  })

  it('does not cross-accept a stream token (domain separation)', () => {
    const streamToken = mintStreamToken(principalId)
    expect(verifyConversationResumeToken(streamToken)).toBeNull()
  })
})
