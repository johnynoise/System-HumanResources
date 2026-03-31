import { defineStore } from 'pinia'

const STORAGE_KEY = 'rhlegal_auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as null | { full_name?: string; is_admin?: boolean },
  }),

  getters: {
    isAdmin: (state) => !!state.user?.is_admin,
  },

  actions: {
    load() {
      if (import.meta.client) {
        const raw = localStorage.getItem(STORAGE_KEY)
        this.user = raw ? JSON.parse(raw) : null
      }
    },
    persist() {
      if (import.meta.client) {
        if (this.user) localStorage.setItem(STORAGE_KEY, JSON.stringify(this.user))
        else localStorage.removeItem(STORAGE_KEY)
      }
    },
    signIn(user: { full_name?: string; is_admin?: boolean }) {
      this.user = user
      this.persist()
    },
    async signOut() {
      this.user = null
      this.persist()
    },
  },
})
