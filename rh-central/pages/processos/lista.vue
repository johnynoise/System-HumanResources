<template>
  <div>
    <div class="page-header">
      <div>
        <div class="page-title">Processos</div>
        <div class="page-sub">Gestão e Acompanhamento</div>
      </div>
    </div>

    <!-- ── FILTROS — Glass Filter Bar ────── -->
    <div class="filters-bar">
      <div class="search-wrap">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          v-model="q"
          type="text"
          placeholder="Buscar por nome, número, cargo..."
          class="search-input"
        />
      </div>

      <select v-model="filterStatus" class="filter-select">
        <option value="">Todos os status</option>
        <option>Em andamento</option>
        <option>Aguardando audiência</option>
        <option>Suspenso</option>
        <option>Concluído</option>
      </select>

      <select v-model="filterResultado" class="filter-select">
        <option value="">Todos os resultados</option>
        <option>Procedente</option>
        <option>Improcedente</option>
        <option>Parcialmente procedente</option>
        <option>Pendente</option>
      </select>

      <span class="count-label">{{ filtered.length }} processo(s)</span>
    </div>

    <!-- ── TABLE ─────────────────────────── -->
    <div class="card" style="padding:0;overflow:hidden;">
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nº Processo</th>
              <th>Funcionário</th>
              <th>Cargo</th>
              <th>Centro de Custo</th>
              <th>Início</th>
              <th>Próx. Audiência</th>
              <th>Status</th>
              <th>Resultado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!filtered.length">
              <td colspan="9">
                <div class="empty">
                  <div class="empty-icon">📂</div>
                  <div class="empty-text">Nenhum processo encontrado</div>
                </div>
              </td>
            </tr>
            <tr v-for="p in filtered" :key="p.id">
              <td class="td-mono">{{ p.numero }}</td>
              <td class="td-primary">{{ p.nome }}</td>
              <td>{{ p.cargo }}</td>
              <td>{{ p.cc }}</td>
              <td style="font-family:'Inter',sans-serif;font-size:0.8125rem">{{ fmtDate(p.inicio) }}</td>
              <td style="font-family:'Inter',sans-serif;font-size:0.8125rem">
                <span v-if="p.audiencia_data">
                  {{ fmtDate(p.audiencia_data) }}
                  <span v-if="p.audiencia_hora" style="color:var(--on-surface-variant)"> {{ p.audiencia_hora }}</span>
                </span>
                <span v-else style="color:var(--outline-variant)">—</span>
              </td>
              <td>
                <span class="badge" :class="getStatusClass(p.status)">{{ p.status }}</span>
              </td>
              <td>
                <span class="badge" :class="getResultadoClass(p.resultado)">{{ p.resultado }}</span>
              </td>
              <td>
                <NuxtLink :to="`/processos/${p.id}`" class="btn btn-sm btn-secondary">
                  Ver
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { StatusProcesso, ResultadoProcesso } from '~/types'

const store = useProcessosStore()
const { fmtDate, getStatusClass, getResultadoClass } = useHelpers()

const q               = ref('')
const filterStatus    = ref<StatusProcesso | ''>('')
const filterResultado = ref<ResultadoProcesso | ''>('')

const filtered = computed(() =>
  store.filter({ q: q.value, status: filterStatus.value, resultado: filterResultado.value })
)
</script>

<style scoped>
.filters-bar {
  display: flex;
  gap: 0.625rem;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
  align-items: center;
  background: rgba(248, 249, 250, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding: 0.75rem 1rem;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-card);
  outline: 1px solid var(--outline-variant);
}

.search-wrap {
  position: relative;
  flex: 1;
  min-width: 200px;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--on-surface-variant);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding-left: 2.25rem;
}

.filter-select {
  width: auto;
  flex-shrink: 0;
}

.count-label {
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  color: var(--on-surface-variant);
  margin-left: auto;
  white-space: nowrap;
  font-weight: 500;
}
</style>