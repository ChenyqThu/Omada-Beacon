import type { ReconcileDeps } from './reconciler'

/**
 * Build the post-reconcile status reporter for `ReconcileDeps`.
 *
 * Reads CP env vars at call time so a deployment that injects them
 * later (sidecar bootstrap, ESO Secret refresh) doesn't need a pod
 * restart. Self-hosters without any of the three vars get a silent
 * no-op — there's no CP to talk to.
 *
 * One retry on transient failure: a brief CP outage shouldn't strand
 * the row in `kind=unknown` for 30+ seconds (the next reconcile tick).
 * 400 responses are treated as success — that's the server rejecting
 * an out-of-order POST, which is benign.
 *
 * Extracted from deps.ts so unit tests can drive it without dragging
 * the db / redis import graph in.
 */
export function makeReportStatus(): NonNullable<ReconcileDeps['reportStatus']> {
  return async (status) => {
    const url = process.env.QUACKBACK_CP_STATUS_URL
    const token = process.env.QUACKBACK_CP_INTERNAL_TOKEN
    const instanceId = process.env.QUACKBACK_INSTANCE_ID
    if (!url || !token || !instanceId) return // self-host: no CP, no-op

    const body = JSON.stringify({
      instanceId,
      reconciledAt: new Date().toISOString(),
      ...status,
    })
    const post = () =>
      fetch(url, {
        method: 'POST',
        headers: {
          authorization: `Bearer ${token}`,
          'content-type': 'application/json',
        },
        body,
      })

    try {
      const res = await post()
      if (res.ok || res.status === 400) return // 400 = stale write, drop
      throw new Error(`status ${res.status}`)
    } catch (firstErr) {
      // Single retry after 1s. Avoids long retry tails interfering
      // with the next reconcile tick (~30s).
      await new Promise((r) => setTimeout(r, 1000))
      try {
        const res = await post()
        if (!res.ok && res.status !== 400) {
          throw new Error(`status ${res.status}`, { cause: firstErr })
        }
      } catch (retryErr) {
        console.error('[config-file] status report failed after retry:', retryErr)
      }
    }
  }
}
