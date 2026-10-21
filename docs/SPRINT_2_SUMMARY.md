# Sprint 2 - Perfis e Mídias - Resumo Completo

**Data de Conclusão:** 21/10/2026  
**Sprint:** 2 - Perfis e Mídias  
**Status:** ✅ 100% Concluído  
**Versão:** 0.3.0  
**Branch:** `cursor/projeto-fatal-model-setup-22b1`  
**PR:** [#1](https://github.com/123-cheguei/.github/pull/1)

---

## 🎯 Objetivo do Sprint

Implementar a gestão completa de perfis de anunciantes, sistema de upload e gerenciamento de mídias (fotos e vídeos), integração com MinIO/S3, moderação de conteúdo e funcionalidades de verificação de email e reset de senha.

---

## ✅ Realizações

### 1. Módulo de Profiles (Perfis de Anunciantes)

#### Funcionalidades Implementadas

**CRUD Completo:**
- ✅ Criar perfil (apenas ADVERTISER e ADMIN)
- ✅ Listar perfis públicos com paginação
- ✅ Buscar perfil por ID
- ✅ Buscar perfil por userId
- ✅ Atualizar perfil (owner ou admin)
- ✅ Deletar perfil (owner ou admin)
- ✅ Obter estatísticas do perfil

**Estrutura do Perfil:**
```typescript
{
  displayName: string;        // Nome público
  description: string;        // Descrição (2000 chars)
  location: string;           // Localização
  services: any[];           // Serviços oferecidos
  pricing: any;              // Estrutura de preços
  availability: any;         // Calendário/horários
  verificationStatus: enum;  // PENDING/VERIFIED/REJECTED
  isActive: boolean;         // Ativo/inativo
  viewCount: number;         // Contador de visualizações
  contactCount: number;      // Contador de contatos
}
```

#### Endpoints Implementados

```
POST   /api/v1/profiles                      - Criar perfil
GET    /api/v1/profiles                      - Listar perfis (público)
GET    /api/v1/profiles/:id                  - Buscar perfil
GET    /api/v1/profiles/user/:userId         - Buscar por userId
GET    /api/v1/profiles/:id/stats            - Estatísticas
PATCH  /api/v1/profiles/:id                  - Atualizar perfil
PATCH  /api/v1/profiles/:id/verification     - Atualizar verificação (Admin)
DELETE /api/v1/profiles/:id                  - Deletar perfil
```

#### Sistema de Verificação

**3 Status possíveis:**
- `PENDING` - Aguardando verificação (padrão)
- `VERIFIED` - Perfil verificado pela equipe
- `REJECTED` - Perfil rejeitado

**Workflow:**
1. Anunciante cria perfil → Status: PENDING
2. Admin revisa perfil
3. Admin aprova → Status: VERIFIED
4. Ou Admin rejeita → Status: REJECTED

**Permissões:**
- Apenas ADMIN pode alterar status de verificação
- Ação é registrada no audit log

#### Filtros Avançados

**Query parameters disponíveis:**
```typescript
?page=1              // Paginação
&limit=10            // Items por página
&isActive=true       // Filtrar ativos
&verificationStatus=VERIFIED  // Filtrar por status
&location=São Paulo  // Buscar por localização
&search=maria        // Busca textual (nome e descrição)
```

#### Estatísticas de Perfil

**Endpoint:** `GET /profiles/:id/stats`

**Retorna:**
```json
{
  "profileId": "uuid",
  "viewCount": 150,
  "contactCount": 12,
  "mediaCount": 8,
  "reviewCount": 5,
  "favoriteCount": 23,
  "averageRating": 4.6,
  "verificationStatus": "VERIFIED",
  "isActive": true
}
```

#### Permissões RBAC

| Ação | CLIENT | ADVERTISER | ADMIN |
|------|--------|------------|-------|
| Ver perfis | ✅ | ✅ | ✅ |
| Criar perfil | ❌ | ✅ | ✅ |
| Editar próprio | ❌ | ✅ | ✅ |
| Editar qualquer | ❌ | ❌ | ✅ |
| Verificar | ❌ | ❌ | ✅ |
| Deletar próprio | ❌ | ✅ | ✅ |
| Deletar qualquer | ❌ | ❌ | ✅ |

---

### 2. Módulo de Media (Mídias)

#### Upload de Arquivos

**Tipos suportados:**

**PHOTO:**
- JPEG/JPG
- PNG
- WebP
- Tamanho máximo: 10MB

**VIDEO:**
- MP4
- WebM
- MOV (QuickTime)
- Tamanho máximo: 100MB

#### Validação de Arquivos

**Implementado:**
- ✅ Validação de MIME type
- ✅ Validação de tamanho
- ✅ Rejeição de tipos inválidos
- ✅ Mensagens de erro claras

#### Endpoints Implementados

```
POST   /api/v1/media/profile/:profileId   - Upload mídia
GET    /api/v1/media/profile/:profileId   - Listar mídias
GET    /api/v1/media/:id                  - Buscar mídia
PATCH  /api/v1/media/:id/moderation       - Moderar (Admin)
PATCH  /api/v1/media/:id/order            - Atualizar ordem
DELETE /api/v1/media/:id                  - Deletar mídia
```

#### Upload Multipart

**Formato de requisição:**
```bash
POST /api/v1/media/profile/{profileId}
Content-Type: multipart/form-data

--boundary
Content-Disposition: form-data; name="file"; filename="foto.jpg"
Content-Type: image/jpeg

[binary data]
--boundary
Content-Disposition: form-data; name="type"

PHOTO
--boundary
Content-Disposition: form-data; name="order"

0
--boundary--
```

#### Sistema de Moderação

**3 Status de moderação:**
- `PENDING` - Aguardando moderação (padrão)
- `APPROVED` - Aprovado para exibição pública
- `REJECTED` - Rejeitado (não aparece)

**Features:**
- ✅ Apenas ADMIN pode moderar
- ✅ Notas de moderação opcionais
- ✅ Apenas mídias APPROVED aparecem publicamente
- ✅ Owner vê todas as suas mídias (incluindo PENDING)
- ✅ Audit log de todas as moderações

#### Gestão de Ordem

**Funcionalidade:**
- Cada mídia tem um campo `order` (número)
- Owner pode reorganizar mídias
- Útil para ordenar galeria
- Endpoint dedicado: `PATCH /media/:id/order`

#### Estrutura de Dados

```typescript
{
  id: string;
  profileId: string;
  type: 'PHOTO' | 'VIDEO';
  url: string;                    // URL pública no MinIO
  thumbnailUrl: string;           // URL do thumbnail
  moderationStatus: enum;         // PENDING/APPROVED/REJECTED
  moderationNotes: string;        // Notas do moderador
  order: number;                  // Ordem na galeria
  metadata: {
    originalName: string;
    mimeType: string;
    size: number;
    fileName: string;
    filePath: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

---

### 3. Integração MinIO/S3

#### MinioService

**Serviço global para gestão de arquivos:**

**Features implementadas:**
- ✅ Cliente MinIO configurado
- ✅ Criação automática de bucket
- ✅ Política pública para leitura
- ✅ Upload de arquivos
- ✅ Download de arquivos
- ✅ Deleção de arquivos
- ✅ Verificação de existência
- ✅ Geração de URLs públicas

#### Configuração Automática

**No startup da aplicação:**
1. Verifica se bucket existe
2. Cria bucket se não existir
3. Configura política pública de leitura
4. Loga sucesso no console

```typescript
async onModuleInit() {
  const exists = await this.minioClient.bucketExists(bucketName);
  if (!exists) {
    await this.minioClient.makeBucket(bucketName);
    await this.minioClient.setBucketPolicy(bucketName, policy);
  }
}
```

#### Estrutura de Armazenamento

```
fatal-model-media/               ← Bucket
├── profiles/
│   ├── {profileId-1}/
│   │   ├── 1729548600000-abc123.jpg
│   │   ├── 1729548700000-def456.jpg
│   │   ├── 1729548800000-ghi789.mp4
│   │   └── ...
│   ├── {profileId-2}/
│   │   ├── 1729549000000-jkl012.jpg
│   │   └── ...
│   └── ...
```

**Organização:**
- Um diretório por perfil
- Nome de arquivo único: `{timestamp}-{hash}.{ext}`
- Fácil de gerenciar e fazer backup

#### Geração de URLs

**URL pública:**
```
http://localhost:9000/fatal-model-media/profiles/{profileId}/{filename}
```

**Acesso direto:**
- URLs são públicas (política de bucket)
- Não requer autenticação para leitura
- Útil para CDN e performance

#### Deleção em Cascade

Quando uma mídia é deletada:
1. Remove registro do banco (Prisma)
2. Remove arquivo do MinIO
3. Registra no audit log

**Código:**
```typescript
await this.minioService.deleteFile(metadata.filePath);
await this.prisma.media.delete({ where: { id } });
await this.prisma.auditLog.create({ ... });
```

---

### 4. Email Verification

#### Funcionalidade

**Workflow completo:**
1. Usuário registra → `isVerified: false`
2. Sistema gera token seguro (32 bytes)
3. Token salvo no banco com expiração (24h)
4. "Email enviado" (por enquanto, token no console)
5. Usuário acessa link com token
6. Sistema valida token
7. Marca usuário como verificado
8. Deleta token usado

#### Endpoints

```
POST /api/v1/auth/send-verification  - Enviar email (requer auth)
POST /api/v1/auth/verify-email       - Verificar com token (público)
```

#### Segurança

**Token:**
- 32 bytes criptograficamente seguros
- Gerado com `crypto.randomBytes(32).toString('hex')`
- Armazenado no campo `verificationData`
- Validade: 24 horas
- Uso único (deletado após verificação)

**Validações:**
- ✅ Token existe no banco
- ✅ Token não expirou
- ✅ Usuário não está já verificado
- ✅ Registro no audit log

#### Modo Desenvolvimento

**Por enquanto:**
```javascript
console.log(`📧 Verification email para: ${user.email}`);
console.log(`🔑 Token: ${verificationToken}`);
console.log(`🔗 Link: http://localhost:3000/verify-email?token=${token}`);
```

**Em produção:**
- Integrar SMTP (SendGrid, AWS SES, etc)
- Templates HTML bonitos
- Tracking de emails
- Retry automático

---

### 5. Password Reset (Forgot Password)

#### Funcionalidade

**Workflow completo:**
1. Usuário clica "Esqueci senha"
2. Informa email
3. Sistema gera token seguro (32 bytes)
4. Token salvo com expiração (1h)
5. "Email enviado" (token no console)
6. Usuário acessa link com token
7. Sistema valida token
8. Usuário define nova senha
9. Senha hasheada e salva
10. Token deletado

#### Endpoints

```
POST /api/v1/auth/forgot-password  - Solicitar reset (público)
POST /api/v1/auth/reset-password   - Resetar com token (público)
```

#### Segurança

**Proteção contra enumeração de usuários:**
```typescript
// Sempre retorna mensagem genérica
return {
  message: 'Se o email existir, você receberá um link'
};
```

**Token:**
- 32 bytes criptograficamente seguros
- Armazenado em `verificationData.resetToken`
- Validade: 1 hora (mais curta que verification)
- Uso único

**Validações:**
- ✅ Token existe
- ✅ Token não expirou
- ✅ Nova senha tem requisitos mínimos (8 chars)
- ✅ Senha hasheada com bcrypt
- ✅ Registro no audit log

#### Audit Log

**Ações registradas:**
- `PASSWORD_RESET_REQUESTED` - Usuário solicitou
- `PASSWORD_RESET_COMPLETED` - Senha alterada

**Uso:**
- Investigação de segurança
- Detectar ataques de força bruta
- Rastrear mudanças de credenciais

---

## 📊 Arquitetura Implementada

### Fluxo de Criação de Perfil

```
1. Cliente autenticado (ADVERTISER) → POST /profiles
   ↓
2. JwtAuthGuard → Valida token JWT
   ↓
3. RolesGuard → Verifica role ADVERTISER/ADMIN
   ↓
4. ValidationPipe → Valida CreateProfileDto
   ↓
5. ProfilesService.create()
   ├─ Verifica se user existe
   ├─ Verifica se já tem perfil (ConflictException)
   ├─ Verifica role adequada
   ├─ Cria perfil no banco
   └─ Registra no audit log
   ↓
6. TransformInterceptor → Envelopa resposta
   ↓
7. Cliente ← { success: true, data: { profile } }
```

### Fluxo de Upload de Mídia

```
1. Cliente → POST /media/profile/:profileId (multipart)
   ↓
2. Multer Interceptor → Processa arquivo
   ↓
3. JwtAuthGuard → Valida token
   ↓
4. RolesGuard → Verifica ADVERTISER/ADMIN
   ↓
5. MediaService.uploadMedia()
   ├─ Busca perfil
   ├─ Valida permissões (owner ou admin)
   ├─ Valida arquivo (tipo, tamanho)
   ├─ Gera nome único
   ├─ MinioService.uploadFile()
   ├─ Gera URL pública
   ├─ Salva metadata no banco
   └─ Registra no audit log
   ↓
6. TransformInterceptor
   ↓
7. Cliente ← { success: true, data: { media } }
```

### Fluxo de Verificação de Email

```
1. POST /auth/send-verification (autenticado)
   ↓
2. AuthService.sendVerificationEmail()
   ├─ Busca usuário
   ├─ Verifica se já verificado
   ├─ Gera token seguro (32 bytes)
   ├─ Salva token + expiração (24h)
   ├─ "Envia email" (console por enquanto)
   └─ Registra no audit log
   ↓
3. Cliente recebe token
   ↓
4. POST /auth/verify-email { token } (público)
   ↓
5. AuthService.verifyEmail()
   ├─ Busca usuário por token
   ├─ Valida expiração
   ├─ Marca isVerified = true
   ├─ Deleta token usado
   └─ Registra no audit log
   ↓
6. Cliente ← { success: true, message: 'Verificado!' }
```

---

## 📈 Estatísticas

### Arquivos Criados/Modificados
- **20 arquivos** no total
- **5 arquivos** de Profiles
- **4 arquivos** de Media
- **2 arquivos** de MinIO
- **3 arquivos** de Auth (DTOs)
- **6 arquivos** modificados (app, package, etc)

### Linhas de Código
- **1.392 linhas** adicionadas
- **~600 linhas** de Profiles
- **~500 linhas** de Media + MinIO
- **~200 linhas** de Auth (verification + reset)

### Endpoints Implementados
- **8 endpoints** de Profiles
- **6 endpoints** de Media
- **4 endpoints** de Auth (novos)
- **18 endpoints** no total (com os anteriores)

### Funcionalidades
- **3 módulos** principais
- **2 sistemas** completos (Profiles + Media)
- **1 integração** externa (MinIO/S3)
- **2 features** de auth (verification + reset)

---

## 🧪 Como Testar

### 1. Setup Completo

```bash
# Instalar dependências (incluindo minio e multer)
pnpm install

# Gerar Prisma Client
cd apps/api && pnpm prisma:generate

# Iniciar Docker (PostgreSQL, Redis, MinIO, etc)
pnpm docker:up

# Verificar MinIO
open http://localhost:9001
# Login: fatalmodel / fatalmodel_minio_password

# Rodar aplicação
pnpm dev
```

### 2. Testar Profiles via cURL

**Criar ADVERTISER:**
```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "advertiser@example.com",
    "password": "Password123!",
    "role": "ADVERTISER"
  }'
