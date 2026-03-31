import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()

  if (!authStore.session && !authStore.loading) {
    await authStore.initializeAuth()
  }

  const isAuthPage = to.path.startsWith('/auth/')
  const isAuthenticated = !!authStore.session

  if (isAuthPage && isAuthenticated) {
    return navigateTo('/')
  }

  if (!isAuthPage && !isAuthenticated && !authStore.loading) {
    return navigateTo('/auth/login')
  }
})
