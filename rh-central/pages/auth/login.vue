<template>
  <div>
    <div class="auth-card">
      <div class="auth-header">
        <h1>RH Central</h1>
        <p>Acesso ao Sistema de Gestão de Processos</p>
      </div>

      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="seu@email.com"
            required
            :disabled="authStore.loading"
          />
        </div>

        <div class="form-group">
          <label for="password">Senha</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="••••••••"
            required
            :disabled="authStore.loading"
          />
        </div>

        <button
          type="submit"
          class="btn-login"
          :disabled="authStore.loading"
        >
          {{ authStore.loading ? 'Carregando...' : 'Entrar' }}
        </button>

        <div v-if="authStore.error" class="error-message">
          {{ authStore.error }}
        </div>
      </form>

      <div class="auth-footer">
        <p>Não tem conta? <NuxtLink to="/auth/register">Cadastre-se</NuxtLink></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: 'auth',
})

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')

const handleLogin = async () => {
  const result = await authStore.signIn(email.value, password.value)
  if (result.success) {
    await router.push('/')
  }
}

onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push('/')
  }
})
</script>

<style scoped>

.auth-card {
  width: 100%;
  max-width: 400px;
  background: #0f0f0f;
  border: 1px solid #1f1f1f;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.auth-header {
  text-align: center;
  margin-bottom: 32px;
}

.auth-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 8px 0;
  font-family: 'Syne', sans-serif;
}

.auth-header p {
  font-size: 14px;
  color: #888888;
  margin: 0;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 13px;
  font-weight: 500;
  color: #cccccc;
  font-family: 'DM Sans', sans-serif;
}

.form-group input {
  padding: 12px 14px;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  color: #ffffff;
  font-size: 14px;
  font-family: 'DM Sans', sans-serif;
  transition: all 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #4a7c59;
  background: #242424;
}

.form-group input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-login {
  padding: 12px 16px;
  background: linear-gradient(135deg, #4a7c59 0%, #3a6b4a 100%);
  border: none;
  border-radius: 8px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'DM Sans', sans-serif;
  margin-top: 8px;
}

.btn-login:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(74, 124, 89, 0.3);
}

.btn-login:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  padding: 12px;
  background: #2a1a1a;
  border: 1px solid #5a3030;
  border-radius: 6px;
  color: #ff6b6b;
  font-size: 13px;
  text-align: center;
  font-family: 'DM Sans', sans-serif;
}

.auth-footer {
  text-align: center;
  padding-top: 24px;
  border-top: 1px solid #1f1f1f;
}

.auth-footer p {
  margin: 0;
  font-size: 13px;
  color: #888888;
  font-family: 'DM Sans', sans-serif;
}

.auth-footer a {
  color: #4a7c59;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.auth-footer a:hover {
  color: #5a9469;
}
</style>
