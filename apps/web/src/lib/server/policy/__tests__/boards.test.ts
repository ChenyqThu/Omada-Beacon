import { describe, it, expect } from 'vitest'
import { canViewBoard } from '../boards'
import { ANONYMOUS_ACTOR, type Actor } from '../types'
import type { SegmentId, PrincipalId } from '@quackback/ids'

const teamActor: Actor = {
  principalId: 'principal_team' as PrincipalId,
  role: 'admin',
  principalType: 'user',
  segmentIds: new Set(),
}

const portalActor: Actor = {
  principalId: 'principal_portal' as PrincipalId,
  role: 'user',
  principalType: 'user',
  segmentIds: new Set(['segment_alpha' as SegmentId]),
}

describe('canViewBoard', () => {
  it('public boards are visible to anyone', () => {
    expect(canViewBoard(ANONYMOUS_ACTOR, { audience: { kind: 'public' } }).allowed).toBe(true)
  })

  it('authenticated boards exclude anonymous viewers', () => {
    expect(canViewBoard(ANONYMOUS_ACTOR, { audience: { kind: 'authenticated' } }).allowed).toBe(
      false
    )
    expect(canViewBoard(portalActor, { audience: { kind: 'authenticated' } }).allowed).toBe(true)
  })

  it('team boards exclude portal users', () => {
    expect(canViewBoard(portalActor, { audience: { kind: 'team' } }).allowed).toBe(false)
    expect(canViewBoard(teamActor, { audience: { kind: 'team' } }).allowed).toBe(true)
  })

  it('segments-audience boards admit members of the listed segments', () => {
    const audience = { kind: 'segments' as const, segmentIds: ['segment_alpha'] }
    expect(canViewBoard(portalActor, { audience }).allowed).toBe(true)
  })

  it('segments-audience boards deny non-members', () => {
    const audience = { kind: 'segments' as const, segmentIds: ['segment_beta'] }
    expect(canViewBoard(portalActor, { audience }).allowed).toBe(false)
  })

  it('team always sees segments-audience boards regardless of membership', () => {
    const audience = { kind: 'segments' as const, segmentIds: ['segment_beta'] }
    expect(canViewBoard(teamActor, { audience }).allowed).toBe(true)
  })
})
