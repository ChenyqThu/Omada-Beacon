export {
  quackbackConfigSchema,
  parseQuackbackConfig,
  type QuackbackConfig,
  type QuackbackConfigSpec,
} from './schema'
export { computeManagedPaths, isPathManaged } from './managed-paths'
export { loadConfigFile, type LoadResult } from './loader'
export { watchConfigFile, type WatchOptions } from './watcher'
export {
  reconcileFileIntoDb,
  type ReconcileDeps,
  type SettingsRow,
  type SettingsUpdate,
} from './reconciler'
export { assertNotManaged } from './managed-guard'

import { createHash } from 'node:crypto'
import { watchConfigFile } from './watcher'
import { reconcileFileIntoDb } from './reconciler'
import { makeReconcileDeps } from './deps'
import type { QuackbackConfigSpec } from './schema'

/**
 * Default config-file path. Override via env `QUACKBACK_CONFIG_FILE`.
 * The `/etc/quackback/config.yaml` location matches the ConfigMap
 * mount the controller emits for cloud Quackbacks.
 */
const DEFAULT_PATH = '/etc/quackback/config.yaml'

/**
 * Start the file watcher + reconciler. Called once at pod boot.
 * Returns a stop fn (test/teardown only).
 *
 * After every tick, calls `deps.reportStatus` with the outcome so the
 * cloud control plane can surface it on `Quackback.status.config`. The
 * reporter is a no-op when the CP env vars aren't set (self-hosters).
 */
export function startQuackbackConfigWatcher(): () => void {
  const path = process.env.QUACKBACK_CONFIG_FILE ?? DEFAULT_PATH
  const deps = makeReconcileDeps()
  return watchConfigFile(path, async (result) => {
    if (result.kind === 'absent') {
      // No file mounted — clear any prior managed paths so the UI
      // unlocks on first boot.
      await reconcileFileIntoDb({}, deps)
      await deps.reportStatus?.({ kind: 'absent' })
      return
    }
    if (result.kind === 'error') {
      console.error(`[config-file] file invalid: ${result.error}`)
      await deps.reportStatus?.({ kind: 'error', message: result.error })
      return
    }
    await reconcileFileIntoDb(result.config.spec, deps)
    await deps.reportStatus?.({
      kind: 'ok',
      configHash: hashSpec(result.config.spec),
    })
    console.log(`[config-file] reconciled spec from ${path}`)
  })
}

/**
 * SHA256 hex of `JSON.stringify(spec)`. Lets the CP detect "did the
 * file change between reconciles" without having to ship the spec
 * itself (which can carry tier limits or feature toggles operators
 * shouldn't have to look at to see "is this tenant healthy").
 */
export function hashSpec(spec: QuackbackConfigSpec): string {
  return createHash('sha256').update(JSON.stringify(spec)).digest('hex')
}
