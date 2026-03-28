<template>
  <div>
    <div class="page-header">
      <div>
        <div class="page-title">Dashboard</div>
        <div class="page-sub">VISÃO GERAL — PROCESSOS TRABALHISTAS</div>
      </div>
      <button class="btn" @click="store.exportCSV()">↓ Exportar CSV</button>
    </div>

    <!-- ── KPIs ─────────────────────────────── -->
    <div class="kpi-grid">
      <div class="kpi-card accent">
        <div class="kpi-label">Total de Processos</div>
        <div class="kpi-value">{{ kpis.total }}</div>
        <div class="kpi-sub">cadastrados no sistema</div>
      </div>
      <div class="kpi-card amber">
        <div class="kpi-label">Em Andamento</div>
        <div class="kpi-value" style="color:var(--amber)">{{ kpis.emAndamento }}</div>
        <div class="kpi-sub">processos ativos</div>
      </div>
      <div class="kpi-card red">
        <div class="kpi-label">Procedentes</div>
        <div class="kpi-value" style="color:var(--red)">{{ kpis.procedentes }}</div>
        <div class="kpi-sub">{{ kpis.total ? pct(kpis.procedentes, kpis.total) : 0 }}% do total</div>
      </div>
      <div class="kpi-card green">
        <div class="kpi-label">Improcedentes</div>
        <div class="kpi-value" style="color:var(--green)">{{ kpis.improcedentes }}</div>
        <div class="kpi-sub">{{ kpis.total ? pct(kpis.improcedentes, kpis.total) : 0 }}% do total</div>
      </div>
      <div class="kpi-card blue">
        <div class="kpi-label">Duração Média</div>
        <div class="kpi-value" style="color:var(--blue);font-size:28px">{{ kpis.avgDuracao }}d</div>
        <div class="kpi-sub">dias por processo</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Valor Total em Causa</div>
        <div class="kpi-value" style="font-size:22px">
          {{ kpis.valorTotal > 0 ? fmtCurrencyShort(kpis.valorTotal) : '—' }}
        </div>
        <div class="kpi-sub">
          {{ kpis.valorTotal > 0 ? fmtCurrency(kpis.valorTotal) : 'sem valores cadastrados' }}
        </div>
      </div>
    </div>

    <!-- ── CHARTS ROW 1 ──────────────────────── -->
    <div class="charts-row" style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
      <!-- Donut -->
      <div class="card">
        <div class="card-title">Procedente vs Improcedente</div>
        <ProcessosDonutChart
          :procedentes="kpis.procedentes"
          :improcedentes="kpis.improcedentes"
          :parciais="kpis.parciais"
          :total="kpis.total"
        />
      </div>

      <!-- CC -->
      <div class="card">
        <div class="card-title">Por Centro de Custo</div>
        <ProcessosBarChart :data="porCentroCusto" color="var(--accent)" />
      </div>
    </div>

    <!-- ── CHARTS ROW 2 ──────────────────────── -->
    <div class="charts-row" style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      <!-- Cargo -->
      <div class="card">
        <div class="card-title">Por Cargo</div>
        <ProcessosBarChart :data="porCargo" color="var(--blue)" />
      </div>

      <!-- Recentes -->
      <div class="card">
        <div class="card-title">Últimas Atualizações</div>
        <div v-if="recentes.length" style="display:flex;flex-direction:column;gap:8px">
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

const kpis          = computed(() => store.kpis)
const porCentroCusto = computed(() => store.porCentroCusto)
const porCargo      = computed(() => store.porCargo)
const recentes      = computed(() => store.recentes)

function pct(val: number, total: number) {
  return Math.round((val / total) * 100)
}
</script>

<style scoped>
.recent-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  background: var(--surface2);
  border-radius: var(--radius);
  text-decoration: none;
  transition: background 0.15s;
}
.recent-item:hover { background: var(--surface3); }
.recent-nome { font-size: 12px; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.recent-num  { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--text3); margin-top: 2px; }
</style>
