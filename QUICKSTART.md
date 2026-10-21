# 🚀 Quickstart - Fatal Model

Guia rápido para rodar o projeto Fatal Model em sua máquina.

---

## ⚡ Setup Rápido (5 minutos)

### 1. Pré-requisitos

```bash
# Verificar Node.js (>= 18)
node --version

# Verificar pnpm (>= 8)
pnpm --version

# Verificar Docker
docker --version
docker-compose --version
```

**Não tem algum deles instalado?**
- Node.js 18+: https://nodejs.org/
- pnpm: `npm install -g pnpm`
- Docker: https://www.docker.com/get-started

---

### 2. Clone e Instale

```bash
# Clone o repositório
git clone https://github.com/123-cheguei/.github
cd .github

# Checkout do branch de desenvolvimento
git checkout cursor/projeto-fatal-model-setup-22b1

# Instalar dependências
pnpm install
```

---

### 3. Iniciar Serviços (PostgreSQL, Redis, etc)

```bash
# Iniciar todos os serviços Docker
pnpm docker:up

# Verificar se estão rodando
docker ps
```

**Serviços disponíveis:**
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`
- OpenSearch: `localhost:9200`
- MinIO: `localhost:9000` (Console: `localhost:9001`)

---

### 4. Configurar Variáveis de Ambiente

```bash
# Backend
cp apps/api/.env.example apps/api/.env.local

# Frontend
cp apps/web/.env.local.example apps/web/.env.local
```

**Valores padrão já estão configurados!** ✅

---

### 5. Setup do Banco de Dados

```bash
cd apps/api

# Gerar Prisma Client
pnpm prisma:generate

# Executar migrations
pnpm prisma:migrate

# (Opcional) Abrir Prisma Studio
pnpm prisma:studio
```

---

### 6. Rodar a Aplicação

```bash
# Voltar para raiz
cd ../..

# Rodar tudo em modo desenvolvimento
pnpm dev
```

**Aguarde alguns segundos...**

✅ **Pronto!** Acesse:

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **API Docs (Swagger):** http://localhost:3001/api/docs
- **Health Check:** http://localhost:3001/api/v1

---

## 🧪 Testar a API

### Método 1: Swagger UI (Recomendado)

1. Acesse http://localhost:3001/api/docs
2. Clique em `POST /api/v1/auth/register`
3. Clique em "Try it out"
4. Cole este JSON:

```json
{
  "email": "admin@fatalmodel.com",
  "password": "Admin123!",
  "role": "ADMIN"
}
```

5. Clique em "Execute"
6. Copie o `accessToken` da resposta
7. Clique no botão "Authorize" (cadeado) no topo
8. Cole o token e clique em "Authorize"
9. Agora você pode testar todos os endpoints! 🎉

---

### Método 2: cURL

**Registrar usuário:**
```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@fatalmodel.com",
    "password": "Admin123!",
    "role": "ADMIN"
  }'
```

**Fazer login:**
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@fatalmodel.com",
    "password": "Admin123!"
  }'
```

**Usar o token:**
```bash
# Salvar token
export TOKEN="SEU_ACCESS_TOKEN_AQUI"

# Buscar perfil
curl -X GET http://localhost:3001/api/v1/auth/me \
  -H "Authorization: Bearer $TOKEN"

# Listar usuários (apenas Admin)
curl -X GET http://localhost:3001/api/v1/users \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📚 Documentação

- **API Guide:** `docs/API_GUIDE.md`
- **Project State:** `docs/PROJECT_STATE.md`
- **Sprint 1 Summary:** `docs/SPRINT_1_SUMMARY.md`
- **Swagger UI:** http://localhost:3001/api/docs

---

## 🛠️ Comandos Úteis

### Docker

```bash
# Iniciar serviços
pnpm docker:up

# Parar serviços
pnpm docker:down

# Ver logs
pnpm docker:logs

# Ver logs de um serviço específico
docker logs -f fatal-model-postgres
```

### Desenvolvimento

```bash
# Rodar tudo
pnpm dev

# Rodar apenas frontend
cd apps/web && pnpm dev

# Rodar apenas backend
cd apps/api && pnpm dev

# Build de produção
pnpm build

# Linting
pnpm lint
```

### Prisma

```bash
cd apps/api

# Gerar Client
pnpm prisma:generate

# Executar migrations
pnpm prisma:migrate

# Criar nova migration
pnpm prisma migrate dev --name nome_da_migration

