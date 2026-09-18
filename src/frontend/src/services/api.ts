import type {
    Cliente,
    Interacao,
    Ticket,
    Status,
    Prioridade,
} from '@/types'
import type { TicketListItem } from '@/types/ticket'

export class ApiError extends Error {
    status: number
    details?: string[]

    constructor(
        message: string,
        status: number,
        details?: string[],
    ) {
        super(message)

        this.name = 'ApiError'
        this.status = status
        this.details = details
    }
}

const API_URL = import.meta.env.VITE_API_URL
const TICKET_API_URL = import.meta.env.VITE_TICKET_API_URL
const REMOVE_TICKET_API_URL = import.meta.env.VITE_REMOVE_TICKET_API_URL
const TICKET_INTERACAO_API_URL = import.meta.env.VITE_TICKET_INTERACAO_API_URL
const CLIENT_API_URL = import.meta.env.VITE_CLIENTE_API_URL

if (!API_URL) {
    throw new Error('VITE_API_URL não configurada')
}

async function request<T>(
    path: string,
    options: RequestInit = {},
): Promise<T> {
    const hasBody = options.body !== undefined

    const response = await fetch(`${path}`, {
        ...options,

        headers: {
            ...(hasBody
                ? { 'Content-Type': 'application/json' }
                : {}),

            ...options.headers,
        },
    })

    if (!response.ok) {
        let message = `Erro HTTP ${response.status}`
        let details: string[] | undefined

        try {
            const data = await response.json()

            message =
                data.erro ??
                data.error ??
                data.message ??
                message

            if (Array.isArray(data.detalhes)) {
                details = data.detalhes
            }
        } catch {
            // resposta não era JSON
        }

        throw new ApiError(
            message,
            response.status,
            details,
        )
    }

    if (response.status === 204) {
        return undefined as T
    }

    return response.json()
}

// Tickets

export async function getTickets(filters?: {
    status?: Status | null
    prioridade?: Prioridade | null
}): Promise<TicketListItem[]> {
    const params = new URLSearchParams()

    if (filters?.status) {
        params.set('status', filters.status)
    }

    if (filters?.prioridade) {
        params.set('prioridade', filters.prioridade)
    }

    const query = params.toString()

    const data = await request<TicketListItem[]>(
        `${API_URL}/tickets${query ? `?${query}` : ''}`,
    )

    if (!Array.isArray(data)) {
        return []
    }

    return data.filter(
        (ticket) =>
            ticket &&
            typeof ticket.id === 'string' &&
            ticket.id.length > 0,
    )
}

export async function getTicket(id: string): Promise<Ticket> {
    return request<Ticket>(`/tickets/${id}`)
}

export async function createTicket(data: {
    cliente_id: string
    titulo: string
    descricao: string
    prioridade: Prioridade
}): Promise<Ticket> {
    return request<Ticket>(`${API_URL}/tickets`, {
        method: 'POST',
        body: JSON.stringify(data),
    })
}

export async function updateStatus(
    id: string,
    status: Status,
): Promise<Ticket> {
    return request<Ticket>(`${TICKET_API_URL}/tickets/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
    })
}

export async function deleteTicket(id: string): Promise<void> {
    return request<void>(`${REMOVE_TICKET_API_URL}/tickets/${id}`, {
        method: 'DELETE',
    })
}

// Interações

export async function createInteracao(id: string, data: {
    tipo: string
    mensagem: string
}): Promise<Interacao> {
    return request<Interacao>(`${TICKET_INTERACAO_API_URL}/tickets/${id}/interacoes`, {
        method: 'POST',
        body: JSON.stringify(data),
    })
}

export async function getInteracoes(
    ticketId: string,
): Promise<Interacao[]> {
    return request<Interacao[]>(`${TICKET_INTERACAO_API_URL}/tickets/${ticketId}/interacoes`)
}

// Clientes

export async function getClientes(): Promise<Cliente[]> {
    return request<Cliente[]>(`${API_URL}/clientes`)
}

export async function getCliente(id: string): Promise<Cliente> {
    return request<Cliente>(`${CLIENT_API_URL}/clientes/${id}`)
}

export async function createCliente(data: {
    nome: string
    email: string
    telefone: string
}): Promise<Cliente> {
    return request<Cliente>(`${API_URL}/clientes`, {
        method: 'POST',
        body: JSON.stringify(data),
    })
}

export async function deleteCliente(id: string): Promise<void> {
    return request<void>(`${CLIENT_API_URL}/clientes/${id}`, {
        method: 'DELETE',
    })
}
