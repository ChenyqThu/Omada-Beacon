import { useForm, useController } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { FormError } from '@/components/shared/form-error'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { useUpdateBoardAccess } from '@/lib/client/mutations'
import { useSegments } from '@/lib/client/hooks/use-segments-queries'
import { GlobeAltIcon, LockClosedIcon, UsersIcon, TagIcon } from '@heroicons/react/24/solid'
import type { BoardId } from '@quackback/ids'
import type { BoardAudience, BoardModeration } from '@/lib/shared/db-types'

/**
 * Board visibility + moderation form. Backed by `audience` (BoardAudience
 * union) and `moderation` (BoardModeration).
 *
 * Exposes three of the four visibility kinds as radio buttons (public /
 * authenticated / team). When the board's stored audience is
 * `{ kind: 'segments' }`, the form shows a read-only banner directing the
 * admin to manage the segment list on the Segments admin page; the moderation
 * section is still rendered below the banner so per-board approval policy can
 * be adjusted independently of visibility.
 *
 * Submit calls `updateBoardAccessFn` (admin-only, audited) — distinct from
 * the general board update path so members can't change board visibility.
 */

interface Board {
  id: BoardId
  audience: BoardAudience
  moderation: BoardModeration
}

interface BoardAccessFormProps {
  board: Board
}

type RadioVisibility = 'public' | 'authenticated' | 'team'

type RequireApproval = BoardModeration['requireApproval']

interface FormValues {
  visibility: RadioVisibility
  requireApproval: RequireApproval
  trustedSegmentIds: string[]
}

function radioVisibility(audience: BoardAudience): RadioVisibility | null {
  switch (audience.kind) {
    case 'public':
      return 'public'
    case 'authenticated':
      return 'authenticated'
    case 'team':
      return 'team'
    case 'segments':
      return null // not representable in this form
  }
}

function formValueToAudience(value: RadioVisibility): BoardAudience {
  return { kind: value }
}