# Abrir Prisma Studio (GUI do banco)
pnpm prisma:studio

# Reset do banco (⚠️ apaga tudo)
pnpm prisma migrate reset
```

### Testes

```bash
cd apps/api

# Testes unitários
pnpm test

# Com coverage
pnpm test:cov

# Watch mode
pnpm test:watch

# Testes E2E
pnpm test:e2e
```

---

## 🐛 Troubleshooting

### Porta já em uso

```bash
# Descobrir o que está usando a porta
lsof -i :3001  # ou 3000, 5432, etc

# Parar o processo
kill -9 PID
```

### Docker não inicia

```bash
# Parar tudo
pnpm docker:down

# Remover volumes (⚠️ apaga dados)
docker-compose -f docker/docker-compose.yml down -v

# Iniciar novamente
pnpm docker:up
```

### Erro "Prisma Client not generated"

```bash
cd apps/api
pnpm prisma:generate
```

### Erro "Cannot find module"

```bash
# Reinstalar dependências
rm -rf node_modules
pnpm install
```

### Banco de dados fora de sincronia

```bash
cd apps/api

# Reset completo (⚠️ apaga dados)
pnpm prisma migrate reset

# Ou apenas reexecutar migrations
pnpm prisma migrate deploy
```

---

## 🔧 Configuração Avançada

### Mudar Porta da API

Edite `apps/api/.env.local`:
```env
PORT=3002
```

### Mudar Porta do Frontend

Edite `apps/web/package.json`:
```json
{
  "scripts": {
    "dev": "next dev -p 3005"
  }
}
```

### Configurar JWT Secret

Edite `apps/api/.env.local`:
```env
JWT_SECRET=sua-super-secret-key-aqui
JWT_REFRESH_SECRET=outra-secret-key-aqui
```

### Configurar Database URL

Edite `apps/api/.env.local`:
```env
DATABASE_URL=postgresql://user:pass@host:5432/db?schema=public
```

---

## 📊 Verificar Saúde dos Serviços

### API Health Check

```bash
curl http://localhost:3001/api/v1
```

**Resposta esperada:**
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "timestamp": "2026-10-20T20:00:00.000Z",
    "uptime": 123.456,
    "environment": "development",
    "version": "0.2.0",
    "sprint": "Sprint 1 - Fundação"
  }
}
```

### PostgreSQL

```bash
docker exec -it fatal-model-postgres psql -U fatalmodel -d fatalmodel -c "SELECT 1;"
```

### Redis

```bash
docker exec -it fatal-model-redis redis-cli -a fatalmodel_redis_password ping
```

### OpenSearch

```bash
curl http://localhost:9200/_cluster/health
```

---

## 🎯 Próximos Passos

Agora que o projeto está rodando:

1. ✅ Explore a API via Swagger: http://localhost:3001/api/docs
2. ✅ Leia a documentação: `docs/API_GUIDE.md`
3. ✅ Crie um usuário Admin e teste os endpoints
4. ✅ Verifique os audit logs no Prisma Studio
5. ✅ Explore o código em `apps/api/src/`

**Pronto para desenvolver!** 🚀

---

## 🆘 Precisa de Ajuda?

- **Documentação Completa:** `docs/`
- **API Guide:** `docs/API_GUIDE.md`
- **Swagger UI:** http://localhost:3001/api/docs
- **GitHub Issues:** https://github.com/123-cheguei/.github/issues
- **Pull Request:** https://github.com/123-cheguei/.github/pull/1

---

## 📝 Checklist de Verificação

Antes de começar a desenvolver, verifique:

- [ ] Node.js >= 18 instalado
- [ ] pnpm >= 8 instalado
- [ ] Docker rodando
- [ ] `pnpm install` executado com sucesso
- [ ] `pnpm docker:up` executado
- [ ] PostgreSQL, Redis, OpenSearch, MinIO rodando
- [ ] `pnpm prisma:generate` executado
- [ ] `pnpm prisma:migrate` executado
- [ ] `pnpm dev` rodando
- [ ] Frontend acessível em http://localhost:3000
- [ ] Backend acessível em http://localhost:3001
- [ ] Swagger UI acessível em http://localhost:3001/api/docs
- [ ] Consegue fazer login via Swagger

**Todos os itens marcados?** ✅ Você está pronto! 🎉

---

**Versão:** 0.2.0  
**Sprint:** 1 - Fundação  
**Última atualização:** 20/10/2026
