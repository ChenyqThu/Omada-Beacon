/**
 * Signed conversation-resume tokens for cross-device resume (P2.6).
 *
 * An agent-reply email links the visitor back to their conversation. On a fresh
 * device they have no session, so the link carries a signed, expiring token that
 * proves "the holder owns conversation X (visitor principal Y)". The resume
 * route verifies it server-side before surfacing the thread — the token is the
 * capability, exactly like a magic link, so it must be unforgeable and expire.
 *
 * Mirrors stream-token: HMAC over a domain-separated payload, timing-safe
 * compare, embedded expiry. Distinct domain tag so a resume token can never be
 * cross-accepted as a stream token (or vice versa) under the same secret.
 */
import { createHmac, timingSafeEqual } from 'crypto'
import { config } from '../config'
import type { ConversationId, PrincipalId } from '@quackback/ids'

// Long-lived relative to a stream token: an offline-reply email may sit unread
// for days. Kept bounded so a leaked link eventually stops working.
const DEFAULT_TTL_MS = 7 * 24 * 60 * 60 * 1000

const DOMAIN_TAG = 'chat-resume:v1\n'

function sign(payload: string): string {
  return createHmac('sha256', config.secretKey)
    .update(DOMAIN_TAG + payload)
    .digest('base64url')
}

export interface ResumeTokenClaims {
  conversationId: ConversationId
  principalId: PrincipalId
}

/** Mint a resume token for a conversation + its visitor, valid for `ttlMs`. */
export function mintConversationResumeToken(
  conversationId: ConversationId,
  principalId: PrincipalId,
  ttlMs: number = DEFAULT_TTL_MS
): string {
  // TypeIDs contain no '.', so '.' is a safe field separator.
  const payload = `${conversationId}.${principalId}.${Date.now() + ttlMs}`
  return `${Buffer.from(payload).toString('base64url')}.${sign(payload)}`
}

/** Verify a resume token, returning its claims or null if invalid/expired. */
export function verifyConversationResumeToken(
  token: string | null | undefined
): ResumeTokenClaims | null {
  if (!token) return null
  const dot = token.lastIndexOf('.')
  if (dot <= 0) return null
  const encodedPayload = token.slice(0, dot)
  const providedSig = token.slice(dot + 1)

  let payload: string
  try {
    payload = Buffer.from(encodedPayload, 'base64url').toString('utf8')
  } catch {
    return null
  }

  const expectedSig = sign(payload)
  const a = Buffer.from(providedSig)
  const b = Buffer.from(expectedSig)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null

  const parts = payload.split('.')
  if (parts.length !== 3) return null
  const [conversationId, principalId, expStr] = parts
  const exp = Number(expStr)
  if (!conversationId || !principalId || !Number.isFinite(exp) || Date.now() > exp) return null

  return {
    conversationId: conversationId as ConversationId,
    principalId: principalId as PrincipalId,
  }
}
