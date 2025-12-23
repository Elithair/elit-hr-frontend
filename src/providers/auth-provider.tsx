import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { User } from '@/modules/auth/types/user'
import type { SignIn } from '@/modules/auth/schemas'
import useAuthStore from '@/stores/auth-store'

interface ICheckAuthorizationProps {
  entity: string
  permissions: Array<string> | undefined
}

export interface IAuthContext {
  // State from store
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  errors: Record<string, string | undefined> | null | undefined
  sessionToken: string | null
  roles: Array<string> | null

  // Actions from store
  signIn: (data: SignIn) => Promise<void>
  signOut: () => Promise<void>
  validateSession: () => Promise<void>
  checkAuthorization: (props: ICheckAuthorizationProps) => Promise<boolean>
  getRoles: () => Promise<Array<string>>
  reset: () => void
}

const AuthContext = createContext<IAuthContext | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const {
    user,
    isLoading,
    isAuthenticated,
    errors,
    sessionToken,
    roles,
    signIn,
    signOut,
    validateSession,
    checkAuthorization,
    getRoles,
    reset,
  } = useAuthStore()

  const [loadingTimeout, setLoadingTimeout] = useState(false)

  // Initialize: Validate session on mount if user is authenticated
  useEffect(() => {
    const initializeAuth = async () => {
      if (isAuthenticated && sessionToken) {
        try {
          await validateSession()
        } catch (error) {
          console.error('Failed to validate session on mount:', error)
        }
      }
    }

    initializeAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run on mount

  // Handle loading timeout to prevent flash of loading screen
  useEffect(() => {
    if (isLoading) {
      const timeoutId = setTimeout(() => {
        setLoadingTimeout(true)
      }, 1000)

      return () => clearTimeout(timeoutId)
    } else {
      setLoadingTimeout(false)
    }
  }, [isLoading])

  // Set up session validation interval (every 30 seconds when authenticated)
  useEffect(() => {
    if (!isAuthenticated) return

    const intervalId = setInterval(
      async () => {
        try {
          await validateSession()
        } catch (error) {
          console.error('Failed to validate session:', error)
        }
      },
      30 * 1000, // 30 seconds
    )

    return () => clearInterval(intervalId)
  }, [isAuthenticated, validateSession])

  // Handle page visibility changes - validate session when tab becomes visible
  useEffect(() => {
    if (!isAuthenticated) return
    console.log('Setting up visibility change listener for session validation')
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        try {
          await validateSession()
        } catch (error) {
          console.error(
            'Failed to validate session on visibility change:',
            error,
          )
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [isAuthenticated, validateSession])

  const value: IAuthContext = {
    user,
    isLoading,
    isAuthenticated,
    errors,
    sessionToken,
    roles,
    signIn,
    signOut,
    validateSession,
    checkAuthorization,
    getRoles,
    reset,
  }

  // Don't render children until loading timeout has elapsed
  if (isLoading && !loadingTimeout) {
    return null
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Hook to access the authentication context.
 * @throws Error if used outside of AuthProvider
 * @returns IAuthContext
 */
export function useAuth(): IAuthContext {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

/**
 * Hook for components that may or may not be wrapped in AuthProvider.
 * @returns IAuthContext | undefined
 */
export function useOptionalAuth(): IAuthContext | undefined {
  return useContext(AuthContext)
}
