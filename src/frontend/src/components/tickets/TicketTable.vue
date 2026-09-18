<script setup lang="ts">
import type { Prioridade, Status } from '@/types'
import { useTicketsStore } from '@/stores/tickets'

const ticketsStore = useTicketsStore()

const statusLabels: Record<Status, string> = {
    aberto: 'Aberto',
    em_atendimento: 'Em atendimento',
    aguardando_cliente: 'Aguardando',
    resolvido: 'Resolvido',
    cancelado: 'Cancelado',
}

const prioridadeLabels: Record<Prioridade, string> = {
    baixa: 'Baixa',
    media: 'Média',
    alta: 'Alta',
}

function statusClass(status: Status) {
    switch (status) {
        case 'aberto':
            return 'bg-blue-50 text-blue-600'

        case 'em_atendimento':
            return 'bg-orange-50 text-orange-600'

        case 'aguardando_cliente':
            return 'bg-neutral-100 text-neutral-700'

        case 'resolvido':
            return 'bg-emerald-50 text-emerald-700'

        case 'cancelado':
            return 'bg-red-50 text-red-600'
    }
}

function prioridadeDot(prioridade: Prioridade) {
    switch (prioridade) {
        case 'alta':
            return 'bg-red-500'

        case 'media':
            return 'bg-amber-500'

        case 'baixa':
            return 'bg-neutral-400'
    }
}

function formatDate(date: string) {
    return new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
    }).format(new Date(date))
}
</script>

<template>
    <div class="overflow-hidden rounded-2xl border border-border bg-card">
        <div v-if="ticketsStore.loading" class="p-10 text-center text-sm text-neutral-500">
            Carregando tickets...
        </div>

        <div v-else-if="ticketsStore.error" class="p-10 text-center text-sm text-red-600">
            {{ ticketsStore.error }}
        </div>

        <div v-else-if="ticketsStore.filteredTickets.length === 0" class="p-10 text-center text-sm text-neutral-500">
            Nenhum ticket encontrado.
        </div>

        <div v-else class="overflow-x-auto">
            <div class="min-w-[850px]">
                <div
                    class="grid grid-cols-[130px_170px_minmax(220px,1fr)_120px_160px_130px] gap-3 border-b border-border px-5 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    <span>Protocolo</span>
                    <span>Cliente</span>
                    <span>Título</span>
                    <span>Prioridade</span>
                    <span>Status</span>
                    <span>Atualizado</span>
                </div>

                <button v-for="ticket in ticketsStore.filteredTickets" :key="ticket.id" type="button"
                    class="grid w-full grid-cols-[130px_170px_minmax(220px,1fr)_120px_160px_130px] gap-3 border-b border-border px-5 py-4 text-left text-sm transition last:border-b-0 hover:bg-[#faf7f0]"
                    :class="ticketsStore.selectedTicket?.id === ticket.id
                        ? 'border-l-4 border-l-primary bg-[#fff4eb] pl-4'
                        : ''
                        " @click="ticketsStore.selectTicket(ticket)">
                    <span class="truncate font-semibold" :class="ticketsStore.selectedTicket?.id === ticket.id
                        ? 'text-primary'
                        : ''
                        ">
                        {{ ticket.protocolo }}
                    </span>

                    <span class="truncate">
                        {{ ticket.cliente_nome }}
                    </span>

                    <span class="truncate font-medium">
                        {{ ticket.titulo }}
                    </span>

                    <span class="flex items-center gap-2">
                        <span class="size-2 rounded-full" :class="prioridadeDot(ticket.prioridade)" />

                        {{ prioridadeLabels[ticket.prioridade] }}
                    </span>

                    <span>
                        <span class="inline-flex rounded-full px-3 py-1 text-xs font-medium"
                            :class="statusClass(ticket.status)">
                            {{ statusLabels[ticket.status] }}
                        </span>
                    </span>

                    <span class="text-xs text-neutral-500">
                        {{ formatDate(ticket.atualizado_em) }}
                    </span>
                </button>
            </div>
        </div>

        <div v-if="!ticketsStore.loading" class="border-t border-border px-5 py-3 text-xs text-neutral-500">
            Mostrando
            {{ ticketsStore.filteredTickets.length }}
            tickets
        </div>
    </div>
</template>
