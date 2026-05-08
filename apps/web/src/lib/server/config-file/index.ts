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

import { watchConfigFile } from './watcher'
import { reconcileFileIntoDb } from './reconciler'
import { makeReconcileDeps } from './deps'

/**
 * Default config-file path. Override via env `QUACKBACK_CONFIG_FILE`.
 * The `/etc/quackback/config.yaml` location matches the ConfigMap
 * mount the controller emits for cloud Quackbacks.
 */
const DEFAULT_PATH = '/etc/quackback/config.yaml'

/**
 * Start the file watcher + reconciler. Called once at pod boot.
 * Returns a stop fn (test/teardown only).
 */
export function startQuackbackConfigWatcher(): () => void {
  const path = process.env.QUACKBACK_CONFIG_FILE ?? DEFAULT_PATH
  const deps = makeReconcileDeps()
  return watchConfigFile(path, async (result) => {
    if (result.kind === 'absent') {
      // No file mounted — clear any prior managed paths so the UI
      // unlocks on first boot.
      await reconcileFileIntoDb({}, deps)
      return
    }
    if (result.kind === 'error') {
      console.error(`[config-file] file invalid: ${result.error}`)
      return
    }
    await reconcileFileIntoDb(result.config.spec, deps)
    console.log(`[config-file] reconciled spec from ${path}`)
  })
}
