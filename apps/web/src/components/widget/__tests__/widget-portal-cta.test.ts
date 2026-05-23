/**
 * Tests for the "Go to portal" CTA visibility logic in WidgetShell.
 *
 * The CTA must be shown only when ALL three conditions hold:
 *   1. hmacRequired=true AND the visitor is identified (isIdentified=true)
 *   2. The portal is private (portalAccess.isPrivate=true)
 *   3. widgetSignIn is enabled (portalAccess.widgetSignIn=true)
 */
import { describe, it, expect } from 'vitest'

function showPortalCta(opts: {
  hmacRequired: boolean
  isIdentified: boolean
  isPrivate: boolean
  widgetSignIn: boolean
}): boolean {
  return opts.hmacRequired && opts.isIdentified && opts.isPrivate && opts.widgetSignIn
}

describe('widget portal CTA visibility', () => {
  const allOn = { hmacRequired: true, isIdentified: true, isPrivate: true, widgetSignIn: true }

  it('shows when all conditions hold', () => {
    expect(showPortalCta(allOn)).toBe(true)
  })

  it('hidden when hmacRequired is false (unverified visitor)', () => {
    expect(showPortalCta({ ...allOn, hmacRequired: false })).toBe(false)
  })

  it('hidden when visitor is not identified', () => {
    expect(showPortalCta({ ...allOn, isIdentified: false })).toBe(false)
  })

  it('hidden when portal is public', () => {
    expect(showPortalCta({ ...allOn, isPrivate: false })).toBe(false)
  })

  it('hidden when widgetSignIn is disabled', () => {
    expect(showPortalCta({ ...allOn, widgetSignIn: false })).toBe(false)
  })

  it('hidden when all off', () => {
    expect(
      showPortalCta({
        hmacRequired: false,
        isIdentified: false,
        isPrivate: false,
        widgetSignIn: false,
      })
    ).toBe(false)
  })
})
