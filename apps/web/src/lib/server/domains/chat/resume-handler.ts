/**
 * Cross-device chat resume (P2.6). An agent-reply email links here with a
 * signed resume token. We verify it server-side (the token is the capability),
 * then land the visitor on the portal — where, once they have a session, their
 * conversation history (P2.4) surfaces the thread.
 *
 * A valid token additionally carries the conversation id as a `?c=` hint for the
 * widget to deep-open; auto-opening that specific thread (widget open-by-URL +
 * minting an anonymous session from the token for a brand-new device) is a
 * pending follow-up, so we don't promise it. A forged/expired link simply lands
 * on the portal root with no hint — we never reveal whether the token was valid
 * beyond that, and never establish a session from an unverified link.
 */
import { getBaseUrl } from '@/lib/server/config'
import { verifyConversationResumeToken } from '@/lib/server/realtime/chat-resume-token'

export function handleChatResume(request: Request): Response {
  const token = new URL(request.url).searchParams.get('token')
  const claims = verifyConversationResumeToken(token)
  const base = getBaseUrl().replace(/\/$/, '')
  const dest = claims ? `${base}/?c=${encodeURIComponent(claims.conversationId)}` : base
  return new Response(null, { status: 302, headers: { Location: dest } })
}
