import { describe, it, expect } from 'vitest'
import { tierAllows } from '../access'
import { ANONYMOUS_ACTOR, type Actor } from '../types'
import type { SegmentId, PrincipalId } from '@quackback/ids'

const anon = ANONYMOUS_ACTOR
const portal: Actor = {
  principalId: 'p_portal' as PrincipalId,
  role: 'user',
  principalType: 'user',
  segmentIds: new Set(),
}
const portalInAlpha: Actor = {
  principalId: 'p_alpha' as PrincipalId,
  role: 'user',
  principalType: 'user',
  segmentIds: new Set(['segment_alpha' as SegmentId]),
}
const service: Actor = {
  principalId: 'p_svc' as PrincipalId,
  role: 'user',
  principalType: 'service',
  segmentIds: new Set(),
}
const member: Actor = {
  principalId: 'p_mem' as PrincipalId,
  role: 'member',
  principalType: 'user',
  segmentIds: new Set(),
}
const admin: Actor = {
  principalId: 'p_admin' as PrincipalId,
  role: 'admin',
  principalType: 'user',
  segmentIds: new Set(),
}

describe('tierAllows — anonymous tier', () => {
  it.each([
    ['anon', anon],
    ['portal', portal],
    ['service', service],
    ['member', member],
    ['admin', admin],
  ] as const)('admits %s', (_, actor) => {
    expect(tierAllows(actor, 'anonymous', [])).toBe(true)
  })
})

describe('tierAllows — authenticated tier', () => {
  it('rejects anon', () => {
    expect(tierAllows(anon, 'authenticated', [])).toBe(false)
  })
  it('admits portal user', () => {
    expect(tierAllows(portal, 'authenticated', [])).toBe(true)
  })
  it('rejects service principalType', () => {
    expect(tierAllows(service, 'authenticated', [])).toBe(false)
  })
  it('admits team (member)', () => {
    expect(tierAllows(member, 'authenticated', [])).toBe(true)
  })
  it('admits team (admin)', () => {
    expect(tierAllows(admin, 'authenticated', [])).toBe(true)
  })
})

describe('tierAllows — segments tier', () => {
  const alpha = ['segment_alpha']
  it('rejects anon', () => {
    expect(tierAllows(anon, 'segments', alpha)).toBe(false)
  })
  it('rejects portal user not in segment', () => {
    expect(tierAllows(portal, 'segments', alpha)).toBe(false)
  })
  it('admits portal user in segment', () => {
    expect(tierAllows(portalInAlpha, 'segments', alpha)).toBe(true)
  })
  it('rejects service even if in segment', () => {
    const svcInAlpha: Actor = {
      ...service,
      segmentIds: new Set(['segment_alpha' as SegmentId]),
    }
    expect(tierAllows(svcInAlpha, 'segments', alpha)).toBe(false)
  })
  it('admits team regardless of segment membership', () => {
    expect(tierAllows(member, 'segments', alpha)).toBe(true)
    expect(tierAllows(admin, 'segments', alpha)).toBe(true)
  })
  it('rejects non-team when segment list is empty (fail-closed)', () => {
    expect(tierAllows(portalInAlpha, 'segments', [])).toBe(false)
  })
})

describe('tierAllows — team tier', () => {
  it('rejects everyone non-team', () => {
    expect(tierAllows(anon, 'team', [])).toBe(false)
    expect(tierAllows(portal, 'team', [])).toBe(false)
    expect(tierAllows(portalInAlpha, 'team', [])).toBe(false)
    expect(tierAllows(service, 'team', [])).toBe(false)
  })
  it('admits team', () => {
    expect(tierAllows(member, 'team', [])).toBe(true)
    expect(tierAllows(admin, 'team', [])).toBe(true)
  })
})
