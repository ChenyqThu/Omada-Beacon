import { describe, it, expect } from 'vitest'
import { hashSpec } from '../index'

// Coverage for the watcher entry point lives in two places:
//   - hashSpec (the helper this file exports) — pure, tested here.
//   - reportStatus wiring on the production deps — tested in deps.test.ts
//     since it runs against `makeReconcileDeps` directly with env-var
//     overrides.
// `startQuackbackConfigWatcher` itself glues those together with
// fs.watch + the reconciler; integration coverage is handled by the
// existing `watcher.test.ts` (file-level changes) and `reconciler.test.ts`
// (db-side effects).

describe('hashSpec', () => {
  it('returns a deterministic SHA256 hex digest of JSON.stringify(spec)', () => {
    const a = hashSpec({ workspace: { name: 'Acme' } })
    const b = hashSpec({ workspace: { name: 'Acme' } })
    expect(a).toBe(b)
    expect(a).toMatch(/^[0-9a-f]{64}$/)
  })

  it('produces different hashes for different specs', () => {
    const a = hashSpec({ workspace: { name: 'Acme' } })
    const b = hashSpec({ workspace: { name: 'Other' } })
    expect(a).not.toBe(b)
  })

  it('hashes an empty spec without throwing', () => {
    expect(hashSpec({})).toMatch(/^[0-9a-f]{64}$/)
  })
})
