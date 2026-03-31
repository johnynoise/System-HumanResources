<template>
  <div class="usuarios-container">
    <div class="page-header">
      <h1>Gestão de Usuários</h1>
      <button class="btn-primary" @click="showNewUserModal = true">
        + Novo Usuário
      </button>
    </div>

    <div v-if="!authStore.isAdmin" class="warning-box">
      Apenas administradores podem gerenciar usuários.
    </div>

    <div v-else class="usuarios-list">
      <div v-if="users.length === 0" class="empty-state">
        <p>Nenhum usuário cadastrado ainda.</p>
      </div>

      <table v-else class="usuarios-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Papel</th>
            <th>Status</th>
            <th>Data de Cadastro</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" :class="{ 'inactive': !user.active }">
            <td>{{ user.full_name }}</td>
            <td class="email">{{ user.email }}</td>
            <td>
              <span class="role-badge" :class="`role-${user.role}`">
                {{ roleLabel(user.role) }}
              </span>
            </td>
            <td>
              <span class="status-badge" :class="`status-${user.active ? 'active' : 'inactive'}`">
                {{ user.active ? 'Ativo' : 'Inativo' }}
              </span>
            </td>
            <td class="date">{{ formatDate(user.created_at) }}</td>
            <td class="actions">
              <button
                class="btn-icon"
                @click="editUser(user)"
                title="Editar"
              >
                ✏️
              </button>
              <button
                class="btn-icon"
                @click="toggleUserStatus(user)"
                :title="user.active ? 'Desativar' : 'Ativar'"
              >
                {{ user.active ? '🔒' : '🔓' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showNewUserModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h2>{{ editingUser ? 'Editar Usuário' : 'Novo Usuário' }}</h2>

        <div class="form-group">
          <label>Nome Completo</label>
          <input
            v-model="form.full_name"
            type="text"
            placeholder="Nome completo"
          />
        </div>

        <div class="form-group">
          <label>Email</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="email@example.com"
            :disabled="!!editingUser"
          />
        </div>

        <div class="form-group">
          <label>Papel</label>
          <select v-model="form.role">
            <option value="analista">Analista</option>
            <option value="gestor">Gestor</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <div v-if="!editingUser" class="form-group">
          <label>Senha</label>
          <input
            v-model="form.password"
            type="password"
            placeholder="••••••••"
            minlength="6"
          />
        </div>

        <div class="modal-actions">
          <button class="btn-secondary" @click="closeModal">Cancelar</button>
          <button
            class="btn-primary"
            @click="saveUser"
            :disabled="loading"
          >
            {{ loading ? 'Salvando...' : 'Salvar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

defineRouteMiddleware('auth')

const authStore = useAuthStore()
const toast = useToast()
const router = useRouter()

interface User {
  id: string
  email: string
  full_name: string
  role: 'admin' | 'gestor' | 'analista'
  active: boolean
  created_at: string
}

const users = ref<User[]>([])
const loading = ref(false)
const showNewUserModal = ref(false)
const editingUser = ref<User | null>(null)

const form = ref({
  full_name: '',
  email: '',
  role: 'analista' as const,
  password: '',
})

const roleLabel = (role: string) => {
  const labels = {
    admin: 'Administrador',
    gestor: 'Gestor',
    analista: 'Analista',
  }
  return labels[role as keyof typeof labels] || role
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('pt-BR')
}

const fetchUsers = async () => {
  // TODO: Implementar fetch de usuários do Supabase
  // Por enquanto, será vazio até implementar a API
}

const editUser = (user: User) => {
  editingUser.value = user
  form.value = {
    full_name: user.full_name,
    email: user.email,
    role: user.role,
    password: '',
  }
  showNewUserModal.value = true
}

const closeModal = () => {
  showNewUserModal.value = false
  editingUser.value = null
  form.value = {
    full_name: '',
    email: '',
    role: 'analista',
    password: '',
  }
}

const saveUser = async () => {
  loading.value = true
  try {
    if (editingUser.value) {
      // TODO: Implementar atualização de usuário
      toast.success('Usuário atualizado com sucesso!')
    } else {
      // TODO: Implementar criação de usuário
      toast.success('Usuário criado com sucesso!')
    }
    closeModal()
    await fetchUsers()
  } catch (error: any) {
    toast.error(error.message || 'Erro ao salvar usuário')
  } finally {
    loading.value = false
  }
}

const toggleUserStatus = async (user: User) => {
  // TODO: Implementar toggle de status
}

onMounted(async () => {
  if (!authStore.isAdmin) {
    await router.push('/')
  }
  await fetchUsers()
})
</script>

<style scoped>
.usuarios-container {
  padding: 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 24px;
  font-weight: 700;
  color: var(--text);
  margin: 0;
}

.btn-primary {
  padding: 10px 16px;
  background: linear-gradient(135deg, #4a7c59 0%, #3a6b4a 100%);
  border: none;
  border-radius: 8px;
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(74, 124, 89, 0.3);
}

.warning-box {
  padding: 16px;
  background: #2a1a1a;
  border: 1px solid #5a3030;
  border-radius: 8px;
  color: #ff6b6b;
  font-size: 14px;
}

.usuarios-list {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
}

.empty-state {
  padding: 32px;
  text-align: center;
  color: var(--text3);
}

.usuarios-table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'DM Sans', sans-serif;
}

.usuarios-table thead {
  background: var(--surface2);
  border-bottom: 1px solid var(--border);
}

.usuarios-table th {
  padding: 14px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: var(--text3);
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.usuarios-table td {
  padding: 14px;
  border-bottom: 1px solid var(--border);
  font-size: 13px;
  color: var(--text2);
}

.usuarios-table tr:hover {
  background: var(--surface2);
}

.usuarios-table tr.inactive td {
  opacity: 0.6;
}

.email {
  font-family: 'DM Mono', monospace;
  font-size: 12px;
}

.date {
  font-family: 'DM Mono', monospace;
  font-size: 12px;
  color: var(--text3);
}

.role-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.role-admin {
  background: rgba(255, 107, 107, 0.1);
  color: #ff6b6b;
}

.role-gestor {
  background: rgba(74, 124, 89, 0.1);
  color: #4a7c59;
}

.role-analista {
  background: rgba(100, 150, 200, 0.1);
  color: #6496c8;
}

.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-active {
  background: rgba(74, 124, 89, 0.1);
  color: #4a7c59;
}

.status-inactive {
  background: rgba(100, 100, 100, 0.1);
  color: #888888;
}

.actions {
  display: flex;
  gap: 8px;
}

.btn-icon {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s;
}

.btn-icon:hover {
  background: var(--surface3);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 32px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal h2 {
  font-size: 18px;
  font-weight: 700;
  color: var(--text);
  margin: 0 0 24px 0;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
}

.form-group label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text3);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-group input,
.form-group select {
  padding: 10px;
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text);
  font-size: 13px;
  font-family: 'DM Sans', sans-serif;
  transition: all 0.2s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #4a7c59;
  background: var(--surface3);
}

.form-group input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.btn-secondary {
  flex: 1;
  padding: 10px;
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: var(--surface3);
}

.btn-primary {
  flex: 1;
  padding: 10px;
}
</style>
