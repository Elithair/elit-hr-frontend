import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { User } from '@/modules/auth/types/user'
import type { SignIn } from '@/modules/auth/schemas'
import { authClient } from '@/lib/auth-client'

interface ICheckAuthorizationProps {
  entity: string
  permissions: Array<string> | undefined
}

interface IAuthState {
  /**
   * **-- States --**\
   * User data
   */
  user: User | null
  /**
   * **-- States --**\
   * Errors
   */
  errors: Record<string, string | undefined> | null | undefined
  /**
   * **-- States --**\
   * Loading status
   */
  isLoading: boolean
  /**
   * **-- States --**\
   * Authenticated status
   */
  isAuthenticated: boolean
  /**
   * **-- States --**\
   * Roles
   */
  roles: Array<string> | null
  /**
   * **-- States --**\
   * Active Organization ID
   */
  activeOrganizationId: string | null
  /**
   * **-- States --**\
   * Active Team ID
   */
  activeTeamId: string | null
  /**
   * **-- States --**\
   * Session Token
   */
  sessionToken: string | null

  /**
   * **-- Setters --**\
   * Set user data
   * @param user
   * @returns void
   */
  setUser: (user: User | null) => void
  /**
   * **-- Setters --**\
   * Set errors
   * @param errors
   * @returns void
   */
  setErrors: (errors: Record<string, string> | null) => void
  /**
   * **-- Setters --**\
   * Set loading status
   * @param isLoading
   * @returns void
   */
  setIsLoading: (isLoading: boolean) => void
  /**
   * **-- Setters --**\
   * Set authenticated status
   * @param isAuthenticated
   * @returns void
   */
  setIsAuthenticated: (isAuthenticated: boolean) => void
  /**
   * **-- Setters --**\
   * Set roles
   * @param roles
   * @returns void
   */
  setRoles: (roles: Array<string> | null) => void
  /**
   * **-- Setters --**\
   * Set active organization ID
   * @param activeOrganizationId
   * @returns void
   */
  setActiveOrganizationId: (activeOrganizationId: string | null) => void
  /**
   * **-- Setters --**\
   * Set active team ID
   * @param activeTeamId
   * @returns void
   */
  setActiveTeamId: (activeTeamId: string | null) => void

  /**
   * **-- Authentication Actions --**\
   * Sign in user and set user data, token, and session
   * @param email
   * @param password
   * @returns Promise<void>
   */
  signIn: ({ email, password, rememberMe }: SignIn) => Promise<void>
  /**
   * **-- Authentication Actions --**\
   * Sign out user and clear user data, token, and session
   * @returns Promise<void>
   */
  signOut: () => Promise<void>
  /**
   * **-- Authentication Actions --**\
   * Validate session and update authentication state
   * @returns Promise<void>
   */
  validateSession: () => Promise<void>

  /**
   * **-- Authorization Actions --**\
   * Check authorization
   * @param props - The properties to check authorization
   * @returns Promise<boolean>
   */
  checkAuthorization: ({
    entity,
    permissions,
  }: ICheckAuthorizationProps) => Promise<boolean>
  /**
   * **-- Authorization Actions --**\
   * Get roles
   * @returns Promise<string[]>
   */
  getRoles: () => Promise<Array<string>>
  /**
   * **-- Reset --**\
   * Reset the authentication state
   * @returns void
   */
  reset: () => void
}

const initialStates = {
  user: null,
  errors: null,
  isLoading: false,
  isAuthenticated: false,
  roles: null,
  activeOrganizationId: null,
  activeTeamId: null,
  sessionToken: null,
}

/**
 * **-- Auth Store --**\
 * This store is used to manage the authentication state of the application.\
 * **Available Stores**:
 * - `user`: The user data of the authenticated user.
 * - `errors`: The errors of the authentication state.
 * - `isLoading`: The loading status of the authentication state.
 * - `isAuthenticated`: The authenticated status of the authentication state.
 * - `roles`: The roles of the authenticated user.
 * - `activeOrganizationId`: The active organization ID of the authenticated user.
 * - `activeTeamId`: The active team ID of the authenticated user.
 * - `sessionToken`: The session token of the authenticated user.
 * \
 * **Available Actions**:
 * - `signIn()`: Sign in the user and set the user data, token, and session.
 * - `signOut()`: Sign out the user and clear the user data, token, and session.
 * - `validateAuthentication()`: Validate the authentication state of the user using session.
 * - `checkAuthorization()`: Check the authorization of the user using session.
 * - `getRoles()`: Get the roles of the authenticated user.
 *  * \
 * **Available Reset**:
 * - `reset()`: Reset the authentication state.
 */
