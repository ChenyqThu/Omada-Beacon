/**
 * Card-in-chat sends. An agent can drop a rich "card" into a conversation:
 *   - proposePost: a draft feedback post the visitor can publish (draft_post card).
 *   - sharePost:   an embedded reference to an existing post (post_ref card).
 *
 * Both mirror sendAgentMessage — server-decided 'agent' sender, conversation
 * touch + assignment claim, realtime broadcast, and the message.created webhook —
 * but stash the card under metadata.card so it flows through to the DTO.
 */
import { db, conversations, chatMessages, eq } from '@/lib/server/db'
import type { ConversationId, PostId, BoardId, PrincipalId } from '@quackback/ids'
import type { ChatCard } from '@/lib/shared/db-types'
import type { Actor } from '@/lib/server/policy/types'
import { canActAsAgent } from '@/lib/server/policy/chat'
import { ForbiddenError, NotFoundError } from '@/lib/shared/errors'
import { toMessageDTO, resolveAuthor, conversationToDTO } from './chat.query'
import { publishChatEvent, publishConversationUpdate } from '@/lib/server/realtime/chat-channels'
import { emitMessageCreated } from './chat.webhooks'
import type { ChatAuthorInput, SendAgentMessageResult } from './chat.types'

export interface DraftPostAgentCtx {
  agentActor: Actor
  agentPrincipalId: PrincipalId
  agent: ChatAuthorInput
}

/**
 * Insert a card-carrying agent message + touch the conversation in one
 * transaction, then broadcast it. Agent-gated like every other agent write.
 */
async function insertCardMessage(
  conversationId: ConversationId,
  content: string,
  card: ChatCard,
  ctx: DraftPostAgentCtx
): Promise<SendAgentMessageResult> {
  const decision = canActAsAgent(ctx.agentActor)
  if (!decision.allowed) throw new ForbiddenError('FORBIDDEN', decision.reason)

  const txResult = await db.transaction(async (tx) => {
    const [existing] = await tx
      .select()
      .from(conversations)
      .where(eq(conversations.id, conversationId))
      .limit(1)
    if (!existing) {
      throw new NotFoundError('CONVERSATION_NOT_FOUND', 'Conversation not found')
    }

    const [message] = await tx
      .insert(chatMessages)
      .values({
        conversationId,
        principalId: ctx.agent.principalId,
        senderType: 'agent',
        content,
        metadata: { card },
      })
      .returning()

    const [updated] = await tx
      .update(conversations)
      .set({
        lastMessageAt: message.createdAt,
        lastMessagePreview: content,
        // Posting a card claims the conversation if it's still unassigned.
        assignedAgentPrincipalId: existing.assignedAgentPrincipalId ?? ctx.agent.principalId,
        updatedAt: message.createdAt,
      })
      .where(eq(conversations.id, conversationId))
      .returning()

    return { message, conversation: updated }
  })

  const messageDTO = toMessageDTO(txResult.message, await resolveAuthor(ctx.agent))
  // Agent-side DTO so the inbox keeps agent-only fields; publishConversationUpdate
  // strips them from the visitor's copy.
  const conversationDTO = await conversationToDTO(txResult.conversation, 'agent')

  publishConversationUpdate(conversationDTO.id, conversationDTO)
  publishChatEvent(messageDTO.conversationId, {
    kind: 'message',
    conversationId: messageDTO.conversationId,
    message: messageDTO,
  })

  void emitMessageCreated(ctx.agentActor, ctx.agent, txResult.message, txResult.conversation)

  return { conversation: conversationDTO, message: messageDTO }
}

/** Agent proposes a draft feedback post (visitor can publish it). */
export function proposePost(
  input: { conversationId: ConversationId; boardId: BoardId; title: string; content: string },
  ctx: DraftPostAgentCtx
): Promise<SendAgentMessageResult> {
  const title = input.title.trim()
  const card: ChatCard = {
    type: 'draft_post',
    status: 'proposed',
    boardId: input.boardId,
    title,
    content: input.content,
  }
  return insertCardMessage(input.conversationId, `📝 Draft feedback: ${title}`, card, ctx)
}

/** Agent shares (embeds) an existing post into the conversation. */
export function sharePost(
  input: { conversationId: ConversationId; postId: PostId },
  ctx: DraftPostAgentCtx
): Promise<SendAgentMessageResult> {
  const card: ChatCard = { type: 'post_ref', postId: input.postId }
  return insertCardMessage(input.conversationId, `🔼 Shared a related idea`, card, ctx)
}
