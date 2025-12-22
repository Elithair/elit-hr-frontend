import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

interface IAppState {
  /**
   * Remembered email
   */
  rememberedEmail: string | null
  /**
   * Selected langauge
   */
  language: string
  /**
   * Selected employee mode
   */
  employeeMode: 'employee' | 'manager'
  /**
   * Selected theme
   */
  theme: 'light' | 'dark' | 'system'
}

interface IAppActions {
  /**
   * Set remembered email
   * @param rememberedEmail
   * @returns
   */
  setRememberedEmail: (rememberedEmail: string | null) => void
  /**
   * Set selected language
   * @param language
   * @returns
   */
  setLanguage: (language: string) => void
  /**
   * Set selected employee mode
   * @param employeeMode
   * @returns
   */
  setEmployeeMode: (employeeMode: 'employee' | 'manager') => void
  /**
   * Set selected theme
   * @param theme
   * @returns
   */
  setTheme: (theme: 'light' | 'dark' | 'system') => void

  /**
   * Reset the app state
   * @returns
   */
  reset: () => void
}

const initialStates: IAppState = {
  rememberedEmail: null,
  language: 'tr',
  employeeMode: 'employee',
  theme: 'system',
}

export const useAppStore = create<IAppState & IAppActions>()(
  devtools(
    persist(
      immer((set) => ({
        ...initialStates,

        setRememberedEmail(rememberedEmail) {
          set((state) => {
            state.rememberedEmail = rememberedEmail
          })
        },

        setEmployeeMode(employeeMode) {
          set((state) => {
            state.employeeMode = employeeMode
          })
        },

        setLanguage(language) {
          set((state) => {
            state.language = language
          })
        },

        setTheme(theme) {
          set((state) => {
            state.theme = theme
          })
        },

        reset() {
          set(initialStates)
        },
      })),
      {
        name: 'app-storage',
        partialize: (state) => ({
          rememberedEmail: state.rememberedEmail,
          language: state.language,
          employeeMode: state.employeeMode,
          theme: state.theme,
        }),
      },
    ),
    {
      name: 'AppStore',
    },
  ),
)
