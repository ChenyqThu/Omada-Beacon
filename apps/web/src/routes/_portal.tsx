import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { fetchUserAvatar } from '@/lib/server/functions/portal'
import { PortalHeader } from '@/components/public/portal-header'
import { AuthPopoverProvider } from '@/components/auth/auth-popover-context'
import { AuthDialog } from '@/components/auth/auth-dialog'
import { PortalAccessDenied } from '@/components/portal/portal-access-denied'
import { DEFAULT_PORTAL_CONFIG } from '@/lib/shared/types/settings'
import { generateThemeCSS, getGoogleFontsUrl } from '@/lib/shared/theme'
import { resolveLocale } from '@/lib/shared/i18n'
import { PortalIntlProvider } from '@/components/portal-intl-provider'
import { evaluatePortalAccess } from '@/lib/server/domains/settings/portal-access'

/** Resolve locale from Accept-Language header on the server. */
const getPortalLocale = createServerFn({ method: 'GET' }).handler(async () => {
  const { getRequestHeaders } = await import('@tanstack/react-start/server')
  const acceptLanguage = getRequestHeaders().get('accept-language')
  return resolveLocale(acceptLanguage)
})

export const Route = createFileRoute('/_portal')({
  loader: async ({ context, location }) => {
    const { session, settings, userRole, baseUrl } = context

    const org = settings?.settings
    if (!org) {
      throw redirect({ to: '/onboarding' })
    }

    // Portal-level visibility gate (Phase 1: team-only for private portals).
    // An anonymous Better Auth session has session.user but principalType===
    // 'anonymous' — mirror the check in widget.tsx to resolve auth state.
    const portalConfig = settings?.portalConfig
    const visibility = portalConfig?.access?.visibility ?? 'public'
    const isAnonymousPrincipal = session?.user?.principalType === 'anonymous'
    const isAuthenticated = !!session?.user && !isAnonymousPrincipal
    const role = (userRole ?? null) as 'admin' | 'member' | 'user' | null
    const accessResult = evaluatePortalAccess({ visibility, role, isAuthenticated })

    if (!accessResult.granted) {
      if (accessResult.reason === 'unauthenticated') {
        // Encode the current path+search so the login page can redirect back.
        const returnTo = location.pathname + (location.searchStr ?? '')
        throw redirect({
          to: '/auth/login',
          search: { returnTo },
        })
      }
      // reason === 'unauthorized': render access-denied UI instead of the portal.
      return {
        portalAccessDenied: true as const,
        org,
        baseUrl: baseUrl ?? '',
        userRole,
        session,
        brandingData: settings?.brandingData ?? null,
        faviconData: settings?.faviconData ?? null,
        themeStyles: '',
        customCss: '',
        themeMode: 'user' as const,
        googleFontsUrl: null,
        initialUserData: undefined,
        authConfig: { found: true, oauth: {}, customProviderNames: undefined },
        locale: await getPortalLocale(),
      }
    }

    // userRole comes from bootstrap data, avatar needs to be fetched
    const avatarData = session?.user
      ? await fetchUserAvatar({
          data: { userId: session.user.id, fallbackImageUrl: session.user.image },
        })
      : null

    const brandingData = settings?.brandingData ?? null
    const faviconData = settings?.faviconData ?? null
    const brandingConfig = settings?.brandingConfig ?? {}
    const customCss = settings?.customCss ?? ''
    const publicPortalConfig = settings?.publicPortalConfig ?? null

    const themeMode = brandingConfig.themeMode ?? 'user'

    // Always generate CSS from theme config (if structured vars exist)
    const hasThemeConfig = brandingConfig.light || brandingConfig.dark
    const themeStyles = hasThemeConfig ? generateThemeCSS(brandingConfig) : ''

    // Always apply custom CSS on top (cascades over theme styles)
    const customCssToApply = customCss

    // Always load Google Fonts from theme config
    const googleFontsUrl = getGoogleFontsUrl(brandingConfig)

    const initialUserData = session?.user
      ? {
          name: session.user.name,
          email: session.user.email,
          avatarUrl: avatarData?.avatarUrl ?? null,
        }
      : undefined

    const authConfig = {
      found: true,
      oauth: publicPortalConfig?.oauth ?? DEFAULT_PORTAL_CONFIG.oauth,
      customProviderNames: publicPortalConfig?.customProviderNames,
    }

    const locale = await getPortalLocale()

    return {
      portalAccessDenied: false as const,
      org,
      baseUrl: baseUrl ?? '',
      userRole,
      session,
      brandingData,
      faviconData,
      themeStyles,
      customCss: customCssToApply,
      themeMode,
      googleFontsUrl,
      initialUserData,
      authConfig,
      locale,
    }
  },
  head: ({ loaderData }) => {
    // Favicon priority: dedicated favicon > workspace logo > default logo.png
    const faviconUrl =
      loaderData?.faviconData?.url || loaderData?.brandingData?.logoUrl || '/logo.png'

    const workspaceName = loaderData?.org?.name ?? 'Quackback'
    const description = `Share feedback, vote on feature requests, and track the ${workspaceName} roadmap.`
    const logoUrl = loaderData?.brandingData?.logoUrl || '/logo.png'

    const meta: Array<Record<string, string>> = [
      { title: workspaceName },
      { name: 'description', content: description },
      { property: 'og:site_name', content: workspaceName },
      { property: 'og:title', content: workspaceName },
      { property: 'og:description', content: description },
      { property: 'og:image', content: logoUrl },
      { name: 'twitter:title', content: workspaceName },
      { name: 'twitter:description', content: description },
    ]
    return {
      meta,
      links: [{ rel: 'icon', href: faviconUrl }],
    }
  },
  component: PortalLayout,
})

function PortalLayout() {
  const loaderData = Route.useLoaderData()
  const {
    org,
    userRole,
    brandingData,
    themeStyles,
    customCss,
    themeMode,
    googleFontsUrl,
    initialUserData,
    authConfig,
    locale,
  } = loaderData

  // Authenticated but non-team visitor on a private portal.
  if (loaderData.portalAccessDenied) {
    return (
      <PortalIntlProvider locale={locale}>
        <div className="min-h-screen bg-background">
          {themeStyles && <style dangerouslySetInnerHTML={{ __html: themeStyles }} />}
          {customCss && <style dangerouslySetInnerHTML={{ __html: customCss }} />}
          <PortalAccessDenied workspaceName={org.name} logoUrl={brandingData?.logoUrl ?? null} />
        </div>
      </PortalIntlProvider>
    )
  }

  return (
    <PortalIntlProvider locale={locale}>
      <AuthPopoverProvider>
        <div className="min-h-screen bg-background flex flex-col">
          {googleFontsUrl && <link rel="stylesheet" href={googleFontsUrl} />}
          {themeStyles && <style dangerouslySetInnerHTML={{ __html: themeStyles }} />}
          {/* Custom CSS is injected after theme styles so it can override */}
          {customCss && <style dangerouslySetInnerHTML={{ __html: customCss }} />}
          <PortalHeader
            orgName={org.name}
            orgLogo={brandingData?.logoUrl ?? null}
            userRole={userRole}
            initialUserData={initialUserData}
            showThemeToggle={themeMode === 'user'}
          />
          <main className="flex-1 w-full flex flex-col">
            <Outlet />
          </main>
          <AuthDialog authConfig={authConfig} workspaceName={org.name} />
        </div>
      </AuthPopoverProvider>
    </PortalIntlProvider>
  )
}