export function BoardAccessForm({ board }: BoardAccessFormProps) {
  const mutation = useUpdateBoardAccess()
  const { data: segments } = useSegments()
  const initial = radioVisibility(board.audience)
  const isSegmentAudience = initial === null

  const form = useForm<FormValues>({
    defaultValues: {
      visibility: initial ?? 'public', // placeholder; submit is gated by isSegmentAudience
      requireApproval: board.moderation.requireApproval,
      trustedSegmentIds: board.moderation.trustedSegmentIds,
    },
  })

  async function onSubmit(data: FormValues) {
    // Defensive: never overwrite a segments-audience board from this form.
    // The form value is 'public'/'authenticated'/'team' — submitting would
    // drop the segmentIds. Disabled in the UI for audience, but belt-and-
    // braces here too.
    const audiencePayload = isSegmentAudience ? undefined : formValueToAudience(data.visibility)

    mutation.mutate({
      boardId: board.id,
      ...(audiencePayload !== undefined && { audience: audiencePayload }),
      moderation: {
        requireApproval: data.requireApproval,
        trustedSegmentIds: data.trustedSegmentIds,
      },
    })
  }

  const moderationSection = <ModerationSection form={form} segments={segments ?? []} />

  if (isSegmentAudience) {
    const segmentIds = board.audience.kind === 'segments' ? board.audience.segmentIds : []
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {mutation.isError && (
            <FormError message={mutation.error?.message ?? 'An error occurred'} />
          )}

          <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
            <div className="flex items-start gap-3">
              <TagIcon className="h-4 w-4 text-muted-foreground mt-1" />
              <div className="space-y-1">
                <p className="font-medium text-sm">Restricted to specific segments</p>
                <p className="text-xs text-muted-foreground">
                  This board is currently visible only to members of {segmentIds.length} segment
                  {segmentIds.length === 1 ? '' : 's'}. Edit the segment list from Settings → Access
                  → Segments, or switch this board to one of the standard visibility tiers via the
                  API / updateBoardAccessFn.
                </p>
              </div>
            </div>
          </div>

          {moderationSection}

          <div className="flex justify-end">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving...' : 'Save changes'}
            </Button>
          </div>
        </form>
      </Form>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {mutation.isError && <FormError message={mutation.error?.message ?? 'An error occurred'} />}

        {/* Board Visibility */}
        <FormField
          control={form.control}
          name="visibility"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <div>
                <FormLabel className="text-base">Board Visibility</FormLabel>
                <FormDescription>Control who can see this board on your portal</FormDescription>
              </div>
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => field.onChange(value as RadioVisibility)}
                  value={field.value}
                  className="grid gap-3"
                >
                  <Label
                    htmlFor="visibility-public"
                    className="flex items-start gap-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/50 [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5"
                  >
                    <RadioGroupItem value="public" id="visibility-public" className="mt-0.5" />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <GlobeAltIcon className="h-4 w-4" />
                        <span className="font-medium">Public</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Anyone can view this board on your portal, including unsigned visitors.
                        Signed-in users can vote, comment, and submit feedback.
                      </p>
                    </div>
                  </Label>
                  <Label
                    htmlFor="visibility-authenticated"
                    className="flex items-start gap-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/50 [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5"
                  >
                    <RadioGroupItem
                      value="authenticated"
                      id="visibility-authenticated"
                      className="mt-0.5"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <UsersIcon className="h-4 w-4" />
                        <span className="font-medium">Authenticated</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Any signed-in portal user can view this board. Hidden from anonymous
                        visitors and search indexes.
                      </p>
                    </div>
                  </Label>
                  <Label
                    htmlFor="visibility-team"
                    className="flex items-start gap-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/50 [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5"
                  >
                    <RadioGroupItem value="team" id="visibility-team" className="mt-0.5" />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <LockClosedIcon className="h-4 w-4" />
                        <span className="font-medium">Team only</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Only admins and team members can view this board
                      </p>
                    </div>
                  </Label>
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />

        {moderationSection}

        <div className="flex justify-end">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Saving...' : 'Save changes'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

// ============================================================================
// Moderation sub-section
// ============================================================================

interface ModerationSectionProps {
  form: ReturnType<typeof useForm<FormValues>>
  segments: { id: string; name: string; color: string }[]
}

const REQUIRE_APPROVAL_OPTIONS: { value: RequireApproval; label: string; description: string }[] = [
  {
    value: 'inherit',
    label: 'Inherit workspace default',
    description: 'Use the workspace-level moderation setting.',
  },
  {
    value: 'none',
    label: 'No approval required',
    description: 'All submissions are published immediately.',
  },
  {
    value: 'anonymous',
    label: 'Require approval for anonymous users',
    description: 'Only anonymous (guest) submissions are held for review.',
  },
  {
    value: 'authenticated',
    label: 'Require approval for signed-in users',
    description: 'Submissions from signed-in portal users are held for review.',
  },
  {
    value: 'all',
    label: 'Require approval for everyone',
    description: 'All submissions are held for review regardless of login state.',
  },
]

function ModerationSection({ form, segments }: ModerationSectionProps) {
  const { field: trustedField } = useController({
    control: form.control,
    name: 'trustedSegmentIds',
  })

  function toggleSegment(id: string) {
    const current: string[] = trustedField.value ?? []
    trustedField.onChange(current.includes(id) ? current.filter((s) => s !== id) : [...current, id])
  }

  return (
    <div className="space-y-4 pt-2 border-t border-border/50">
      <div>
        <p className="text-base font-semibold leading-none tracking-tight">Post Moderation</p>
        <p className="text-sm text-muted-foreground mt-1">
          Control which submissions require admin approval before going live on this board
        </p>
      </div>

      {/* requireApproval radio */}
      <FormField
        control={form.control}
        name="requireApproval"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormControl>
              <RadioGroup
                onValueChange={(value) => field.onChange(value as RequireApproval)}
                value={field.value}
                className="grid gap-2"
              >
                {REQUIRE_APPROVAL_OPTIONS.map(({ value, label, description }) => (
                  <Label
                    key={value}
                    htmlFor={`require-approval-${value}`}
                    className="flex items-start gap-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/50 [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5"
                  >
                    <RadioGroupItem
                      value={value}
                      id={`require-approval-${value}`}
                      className="mt-0.5"
                    />
                    <div className="flex-1 space-y-0.5">
                      <span className="font-medium text-sm">{label}</span>
                      <p className="text-xs text-muted-foreground">{description}</p>
                    </div>
                  </Label>
                ))}
              </RadioGroup>
            </FormControl>
          </FormItem>
        )}
      />

      {/* trustedSegmentIds */}
      {segments.length > 0 && (
        <div className="space-y-2">
          <div>
            <p className="text-sm font-medium">Trusted segments</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Members of these segments bypass the approval requirement above
            </p>
          </div>
          <div className="grid gap-1">
            {segments.map((segment) => {
              const checked = (trustedField.value ?? []).includes(segment.id)
              return (
                <label
                  key={segment.id}
                  className="flex items-center gap-3 rounded-md px-3 py-2 cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <Checkbox checked={checked} onCheckedChange={() => toggleSegment(segment.id)} />
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: segment.color }}
                  />
                  <span className="text-sm">{segment.name}</span>
                </label>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
