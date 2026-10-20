# Guia da API - Fatal Model

## 📚 Documentação Interativa

Quando a API estiver rodando, acesse a documentação Swagger completa:

**URL:** http://localhost:3001/api/docs

---

## 🔐 Autenticação

### 1. Registrar Novo Usuário

**Endpoint:** `POST /api/v1/auth/register`

**Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "role": "CLIENT"
}
```

**Roles disponíveis:**
- `CLIENT` - Cliente (usuário que busca profissionais)
- `ADVERTISER` - Anunciante (profissional)
- `ADMIN` - Administrador

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "CLIENT",
      "isVerified": false,
      "createdAt": "2026-09-16T23:00:00.000Z",
      "updatedAt": "2026-09-16T23:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Login

**Endpoint:** `POST /api/v1/auth/login`

**Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

### 3. Renovar Token

**Endpoint:** `POST /api/v1/auth/refresh`

**Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "accessToken": "novo-access-token",
    "refreshToken": "novo-refresh-token"
  }
}
```

### 4. Obter Perfil do Usuário Autenticado

**Endpoint:** `GET /api/v1/auth/me`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "CLIENT",
    "isVerified": false,
    "createdAt": "2026-09-16T23:00:00.000Z",
    "updatedAt": "2026-09-16T23:00:00.000Z",
    "lastLogin": "2026-09-16T23:05:00.000Z"
  }
}
```

---

## 👥 Gestão de Usuários

### 1. Listar Usuários (Admin apenas)

**Endpoint:** `GET /api/v1/users?page=1&limit=10`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Requer:** Role `ADMIN`

**Response:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "email": "user1@example.com",
        "role": "CLIENT",
        "isVerified": true,
        "createdAt": "2026-09-16T23:00:00.000Z"
      }
    ],
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

### 2. Buscar Usuário por ID

**Endpoint:** `GET /api/v1/users/{id}`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "CLIENT",
    "isVerified": true,
    "profile": null,
    "_count": {
      "reviews": 5,
      "favorites": 10
    }
  }
}
```

### 3. Atualizar Usuário (Admin apenas)

**Endpoint:** `PATCH /api/v1/users/{id}`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Requer:** Role `ADMIN`

**Body:**
```json
{
  "isVerified": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "CLIENT",
    "isVerified": true,
    "updatedAt": "2026-09-16T23:10:00.000Z"
  }
}
```

### 4. Deletar Usuário (Admin apenas)

**Endpoint:** `DELETE /api/v1/users/{id}`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Requer:** Role `ADMIN`

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Usuário removido com sucesso"
  }
}
```

---

## 🔒 Sistema de RBAC (Role-Based Access Control)

### Roles e Permissões

| Role | Permissões |
|------|-----------|
| `CLIENT` | - Ver perfis<br>- Buscar profissionais<br>- Adicionar favoritos<br>- Deixar avaliações |
| `ADVERTISER` | - Tudo de CLIENT<br>- Criar/editar perfil<br>- Upload de mídias<br>- Ver analytics |
| `ADMIN` | - Tudo de ADVERTISER<br>- Gestão de usuários<br>- Moderação de conteúdo<br>- Ver logs de auditoria |

### Como Usar Guards

Os endpoints protegidos usam os seguintes guards:

1. **JwtAuthGuard** - Aplicado globalmente, verifica token JWT
2. **RolesGuard** - Verifica se o usuário tem a role necessária

**Exemplo de endpoint protegido:**
```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Get('admin-only')
adminEndpoint() {
  return 'Apenas admins podem ver isso';
}
```

**Endpoint público (sem autenticação):**
```typescript
@Public()
@Get('public')
publicEndpoint() {
  return 'Todos podem ver isso';
}
```

---

## 📝 Audit Logging

Todas as ações importantes são registradas automaticamente:

### Ações Auditadas

- `USER_REGISTERED` - Novo usuário criado
- `USER_LOGIN` - Login realizado
- `USER_UPDATED` - Dados de usuário alterados
- `USER_DELETED` - Usuário removido

### Estrutura do Log

```typescript
{
  id: string;           // ID do log
  userId: string;       // Quem fez a ação
  action: string;       // Tipo de ação
  resource: string;     // Recurso afetado (User, Profile, etc)
  resourceId: string;   // ID do recurso
  changes: object;      // Dados alterados (JSON)
  ipAddress: string;    // IP do usuário (futuro)
  userAgent: string;    // User agent (futuro)
  createdAt: Date;      // Quando aconteceu
}
```

---

## 🧪 Testando a API

### 1. Com cURL

**Registrar usuário:**
```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!",
    "role": "CLIENT"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!"
  }'
```

**Usar token:**
```bash
curl -X GET http://localhost:3001/api/v1/auth/me \
  -H "Authorization: Bearer {seu-token-aqui}"
```

### 2. Com Swagger UI

1. Acesse http://localhost:3001/api/docs
2. Clique em "Authorize" (cadeado no topo)
3. Cole seu access token
4. Teste os endpoints interativamente

### 3. Com Postman/Insomnia

Importe a collection:
- **Base URL:** `http://localhost:3001/api/v1`
- **Authorization:** Bearer Token
- **Headers:** `Content-Type: application/json`

---

## 🔧 Variáveis de Ambiente

```env
# JWT
JWT_SECRET=sua-chave-secreta
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=sua-chave-refresh-secreta
JWT_REFRESH_EXPIRES_IN=7d

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/db
```

---

## 📊 Rate Limiting

A API possui rate limiting configurado:

- **Limite:** 10 requisições
- **Janela:** 60 segundos (1 minuto)

Se exceder o limite, receberá:
```json
{
  "statusCode": 429,
  "message": "ThrottlerException: Too Many Requests"
}
```

---

## ⚠️ Tratamento de Erros

### Estrutura de Erro Padrão

```json
{
  "success": false,
  "statusCode": 400,
  "timestamp": "2026-09-16T23:00:00.000Z",
  "path": "/api/v1/auth/login",
  "method": "POST",
  "error": {
    "message": "Credenciais inválidas",
    "code": "UNAUTHORIZED"
  }
}
```

### Códigos de Status

| Código | Significado |
|--------|-------------|
| 200 | Sucesso |
| 201 | Criado |
| 400 | Requisição inválida |
| 401 | Não autenticado |
| 403 | Sem permissão |
| 404 | Não encontrado |
| 409 | Conflito (ex: email já existe) |
| 429 | Muitas requisições |
| 500 | Erro no servidor |

---

## 🚀 Próximas Features

Em desenvolvimento para o próximo sprint:

- [ ] Email verification
- [ ] Password reset
- [ ] Profile management
- [ ] Media upload
- [ ] Basic search

---

## 📖 Recursos Adicionais

- **Swagger Docs:** http://localhost:3001/api/docs
- **Health Check:** http://localhost:3001/api/v1
- **API Info:** http://localhost:3001/api/v1/info

---

**Versão:** 0.1.0  
**Sprint:** 1 - Fundação  
**Última atualização:** 20/10/2026
