export type Status =
    | 'aberto'
    | 'em_atendimento'
    | 'aguardando_cliente'
    | 'resolvido'
    | 'cancelado'

export type Prioridade =
    | 'baixa'
    | 'media'
    | 'alta'

export interface Ticket {
    id: string
    protocolo: string
    cliente_id: string
    titulo: string
    descricao: string
    prioridade: Prioridade
    status: Status
    criado_em: string
    atualizado_em: string
}

export interface TicketListItem extends Ticket {
    cliente_nome: string
}
