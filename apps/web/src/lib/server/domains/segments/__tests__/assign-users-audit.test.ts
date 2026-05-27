/**
 * `assignUsersToSegment` is the admin-triggered bulk-add path. It used to
 * call `addMember(..., actor: null)`, meaning every dashboard "Add users
 * to segment" click landed in user_segments with no audit row — while
 * the REST /api/v1/segments/:slug/members endpoint, which routes
 * through the same service for the same data plane, DID write an audit
 * row. Asymmetric history.
 *
 * The fix threads an optional actor through to addMember; the admin
 * server fn passes the auth-derived actor on every call.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generateId, type PrincipalId, type SegmentId } from '@quackback/ids'

const mockAddMember = vi.fn()
const mockSegmentFindFirst = vi.fn()

vi.mock('@/lib/server/db', () => ({
  db: { query: { segments: { findFirst: (...a: unknown[]) => mockSegmentFindFirst(...a) } } },
  eq: vi.fn((col, val) => ({ kind: 'eq', col, val })),
  and: vi.fn((...parts: unknown[]) => ({ kind: 'and', parts })),
  isNull: vi.fn((col) => ({ kind: 'isNull', col })),
  segments: { id: 'segments.id', deletedAt: 'segments.deleted_at' },
  userSegments: {},
}))

vi.mock('../segment-membership.service', () => ({
  addMember: (...a: unknown[]) => mockAddMember(...a),
}))

const SEGMENT_ID = generateId('segment') as SegmentId
const ALICE = generateId('principal') as PrincipalId
const BOB = generateId('principal') as PrincipalId

const ADMIN_ACTOR = {
  userId: 'usr_admin' as `user_${string}`,
  email: 'admin@example.com',
  role: 'admin',
  type: 'user' as const,
  authMethod: null,
}

beforeEach(() => {
  vi.clearAllMocks()
  mockSegmentFindFirst.mockResolvedValue({
    id: SEGMENT_ID,
    name: 'Beta',
    slug: 'beta',
    type: 'manual',
    description: null,
    rules: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    memberCount: 0,
  })
})

describe('assignUsersToSegment — admin audit (G11)', () => {
  it('forwards the supplied actor to addMember for every principal', async () => {
    const { assignUsersToSegment } = await import('../segment.service')
    await assignUsersToSegment(SEGMENT_ID, [ALICE, BOB], ADMIN_ACTOR)

    expect(mockAddMember).toHaveBeenCalledTimes(2)
    for (const call of mockAddMember.mock.calls) {
      const arg = call[0] as { actor: typeof ADMIN_ACTOR | null }
      expect(arg.actor).toEqual(ADMIN_ACTOR)
    }
  })

  it('omits actor when not supplied (backstop for system callers)', async () => {
    const { assignUsersToSegment } = await import('../segment.service')
    await assignUsersToSegment(SEGMENT_ID, [ALICE])

    expect(mockAddMember).toHaveBeenCalledTimes(1)
    const arg = mockAddMember.mock.calls[0][0] as { actor: unknown }
    expect(arg.actor).toBeNull()
  })
})
