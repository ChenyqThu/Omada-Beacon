import { z } from 'zod'
import { ACCESS_TIERS, ACCESS_TIER_RANK } from '@/lib/shared/db-types'

export const createBoardSchema = z.object({
  name: z.string().min(1, 'Board name is required').max(100),
  description: z.string().max(500).optional(),
  isPublic: z.boolean().default(true),
})

export const updateBoardSchema = z.object({
  name: z.string().min(1, 'Board name is required').max(100),
  description: z.string().max(500).optional(),
})

export const deleteBoardSchema = z.object({
  confirmName: z.string(),
})

export type CreateBoardInput = z.input<typeof createBoardSchema>
export type CreateBoardOutput = z.infer<typeof createBoardSchema>
export type UpdateBoardInput = z.infer<typeof updateBoardSchema>
export type DeleteBoardInput = z.infer<typeof deleteBoardSchema>

// ============================================
// Board access (view/comment/submit + segments + approval)
// ============================================
//
// Kept alongside the other board schemas (and out of `server/`) so client
// code can import without dragging the @quackback/db/client guard. Only
// imports zod + @quackback/db/types — both are runtime-safe in any env.

const tierSchema = z.enum(ACCESS_TIERS)

/**
 * Validation for the per-action `BoardAccess` payload (view/comment/submit
 * + segmentIds + approval). Enforces the spec's tier-rank invariants so a
 * board can't accidentally land in a contradictory state (e.g. anonymous
 * comments on a team-only-visible board).
 *
 * Invariants:
 *  - `comment.rank >= view.rank` (can't be more permissive than view)
 *  - `submit.rank >= view.rank`
 *  - If ANY tier is `'segments'`, `segmentIds.length >= 1` (empty allowlist
 *    would hide the board from everyone in that tier)
 *  - `segmentIds.length <= 50` (board capacity cap)
 */
export const boardAccessSchema = z
  .object({
    view: tierSchema,
    comment: tierSchema,
    submit: tierSchema,
    segmentIds: z.array(z.string()).max(50, 'At most 50 segments per board.'),
    approval: z.object({
      posts: z.boolean(),
      comments: z.boolean(),
    }),
  })
  .superRefine((val, ctx) => {
    if (ACCESS_TIER_RANK[val.comment] < ACCESS_TIER_RANK[val.view]) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['comment'],
        message: 'Comment tier cannot be more permissive than view.',
      })
    }
    if (ACCESS_TIER_RANK[val.submit] < ACCESS_TIER_RANK[val.view]) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['submit'],
        message: 'Submit tier cannot be more permissive than view.',
      })
    }
    const anyTierSegments =
      val.view === 'segments' || val.comment === 'segments' || val.submit === 'segments'
    if (anyTierSegments && val.segmentIds.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['segmentIds'],
        message:
          'Pick at least one segment — empty allowlist hides the board from everyone in that tier.',
      })
    }
  })
