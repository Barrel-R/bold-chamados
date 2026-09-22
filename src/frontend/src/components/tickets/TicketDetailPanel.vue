<script setup lang="ts">
import type {
    Prioridade,
    Status,
} from '@/types'

import { ref } from 'vue'
import { useTicketsStore } from '@/stores/tickets'
import { ApiError } from '@/services/api'

const ticketsStore = useTicketsStore()

const updatingStatus = ref(false)
const error = ref<string | null>(null)
const errorDetails = ref<string[]>([])
const deletingTicket = ref(false)
const deleteError = ref<string | null>(null)
const novaMensagem = ref('')

const creatingInteracao = ref(false)
const interacaoCreateError = ref<string | null>(null)

const statusOptions: {
    value: Status
    label: string
}[] = [
        {
            value: 'aberto',
            label: 'Aberto',
        },
        {
            value: 'em_atendimento',
            label: 'Em atendimento',
        },
        {
            value: 'aguardando_cliente',
            label: 'Aguardando',
        },
        {
            value: 'resolvido',
            label: 'Resolvido',
        },
        {
            value: 'cancelado',
            label: 'Cancelado',
        },
    ]

const prioridadeLabels: Record<Prioridade, string> = {
    baixa: 'Baixa',
    media: 'Média',
    alta: 'Alta',
}

async function handleStatusChange(status: Status) {
    const ticket = ticketsStore.selectedTicket

    if (!ticket || ticket.status === status) {
        return
    }

    updatingStatus.value = true
    error.value = null
    errorDetails.value = []

    try {
        await ticketsStore.changeStatus(ticket.id, status)
    } catch (err) {
        if (err instanceof ApiError) {
            error.value = err.message
            errorDetails.value = err.details ?? []
        } else {
            error.value = 'Não foi possível atualizar o ticket'
        }
    } finally {
        updatingStatus.value = false
    }
}

async function handleDeleteTicket() {
    const ticket = ticketsStore.selectedTicket

    if (!ticket) {
        return
    }

    const confirmed = window.confirm(
        `Remover o ticket ${ticket.protocolo}?`,
    )

    if (!confirmed) {
        return
    }

    deletingTicket.value = true
    deleteError.value = null

    try {
        await ticketsStore.removeTicket(ticket.id)
    } catch (err) {
        if (err instanceof ApiError) {
            deleteError.value = err.message
        } else {
            deleteError.value = 'Não foi possível remover o ticket'
        }
    } finally {
        deletingTicket.value = false
    }
}

async function handleCreateInteracao() {
    const mensagem = novaMensagem.value.trim()

    if (!mensagem) {
        interacaoCreateError.value =
            'Digite uma mensagem'
        return
    }

    creatingInteracao.value = true
    interacaoCreateError.value = null

    try {
        await ticketsStore.addInteracao(
            mensagem,
        )

        novaMensagem.value = ''
    } catch (err) {
        if (err instanceof ApiError) {
            const message = err.details ? err.details[0] ?? err.message : err.message
            interacaoCreateError.value = message
        } else {
            interacaoCreateError.value = 'Não foi possível atualizar o ticket'
        }
    } finally {
        creatingInteracao.value = false
    }
}

function formatDate(date?: string | null) {
    if (!date) {
        return '-'
    }

    const parsed = new Date(date)

    if (Number.isNaN(parsed.getTime())) {
        return '-'
    }

    return new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
    }).format(parsed)
}

</script>

