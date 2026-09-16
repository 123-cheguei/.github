# Docker Setup - Fatal Model

Este diretório contém as configurações Docker para o ambiente de desenvolvimento do Fatal Model.

## Serviços Disponíveis

### PostgreSQL (porta 5432)
Banco de dados principal da aplicação.
- **User:** fatalmodel
- **Password:** fatalmodel_dev_password
- **Database:** fatalmodel

### Redis (porta 6379)
Cache e gerenciamento de sessões.
- **Password:** fatalmodel_redis_password

### OpenSearch (portas 9200, 9600)
Motor de busca e indexação para features de IA.
- **Endpoint:** http://localhost:9200
- **Password:** FatalModel@2026

### MinIO (portas 9000, 9001)
Armazenamento de objetos S3-compatível para mídias.
- **API:** http://localhost:9000
- **Console:** http://localhost:9001
- **Access Key:** fatalmodel
- **Secret Key:** fatalmodel_minio_password

## Como Usar

### Iniciar todos os serviços
```bash
docker-compose up -d
```

### Ver logs
```bash
docker-compose logs -f
```

### Parar todos os serviços
```bash
docker-compose down
```

### Parar e remover volumes (⚠️ apaga dados)
```bash
docker-compose down -v
```

### Verificar status dos serviços
```bash
docker-compose ps
```

### Acessar um serviço específico
```bash
# PostgreSQL
docker-compose exec postgres psql -U fatalmodel -d fatalmodel

# Redis
docker-compose exec redis redis-cli -a fatalmodel_redis_password
```

## Health Checks

Todos os serviços possuem health checks configurados. Você pode verificar o status com:

```bash
docker-compose ps
```

Serviços saudáveis mostrarão `healthy` na coluna de status.

## Volumes

Os dados são persistidos em volumes Docker:
- `postgres_data` - Dados do PostgreSQL
- `redis_data` - Dados do Redis
- `opensearch_data` - Dados do OpenSearch
- `minio_data` - Arquivos do MinIO

## Rede

Todos os serviços estão na rede `fatal-model-network` e podem se comunicar entre si usando os nomes dos containers.

## Troubleshooting

### Erro "port already in use"
Algum serviço já está usando a porta. Pare o serviço conflitante ou mude a porta no docker-compose.yml.

### Erro "insufficient memory"
OpenSearch requer pelo menos 1GB de RAM disponível. Ajuste os limites em `OPENSEARCH_JAVA_OPTS`.

### Erro de conexão
Verifique se os serviços estão saudáveis com `docker-compose ps` e os logs com `docker-compose logs [service]`.
