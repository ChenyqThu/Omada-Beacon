/**
 * Portal-level access evaluation.
 *
 * Decides whether a visitor may render the portal, based on the workspace's
 * configured visibility and the visitor's authentication state.
 *
 * Phase 1: team-only gate (admin | member always pass).
 * Extension points are marked below for later phases.
 */

// =============================================================================
// Types
// =============================================================================

export type PortalVisibility = 'public' | 'private'

/** Caller-supplied context — everything the evaluator needs, nothing more. */
export interface PortalAccessContext {
  /** Resolved from portalConfig.access?.visibility. Default 'public'. */
  visibility: PortalVisibility
  /**
   * Role of the current principal. `null` means anonymous (no session, or
   * the session's principalType is 'anonymous').
   */
  role: 'admin' | 'member' | 'user' | null
  /**
   * True when the visitor has a real (non-anonymous) authenticated session.
   * An anonymous Better Auth session counts as NOT authenticated.
   */
  isAuthenticated: boolean
}

/** Discriminated union — narrows cleanly in if/switch. */
export type PortalAccessResult =
  | { granted: true; reason: 'public' | 'team' }
  | { granted: false; reason: 'unauthenticated' | 'unauthorized' }

// =============================================================================
// Evaluator
// =============================================================================

/**
 * Pure function — no I/O. Returns a typed access decision.
 *
 * Execution order:
 * 1. Public portal → always granted.
 * 2. Team member (admin | member) → granted.
 * --- EXTENSION POINT: Phase 2+ grant branches go here (domain, invite, widget) ---
 * 3. No real session → unauthenticated (redirect to login).
 * 4. Authenticated but not team → unauthorized (show access-denied screen).
 */
export function evaluatePortalAccess(ctx: PortalAccessContext): PortalAccessResult {
  // 1. Public portal — open to everyone.
  if (ctx.visibility !== 'private') {
    return { granted: true, reason: 'public' }
  }

  // 2. Team members always have access.
  if (ctx.role === 'admin' || ctx.role === 'member') {
    return { granted: true, reason: 'team' }
  }

  // --- EXTENSION POINT ---
  // Phase 2: allowed email-domain check goes here, before the final denials.
  //   if (ctx.email && isAllowedDomain(ctx.email, allowedDomains)) return { granted: true, reason: 'domain' }
  // Phase N: invite-token / widget-grant checks go here similarly.
  // -------------------------

  // 3. No real authentication → redirect to login.
  if (!ctx.isAuthenticated) {
    return { granted: false, reason: 'unauthenticated' }
  }

  // 4. Authenticated but not a team member → show access-denied UI.
  return { granted: false, reason: 'unauthorized' }
}
