<template>
  <div>
    <div class="page-header">
      <div>
        <div class="page-title">Processos</div>
        <div class="page-sub">GESTÃO E ACOMPANHAMENTO</div>
      </div>
    </div>

    <!-- ── FILTROS ──────────────────────────── -->
    <div class="filters-row">
      <input
        v-model="q"
        type="text"
        placeholder="Buscar por nome, número, cargo..."
        style="max-width:300px"
      />
      <select v-model="filterStatus">
        <option value="">Todos os status</option>
        <option>Em andamento</option>
        <option>Aguardando audiência</option>
        <option>Suspenso</option>
        <option>Concluído</option>
      </select>
      <select v-model="filterResultado">
        <option value="">Todos os resultados</option>
        <option>Procedente</option>
        <option>Improcedente</option>
        <option>Parcialmente procedente</option>
        <option>Pendente</option>
      </select>
      <span class="count-badge">{{ filtered.length }} processo(s)</span>
    </div>

    <!-- ── TABLE ────────────────────────────── -->
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
              <th>Ações</th>
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
              <td style="font-family:'DM Mono',monospace;font-size:11px">{{ fmtDate(p.inicio) }}</td>
              <td style="font-family:'DM Mono',monospace;font-size:11px">
                <span v-if="p.audiencia_data">
                  {{ fmtDate(p.audiencia_data) }}
                  <span v-if="p.audiencia_hora"> {{ p.audiencia_hora }}</span>
                </span>
                <span v-else style="color:var(--text3)">—</span>
              </td>
              <td>
                <span class="badge" :class="getStatusClass(p.status)">{{ p.status }}</span>
              </td>
              <td>
                <span class="badge" :class="getResultadoClass(p.resultado)">{{ p.resultado }}</span>
              </td>
              <td>
                <NuxtLink :to="`/processos/${p.id}`" class="btn btn-sm">Ver</NuxtLink>
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
.filters-row {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  align-items: center;
}

.count-badge {
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  color: var(--text3);
  margin-left: auto;
  letter-spacing: 0.5px;
}
</style>
