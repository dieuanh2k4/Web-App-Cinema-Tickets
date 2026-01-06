import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      customerId: null,
      
      setAuth: (user, token) => {
        localStorage.setItem('token', token)
        set({ 
          user, 
          token,
          customerId: user?.customerId || user?.id || null
        })
      },
      
      logout: () => {
        localStorage.removeItem('token')
        set({ user: null, token: null, customerId: null })
      },
      
      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData }
        }))
      },

      setCustomerId: (customerId) => {
        set({ customerId })
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)
