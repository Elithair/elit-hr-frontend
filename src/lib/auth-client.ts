/**
 * Mock Better Auth Client
 * Simulates the Better Auth API responses for development and testing
 * 
 * DEVELOPMENT MODE: Auto-logged in by default for easy development
 */

import type { User } from '@/modules/auth/types/user'

export interface AuthResponse<T = any> {
  data?: T
  error?: {
    code: string
    status?: number
    message: string
  }
  token?: string
}

export interface SessionData {
  user: User
  session: {
    token: string
    activeOrganizationId: string | null
    activeTeamId: string | null
  }
}

export interface MemberRole {
  role: string
}

const STORAGE_KEY = 'mock-auth-session'

class MockAuthClient {
  private isAuthenticated = false // Start unauthenticated
  private currentUser: User | null = null
  private sessionToken: string | null = null

  constructor() {
    // Try to restore session from localStorage if it exists
    this.restoreSession()
  }

  private restoreSession() {
    if (typeof window === 'undefined') return

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const { user, token, isAuth } = JSON.parse(stored)
        this.currentUser = user
        this.sessionToken = token
        this.isAuthenticated = isAuth
        console.log('✅ Restored session from localStorage:', user.email)
      }
      // If no stored session, remain unauthenticated (no auto-login)
    } catch (error) {
      console.warn('Failed to restore mock session:', error)
      // Remain unauthenticated
    }
  }

  private saveSession() {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          user: this.currentUser,
          token: this.sessionToken,
          isAuth: this.isAuthenticated,
        })
      )
    } catch (error) {
      console.warn('Failed to save mock session:', error)
    }
  }

  private clearSession() {
    if (typeof window === 'undefined') return

    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.warn('Failed to clear mock session:', error)
    }
  }

  signIn = {
    email: async (options: {
      email: string
      password: string
      rememberMe?: boolean
    }): Promise<AuthResponse<{ token: string }>> => {
      // No artificial delay for development
      const mockToken = `token_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`

      const mockAuthUser: User = {
        id: `user_${Date.now()}`,
        name: options.email.split('@')[0],
        email: options.email,
        emailVerified: true,
        image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${options.email}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        role: 'manager',
        activeOrganizationId: 'org-001',
        activeTeamId: 'team-001',
      }

      this.isAuthenticated = true
      this.currentUser = mockAuthUser
      this.sessionToken = mockToken
      this.saveSession()

      return {
        data: { token: mockToken },
        token: mockToken,
      }
    },
  }

  signOut = async (): Promise<AuthResponse<void>> => {
    this.isAuthenticated = false
    this.currentUser = null
    this.sessionToken = null
    this.clearSession()

    return { data: undefined }
  }

  getSession = async (): Promise<AuthResponse<SessionData>> => {
    // Return error if not authenticated (no auto-login)
    if (!this.isAuthenticated || !this.currentUser) {
      return {
        error: {
          code: 'UNAUTHORIZED',
          status: 401,
          message: 'No active session',
        },
      }
    }

    return {
      data: {
        user: this.currentUser,
        session: {
          token: this.sessionToken || '',
          activeOrganizationId: this.currentUser.activeOrganizationId ?? null,
          activeTeamId: this.currentUser.activeTeamId ?? null,
        },
      },
    }
  }

  organization = {
    getActiveMemberRole: async (): Promise<AuthResponse<MemberRole>> => {
      // Always return manager role for development
      return {
        data: {
          role: 'manager',
        },
      }
    },

    hasPermission: async (_permissions: {
      [key: string]: { permissions?: Array<string> }
    }): Promise<AuthResponse<{ success: boolean; error?: string }>> => {
      // Always grant permissions in development mode
      return {
        data: {
          success: true,
        },
      }
    },
  }

  admin = {
    hasPermission: async (_permissions: {
      [key: string]: { permissions?: Array<string> }
    }): Promise<AuthResponse<{ success: boolean; error?: string }>> => {
      // Always grant admin permissions in development mode
      return {
        data: {
          success: true,
        },
      }
    },
  }
}

// Create and export a singleton instance
export const authClient = new MockAuthClient()
