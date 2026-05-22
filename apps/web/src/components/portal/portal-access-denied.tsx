/**
 * Shown when a private portal denies an authenticated (non-team) visitor.
 *
 * Phase 1 is intentionally minimal — no request-access form.
 */
import { LockKeyholeIcon } from 'lucide-react'

interface PortalAccessDeniedProps {
  workspaceName: string
  logoUrl?: string | null
}

export function PortalAccessDenied({ workspaceName, logoUrl }: PortalAccessDeniedProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      {logoUrl ? (
        <img src={logoUrl} alt={workspaceName} className="mb-6 h-12 w-auto object-contain" />
      ) : (
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <LockKeyholeIcon className="h-6 w-6 text-muted-foreground" aria-hidden />
        </div>
      )}

      <h1 className="text-2xl font-semibold tracking-tight">{workspaceName}</h1>
      <p className="mt-2 text-lg font-medium">This portal is private</p>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        You don&apos;t currently have access. Contact the workspace for access.
      </p>
    </div>
  )
}
