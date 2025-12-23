import { redirect } from '@tanstack/react-router'
import type { LoaderFnContext, ParsedLocation } from '@tanstack/react-router'
import useAuthStore from '@/stores/auth-store'

/**
 * Guard for routes that require authentication
 * Redirects to login page if user is not authenticated
 */
export function requireAuth({ location }: LoaderFnContext) {
  const { isAuthenticated, user } = useAuthStore.getState()

  if (!isAuthenticated || !user) {
    throw redirect({
      to: '/',
      search: {
        // Save the current location to redirect back after login
        redirect: location.href,
      },
    })
  }
}

/**
 * Guard for routes that should only be accessible to guests (non-authenticated users)
 * Redirects to dashboard if user is already authenticated
 */
export function requireGuest({
  location,
}: {
  location: ParsedLocation<{}>
}) {
  const { isAuthenticated } = useAuthStore.getState()

  if (isAuthenticated) {
    // Check if there's a redirect location in the search params
    const searchParams = new URLSearchParams(location.search)
    const redirectTo = searchParams.get('redirect')

    if (redirectTo) {
      throw redirect({
        to: redirectTo,
      })
    }

    throw redirect({
      to: '/dashboard',
    })
  }
}

/**
 * Guard that waits for auth to be loaded before rendering
 * Useful for routes that need to know auth status but don't redirect
 */
export async function waitForAuth() {
  const { isLoading } = useAuthStore.getState()

  if (isLoading) {
    // Return a promise that resolves when auth is loaded
    return new Promise((resolve) => {
      const checkAuth = () => {
        if (!useAuthStore.getState().isLoading) {
          resolve(undefined)
        } else {
          setTimeout(checkAuth, 50)
        }
      }
      checkAuth()
    })
  }
}

/**
 * Composable guard that combines multiple guards
 */
export function composeGuards(
  ...guards: Array<(ctx: LoaderFnContext) => void | Promise<void>>
) {
  return async (ctx: LoaderFnContext) => {
    for (const guard of guards) {
      await guard(ctx)
    }
  }
}

/**
 * Guard for routes that require specific user attributes
 * Example: email verification, specific roles, etc.
 */
export function requireVerifiedEmail() {
  const { user } = useAuthStore.getState()

  if (!user?.emailVerified) {
    throw redirect({
      to: '/',
    })
  }
}

/**
 * Guard for routes that require a specific role
 */
export function requireRole(requiredRole: string) {
  return () => {
    const { isAuthenticated, roles } = useAuthStore.getState()

    if (!isAuthenticated || !roles || !roles.includes(requiredRole)) {
      throw redirect({
        to: '/dashboard',
      })
    }
  }
}