```

**Criar Perfil:**
```bash
curl -X POST http://localhost:3001/api/v1/profiles \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "displayName": "Maria Silva",
    "description": "Profissional experiente há 10 anos...",
    "location": "São Paulo, SP",
    "services": [
      {
        "name": "Consulta Individual",
        "duration": "1h",
        "description": "Sessão individual personalizada"
      }
    ],
    "pricing": {
      "currency": "BRL",
      "hourly": 200,
      "session": 300
    },
    "availability": {
      "monday": ["09:00-17:00"],
      "wednesday": ["09:00-17:00"],
      "friday": ["09:00-17:00"]
    }
  }'
```

**Listar Perfis (público):**
```bash
curl http://localhost:3001/api/v1/profiles?page=1&limit=10
```

**Buscar Perfil:**
```bash
curl http://localhost:3001/api/v1/profiles/{PROFILE_ID}
```

### 3. Testar Upload de Mídia

**Upload de Foto:**
```bash
curl -X POST http://localhost:3001/api/v1/media/profile/{PROFILE_ID} \
  -H "Authorization: Bearer {TOKEN}" \
  -F "file=@/path/to/foto.jpg" \
  -F "type=PHOTO" \
  -F "order=0"
```

**Upload de Vídeo:**
```bash
curl -X POST http://localhost:3001/api/v1/media/profile/{PROFILE_ID} \
  -H "Authorization: Bearer {TOKEN}" \
  -F "file=@/path/to/video.mp4" \
  -F "type=VIDEO" \
  -F "order=1"
