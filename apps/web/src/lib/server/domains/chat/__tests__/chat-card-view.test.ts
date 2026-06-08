import { describe, it, expect } from 'vitest'
import { collectCardRefs, buildCardView } from '../chat.card-view'

const ref = (postId: string) => ({ type: 'post_ref', postId }) as const

describe('collectCardRefs', () => {
  it('collects post ids from post_ref cards', () => {
    const { boardIds, postIds } = collectCardRefs([ref('post_5'), ref('post_9')] as any)
    expect([...boardIds]).toEqual([])
    expect([...postIds].sort()).toEqual(['post_5', 'post_9'])
  })
})

describe('buildCardView', () => {
  const boards = new Map([['board_1', { name: 'Feature Requests', slug: 'features' }]])
  const posts = new Map([
    [
      'post_5',
      {
        title: 'Dark mode',
        voteCount: 12,
        statusName: 'Open',
        statusColor: '#22c55e',
        boardSlug: 'features',
        boardName: 'Feature Requests',
      },
    ],
  ])
  it('builds a post_ref view from the post map', () => {
    expect(buildCardView(ref('post_5') as any, boards, posts)).toEqual({
      type: 'post_ref',
      title: 'Dark mode',
      voteCount: 12,
      statusName: 'Open',
      statusColor: '#22c55e',
      boardName: 'Feature Requests',
      boardSlug: 'features',
    })
  })
  it('returns null when the referenced post is missing', () => {
    expect(buildCardView(ref('post_x') as any, boards, posts)).toBeNull()
  })
  it('returns null for an unknown/legacy card type', () => {
    expect(buildCardView({ type: 'legacy_card' } as any, boards, posts)).toBeNull()
  })
})
