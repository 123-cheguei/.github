# PROJECT STATE - FATAL MODEL

## Informações do Projeto

**Nome:** Fatal Model  
**Versão:** 0.1.0  
**Status:** DESENVOLVIMENTO  
**Última Atualização:** 16/09/2026  
**Fase Atual:** Sprint 0 - Setup Inicial  
**Sprint Atual:** 0

---

## 📋 Visão Geral

O **Fatal Model** é uma plataforma/marketplace que conecta clientes a profissionais anunciantes, com forte diferenciação através de **Inteligência Artificial** para busca, matching e confiança.

### Atores Principais
- 👤 **Clientes** - Buscam profissionais
- 💼 **Anunciantes** - Profissionais que criam perfis
- 🛡️ **Administradores** - Moderação e gestão da plataforma

### Proposta de Valor
> **"Encontrar melhor. Confiar mais. Gerenciar melhor."**

### Diferenciais Competitivos
- ✅ Uso intensivo de IA para busca e matching
- ✅ Foco em confiança e segurança
- ✅ Privacidade por design
- ✅ Busca semântica e conversacional
- ✅ Sistema de Trust Engine para validação
- ✅ Ranking determinístico e auditável

---

## 🏗️ Arquitetura

### Stack Tecnológico

**Frontend:**
- Next.js 14+ (App Router)
- React 18+
- TypeScript 5+
- Tailwind CSS
- PWA Support

**Backend:**
- NestJS
- TypeScript
- Modular Monolith (não microsserviços no MVP)

**Banco de Dados:**
- PostgreSQL (dados principais)
- Prisma ORM
- Redis (cache e sessões)
- OpenSearch (busca + IA)
- S3/Object Storage (mídias)

**Infraestrutura:**
- Docker + Docker Compose
- Cloudflare (DNS, WAF, CDN)
- Coolify (deploy inicial)

**IA:**
- LLM (Large Language Models)
- Embeddings (busca semântica)
- OpenSearch (indexação vetorial)

### Arquitetura de Deployment

```
web.local      → Frontend (Next.js)
api.local      → Backend (NestJS)
admin.local    → Dashboard administrativo
```

### Estrutura do Monorepo

```
/
├── docs/                     - Documentação do projeto
│   └── PROJECT_STATE.md     - Este arquivo (estado vivo)
│
├── apps/
│   ├── web/                 - Frontend Next.js
│   ├── api/                 - Backend NestJS
│   └── admin/               - Dashboard admin
│
├── packages/                - Código compartilhado
│   ├── types/               - TypeScript types compartilhados
│   ├── ui/                  - Componentes UI reutilizáveis
│   └── utils/               - Funções utilitárias
│
└── docker/                  - Configurações Docker
```

---

## 🔐 Decisões Arquiteturais (ADRs)

### ADR-001: Modular Monolith no MVP
**Decisão:** Começar com um monólito modular ao invés de microsserviços.  
**Razão:** Evitar complexidade prematura. Escalar quando houver necessidade real.  
**Data:** 16/09/2026

### ADR-002: PWA antes de App Nativo
**Decisão:** Construir Progressive Web App antes de aplicativos nativos.  
**Razão:** Maior alcance, menor custo de manutenção, deploy mais rápido.  
**Data:** 16/09/2026

### ADR-003: TypeScript Full Stack
**Decisão:** Usar TypeScript em todo o projeto (frontend e backend).  
**Razão:** Type safety, melhor DX, compartilhamento de tipos entre apps.  
**Data:** 16/09/2026

### ADR-004: Prisma como ORM
**Decisão:** Usar Prisma como ORM principal.  
**Razão:** Type-safe, migrations automáticas, excelente DX.  
**Data:** 16/09/2026

### ADR-005: Monorepo com Turborepo
**Decisão:** Estruturar projeto como monorepo usando Turborepo.  
**Razão:** Compartilhamento de código, build cache, desenvolvimento paralelo.  
**Data:** 16/09/2026

---

## 🛡️ Regras de Segurança e Privacidade

### Princípios Fundamentais

1. **Adult-only**
   - Plataforma exclusiva para adultos (18+)
   - Verificação de idade obrigatória

2. **Consentimento e Segurança**
   - Não são opcionais
   - Devem estar no core da arquitetura

3. **Privacidade por Design**
   - Separação entre identidade civil e perfil público
   - Privacy Guard desde o início
   - Compliance com LGPD

4. **IA não é fonte de verdade**
   - IA assiste, não decide
   - Ranking determinístico e auditável
   - Transparência nas decisões

5. **IA não controla autorização**
   - Permissões baseadas em regras claras
   - Auditoria de todas as decisões

6. **Identidade civil separada do perfil público**
   - Dados pessoais vs dados do perfil
   - Proteção de identidade real
   - Anonimização quando possível

### Requisitos de Segurança

