import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      
      setAuth: (user, token) => {
        localStorage.setItem('token', token)
        set({ user, token })
      },
      
      logout: () => {
        localStorage.removeItem('token')
        set({ user: null, token: null })
      },
      
      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData }
        }))
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)
