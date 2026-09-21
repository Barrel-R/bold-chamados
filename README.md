## Configuração

1. Configure o banco PostgreSQL/Supabase.
2. Execute `database/schema.sql`.
3. Configure as credenciais do PostgreSQL no n8n.
4. Importe os workflows JSON presentes em `workflows/`.
5. Configure as URLs/webhooks utilizados pelos workflows.
6. Configure o endpoint de integração externa.
### Frontend

```
cd src/frontend
bun install
bun run dev
```

Configure o `.env` a partir do `.env.example`.

## Tecnologias 
- **n8n**: orquestração da API, validações, regras de negócio e integrações. 
- **PostgreSQL / Supabase**: persistência e constraints.
- **Vue 3 + TypeScript**: frontend com tipos que refletem a API.
- **Pinia**: estado global. 
- **Tailwind CSS**: estilização.
- **Vercel**: deploy do frontend e proxy do endpoint PATCH.
## Arquitetura

```text
Frontend
   │
   ▼
n8n Webhooks
   │
   ├── Validação de entrada
   ├── Regras de negócio
   └── Integração HTTP
   │
   ▼
Supabase / PostgreSQL
```

## API

As rotas são implementadas através de Webhooks do n8n.

### Clientes

| Método | Rota            | Descrição       |
| ------ | --------------- | --------------- |
| GET    | `/clientes`     | Listar clientes |
| GET    | `/clientes/:id` | Buscar cliente  |
| POST   | `/clientes`     | Criar cliente   |
| DELETE | `/clientes/:id` | Remover cliente |

### Tickets

| Método | Rota                      | Descrição                   |
| ------ | ------------------------- | --------------------------- |
| GET    | `/tickets`                | Listar tickets              |
| GET    | `/tickets/:id`            | Buscar ticket               |
| GET    | `/tickets/:id/interacoes` | Listar interações do ticket |
| POST   | `/tickets`                | Criar ticket                |
| POST   | `tickets/:id/interacoes`  | Registrar interação         |
| PATCH  | `/tickets/:id`            | Atualizar status            |
| DELETE | `/tickets/:id`            | Remover ticket              |

## Regras de negócio

- Ticket deve estar vinculado a um cliente existente.
- Status inicial: `aberto`.
- Prioridades válidas:
    - `baixa`
    - `media`
    - `alta`
- Status válidos:
    - `aberto`
    - `em_atendimento`
    - `aguardando_cliente`
    - `resolvido`
    - `cancelado`
- Alteração de status gera uma interação de histórico.

## Integração externa

O n8n também é utilizado para realizar uma chamada HTTP para um sistema externo/mock (atualmente https://webhook.site/) após a criação ou atualização de um ticket.

O evento enviado contém um payload na seguinte estrutura:

```json
{
  "protocolo": "TK-2026-000001",
  "evento": "ticket.criado",
  "status": "aberto"
}
```

## Frontend

Principais telas:
### Caixa de entrada
- Rota: `/`
- cards de status, filtros, tabela de tickets.

![Caixa de Entrada](src/docs/screenshots/caixa_de_entrada.png)

- **Detalhe do ticket**: dados, histórico de interações, nova interação, mudança de status e botão de excluir.

![Detalhes do Ticket](src/docs/screenshots/ticket_detalhes.png)

![Interações do Ticket](src/docs/screenshots/ticket_interacoes.png)

## Novo Ticket
- Rota: `/tickets/novo`
- Formulário com validação nativa, carregamento de clientes e aviso caso não tenham clientes cadastrados.

![Novo Ticket](src/docs/screenshots/ticket_novo.png)

### Clientes
- Rota: `/clientes`
- tabela de clientes, botão de navegação para cadastrar, remover clientes

![Clientes](src/docs/screenshots/clientes.png)

### Novo Cliente
- Rota: `/clientes/novo`
- Formulário com validação nativa e máscara de telefone 

![Novo Cliente](src/docs/screenshots/cliente_novo.png)

### CORS e Vercel Function

A infraestrutura n8n utilizada no desafio não liberava `PATCH` corretamente no preflight CORS do navegador.

Por isso, somente a atualização de status passa por uma Vercel Function:

```
Frontend
   ↓
PATCH /api/tickets/:id/status
   ↓
Vercel Function
   ↓
n8n
```

Arquivo:

```
frontend/api/tickets/[id]/status.ts
```

## Trace logs

A versão v2 registra logs estruturados no PostgreSQL.

Exemplo:

```
{
  "trace_id": "12345",
  "workflow": "Tickets - Criar",
  "evento": "ticket.criado",
  "nivel": "info",
  "status_code": 201,
  "duracao_ms": 180
}
```

## Limitações conhecidas

- Webhook.site utiliza URLs temporárias.
- Não há autenticação/JWT.
- Não há máquina de estados para transições de status.
- Exclusão em cascata de tickets e interações ao remover um cliente e um ticket, respectivamente. 