- ✅ Age verification (18+)
- ✅ Identity verification para anunciantes
- ✅ Consent management
- ✅ LGPD compliance
- ✅ Audit logging de ações sensíveis
- ✅ Content moderation
- ✅ Fraud detection
- ✅ Secure file upload
- ✅ Data encryption at rest e in transit
- ✅ Regular security audits

---

## 📊 Sprint Atual - Sprint 0: Setup Inicial

### Objetivo
Criar a estrutura base do projeto e configurar o ambiente de desenvolvimento.

### Checklist

**Infrastructure:**
- [x] Criar estrutura de monorepo
- [ ] Configurar Docker e docker-compose
- [ ] Setup de environments (.env)
- [ ] Documentação de setup

**Frontend:**
- [ ] Setup Next.js
- [ ] Configurar Tailwind CSS
- [ ] Estrutura de pastas
- [ ] Configuração de paths (@/)

**Backend:**
- [ ] Setup NestJS
- [ ] Configurar estrutura modular
- [ ] Setup de variáveis de ambiente
- [ ] Configuração de logging

**Database:**
- [ ] Setup PostgreSQL
- [ ] Integrar Prisma ORM
- [ ] Setup Redis
- [ ] Docker containers para DBs

**DevOps:**
- [ ] Docker e docker-compose configurados
- [ ] Scripts de desenvolvimento
- [ ] Health checks
- [ ] Logs centralizados

### Resultado Esperado

```
✅ Monorepo estruturado
✅ Docker ambiente rodando
✅ web.local acessível
✅ api.local acessível
✅ PostgreSQL funcionando
✅ Redis funcionando
✅ Documentação atualizada
```

---

## 🎯 Próximo Sprint - Sprint 1: Fundação

### Objetivo
Implementar a base sólida do sistema (autenticação, autorização, audit logging).

### Escopo Planejado

**Authentication & Authorization:**
- [ ] Sistema de autenticação
- [ ] JWT + Refresh tokens
- [ ] RBAC (Role-Based Access Control)
- [ ] Password hashing (bcrypt)
- [ ] Email verification
- [ ] Password reset

**Core Features:**
- [ ] User model e CRUD
- [ ] Audit logging system
- [ ] Error handling global
- [ ] Logging estruturado
- [ ] API documentation (Swagger)
- [ ] Validation pipes
- [ ] Rate limiting

**Testing:**
- [ ] Setup de testes unitários
- [ ] Setup de testes E2E
- [ ] Coverage mínimo (80%)

---

## 📝 Backlog Priorizado

### Alta Prioridade
1. Completar Sprint 0 (Setup)
2. Implementar Sprint 1 (Fundação)
3. Profile module
4. Media upload
5. Basic search

### Média Prioridade
1. Moderation system
2. Client features
3. Advertiser dashboard
4. Admin panel
5. Payment integration

### Baixa Prioridade
1. AI Search básico
2. AI Match MVP
3. Profile Copilot básico
4. Advanced analytics

---

## 💳 Débitos Técnicos

*Nenhum débito técnico registrado ainda.*

---

## 📈 KPIs e Métricas

### Métricas de Desenvolvimento
- **Code Coverage:** Target: 80%
- **Build Time:** Target: < 2 min
- **Bundle Size:** Target: < 200KB (initial load)

### Métricas de Produto (Futuro)
- Número de anunciantes ativos
- Número de clientes ativos
- Taxa de conversão (busca → contato)
- NPS (Net Promoter Score)
- Taxa de retenção

---

## 🚀 Próximos Passos Imediatos

1. ✅ Estrutura do monorepo criada
2. ✅ Documento PROJECT_STATE.md criado
3. ⏳ Configurar Docker e docker-compose
4. ⏳ Setup Next.js
5. ⏳ Setup NestJS
6. ⏳ Setup PostgreSQL + Prisma
7. ⏳ Setup Redis
8. ⏳ Implementar autenticação

---

## 📚 Recursos e Links

- [Documentação Next.js](https://nextjs.org/docs)
- [Documentação NestJS](https://docs.nestjs.com)
- [Documentação Prisma](https://www.prisma.io/docs)
- [Documentação Tailwind CSS](https://tailwindcss.com/docs)

---

## 📝 Notas e Observações

### Metodologia: "Projeto Vivo"

Este documento serve como **estado vivo** do projeto. Ele deve ser atualizado constantemente para refletir:
- Decisões arquiteturais
- Estado atual do desenvolvimento
- Débitos técnicos
- Próximos passos

### Filosofia do Projeto

1. **Começar simples, escalar quando necessário**
2. **Privacidade e segurança by design**
3. **IA como assistente, não como decisor**
4. **Código limpo, testado e documentado**
5. **Foco no usuário e na experiência**

---

**Última revisão:** 16/09/2026  
**Revisado por:** Cursor AI Agent  
**Próxima revisão:** Após Sprint 0
