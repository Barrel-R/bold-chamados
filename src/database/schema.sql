-- =========================================================
-- Desafio Bold - Sistema de Chamados/Tickets
-- Schema PostgreSQL
-- =========================================================

-- Extensão para gerar UUIDs
create extension if not exists "pgcrypto";

-- =========================================================
-- Tabela: clientes
-- =========================================================
create table if not exists clientes (
  id          uuid primary key default gen_random_uuid(),
  nome        varchar(150) not null,
  email       varchar(150) not null unique,
  telefone    varchar(20)  not null,
  criado_em   timestamptz  not null default now()
);

-- =========================================================
-- Tabela: tickets
-- status e prioridade controlados por CHECK constraints,
-- assim o próprio banco recusa valores fora da lista.
-- =========================================================
create table if not exists tickets (
  id            uuid primary key default gen_random_uuid(),
  protocolo     varchar(20) not null unique,
  cliente_id    uuid not null references clientes(id) on delete cascade,
  titulo        varchar(150) not null,
  descricao     text not null,
  prioridade    varchar(10) not null default 'media'
                  check (prioridade in ('baixa','media','alta')),
  status        varchar(20) not null default 'aberto'
                  check (status in (
                    'aberto','em_atendimento','aguardando_cliente',
                    'resolvido','cancelado'
                  )),
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

-- Facilita a rota GET /tickets?status=... e ?prioridade=...
create index if not exists idx_tickets_status     on tickets(status);
create index if not exists idx_tickets_prioridade on tickets(prioridade);
create index if not exists idx_tickets_cliente_id on tickets(cliente_id);

-- =========================================================
-- Tabela: interacoes (histórico do ticket)
-- =========================================================
create table if not exists interacoes (
  id          uuid primary key default gen_random_uuid(),
  ticket_id   uuid not null references tickets(id) on delete cascade,
  tipo        varchar(20) not null default 'comentario'
                check (tipo in ('comentario','atualizacao_status','sistema')),
  mensagem    text not null,
  criado_em   timestamptz not null default now()
);

create index if not exists idx_interacoes_ticket_id on interacoes(ticket_id);

-- =========================================================
-- Sequência para gerar o protocolo do ticket
-- Formato final gerado pelo n8n: TK-2026-000001
-- (a sequência garante que o número nunca se repete)
-- =========================================================
create sequence if not exists tickets_protocolo_seq start 1
