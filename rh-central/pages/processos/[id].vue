<template>
  <div v-if="processo">
    <!-- ── HEADER ───────────────────────────── -->
    <div class="page-header">
      <div>
        <div style="margin-bottom:8px">
          <NuxtLink to="/processos/lista" class="back-link">← Voltar para lista</NuxtLink>
        </div>
        <div class="page-title">{{ processo.nome }}</div>
        <div class="page-sub" style="color:var(--accent)">{{ processo.numero }}</div>
      </div>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <NuxtLink :to="`/processos/${processo.id}/editar`" class="btn btn-primary">✎ Editar</NuxtLink>
        <button class="btn btn-danger" @click="handleDelete">✕ Excluir</button>
      </div>
    </div>

    <!-- ── BADGES ───────────────────────────── -->
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:24px">
      <span class="badge" :class="getStatusClass(processo.status)">{{ processo.status }}</span>
      <span class="badge" :class="getResultadoClass(processo.resultado)">{{ processo.resultado }}</span>
    </div>

    <!-- ── DADOS ────────────────────────────── -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px" class="detail-grid-resp">
      <!-- Funcionário -->
      <div class="card">
        <div class="card-title">Funcionário</div>
        <div class="detail-grid">
          <ProcessosDetailField label="Cargo"      :value="processo.cargo" />
          <ProcessosDetailField label="Centro de Custo" :value="processo.cc" />
          <ProcessosDetailField label="CPF"        :value="processo.cpf" />
          <ProcessosDetailField label="Matrícula"  :value="processo.matricula" />
          <ProcessosDetailField label="Admissão"   :value="fmtDate(processo.admissao)" />
          <ProcessosDetailField label="Demissão"   :value="fmtDate(processo.demissao)" />
        </div>
      </div>

      <!-- Processo -->
      <div class="card">
        <div class="card-title">Processo</div>
        <div class="detail-grid">
          <ProcessosDetailField label="Início"     :value="fmtDate(processo.inicio)" />
          <ProcessosDetailField label="Encerramento" :value="processo.fim ? fmtDate(processo.fim) : 'Em aberto'" />
          <ProcessosDetailField label="Duração"    :value="`${calcDuration(processo.inicio, processo.fim)} dia(s)`" />
          <ProcessosDetailField label="Valor da Causa" :value="processo.valor ? fmtCurrency(processo.valor) : '—'" />
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

    <!-- ── DESCRIÇÃO ─────────────────────────── -->
    <div v-if="processo.descricao" class="card">
      <div class="card-title">Descrição / Pedidos</div>
      <p class="descricao-text">{{ processo.descricao }}</p>
    </div>

    <!-- ── NOVA ATUALIZAÇÃO ──────────────────── -->
    <div class="card">
      <div class="card-title">Adicionar Atualização</div>
      <div class="update-input-row">
        <input v-model="updateAuthor" type="text" placeholder="Seu nome" style="max-width:180px" />
        <input v-model="updateText"   type="text" placeholder="Descreva a atualização..." style="flex:1" />
        <button class="btn btn-primary btn-sm" @click="handleAddUpdate">+ Adicionar</button>
      </div>
    </div>

    <!-- ── HISTÓRICO ─────────────────────────── -->
    <div class="card">
      <div class="card-title">Histórico de Atualizações</div>
      <div v-if="processo.atualizacoes?.length" class="update-list">
        <div
          v-for="(u, i) in [...processo.atualizacoes].reverse()"
          :key="i"
          class="update-item"
        >
          <div class="update-date">{{ fmtDateTime(u.data) }}</div>
          <div class="update-text">{{ u.texto }}</div>
          <div class="update-author">{{ u.autor }}</div>
        </div>
      </div>
      <div v-else style="color:var(--text3);font-family:'DM Mono',monospace;font-size:12px">
        Nenhuma atualização registrada.
      </div>
    </div>
  </div>

  <!-- ── NOT FOUND ──────────────────────────── -->
  <div v-else class="empty">
    <div class="empty-icon">🔍</div>
    <div class="empty-text">Processo não encontrado</div>
    <NuxtLink to="/processos/lista" class="btn" style="margin-top:16px">Voltar para lista</NuxtLink>
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
  toast('ATUALIZAÇÃO ADICIONADA')
}

async function handleDelete() {
  if (!confirm('Excluir este processo? Esta ação não pode ser desfeita.')) return
  store.remove(id)
  toast('PROCESSO EXCLUÍDO')
  await navigateTo('/processos/lista')
}
</script>

<style scoped>
.back-link {
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  color: var(--text3);
  text-decoration: none;
  letter-spacing: 0.5px;
  transition: color 0.15s;
}
.back-link:hover { color: var(--text2); }

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.descricao-text {
  font-size: 13px;
  color: var(--text2);
  line-height: 1.7;
}

.update-input-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
}

@media (max-width: 768px) {
  .detail-grid-resp { grid-template-columns: 1fr !important; }
  .detail-grid { grid-template-columns: 1fr; }
}
</style>
