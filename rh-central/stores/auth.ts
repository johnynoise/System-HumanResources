import { defineStore } from 'pinia'
import { supabase } from '~/lib/supabase'

export interface User {
  id: string
  email: string
  full_name: string
  role: 'admin' | 'gestor' | 'analista'
  active: boolean
}

interface AuthState {
  user: User | null
  session: any
  loading: boolean
  error: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    session: null,
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.session,
    isAdmin: (state) => state.user?.role === 'admin',
    isGestor: (state) => state.user?.role === 'gestor',
  },

  actions: {
    async signUp(email: string, password: string, fullName: string) {
      this.loading = true
      this.error = null

      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })

        if (error) throw error

        if (data.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              email,
              full_name: fullName,
              role: 'analista',
              active: true,
            })

          if (profileError) throw profileError
        }

        return { success: true }
      } catch (err: any) {
        this.error = err.message || 'Erro ao cadastrar'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async signIn(email: string, password: string) {
      this.loading = true
      this.error = null

      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        this.session = data.session

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle()

        if (profileError) throw profileError

        if (profileData) {
          this.user = profileData as User
        }

        return { success: true }
      } catch (err: any) {
        this.error = err.message || 'Erro ao fazer login'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async signOut() {
      this.loading = true
      this.error = null

      try {
        const { error } = await supabase.auth.signOut()
        if (error) throw error

        this.user = null
        this.session = null
      } catch (err: any) {
        this.error = err.message || 'Erro ao fazer logout'
      } finally {
        this.loading = false
      }
    },

    async initializeAuth() {
      this.loading = true

      try {
        const { data } = await supabase.auth.getSession()
        this.session = data.session

        if (data.session?.user) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.session.user.id)
            .maybeSingle()

          if (profileData) {
            this.user = profileData as User
          }
        }
      } catch (err: any) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async updateProfile(fullName: string) {
      if (!this.user) return

      this.loading = true
      this.error = null

      try {
        const { error } = await supabase
          .from('profiles')
          .update({ full_name: fullName, updated_at: new Date() })
          .eq('id', this.user.id)

        if (error) throw error

        this.user.full_name = fullName
        return { success: true }
      } catch (err: any) {
        this.error = err.message || 'Erro ao atualizar perfil'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },
  },
})
