# Fatal Model

> Plataforma inteligente para conectar clientes e profissionais com IA, confiança e privacidade.

## 📋 Sobre o Projeto

O **Fatal Model** é um marketplace que conecta clientes a profissionais anunciantes, com forte diferenciação através de **Inteligência Artificial** para busca, matching e confiança.

### Proposta de Valor
> **"Encontrar melhor. Confiar mais. Gerenciar melhor."**

### Diferenciais
- ✅ Busca inteligente com IA semântica e conversacional
- ✅ Sistema de Trust Engine para validação e confiança
- ✅ Privacidade por design
- ✅ Ranking determinístico e auditável
- ✅ Proteção automática de privacidade (Privacy Guard)

---

## 🏗️ Arquitetura

### Stack Tecnológico

**Frontend:**
- Next.js 14+ (App Router)
- React 18+
- TypeScript
- Tailwind CSS
- PWA

**Backend:**
- NestJS
- TypeScript
- Modular Monolith

**Banco de Dados:**
- PostgreSQL (dados principais)
- Prisma ORM
- Redis (cache e sessões)
- OpenSearch (busca + IA)
- MinIO/S3 (mídias)

**Infraestrutura:**
- Docker + Docker Compose
- Turborepo (monorepo)

---

## 📁 Estrutura do Projeto

```
fatal-model/
├── apps/
│   ├── web/              # Frontend Next.js
│   ├── api/              # Backend NestJS
│   └── admin/            # Dashboard admin (futuro)
│
├── packages/
│   ├── types/            # TypeScript types compartilhados
│   ├── ui/               # Componentes UI reutilizáveis
│   └── utils/            # Funções utilitárias
│
├── docker/               # Configurações Docker
│   ├── docker-compose.yml
│   └── README.md
│
└── docs/
    └── PROJECT_STATE.md  # Estado vivo do projeto
```

---

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+
- pnpm 8+
- Docker e Docker Compose

### 1. Instalar Dependências

```bash
pnpm install
```

### 2. Iniciar Serviços (PostgreSQL, Redis, OpenSearch, MinIO)

```bash
pnpm docker:up
```

### 3. Configurar Variáveis de Ambiente

```bash
# Backend
cp apps/api/.env.example apps/api/.env.local

# Frontend
cp apps/web/.env.local.example apps/web/.env.local
```

### 4. Executar Migrations do Prisma

```bash
cd apps/api
pnpm prisma:migrate
pnpm prisma:generate
```

### 5. Iniciar Aplicações em Modo Dev

```bash
# Na raiz do projeto
pnpm dev
```

Acesse:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **API Docs:** http://localhost:3001/api/docs

---

## 📚 Documentação

- [PROJECT_STATE.md](./docs/PROJECT_STATE.md) - Estado vivo do projeto
- [Docker README](./docker/README.md) - Configuração dos serviços Docker
- [API Docs](http://localhost:3001/api/docs) - Documentação Swagger da API (quando rodando)

---

## 🎯 Estado Atual

**Versão:** 0.1.0  
**Sprint:** Sprint 0 - Setup Inicial  
**Status:** 🚧 Em desenvolvimento

### Checklist Sprint 0

**Infrastructure:**
- [x] Estrutura de monorepo
- [x] Configuração Docker e docker-compose
- [x] Setup de environments
- [x] Documentação de setup

**Frontend:**
- [x] Setup Next.js
- [x] Configuração Tailwind CSS
- [x] Estrutura de pastas
- [x] Configuração de paths

**Backend:**
- [x] Setup NestJS
- [x] Estrutura modular
- [x] Variáveis de ambiente
- [x] Configuração de logging
- [x] Swagger/API documentation

**Database:**
- [x] Setup PostgreSQL
- [x] Integração Prisma ORM
- [x] Schema inicial
- [x] Setup Redis
- [x] Docker containers para DBs

**Packages:**
- [x] @fatal-model/types
- [x] @fatal-model/utils
- [x] @fatal-model/ui

---

## 🔐 Princípios de Segurança

1. **Adult-only** - Plataforma exclusiva para adultos (18+)
2. **Consentimento e segurança** são fundamentais
3. **Privacidade por design** - Separação identidade civil vs perfil público
4. **IA não é fonte de verdade** - IA assiste, não decide
5. **Ranking determinístico e auditável**
6. **Compliance com LGPD**

---

## 📈 Próximos Passos

### Sprint 1 - Fundação (Próximo)

- [ ] Sistema de autenticação (JWT + Refresh tokens)
- [ ] RBAC (Role-Based Access Control)
- [ ] User model e CRUD
- [ ] Audit logging system
- [ ] Error handling global
- [ ] Testes unitários e E2E

### Sprints Futuros

- Profile module
- Media upload
- Basic search
- Moderation system
- AI features

---

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev              # Roda todas as apps em modo dev
pnpm build            # Build de todas as apps
pnpm test             # Roda todos os testes
pnpm lint             # Lint em todas as apps

# Docker
pnpm docker:up        # Inicia serviços Docker
pnpm docker:down      # Para serviços Docker
pnpm docker:logs      # Ver logs dos serviços

# Prisma (no diretório apps/api)
pnpm prisma:generate  # Gera Prisma Client
pnpm prisma:migrate   # Executa migrations
pnpm prisma:studio    # Abre Prisma Studio
```

---

## 🤝 Contribuindo

Este é um projeto em desenvolvimento inicial. Consulte [PROJECT_STATE.md](./docs/PROJECT_STATE.md) para entender o estado atual e decisões arquiteturais.

---

## 📄 Licença

Privado - Fatal Model © 2026

---

## 🔗 Links Úteis

- [Next.js Docs](https://nextjs.org/docs)
- [NestJS Docs](https://docs.nestjs.com)
- [Prisma Docs](https://www.prisma.io/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Turborepo Docs](https://turbo.build/repo/docs)

---

**Última atualização:** 16/09/2026  
**Sprint atual:** Sprint 0 - Setup Inicial  
**Status:** 🚧 Em desenvolvimento ativo
