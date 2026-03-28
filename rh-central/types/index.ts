// ══════════════════════════════════════════
// RH CENTRAL — TYPES
// ══════════════════════════════════════════

export interface Atualizacao {
  data: string       // ISO string
  texto: string
  autor: string
}

export interface Processo {
  id: string
  // Processo
  numero: string
  status: StatusProcesso
  resultado: ResultadoProcesso
  valor: number
  descricao: string
  // Funcionário
  nome: string
  cpf: string
  matricula: string
  cargo: string
  cc: string          // Centro de Custo
  admissao: string    // YYYY-MM-DD
  demissao: string    // YYYY-MM-DD
  // Datas
  inicio: string      // YYYY-MM-DD
  fim: string         // YYYY-MM-DD
  audiencia_data: string  // YYYY-MM-DD
  audiencia_hora: string  // HH:MM
  // Jurídico
  vara: string
  advogado: string
  // Histórico
  atualizacoes: Atualizacao[]
  criado_em: string
  atualizado_em: string
}

export type StatusProcesso =
  | 'Em andamento'
  | 'Aguardando audiência'
  | 'Suspenso'
  | 'Concluído'

export type ResultadoProcesso =
  | 'Pendente'
  | 'Procedente'
  | 'Improcedente'
  | 'Parcialmente procedente'

// ── KPIs ──────────────────────────────────
export interface DashboardKPIs {
  total: number
  emAndamento: number
  procedentes: number
  improcedentes: number
  parciais: number
  pendentes: number
  avgDuracao: number
  valorTotal: number
}

// ── Módulos futuros de RH ─────────────────
// Adicione novos módulos aqui conforme forem criados:
// export interface FolhaPagamento { ... }
// export interface Recrutamento { ... }
// export interface Treinamento { ... }
// export interface Beneficios { ... }
