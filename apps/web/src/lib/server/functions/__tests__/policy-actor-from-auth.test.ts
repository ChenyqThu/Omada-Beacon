import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/server/domains/segments/segment-membership.service', () => ({
  segmentIdsForPrincipal: vi.fn(async () => new Set(['s_1', 's_2'])),
}))

import { policyActorFromAuth } from '../auth-helpers'

describe('policyActorFromAuth', () => {
  it('returns anonymous for null auth', async () => {
    const actor = await policyActorFromAuth(null)
    expect(actor.role).toBeNull()
    expect(actor.principalType).toBe('anonymous')
  })

  it('resolves segment ids for an authenticated portal user', async () => {
    const actor = await policyActorFromAuth({
      principal: { id: 'p_1', role: 'user', type: 'user' },
      user: { id: 'u_1', email: 'e@x.com' },
    } as never)
    expect(actor.principalType).toBe('user')
    expect(actor.segmentIds.size).toBe(2)
  })

  it('preserves anonymous principal type from Better Auth anon sessions', async () => {
    // Regression guard: a signed anonymous session must NOT collapse onto
    // 'user'. If it does, audience.kind='authenticated' boards and
    // moderation.requireApproval='anonymous' both leak.
    const actor = await policyActorFromAuth({
      principal: { id: 'p_anon', role: 'user', type: 'anonymous' },
      user: { id: 'u_anon', email: null },
    } as never)
    expect(actor.principalType).toBe('anonymous')
  })

  it('maps service principals to service', async () => {
    const actor = await policyActorFromAuth({
      principal: { id: 'p_svc', role: 'service', type: 'service' },
      user: { id: null, email: null },
    } as never)
    expect(actor.principalType).toBe('service')
  })
})
