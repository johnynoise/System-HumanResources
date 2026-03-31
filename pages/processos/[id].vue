<template>
  <div v-if="processo">
    <!-- ── HEADER ──────────────────────── -->
    <div class="page-header">
      <div>
        <NuxtLink to="/processos/lista" class="back-link">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Voltar para lista
        </NuxtLink>
        <div class="page-title" style="margin-top:0.5rem">{{ processo.nome }}</div>
        <div class="process-number">{{ processo.numero }}</div>
      </div>
      <div style="display:flex;gap:0.625rem;flex-wrap:wrap;align-items:flex-start">
        <NuxtLink :to="`/processos/${processo.id}/editar`" class="btn btn-primary">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          Editar
        </NuxtLink>
        <button class="btn btn-danger" @click="handleDelete">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
          Excluir
        </button>
      </div>
    </div>

    <!-- ── STATUS CHIPS ──────────────────── -->
    <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-bottom:1.75rem">
      <span class="badge" :class="getStatusClass(processo.status)">{{ processo.status }}</span>
      <span class="badge" :class="getResultadoClass(processo.resultado)">{{ processo.resultado }}</span>
      <span v-if="processo.valor" class="valor-chip">
        {{ fmtCurrency(processo.valor) }} em causa
      </span>
    </div>

    <!-- ── DATA CARDS ──────────────────── -->
    <div class="detail-grid-resp" style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
      <div class="card">
        <div class="card-header">
          <div class="card-title">Dados do Funcionário</div>
        </div>
        <div class="detail-grid">
          <ProcessosDetailField label="Cargo"           :value="processo.cargo" />
          <ProcessosDetailField label="Centro de Custo" :value="processo.cc" />
          <ProcessosDetailField label="CPF"             :value="processo.cpf" />
          <ProcessosDetailField label="Matrícula"       :value="processo.matricula" />
          <ProcessosDetailField label="Admissão"        :value="fmtDate(processo.admissao)" />
          <ProcessosDetailField label="Demissão"        :value="fmtDate(processo.demissao)" />
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">Dados do Processo</div>
        </div>
        <div class="detail-grid">
          <ProcessosDetailField label="Início"           :value="fmtDate(processo.inicio)" />
          <ProcessosDetailField label="Encerramento"     :value="processo.fim ? fmtDate(processo.fim) : 'Em aberto'" />
          <ProcessosDetailField label="Duração"          :value="`${calcDuration(processo.inicio, processo.fim)} dia(s)`" />
          <ProcessosDetailField
            label="Próx. Audiência"
            :value="processo.audiencia_data
              ? `${fmtDate(processo.audiencia_data)}${processo.audiencia_hora ? ' às ' + processo.audiencia_hora : ''}`
              : '—'"
          />
          <ProcessosDetailField label="Vara / Local"  :value="processo.vara" />
          <ProcessosDetailField label="Advogado"      :value="processo.advogado" />
        </div>
      </div>
    </div>

    <!-- ── DESCRIÇÃO ─────────────────────── -->
    <div v-if="processo.descricao" class="card">
      <div class="card-header">
        <div class="card-title">Descrição / Pedidos</div>
      </div>
      <p class="body-md" style="color:var(--on-surface-variant);line-height:1.7">
        {{ processo.descricao }}
      </p>
    </div>

    <!-- ── NOVA ATUALIZAÇÃO ──────────────── -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">Adicionar Atualização</div>
      </div>
      <div class="update-input-row">
        <input v-model="updateAuthor" type="text" placeholder="Seu nome" style="max-width:180px" />
        <input v-model="updateText"   type="text" placeholder="Descreva a atualização..." style="flex:1" />
        <button class="btn btn-primary btn-sm" @click="handleAddUpdate">Adicionar</button>
      </div>
    </div>

    <!-- ── HISTÓRICO ─────────────────────── -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">Histórico de Atualizações</div>
      </div>
      <div v-if="processo.atualizacoes?.length" class="update-list">
        <div v-for="(u, i) in [...processo.atualizacoes].reverse()" :key="i" class="update-item">
          <div class="update-date">{{ fmtDateTime(u.data) }}</div>
          <div class="update-text">{{ u.texto }}</div>
          <div class="update-author">{{ u.autor }}</div>
        </div>
      </div>
      <div v-else class="label-md" style="padding:0.5rem 0">
        Nenhuma atualização registrada.
      </div>
    </div>
  </div>

  <div v-else class="empty">
    <div class="empty-icon">🔍</div>
    <div class="empty-text">Processo não encontrado</div>
    <NuxtLink to="/processos/lista" class="btn btn-primary" style="margin-top:1.25rem">
      Voltar para lista
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const store = useProcessosStore()
const { toast } = useToast()
const { fmtDate, fmtDateTime, fmtCurrency, calcDuration, getStatusClass, getResultadoClass } = useHelpers()

const id = route.params.id as string
const processo = computed(() => store.getById(id))

const updateText   = ref('')
const updateAuthor = ref('')

function handleAddUpdate() {
  if (!updateText.value.trim()) return
  store.addAtualizacao(id, updateText.value.trim(), updateAuthor.value.trim() || 'RH')
  updateText.value   = ''
  updateAuthor.value = ''
  toast('Atualização adicionada')
}

async function handleDelete() {
  if (!confirm('Excluir este processo? Esta ação não pode ser desfeita.')) return
  store.remove(id)
  toast('Processo excluído')
  await navigateTo('/processos/lista')
}
</script>

<style scoped>
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  color: var(--on-surface-variant);
  text-decoration: none;
  letter-spacing: 0.02em;
  transition: color 0.15s;
  margin-bottom: 0.5rem;
}
.back-link:hover { color: var(--primary-container); }

.process-number {
  font-family: 'Inter', sans-serif;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--primary-container);
  letter-spacing: 0.04em;
  margin-top: 0.25rem;
}

.valor-chip {
  font-family: 'Inter', sans-serif;
  font-size: 0.6875rem;
  font-weight: 600;
  background: #F0F4FF;
  color: var(--primary-container);
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-full);
  display: inline-flex;
  align-items: center;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.update-input-row {
  display: flex;
  gap: 0.625rem;
  flex-wrap: wrap;
  align-items: center;
}

@media (max-width: 768px) {
  .detail-grid-resp { grid-template-columns: 1fr !important; }
  .detail-grid { grid-template-columns: 1fr; }
}
</style>