/**
 * Unit tests for evaluatePortalAccess().
 *
 * Pure function — no DB, no mocks needed.
 */
import { describe, it, expect } from 'vitest'
import { evaluatePortalAccess } from '../portal-access'

describe('evaluatePortalAccess — public portal', () => {
  it('always grants when visibility is public, no session', () => {
    const result = evaluatePortalAccess({
      visibility: 'public',
      role: null,
      isAuthenticated: false,
    })
    expect(result.granted).toBe(true)
    if (result.granted) {
      expect(result.reason).toBe('public')
    }
  })

  it('always grants when visibility is public, even for anonymous session', () => {
    const result = evaluatePortalAccess({
      visibility: 'public',
      role: null,
      isAuthenticated: false,
    })
    expect(result.granted).toBe(true)
  })
})

describe('evaluatePortalAccess — private portal, team members', () => {
  it('grants access for admin', () => {
    const result = evaluatePortalAccess({
      visibility: 'private',
      role: 'admin',
      isAuthenticated: true,
    })
    expect(result.granted).toBe(true)
    if (result.granted) {
      expect(result.reason).toBe('team')
    }
  })

  it('grants access for member', () => {
    const result = evaluatePortalAccess({
      visibility: 'private',
      role: 'member',
      isAuthenticated: true,
    })
    expect(result.granted).toBe(true)
    if (result.granted) {
      expect(result.reason).toBe('team')
    }
  })
})

describe('evaluatePortalAccess — private portal, non-team', () => {
  it('returns unauthenticated when no session (anonymous)', () => {
    const result = evaluatePortalAccess({
      visibility: 'private',
      role: null,
      isAuthenticated: false,
    })
    expect(result.granted).toBe(false)
    if (!result.granted) {
      expect(result.reason).toBe('unauthenticated')
    }
  })

  it('returns unauthenticated when principal is anonymous (anonymous Better Auth session)', () => {
    const result = evaluatePortalAccess({
      visibility: 'private',
      role: null,
      isAuthenticated: false,
    })
    expect(result.granted).toBe(false)
    if (!result.granted) {
      expect(result.reason).toBe('unauthenticated')
    }
  })

  it('returns unauthorized for authenticated portal user (role=user)', () => {
    const result = evaluatePortalAccess({
      visibility: 'private',
      role: 'user',
      isAuthenticated: true,
    })
    expect(result.granted).toBe(false)
    if (!result.granted) {
      expect(result.reason).toBe('unauthorized')
    }
  })
})
