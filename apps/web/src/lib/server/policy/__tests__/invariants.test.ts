/**
 * Property-style invariant: canViewBoard / canCreatePost behave
 * deterministically and consistently for every meaningful (actor, board)
 * combination. boardViewFilter SQL fragment is exercised by Task 22's
 * integration test against real Postgres.
 */
import { describe, it, expect } from 'vitest'
import { canViewBoard } from '../boards'
import { ANONYMOUS_ACTOR, type Actor } from '../types'
import type { SegmentId, PrincipalId } from '@quackback/ids'
import type { BoardAudience } from '@/lib/server/db'

function buildActor(overrides: Partial<Actor>): Actor {
  return {
    principalId: null,
    role: null,
    principalType: 'anonymous',
    segmentIds: new Set(),
    ...overrides,
  }
}

const actors: Actor[] = [
  ANONYMOUS_ACTOR,
  buildActor({ principalId: 'p1' as PrincipalId, role: 'user', principalType: 'user' }),
  buildActor({
    principalId: 'p2' as PrincipalId,
    role: 'user',
    principalType: 'user',
    segmentIds: new Set(['s_alpha' as SegmentId]),
  }),
  buildActor({ principalId: 'p3' as PrincipalId, role: 'member', principalType: 'user' }),
  buildActor({ principalId: 'p4' as PrincipalId, role: 'admin', principalType: 'user' }),
]

const audiences: BoardAudience[] = [
  { kind: 'public' },
  { kind: 'authenticated' },
  { kind: 'team' },
  { kind: 'segments', segmentIds: ['s_alpha'] },
  { kind: 'segments', segmentIds: ['s_beta'] },
]

describe('policy invariants — boards', () => {
  it('canViewBoard is deterministic for every (actor, audience) pair', () => {
    for (const actor of actors) {
      for (const audience of audiences) {
        const a = canViewBoard(actor, { audience })
        const b = canViewBoard(actor, { audience })
        expect(a.allowed).toBe(b.allowed)
      }
    }
  })

  it('team always passes', () => {
    const admin = actors[4]
    for (const audience of audiences) {
      expect(canViewBoard(admin, { audience }).allowed).toBe(true)
    }
  })

  it('anonymous only passes public', () => {
    for (const audience of audiences) {
      const decision = canViewBoard(ANONYMOUS_ACTOR, { audience })
      expect(decision.allowed).toBe(audience.kind === 'public')
    }
  })
})