const useAuthStore = create<IAuthState>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialStates,

        // Setters
        setUser: (user: User | null) => {
          set((state) => {
            state.user = user
          })
        },

        setErrors: (errors: Record<string, string> | null) => {
          set((state) => {
            state.errors = errors
          })
        },

        setIsLoading: (isLoading: boolean) => {
          set((state) => {
            state.isLoading = isLoading
          })
        },

        setIsAuthenticated: (isAuthenticated: boolean) => {
          set((state) => {
            state.isAuthenticated = isAuthenticated
          })
        },

        setRoles: (roles: Array<string> | null) => {
          set((state) => {
            state.roles = roles
          })
        },

        setActiveOrganizationId: (activeOrganizationId: string | null) => {
          set((state) => {
            state.activeOrganizationId = activeOrganizationId
          })
        },

        setActiveTeamId: (activeTeamId: string | null) => {
          set((state) => {
            state.activeTeamId = activeTeamId
          })
        },

        // Authentication Actions
        signIn: async ({ email, password, rememberMe }: SignIn) => {
          set((state) => {
            state.isLoading = true
            state.errors = null
          })

          try {
            const response = await authClient.signIn.email({
              email,
              password,
              rememberMe,
            })

            if (response.error) {
              const key = response.error.code
              const value = response.error.message
              set((state) => {
                state.isLoading = false
                state.errors = {
                  ...state.errors,
                  [key]: value,
                }
              })
              throw new Error(response.error.message || 'Failed to sign in')
            }

            if (!response.data) {
              set((state) => {
                state.isLoading = false
                state.errors = {
                  '500': 'common.errors.internal_server_error',
                }
              })
              throw new Error('Failed to sign in')
            }

            const { data, error } = await authClient.getSession()

            if (error) {
              const key = error.code
              const value = error.message
              set((state) => {
                state.isLoading = false
                state.errors = {
                  ...state.errors,
                  [key]: value,
                }
              })
              throw new Error(error.message || 'Failed to get session')
            }

            if (!data) {
              set((state) => {
                state.isLoading = false
                state.errors = {
                  '500': 'common.errors.internal_server_error',
                }
              })
              throw new Error('Failed to get session')
            }

            const { data: activeMemberRole, error: activeMemberRoleError } =
              await authClient.organization.getActiveMemberRole()

            if (
              activeMemberRoleError &&
              activeMemberRoleError.code !== 'NO_ACTIVE_ORGANIZATION'
            ) {
              const key = activeMemberRoleError.code
              const value = activeMemberRoleError.message
              set((state) => {
                state.isLoading = false
                state.errors = {
                  ...state.errors,
                  [key]: value,
                }
              })
              throw new Error(
                activeMemberRoleError.message ||
                'Failed to get active member role',
              )
            }

            // Check ban status from response user data
            // Note: banned and banExpires properties are not in the User type,
            // so we skip these checks for now with mock auth

            set((state) => {
              state.isLoading = false
              state.user = data.user
              state.isAuthenticated = true
              state.errors = null
              state.activeOrganizationId =
                data?.session.activeOrganizationId ?? null
              state.activeTeamId = data?.session.activeTeamId ?? null
              state.roles = activeMemberRole ? [activeMemberRole.role] : []
              state.sessionToken = data.session.token
            })
          } catch (error) {
            throw error
          }
        },

        signOut: async () => {
          set((state) => {
            state.isLoading = true
            state.errors = null
          })

          try {
            await authClient.signOut()
          } catch (error) {
            set((state) => {
              const value =
                error instanceof Error
                  ? error.message
                  : 'common.errors.internal_server_error'
              const key = error instanceof Error ? error.name : '500'
              state.isLoading = false
              state.errors = {
                [key]: value,
              }
            })
            throw error
          } finally {
            set((state) => {
              state.isLoading = false
              state.user = null
              state.isAuthenticated = false
              state.roles = null
              state.activeOrganizationId = null
              state.activeTeamId = null
            })
          }
        },

        validateSession: async () => {
          try {
            const session = await authClient.getSession()

            if (session.error) {
              const errorCode = session.error.status || session.error.code
              if (
                errorCode === 401 ||
                errorCode === 403 ||
                errorCode === 'UNAUTHORIZED'
              ) {
                // In development with auto-login, this shouldn't happen
                console.warn('Session validation failed, re-initializing...')
                get().reset()
                return
              }

              console.warn('Session validation warning:', session.error)
              return
            }

            if (!session.data) {
              console.warn(
                'No session data received - using mock auto-login',
              )
              return
            }

            const { data: activeMemberRole } =
              await authClient.organization.getActiveMemberRole()

            set((state) => {
              state.user = session.data!.user
              state.isAuthenticated = true
              state.activeOrganizationId =
                session.data!.session.activeOrganizationId ?? null
              state.activeTeamId = session.data!.session.activeTeamId ?? null
              state.roles = activeMemberRole ? [activeMemberRole.role] : []
            })
          } catch (error) {
            // In development mode, don't throw errors for session validation
            console.warn('Session validation error (ignored in dev mode):', error)
          }
        },

        // Authorization Actions
        checkAuthorization: async ({
          entity,
          permissions,
        }: ICheckAuthorizationProps) => {
          set((state) => {
            state.errors = null
          })

          try {
            const user = get().user

            if (user?.role) {
              const { data, error } = await authClient.admin.hasPermission({
                [entity]: {
                  permissions,
                },
              })

              if (error || data?.error) {
                set((state) => {
                  const key = error?.code ?? error?.status ?? '500'
                  const value = data?.error ? data.error : error?.message
                  state.errors = {
                    [key]: value as string,
                  }
                })
                return false
              }

              return data?.success ?? false
            }

            const { data, error } = await authClient.organization.hasPermission(
              {
                [entity]: {
                  permissions,
                },
              },
            )

            if (error || data?.error) {
              set((state) => {
                const key = error?.code ?? error?.status ?? '500'
                const value = data?.error ? data.error : error?.message
                state.errors = {
                  [key]: value as string,
                }
              })
              return false
            }

            return data?.success ?? false
          } catch (error) {
            set((state) => {
              const value =
                error instanceof Error
                  ? error.message
                  : 'common.errors.internal_server_error'
              const key = error instanceof Error ? error.name : '500'
              state.errors = {
                [key]: value,
              }
            })
            return false
          }
        },

        getRoles: async () => {
          try {
            const currentRoles = get().roles
            if (currentRoles && currentRoles.length > 0) {
              return currentRoles
            }

            // Fetch roles from the server if not in state
            const { data: activeMemberRole, error: activeMemberRoleError } =
              await authClient.organization.getActiveMemberRole()

            if (activeMemberRoleError || !activeMemberRole) {
              set((state) => {
                state.errors = {
                  [activeMemberRoleError?.code ?? '500']:
                    activeMemberRoleError?.message ?? 'Failed to get roles',
                }
              })
              return []
            }

            const roles = [activeMemberRole.role]
            set((state) => {
              state.roles = roles
            })

            return roles
          } catch (error) {
            set((state) => {
              const value =
                error instanceof Error
                  ? error.message
                  : 'common.errors.internal_server_error'
              const key = error instanceof Error ? error.name : '500'
              state.errors = {
                [key]: value,
              }
            })
            return []
          }
        },

        // Reset
        reset: () => {
          set((state) => {
            state.user = null
            state.errors = null
            state.isLoading = false
            state.isAuthenticated = false
            state.roles = null
            state.activeOrganizationId = null
            state.activeTeamId = null
            state.sessionToken = null
          })
        },
      })),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          roles: state.roles,
          activeOrganizationId: state.activeOrganizationId,
          activeTeamId: state.activeTeamId,
          sessionToken: state.sessionToken,
        }),
      },
    ),
    {
      name: 'AuthStore',
    },
  ),
)

export default useAuthStore