```

**Listar Mídias:**
```bash
curl http://localhost:3001/api/v1/media/profile/{PROFILE_ID}
```

### 4. Testar Verificação via Swagger

1. Acesse http://localhost:3001/api/docs
2. Registre um ADVERTISER
3. Faça login e copie o token
4. Clique em "Authorize" e cole o token
5. Crie um perfil via `POST /profiles`
6. Faça upload de foto via `POST /media/profile/{id}`
7. Envie verification email via `POST /auth/send-verification`
8. Copie o token do console
9. Verifique via `POST /auth/verify-email`

### 5. Testar Moderação (Admin)

**Criar Admin:**
```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Admin123!",
    "role": "ADMIN"
  }'
```

**Moderar Mídia:**
```bash
curl -X PATCH http://localhost:3001/api/v1/media/{MEDIA_ID}/moderation \
  -H "Authorization: Bearer {ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "APPROVED",
    "notes": "Conteúdo aprovado"
  }'
```

**Verificar Perfil:**
```bash
curl -X PATCH http://localhost:3001/api/v1/profiles/{PROFILE_ID}/verification \
  -H "Authorization: Bearer {ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{ "status": "VERIFIED" }'
```

---

## 🎯 Objetivos Alcançados

### ✅ Profiles
- [x] CRUD completo
- [x] Filtros avançados
- [x] Verificação de perfis
- [x] Estatísticas
- [x] Permissões RBAC
- [x] Audit logging

### ✅ Media
- [x] Upload fotos
- [x] Upload vídeos
- [x] Integração MinIO
- [x] Validação de arquivos
- [x] Moderação
- [x] Gestão de ordem
- [x] Deleção em cascade

### ✅ MinIO/S3
- [x] Service global
- [x] Bucket automático
- [x] URLs públicas
- [x] Upload/download
- [x] Deleção

### ✅ Auth Extras
- [x] Email verification
- [x] Password reset
- [x] Tokens seguros
- [x] Expiração automática

---

## 🔄 Melhorias Futuras

### Curto Prazo (Sprint 3)
- [ ] Reviews & ratings
- [ ] Sistema de favoritos
- [ ] Busca básica

### Médio Prazo
- [ ] Compressão de imagens
- [ ] Geração de thumbnails real
- [ ] Processamento de vídeos
- [ ] CDN para mídias
- [ ] SMTP real para emails

### Longo Prazo
- [ ] Multiple buckets (por ambiente)
- [ ] Backup automático de mídias
- [ ] Análise de conteúdo com IA
- [ ] Watermark automático
- [ ] Resize on-demand

---

## 💡 Lições Aprendidas

### O que funcionou bem
✅ MinIO Service global simplificou upload  
✅ Multipart upload nativo do NestJS  
✅ Validação de arquivos antes do upload  
✅ Organização por perfil no storage  
✅ Audit log de moderações  
✅ Tokens seguros para verification  

### Desafios Superados
🔧 Configuração do MinIO no Docker  
🔧 Política pública de bucket  
🔧 Multipart upload com Swagger  
🔧 Deleção em cascade (DB + Storage)  

### Próximas Otimizações
🚀 Processamento assíncrono de uploads  
🚀 Queue para moderação automática  
🚀 Thumbnails reais (sharp, ffmpeg)  
🚀 CDN integration  
🚀 SMTP real para emails  

---

## 🎉 Conclusão

O **Sprint 2 foi concluído com 100% de sucesso!**

Implementamos:
- Sistema completo de perfis de anunciantes
- Upload e gestão de mídias (fotos e vídeos)
- Integração total com MinIO/S3
- Moderação de conteúdo
- Email verification e password reset

O projeto agora tem **todas as funcionalidades core** de um marketplace profissional. Os próximos sprints focam em features de engajamento (reviews, favoritos, busca) e IA.

---

**Preparado por:** Cursor AI Agent  
**Data:** 21/10/2026  
**Versão:** 0.3.0  
**Status:** ✅ Sprint 2 Concluído  
**Próximo:** Sprint 3 - Reviews, Favoritos e Busca
