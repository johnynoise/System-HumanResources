<template>
  <div>
    <!-- ── DADOS DO PROCESSO ──────────────── -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">Dados do Processo</div>
      </div>
      <div class="form-grid">
        <div class="form-group">
          <label>Número do Processo *</label>
          <input v-model="form.numero" type="text" placeholder="0001234-56.2024.5.00.0000" />
        </div>
        <div class="form-group">
          <label>Status *</label>
          <select v-model="form.status">
            <option>Em andamento</option>
            <option>Aguardando audiência</option>
            <option>Suspenso</option>
            <option>Concluído</option>
          </select>
        </div>
        <div class="form-group">
          <label>Resultado</label>
          <select v-model="form.resultado">
            <option>Pendente</option>
            <option>Procedente</option>
            <option>Improcedente</option>
            <option>Parcialmente procedente</option>
          </select>
        </div>
        <div class="form-group">
          <label>Valor da Causa (R$)</label>
          <input v-model.number="form.valor" type="number" placeholder="0,00" step="0.01" min="0" />
        </div>
      </div>
    </div>

    <!-- ── DADOS DO FUNCIONÁRIO ───────────── -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">Dados do Funcionário</div>
      </div>
      <div class="form-grid">
        <div class="form-group">
          <label>Nome do Funcionário *</label>
          <input v-model="form.nome" type="text" placeholder="Nome completo" />
        </div>
        <div class="form-group">
          <label>CPF</label>
          <input v-model="form.cpf" type="text" placeholder="000.000.000-00" />
        </div>
        <div class="form-group">
          <label>Cargo *</label>
          <input v-model="form.cargo" type="text" placeholder="Ex: Analista de TI" />
        </div>
        <div class="form-group">
          <label>Centro de Custo *</label>
          <input v-model="form.cc" type="text" placeholder="Ex: Financeiro, TI, Logística" />
        </div>
        <div class="form-group">
          <label>Matrícula</label>
          <input v-model="form.matricula" type="text" placeholder="000000" />
        </div>
        <div class="form-group">
          <label>Data de Admissão</label>
          <input v-model="form.admissao" type="date" />
        </div>
        <div class="form-group">
          <label>Data de Demissão</label>
          <input v-model="form.demissao" type="date" />
        </div>
      </div>
    </div>

    <!-- ── DATAS E AUDIÊNCIAS ─────────────── -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">Datas e Audiências</div>
      </div>
      <div class="form-grid">
        <div class="form-group">
          <label>Data de Início do Processo *</label>
          <input v-model="form.inicio" type="date" />
        </div>
        <div class="form-group">
          <label>Data de Encerramento</label>
          <input v-model="form.fim" type="date" />
        </div>
        <div class="form-group">
          <label>Data da Próxima Audiência</label>
          <input v-model="form.audiencia_data" type="date" />
        </div>
        <div class="form-group">
          <label>Hora da Audiência</label>
          <input v-model="form.audiencia_hora" type="time" />
        </div>
        <div class="form-group">
          <label>Local / Vara</label>
          <input v-model="form.vara" type="text" placeholder="Ex: 3ª Vara do Trabalho de Manaus" />
        </div>
        <div class="form-group">
          <label>Advogado Responsável</label>
          <input v-model="form.advogado" type="text" placeholder="Nome do advogado" />
        </div>
      </div>
    </div>

    <!-- ── OBSERVAÇÕES ───────────────────── -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">Observações</div>
      </div>
      <div class="form-group">
        <label>Descrição / Pedidos</label>
        <textarea
          v-model="form.descricao"
          rows="4"
          placeholder="Descreva os pedidos, tipo de reclamação trabalhista, informações relevantes..."
        />
      </div>
    </div>

    <!-- ── ERRO ──────────────────────────── -->
    <div v-if="error" class="error-msg">{{ error }}</div>

    <!-- ── AÇÕES ─────────────────────────── -->
    <div style="display:flex;gap:0.75rem;margin-bottom:2rem;flex-wrap:wrap">
      <button class="btn btn-primary" @click="handleSubmit">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        Salvar Processo
      </button>
      <button class="btn btn-secondary" @click="resetForm">Limpar</button>
      <NuxtLink to="/processos/lista" class="btn btn-secondary">Cancelar</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Processo, StatusProcesso, ResultadoProcesso } from '~/types'

const props = defineProps<{ initial?: Processo }>()
const emit = defineEmits<{ saved: [] }>()

const store = useProcessosStore()
const error = ref('')

const defaultForm = () => ({
  numero: '', status: 'Em andamento' as StatusProcesso,
  resultado: 'Pendente' as ResultadoProcesso, valor: 0,
  nome: '', cpf: '', matricula: '', cargo: '', cc: '',
  admissao: '', demissao: '', inicio: '', fim: '',
  audiencia_data: '', audiencia_hora: '', vara: '',
  advogado: '', descricao: '',
})

const form = reactive(defaultForm())

onMounted(() => { if (props.initial) Object.assign(form, props.initial) })

function resetForm() { Object.assign(form, defaultForm()) }

function handleSubmit() {
  error.value = ''
  if (!form.numero || !form.nome || !form.cargo || !form.cc || !form.inicio) {
    error.value = 'Preencha os campos obrigatórios: Número, Funcionário, Cargo, Centro de Custo e Data de Início.'
    return
  }
  if (props.initial?.id) {
    store.update(props.initial.id, { ...form })
  } else {
    store.add({ ...form })
  }
  emit('saved')
}
</script>