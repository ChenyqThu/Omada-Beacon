# v0.11.0 — SSO Enforcement, Recovery Codes, Audit Log, Group Mapping

**Goal:** Ship workspace-wide SSO enforcement (`authConfig.ssoOidc.required`) with the load-bearing supporting features required by enterprise customers: an audit log for all security-sensitive setting changes, recovery codes as the break-glass mechanism, and IdP-attribute-based role assignment.

**Architecture:** Four phases with explicit dependencies. A (audit log) and B (recovery codes) are prerequisites for C (enforcement) so the actor can't lock themselves out and every change is traceable. D (attribute mapping) is independent of C and can land in parallel.

**Tech Stack:** TanStack Start, Better-Auth 1.6.5, Drizzle ORM + Postgres, shadcn/ui, vitest. argon2id for recovery-code hashes via Better-Auth's existing crypto stack. Crockford base32 for the human-typeable code format.

---

## Phase A — Audit log foundation (prerequisite)

Without this, every other change in this plan is non-compliant for SOC2 customers.

**Tasks:**

- A.1 — Migration `0057_audit_log.sql` + Drizzle schema for the `audit_log` table
- A.2 — `lib/server/audit/log.ts` helper + `AuditEventType` taxonomy
- A.3 — Wire `setVerifiedDomainEnforcedFn` to record entries
- A.4 — Wire `setSsoClientSecretFn` / `clearSsoClientSecretFn`
- A.5 — Wire `updateAuthConfig` (password/magic-link toggles)
- A.6 — Wire `adminResetTwoFactorFn`
- A.7 — Admin UI: `/admin/settings/security/audit-log` table + filter + CSV export

**Exit criteria:** every listed call-site writes an audit entry on success/failure; the admin UI renders the latest 100 entries with filter by event-type, actor, time range. typecheck + vitest + build green. /simplify + codex review applied.

## Phase B — Recovery codes (prerequisite)

The break-glass that replaces magic-link in Required mode.

**Tasks:**

- B.1 — Migration `0058_sso_recovery_codes.sql` + Drizzle schema for `sso_recovery_code`
- B.2 — `generateRecoveryCode()` Crockford base32 + `hashRecoveryCode` / `verifyRecoveryCode` argon2id helpers
- B.3 — `generateRecoveryCodesFn` server fn (regenerates the batch of 10, invalidates old)
- B.4 — `listRecoveryCodesFn` server fn (metadata only)
- B.5 — `consumeRecoveryCodeFn` server fn (constant-time compare, creates session)
- B.6 — `/auth/recovery` route (email + code form)
- B.7 — Admin profile + settings UI for code management
- B.8 — Generation UX with show-once modal + acknowledgement checkbox

**Exit criteria:** admin can generate codes, see metadata, sign in via `/auth/recovery` with a valid code; reuse is blocked; regenerate invalidates old. Audit-log entries written for generate/use/invalidate. Smoke + reviews green.

## Phase C — Workspace enforcement (depends on A + B)

The actual feature.

**Tasks:**

- C.1 — Extend `AuthConfig.ssoOidc` with `required?: boolean` + `allowMagicLinkUnderRequired?: boolean`
- C.2 — Refactor `isHardBoundByVerifiedDomain` → `isHardBound` with workspace-wide branch + role param
- C.3 — `revokeNonSsoTeamSessions()` helper returning count
- C.4 — `previewSsoRequiredImpactFn` server fn (counts for the confirmation modal)
- C.5 — `setSsoRequiredFn` server fn (bootstrap guard + recovery-codes prereq + session revoke + audit-log + magic-link auto-disable)
- C.6 — `lookupAuthMethodsFn` workspace-wide `sso-redirect` branch
- C.7 — Migration `0059_sso_required_default.sql` backfilling `required=false` for tenants with `ssoOidc`
- C.8 — Tri-state radio UI (Off / Per-domain / Required) + confirmation modal with impact preview
- C.9 — JIT-interaction warning banner in Required mode

**Exit criteria:** enabling Required without active recovery codes is rejected; enabling revokes non-SSO team sessions; the modal shows correct counts; `lookupAuthMethodsFn` returns `sso-redirect` for any team-surface email when Required is on; per-domain enforce still works alongside. Smoke + reviews green.

## Phase D — IdP-attribute-based auto-provisioning (independent of C)

Source-of-truth role assignment from the IdP.

**Tasks:**

- D.1 — Extend `AuthConfig.ssoOidc` with `attributeMapping?: { claimPath, rules, defaultRole, syncOnEverySignIn }`
- D.2 — `getNestedClaim` helper for dotted + URL-shaped claim paths
- D.3 — `resolveSsoRole` pure helper
- D.4 — Integrate into `handleAutoProvisionAfter` (JIT mode)
- D.5 — Integrate into `handleSsoCallbackAfter` (sync mode, opt-in)
- D.6 — Admin UI for the mapping config (claim path, rules list, default role, sync toggle)
- D.7 — Test sign-in's result panel surfaces the last claim values to help rule-writing

**Exit criteria:** new SSO users get the right role based on their group claim; sync mode demotes/promotes correctly on subsequent sign-ins; audit-log records `user.role.changed` for every mapping-driven change; admin can configure and test the mapping. Smoke + reviews green.

---

## Migrations

| Migration | Phase | Description |
|---|---|---|
| `0057_audit_log.sql` | A | New `audit_log` table |
| `0058_sso_recovery_codes.sql` | B | New `sso_recovery_code` table |
| `0059_sso_required_default.sql` | C | Backfill `authConfig.ssoOidc.required=false` for tenants with `ssoOidc` |

Phase D adds JSON fields; no migration.

---

## Per-phase review cadence

After each phase completes:

1. `bun run typecheck && bunx vitest run apps/web/src && bun run build` — must be green
2. `/simplify` parallel review (reuse + quality + efficiency)
3. Codex review with the phase context
4. Apply findings, re-verify

## TDD discipline per task

- Failing test first (red)
- Minimal implementation (green)
- Commit
- No skipping the red phase

## Risk register

Per the prior planning doc (`docs/superpowers/plans/2026-05-11-sso-test-signin-jit-role-2fa.md` lineage), key risks:

- Admin self-lockout when enabling Required → mitigated by hard recovery-code prerequisite (C.5)
- Recovery code DB leak → mitigated by argon2id (B.2)
- Sync-mode role demotion surprises → mitigated by UI warning + opt-in (D.5)
- Audit log growth → infinite retention in v0.11; configurable policy in v0.12

## Open decisions resolved

| Decision | Choice |
|---|---|
| Recovery code count | 10 (matches GitHub) |
| Recovery code charset | Crockford base32 (12 chars in `XXXX-XXXX-XXXX` shape) |
| Audit-log retention | Infinite (configurable in v0.12) |
| Magic-link on Required enable | Auto-disable, opt-in to keep via `allowMagicLinkUnderRequired` |
| Group-mapping sync default | Opt-in (JIT-only by default) |
| Recovery codes prerequisite for Required | Hard prerequisite (block enable until codes exist) |
| Naming | `authConfig.ssoOidc.required` (matches Linear/Notion/GitHub/Vercel) |
