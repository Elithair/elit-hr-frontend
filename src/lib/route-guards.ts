/**
 * Route Guards for Authentication
 * Used to protect routes and redirect based on authentication status
 */

import { redirect } from '@tanstack/react-router'
import useAuthStore from '@/stores/auth-store'

/**
 * Guard to ensure user is authenticated
 * Redirects unauthenticated users to login page
 */
export function requireAuth() {
  const state = useAuthStore.getState()
  // If not authenticated, redirect to login
  if (!state.isAuthenticated || !state.user) {
    throw redirect({
      to: '/',
    })
  }
}

/**
 * Guard to ensure user is NOT authenticated (guest)
 * Redirects authenticated users to dashboard
 */
export function requireGuest() {
  const state = useAuthStore.getState()

  // If authenticated, redirect to dashboard
  if (state.isAuthenticated && state.user) {
    throw redirect({
      to: '/dashboard',
    })
  }
}

/**
 * Guard to check if user has a specific role
 * Redirects if user doesn't have the required role
 */
export function requireRole(requiredRole: string) {
  return async function () {
    const state = useAuthStore.getState()

    if (!state.isAuthenticated || !state.user) {
      throw redirect({
        to: '/',
      })
    }

    // Check if user has the required role
    if (!state.roles || !state.roles.includes(requiredRole)) {
      throw redirect({
        to: '/dashboard',
      })
    }
  }
}
