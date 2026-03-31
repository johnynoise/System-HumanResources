// ══════════════════════════════════════════
// Composable: useHelpers
// Formatação, badges e utilitários globais
// ══════════════════════════════════════════

import type { StatusProcesso, ResultadoProcesso } from '~/types'

export function useHelpers() {
  // ── Formatação de datas ────────────────
  function fmtDate(d: string | undefined): string {
    if (!d) return '—'
    const [y, m, day] = d.split('-')
    return `${day}/${m}/${y}`
  }

  function fmtDateTime(iso: string | undefined): string {
    if (!iso) return '—'
    const dt = new Date(iso)
    return (
      dt.toLocaleDateString('pt-BR') +
      ' ' +
      dt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    )
  }

  function fmtCurrency(val: number): string {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  function fmtCurrencyShort(val: number): string {
    if (val >= 1_000_000) return `R$${(val / 1_000_000).toFixed(1)}M`
    if (val >= 1_000)     return `R$${(val / 1_000).toFixed(0)}k`
    return fmtCurrency(val)
  }

  function calcDuration(start: string, end?: string): number {
    const e = end || new Date().toISOString().split('T')[0]
    return Math.max(0, Math.round((new Date(e).getTime() - new Date(start).getTime()) / 86400000))
  }

  // ── Badges de Status ──────────────────
  const statusBadgeClass: Record<StatusProcesso, string> = {
    'Em andamento':        'badge-amber',
    'Aguardando audiência':'badge-blue',
    'Suspenso':            'badge-gray',
    'Concluído':           'badge-green',
  }

  function getStatusClass(s: string): string {
    return statusBadgeClass[s as StatusProcesso] || 'badge-gray'
  }

  // ── Badges de Resultado ───────────────
  const resultadoBadgeClass: Record<ResultadoProcesso, string> = {
    'Procedente':             'badge-red',
    'Improcedente':           'badge-green',
    'Parcialmente procedente':'badge-amber',
    'Pendente':               'badge-gray',
  }

  function getResultadoClass(r: string): string {
    return resultadoBadgeClass[r as ResultadoProcesso] || 'badge-gray'
  }

  // ── Data atual formatada ──────────────
  function getHeaderDate(): string {
    return new Date()
      .toLocaleDateString('pt-BR', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
      .toUpperCase()
  }

  return {
    fmtDate,
    fmtDateTime,
    fmtCurrency,
    fmtCurrencyShort,
    calcDuration,
    getStatusClass,
    getResultadoClass,
    getHeaderDate,
  }
}
