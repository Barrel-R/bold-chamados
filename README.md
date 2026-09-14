## Configuração

1. Configure o banco PostgreSQL/Supabase.
2. Execute `database/schema.sql`.
3. Configure as credenciais do PostgreSQL no n8n.
4. Importe os workflows JSON presentes em `workflows/`.
5. Configure as URLs/webhooks utilizados pelos workflows.

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
| POST   | `/clientes`     | Criar cliente   |
| GET    | `/clientes/:id` | Buscar cliente  |
| DELETE | `/clientes/:id` | Remover cliente |

### Tickets

| Método | Rota                     | Descrição           |
| ------ | ------------------------ | ------------------- |
| POST   | `/tickets`               | Criar ticket        |
| GET    | `/tickets`               | Listar tickets      |
| GET    | `/tickets/:id`           | Buscar ticket       |
| PATCH  | `/tickets/:id`           | Atualizar status    |
| DELETE | `/tickets/:id`           | Remover ticket      |
| POST   | `tickets/:id/interacoes` | Registrar interação |


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
