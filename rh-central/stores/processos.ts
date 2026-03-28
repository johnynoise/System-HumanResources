import { defineStore } from 'pinia'
import type { Processo, StatusProcesso, ResultadoProcesso, DashboardKPIs } from '~/types'

const STORAGE_KEY = 'rhlegal_processos'

export const useProcessosStore = defineStore('processos', {
  state: () => ({
    processos: [] as Processo[],
    loaded: false,
  }),

  getters: {
    // ── KPIs ──────────────────────────────
    kpis: (state): DashboardKPIs => {
      const data = state.processos
      const total = data.length
      const emAndamento = data.filter(
        p => p.status === 'Em andamento' || p.status === 'Aguardando audiência'
      ).length
      const procedentes   = data.filter(p => p.resultado === 'Procedente').length
      const improcedentes = data.filter(p => p.resultado === 'Improcedente').length
      const parciais      = data.filter(p => p.resultado === 'Parcialmente procedente').length
      const pendentes     = data.filter(p => p.resultado === 'Pendente').length
      const valorTotal    = data.reduce((s, p) => s + (p.valor || 0), 0)

      const today = new Date().toISOString().split('T')[0]
      const durations = data
        .filter(p => p.inicio)
        .map(p => calcDuration(p.inicio, p.fim || today))
      const avgDuracao = durations.length
        ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
        : 0

      return { total, emAndamento, procedentes, improcedentes, parciais, pendentes, avgDuracao, valorTotal }
    },

    // ── Agrupamentos para gráficos ─────────
    porCentroCusto: (state): Record<string, number> => {
      return state.processos.reduce((acc, p) => {
        acc[p.cc] = (acc[p.cc] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    },

    porCargo: (state): Record<string, number> => {
      return state.processos.reduce((acc, p) => {
        acc[p.cargo] = (acc[p.cargo] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    },

    // ── Recentes ──────────────────────────
    recentes: (state): Processo[] => {
      return [...state.processos]
        .sort((a, b) => new Date(b.atualizado_em || b.criado_em).getTime() - new Date(a.atualizado_em || a.criado_em).getTime())
        .slice(0, 5)
    },

    // ── Get por ID ────────────────────────
    getById: (state) => (id: string): Processo | undefined => {
      return state.processos.find(p => p.id === id)
    },
  },

  actions: {
    // ── Carrega do localStorage ────────────
    load() {
      if (import.meta.client) {
        const raw = localStorage.getItem(STORAGE_KEY)
        this.processos = raw ? JSON.parse(raw) : []
        this.loaded = true
      }
    },

    // ── Persiste no localStorage ───────────
    persist() {
      if (import.meta.client) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.processos))
      }
    },

    // ── CRUD ──────────────────────────────
    add(processo: Omit<Processo, 'id' | 'criado_em' | 'atualizado_em' | 'atualizacoes'>) {
      const now = new Date().toISOString()
      const novo: Processo = {
        ...processo,
        id: Date.now().toString(),
        atualizacoes: [],
        criado_em: now,
        atualizado_em: now,
      }
      this.processos.unshift(novo)
      this.persist()
      return novo
    },

    update(id: string, dados: Partial<Processo>) {
      const idx = this.processos.findIndex(p => p.id === id)
      if (idx < 0) return
      this.processos[idx] = {
        ...this.processos[idx],
        ...dados,
        atualizado_em: new Date().toISOString(),
      }
      this.persist()
    },

    remove(id: string) {
      this.processos = this.processos.filter(p => p.id !== id)
      this.persist()
    },

    addAtualizacao(id: string, texto: string, autor: string) {
      const idx = this.processos.findIndex(p => p.id === id)
      if (idx < 0) return
      this.processos[idx].atualizacoes.push({
        data: new Date().toISOString(),
        texto,
        autor,
      })
      this.processos[idx].atualizado_em = new Date().toISOString()
      this.persist()
    },

    // ── Filtros ───────────────────────────
    filter(opts: {
      q?: string
      status?: StatusProcesso | ''
      resultado?: ResultadoProcesso | ''
    }): Processo[] {
      let data = this.processos
      if (opts.q) {
        const q = opts.q.toLowerCase()
        data = data.filter(p =>
          [p.nome, p.numero, p.cargo, p.cc, p.vara].join(' ').toLowerCase().includes(q)
        )
      }
      if (opts.status)    data = data.filter(p => p.status === opts.status)
      if (opts.resultado) data = data.filter(p => p.resultado === opts.resultado)
      return data
    },

    // ── Export CSV ────────────────────────
    exportCSV() {
      const cols: (keyof Processo)[] = [
        'numero','nome','cargo','cc','cpf','matricula','admissao','demissao',
        'inicio','fim','audiencia_data','audiencia_hora','vara','advogado',
        'status','resultado','valor','descricao',
      ]
      const headers = [
        'Número','Funcionário','Cargo','Centro de Custo','CPF','Matrícula',
        'Admissão','Demissão','Início','Encerramento','Data Audiência',
        'Hora Audiência','Vara','Advogado','Status','Resultado','Valor','Descrição',
      ]
      const rows = [
        headers,
        ...this.processos.map(p =>
          cols.map(c => `"${(p[c] ?? '').toString().replace(/"/g, '""')}"`)
        ),
      ]
      const csv = rows.map(r => r.join(',')).join('\n')
      const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href = url
      a.download = `processos-trabalhistas-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      URL.revokeObjectURL(url)
    },
  },
})

// ── Helper interno ─────────────────────────
function calcDuration(start: string, end: string): number {
  return Math.max(0, Math.round((new Date(end).getTime() - new Date(start).getTime()) / 86400000))
}