<template>
    <aside v-if="ticketsStore.selectedTicket"
        class="self-start overflow-hidden rounded-2xl border border-border bg-card">
        <header class="border-b border-border p-5">
            <div class="flex items-start justify-between gap-4">
                <div>
                    <div class="mb-2 flex items-center gap-2">
                        <span class="text-sm font-semibold text-primary">
                            {{ ticketsStore.selectedTicket.protocolo }}
                        </span>

                        <span class="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600">
                            {{
                                ticketsStore.selectedTicket.status.replaceAll(
                                    '_',
                                    ' ',
                                )
                            }}
                        </span>
                    </div>

                    <h2 class="text-xl font-semibold leading-tight">
                        {{ ticketsStore.selectedTicket.titulo }}
                    </h2>
                </div>

                <button type="button"
                    class="flex size-9 shrink-0 items-center justify-center rounded-xl border border-border text-xl text-neutral-500 transition hover:bg-background"
                    @click="ticketsStore.clearSelectedTicket">
                    ×
                </button>
            </div>
        </header>

        <div class="p-5">
            <div class="mb-6 grid grid-cols-2 gap-3">
                <div class="rounded-xl bg-background p-3">
                    <p class="mb-1 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                        Cliente
                    </p>

                    <p class="truncate text-sm font-semibold">
                        {{ ticketsStore.selectedTicket.cliente_nome }}
                    </p>
                </div>

                <div class="rounded-xl bg-background p-3">
                    <p class="mb-1 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                        Prioridade
                    </p>

                    <p class="text-sm font-semibold">
                        {{
                            prioridadeLabels[
                            ticketsStore.selectedTicket.prioridade
                            ]
                        }}
                    </p>
                </div>

                <div class="rounded-xl bg-background p-3">
                    <p class="mb-1 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                        Aberto em
                    </p>

                    <p class="text-sm font-semibold">
                        {{
                            formatDate(
                                ticketsStore.selectedTicket.criado_em,
                            )
                        }}
                    </p>
                </div>

                <div class="rounded-xl bg-background p-3">
                    <p class="mb-1 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                        Atualizado
                    </p>

                    <p class="text-sm font-semibold">
                        {{
                            formatDate(
                                ticketsStore.selectedTicket.atualizado_em,
                            )
                        }}
                    </p>
                </div>
            </div>

            <section class="mb-6">
                <h3 class="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                    Descrição
                </h3>

                <p class="text-sm leading-6 text-neutral-600">
                    {{ ticketsStore.selectedTicket.descricao }}
                </p>
            </section>

            <section>
                <h3 class="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                    Atualizar status
                </h3>

                <div class="flex flex-wrap gap-2">
                    <button v-for="status in statusOptions" :key="status.value" type="button" :disabled="updatingStatus"
                        class="rounded-xl px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50"
                        :class="ticketsStore.selectedTicket.status === status.value
                            ? 'bg-blue-600 text-white'
                            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                            " @click="handleStatusChange(status.value)">
                        {{ status.label }}
                    </button>
                </div>

                <div v-if="error" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 mt-6">
                    <p class="text-sm font-medium text-red-700">
                        {{ error }}
                    </p>

                    <ul v-if="errorDetails.length" class="mt-2 list-disc space-y-1 pl-5 text-sm text-red-600">
                        <li v-for="detail in errorDetails" :key="detail">
                            {{ detail }}
                        </li>
                    </ul>
                </div>

                <section class="mt-8 border-t border-border pt-6">
                    <div v-if="deleteError"
                        class="mb-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {{ deleteError }}
                    </div>

                    <button type="button" :disabled="deletingTicket"
                        class="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                        @click="handleDeleteTicket">
                        {{
                            deletingTicket
                                ? 'Removendo ticket...'
                                : 'Remover ticket'
                        }}
                    </button>
                </section>

                <section class="mt-8 border-t border-border pt-6">
                    <div class="mb-4 flex items-center justify-between">
                        <h3 class="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                            Interações
                        </h3>

                        <span v-if="!ticketsStore.loadingInteracoes" class="text-xs text-neutral-400">
                            {{ ticketsStore.interacoes.length }}
                        </span>
                    </div>

                    <div class="mb-5 rounded-xl border border-border bg-background p-4">
                        <div class="mb-3">
                            <label class="mb-2 block text-xs font-semibold uppercase tracking-wide text-neutral-400">
                                Nova interação
                            </label>

                            <textarea v-model="novaMensagem" rows="3" maxlength="1000"
                                placeholder="Escreva uma mensagem..."
                                class="w-full resize-none rounded-xl border border-border bg-white px-3 py-3 text-sm outline-none transition focus:border-primary" />
                        </div>

                        <div v-if="interacaoCreateError"
                            class="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                            {{ interacaoCreateError }}
                        </div>

                        <div class="flex justify-end">
                            <button type="button" :disabled="creatingInteracao ||
                                !novaMensagem.trim()
                                "
                                class="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
                                @click="handleCreateInteracao">
                                {{
                                    creatingInteracao
                                        ? 'Adicionando...'
                                        : 'Adicionar interação'
                                }}
                            </button>
                        </div>
                    </div>

                    <div v-if="ticketsStore.loadingInteracoes" class="py-6 text-center text-sm text-neutral-500">
                        Carregando interações...
                    </div>

                    <div v-else-if="ticketsStore.interacoesError"
                        class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {{ ticketsStore.interacoesError }}
                    </div>

                    <div v-else-if="ticketsStore.interacoes?.length === 0"
                        class="rounded-xl bg-background px-4 py-5 text-center text-sm text-neutral-500">
                        Nenhuma interação registrada.
                    </div>

                    <div v-else class="space-y-3">
                        <article v-for="interacao in ticketsStore.interacoes" :key="interacao.id"
                            class="rounded-xl border border-border bg-background p-4">
                            <div class="mb-2 flex items-center justify-between gap-3">
                                <span class="text-xs font-semibold uppercase tracking-wide text-primary">
                                    {{ interacao.tipo }}
                                </span>

                                <span class="text-xs text-neutral-400">
                                    {{ formatDate(interacao.criado_em) }}
                                </span>
                            </div>

                            <p class="text-sm leading-6 text-neutral-600">
                                {{ interacao.mensagem }}
                            </p>
                        </article>
                    </div>
                </section>

            </section>
        </div>
    </aside>
</template>
