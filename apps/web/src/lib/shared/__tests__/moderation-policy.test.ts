import { describe, it, expect } from 'vitest'
import {
  requireApprovalToToggles,
  togglesToRequireApproval,
  resolveWorkspaceModeration,
  type RequireApprovalLevel,
} from '../moderation-policy'

const LEVELS: RequireApprovalLevel[] = ['none', 'anonymous', 'authenticated', 'all']

describe('moderation-policy mapping', () => {
  it('requireApprovalToToggles maps each approval level to the right toggle pair', () => {
    expect(requireApprovalToToggles('none')).toEqual({ anonymous: false, authenticated: false })
    expect(requireApprovalToToggles('anonymous')).toEqual({ anonymous: true, authenticated: false })
    expect(requireApprovalToToggles('authenticated')).toEqual({
      anonymous: false,
      authenticated: true,
    })
    expect(requireApprovalToToggles('all')).toEqual({ anonymous: true, authenticated: true })
  })

  it('togglesToRequireApproval maps each toggle combination to the right level', () => {
    expect(togglesToRequireApproval({ anonymous: false, authenticated: false })).toBe('none')
    expect(togglesToRequireApproval({ anonymous: true, authenticated: false })).toBe('anonymous')
    expect(togglesToRequireApproval({ anonymous: false, authenticated: true })).toBe(
      'authenticated'
    )
    expect(togglesToRequireApproval({ anonymous: true, authenticated: true })).toBe('all')
  })

  it('round-trips every level (toggles -> level -> toggles is identity)', () => {
    for (const level of LEVELS) {
      expect(togglesToRequireApproval(requireApprovalToToggles(level))).toBe(level)
    }
  })
})

describe('resolveWorkspaceModeration — full axis × level matrix', () => {
  const cases: Array<
    [
      Parameters<typeof resolveWorkspaceModeration>[1],
      { anonPosts: 'on' | 'off'; signedPosts: 'on' | 'off'; comments: 'on' | 'off' },
    ]
  > = [
    ['none', { anonPosts: 'off', signedPosts: 'off', comments: 'off' }],
    ['anonymous', { anonPosts: 'on', signedPosts: 'off', comments: 'off' }],
    ['authenticated', { anonPosts: 'off', signedPosts: 'on', comments: 'off' }],
    ['all', { anonPosts: 'on', signedPosts: 'on', comments: 'on' }],
    [undefined, { anonPosts: 'off', signedPosts: 'off', comments: 'off' }],
  ]
  for (const [level, expected] of cases) {
    it(`level=${level ?? 'undefined'}`, () => {
      expect(resolveWorkspaceModeration('anonPosts', level)).toBe(expected.anonPosts)
      expect(resolveWorkspaceModeration('signedPosts', level)).toBe(expected.signedPosts)
      expect(resolveWorkspaceModeration('comments', level)).toBe(expected.comments)
    })
  }
})
