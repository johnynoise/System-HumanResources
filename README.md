# RH Central

Sistema central de RH modular construído com **Nuxt 3** + **Pinia** + **localStorage**.

## Módulos

| Módulo | Status |
|---|---|
| ⚖️ Processos Trabalhistas | ✅ Disponível |
| 🎯 Recrutamento & Seleção | 🔜 Em breve |
| 💰 Folha de Pagamento | 🔜 Em breve |
| 📚 Treinamentos | 🔜 Em breve |
| 🏥 Benefícios | 🔜 Em breve |

## Stack

- **Nuxt 3** — framework Vue com file-based routing e SSR opcional
- **Pinia** — gerenciamento de estado tipado
- **localStorage** — persistência sem servidor (substituível por Supabase/API futuramente)
- **TypeScript** — tipos para todo o domínio de RH

## Estrutura

```
rh-central/
├── assets/css/          # Design tokens e estilos globais
├── composables/
│   ├── useHelpers.ts    # Formatação, badges, utilitários
│   └── useToast.ts      # Notificações globais
├── layouts/
│   └── default.vue      # Shell: header + sidebar + main
├── pages/
│   ├── index.vue        # Redirect para /processos
│   ├── processos.vue    # Sub-nav do módulo
│   └── processos/
│       ├── index.vue    # Dashboard (KPIs + gráficos)
│       ├── lista.vue    # Tabela com filtros
│       ├── novo.vue     # Formulário de cadastro
│       ├── [id].vue     # Detalhes + histórico
│       └── [id]/
│           └── editar.vue  # Edição
├── components/
│   ├── AppToast.vue
│   └── processos/
│       ├── ProcessosForm.vue
│       ├── ProcessosDonutChart.vue
│       ├── ProcessosBarChart.vue
│       └── ProcessosDetailField.vue
├── stores/
│   └── processos.ts     # Pinia store com CRUD + KPIs + filtros
├── types/
│   └── index.ts         # Interfaces TypeScript do domínio
└── nuxt.config.ts
```

## Setup

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Gerar site estático (recomendado para uso interno)
npm run generate
```

## Adicionando um novo módulo de RH

1. Crie os tipos em `types/index.ts`
2. Crie a store em `stores/nome-modulo.ts`
3. Crie as páginas em `pages/nome-modulo/`
4. Crie os componentes em `components/nome-modulo/`
5. Adicione o link no sidebar em `layouts/default.vue`

## Migrar para banco de dados

O projeto usa `localStorage` para simplicidade. Para migrar para Supabase ou outra API:
- Substitua os métodos `load()` e `persist()` da store por chamadas `$fetch` ao servidor
- Crie as rotas de API em `server/api/`
- O restante do código permanece intacto

## Deploy

```bash
# Build estático (hospedagem simples: Netlify, Vercel, Nginx)
npm run generate
# Resultado em: dist/

# Ou SSR com Node
npm run build
node .output/server/index.mjs
```
