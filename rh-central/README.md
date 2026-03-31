# RH Central

Sistema central de RH modular construído com **Nuxt 3** + **Pinia** + **Supabase**.

## Funcionalidades

### ⚖️ Processos Trabalhistas (v1.0)
- ✅ Cadastro, edição e exclusão de processos
- ✅ Dashboard com KPIs e gráficos
- ✅ Acompanhamento com filtros avançados
- ✅ Histórico de alterações
- ✅ Exportação de dados (CSV)
- 🔜 Upload e anexação de documentos

### 👥 Autenticação e Controle de Acesso (v1.0)
- ✅ Login/Logout
- ✅ Cadastro de usuários
- ✅ Controle de papéis (Admin, Gestor, Analista)
- ✅ Persistência segura em Supabase

## Stack

- **Nuxt 3** — framework Vue com file-based routing
- **Pinia** — gerenciamento de estado tipado
- **Supabase** — autenticação, banco de dados e armazenamento
- **TypeScript** — tipos para todo o domínio de RH

## Estrutura

```
rh-central/
├── assets/css/          # Design tokens e estilos globais
├── components/
│   ├── AppToast.vue
│   ├── DocumentUpload.vue  # Upload de arquivos
│   └── processos/
│       ├── ProcessosForm.vue
│       ├── ProcessosDonutChart.vue
│       ├── ProcessosBarChart.vue
│       └── ProcessosDetailField.vue
├── composables/
│   ├── useHelpers.ts    # Formatação, badges, utilitários
│   └── useToast.ts      # Notificações globais
├── layouts/
│   ├── auth.vue         # Login/Register (sem sidebar)
│   └── default.vue      # Shell autenticado: header + sidebar + main
├── lib/
│   └── supabase.ts      # Cliente Supabase
├── middleware/
│   └── auth.ts          # Proteção de rotas e autenticação
├── pages/
│   ├── index.vue        # Redirect para /processos
│   ├── auth/
│   │   ├── login.vue
│   │   └── register.vue
│   ├── usuarios/
│   │   └── index.vue    # Gestão de usuários (admin)
│   ├── processos.vue    # Sub-nav do módulo
│   └── processos/
│       ├── index.vue    # Dashboard
│       ├── lista.vue    # Listagem com filtros
│       ├── novo.vue     # Cadastro
│       ├── [id].vue     # Detalhes + histórico
│       └── [id]/
│           └── editar.vue  # Edição
├── stores/
│   ├── auth.ts          # Autenticação com Supabase
│   └── processos.ts     # Processos trabalhistas
├── types/
│   └── index.ts         # Interfaces TypeScript
└── nuxt.config.ts
```

## Setup

```bash
# Instalar dependências
npm install

# Variáveis de ambiente (verificar .env)
# VITE_SUPABASE_URL=https://...
# VITE_SUPABASE_SUPABASE_ANON_KEY=...

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview build local
npm run preview
```

## Primeiro Acesso

1. Ir para `/auth/register` e criar uma conta
2. Fazer login em `/auth/login`
3. Dashboard de processos em `/processos`

**Nota:** O primeiro usuário registrado pode ser promovido a admin no Supabase (RLS permite).

## Adicionando um novo módulo de RH

1. Crie os tipos em `types/index.ts`
2. Crie a store em `stores/nome-modulo.ts`
3. Crie as páginas em `pages/nome-modulo/`
4. Crie os componentes em `components/nome-modulo/`
5. Adicione o link no sidebar em `layouts/default.vue`

## Próximas Fases

- [ ] Upload e anexação de documentos (Supabase Storage)
- [ ] Integração com calendário de audiências
- [ ] Notificações de prazos
- [ ] Relatórios gerenciais em PDF
- [ ] Recrutamento & Seleção
- [ ] Folha de Pagamento

## Segurança

- Autenticação com Supabase Auth
- Row-Level Security (RLS) em todas as tabelas
- Senhas criptografadas
- Controle de acesso baseado em papéis
- Sem exposição de dados sensíveis

## Deploy

```bash
# Build SSR com Node
npm run build
node .output/server/index.mjs

# Ou em plataforma serverless (Vercel, Netlify, etc)
npm run build
# Deploy pasta .output/
```
