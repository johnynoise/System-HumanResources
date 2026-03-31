<template>
  <div>
    <div class="page-header">
      <div>
        <div class="page-title">Dashboard</div>
        <div class="page-sub">Visão Geral · Processos Trabalhistas</div>
      </div>
      <button class="btn btn-secondary" @click="store.exportCSV()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        Exportar CSV
      </button>
    </div>

    <!-- ── KPIs ─────────────────────────── -->
    <div class="kpi-grid">
      <div class="kpi-card navy">
        <div class="kpi-label">Total de Processos</div>
        <div class="kpi-value navy">{{ kpis.total }}</div>
        <div class="kpi-sub">cadastrados no sistema</div>
      </div>
      <div class="kpi-card warning">
        <div class="kpi-label">Em Andamento</div>
        <div class="kpi-value warning">{{ kpis.emAndamento }}</div>
        <div class="kpi-sub">processos ativos</div>
      </div>
      <div class="kpi-card error">
        <div class="kpi-label">Procedentes</div>
        <div class="kpi-value error">{{ kpis.procedentes }}</div>
        <div class="kpi-sub">
          {{ kpis.total ? pct(kpis.procedentes, kpis.total) : 0 }}% do total
        </div>
      </div>
      <div class="kpi-card positive">
        <div class="kpi-label">Improcedentes</div>
        <div class="kpi-value positive">{{ kpis.improcedentes }}</div>
        <div class="kpi-sub">
          {{ kpis.total ? pct(kpis.improcedentes, kpis.total) : 0 }}% do total
        </div>
      </div>
      <div class="kpi-card info">
        <div class="kpi-label">Duração Média</div>
        <div class="kpi-value info" style="font-size:2rem">{{ kpis.avgDuracao }}d</div>
        <div class="kpi-sub">dias por processo</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Valor Total em Causa</div>
        <div class="kpi-value" style="font-size:1.625rem">
          {{ kpis.valorTotal > 0 ? fmtCurrencyShort(kpis.valorTotal) : '—' }}
        </div>
        <div class="kpi-sub">
          {{ kpis.valorTotal > 0 ? fmtCurrency(kpis.valorTotal) : 'sem valores cadastrados' }}
        </div>
      </div>
    </div>

    <!-- ── CHARTS ROW 1 ──────────────────── -->
    <div class="charts-row" style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
      <div class="card">
        <div class="card-header">
          <div class="card-title">Resultado dos Processos</div>
        </div>
        <ProcessosDonutChart
          :procedentes="kpis.procedentes"
          :improcedentes="kpis.improcedentes"
          :parciais="kpis.parciais"
          :total="kpis.total"
        />
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">Por Centro de Custo</div>
        </div>
        <ProcessosBarChart :data="porCentroCusto" color="var(--primary-container)" />
      </div>
    </div>

    <!-- ── CHARTS ROW 2 ──────────────────── -->
    <div class="charts-row" style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
      <div class="card">
        <div class="card-header">
          <div class="card-title">Por Cargo</div>
        </div>
        <ProcessosBarChart :data="porCargo" color="#4A90D9" />
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">Últimas Atualizações</div>
        </div>
        <div v-if="recentes.length" style="display:flex;flex-direction:column;gap:0.5rem">
          <NuxtLink
            v-for="p in recentes"
            :key="p.id"
            :to="`/processos/${p.id}`"
            class="recent-item"
          >
            <div style="flex:1;min-width:0">
              <div class="recent-nome">{{ p.nome }}</div>
              <div class="recent-num">{{ p.numero }}</div>
            </div>
            <span class="badge" :class="getStatusClass(p.status)">{{ p.status }}</span>
          </NuxtLink>
        </div>
        <div v-else class="empty">
          <div class="empty-icon">📂</div>
          <div class="empty-text">Nenhum processo cadastrado</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useProcessosStore()
const { fmtCurrency, fmtCurrencyShort, getStatusClass } = useHelpers()

const kpis           = computed(() => store.kpis)
const porCentroCusto = computed(() => store.porCentroCusto)
const porCargo       = computed(() => store.porCargo)
const recentes       = computed(() => store.recentes)

function pct(val: number, total: number) {
  return Math.round((val / total) * 100)
}
</script>

<style scoped>
.recent-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0.75rem;
  background: var(--surface-container-low);
  border-radius: var(--radius-lg);
  text-decoration: none;
  transition: background 0.15s;
}
.recent-item:hover { background: var(--surface-container); }
.recent-nome {
  font-family: 'Inter', sans-serif;
  font-size: 0.8125rem;
  color: var(--on-surface);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.recent-num {
  font-family: 'Inter', sans-serif;
  font-size: 0.6875rem;
  color: var(--on-surface-variant);
  margin-top: 0.125rem;
}
</style>