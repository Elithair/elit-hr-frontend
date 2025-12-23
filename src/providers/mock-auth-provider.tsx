'use client'

import { createContext, useContext, useEffect } from 'react'
import type { User } from '@/modules/auth/types/user'
import useAuthStore from '@/stores/auth-store'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  errors: Record<string, string | undefined> | null | undefined
  signIn: (email: string) => Promise<void>
  signOut: () => Promise<void>
  validateSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function MockAuthProvider({ children }: { children: React.ReactNode }) {
  const {
    user,
    isAuthenticated,
    isLoading,
    errors,
    validateSession,
    signIn: storeSignIn,
    signOut: storeSignOut,
  } = useAuthStore()

  // Initialize auth on mount - simplified for development
  useEffect(() => {
    // Only validate if not already authenticated
    if (!isAuthenticated) {
      validateSession().catch((error) => {
        console.warn('Session validation skipped:', error)
        // Don't throw - in development mode we want to continue
      })
    }
  }, []) // Run only once on mount

  const signIn = async (email: string) => {
    try {
      await storeSignIn({ email, password: 'mock', rememberMe: false })
    } catch (error) {
      console.error('Sign in failed:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      await storeSignOut()
    } catch (error) {
      console.error('Sign out failed:', error)
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    errors,
    signIn,
    signOut,
    validateSession,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within a MockAuthProvider')
  }
  return context
}
