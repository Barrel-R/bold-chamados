import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'

import type {
    Status,
    Prioridade,
    Interacao,
} from '@/types'

import {
    ApiError,
    createInteracao,
    getInteracoes,
    getTickets,
    deleteTicket,
    updateStatus as updateTicketStatus,
} from '@/services/api'
import type { TicketListItem } from '@/types/ticket'

export const useTicketsStore = defineStore('tickets', () => {
    const tickets = ref<TicketListItem[]>([])
    const selectedTicket = ref<TicketListItem | null>(null)

    const search = ref('')

    const filters = ref<{
        status: Status | null
        prioridade: Prioridade | null
    }>({
        status: null,
        prioridade: null,
    })

    const interacoes = ref<Interacao[]>([])
    const loadingInteracoes = ref(false)
    const interacoesError = ref<string | null>(null)

    const loading = ref(false)
    const error = ref<string | null>(null)

    const filteredTickets = computed(() => {
        const term = search.value.trim().toLowerCase()

        if (!term) {
            return tickets.value
        }

        return tickets.value.filter((ticket) =>
            ticket.protocolo.toLowerCase().includes(term) ||
            ticket.titulo.toLowerCase().includes(term) ||
            ticket.cliente_nome.toLowerCase().includes(term)
        )
    })

    const totalTickets = computed(() => tickets.value.length)

    const totalAbertos = computed(
        () =>
            tickets.value.filter(
                (ticket) => ticket.status === 'aberto',
            ).length,
    )

    const totalEmAtendimento = computed(
        () =>
            tickets.value.filter(
                (ticket) => ticket.status === 'em_atendimento',
            ).length,
    )

    const totalResolvidos = computed(
        () =>
            tickets.value.filter(
                (ticket) => ticket.status === 'resolvido',
            ).length,
    )

    async function fetchTickets() {
        loading.value = true
        error.value = null

        try {
            tickets.value = await getTickets({
                status: filters.value.status,
                prioridade: filters.value.prioridade,
            })
        } catch (err) {
            tickets.value = []

            if (err instanceof ApiError) {
                error.value = err.message
            } else {
                error.value = 'Não foi possível obter os tickets'
            }
        } finally {
            loading.value = false
        }
    }

    async function selectTicket(ticket: TicketListItem) {
        selectedTicket.value = ticket

        await fetchInteracoes(ticket.id)
    }

    function clearSelectedTicket() {
        selectedTicket.value = null
        interacoes.value = []
        interacoesError.value = null
    }

    function clearFilters() {
        filters.value = {
            status: null,
            prioridade: null,
        }

        search.value = ''
    }

    async function changeStatus(
        ticketId: string,
        status: Status,
    ) {
        const updatedTicket = await updateTicketStatus(
            ticketId,
            status,
        )

        const index = tickets.value.findIndex(
            (ticket) => ticket.id === ticketId,
        )

        if (index !== -1) {
            tickets.value[index] = { ...updatedTicket, cliente_nome: tickets.value[index]!.cliente_nome }
        }

        if (selectedTicket.value?.id === ticketId) {
            selectedTicket.value = { ...updatedTicket, cliente_nome: selectedTicket.value.cliente_nome }
        }

        return updatedTicket
    }

    async function removeTicket(ticketId: string) {
        await deleteTicket(ticketId)

        tickets.value = tickets.value.filter(
            (ticket) => ticket.id !== ticketId,
        )

        if (selectedTicket.value?.id === ticketId) {
            clearSelectedTicket()
        }
    }

    async function fetchInteracoes(ticketId: string) {
        loadingInteracoes.value = true
        interacoesError.value = null
        interacoes.value = []

        try {
            const data = await getInteracoes(ticketId)

            if (selectedTicket.value?.id !== ticketId) {
                return
            }

            interacoes.value = Array.isArray(data)
                ? data.filter(
                    (interacao) =>
                        interacao &&
                        typeof interacao.id === 'string' &&
                        interacao.id.length > 0,
                )
                : []
        } catch (err) {
            if (err instanceof ApiError) {
                interacoesError.value = err.message
            } else {
                interacoesError.value = 'Não foi possível carregar as interações'
            }
        } finally {
            if (selectedTicket.value?.id === ticketId) {
                loadingInteracoes.value = false
            }
        }
    }

    async function addInteracao(mensagem: string) {
        const ticket = selectedTicket.value

        if (!ticket) {
            throw new Error('Nenhum ticket selecionado')
        }

        const interacao = await createInteracao(
            ticket.id,
            {
                mensagem,
            },
        )

        interacoes.value.unshift(interacao)

        return interacao
    }

    watch(
        () => [
            filters.value.status,
            filters.value.prioridade,
        ],
        () => {
            fetchTickets()
        },
    )

    return {
        tickets,
        selectedTicket,
        search,
        filters,
        loading,
        error,

        filteredTickets,
        totalTickets,
        totalAbertos,
        totalEmAtendimento,
        totalResolvidos,

        fetchTickets,
        fetchInteracoes,
        selectTicket,
        clearSelectedTicket,
        clearFilters,
        changeStatus,
        removeTicket,

        interacoes,
        loadingInteracoes,
        interacoesError,
        addInteracao,
    }
})
