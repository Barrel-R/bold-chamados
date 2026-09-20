<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Cliente } from '@/types'
import {
    ApiError,
    deleteCliente,
    getClientes,
} from '@/services/api'

const clientes = ref<Cliente[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const deletingId = ref<string | null>(null)

async function loadClientes() {
    loading.value = true
    error.value = null

    try {
        clientes.value = await getClientes()
    } catch (err) {
        if (err instanceof ApiError) {
            error.value = err.message
        } else {
            error.value = 'Não foi possível obter os clientes'
        }
    } finally {
        loading.value = false
    }
}

async function removeCliente(cliente: Cliente) {
    const confirmed = window.confirm(
        `Remover o cliente "${cliente.nome}"?`,
    )

    if (!confirmed) {
        return
    }

    deletingId.value = cliente.id

    try {
        await deleteCliente(cliente.id)

        clientes.value = clientes.value.filter(
            (item) => item.id !== cliente.id,
        )
    } catch (err) {
        error.value =
            err instanceof Error
                ? err.message
                : 'Não foi possível remover o cliente'
    } finally {
        deletingId.value = null
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

onMounted(loadClientes)
</script>

<template>
    <div>
        <div class="mb-6 flex items-end justify-between gap-4">
            <div>
                <h1 class="text-4xl font-bold tracking-tight">
                    Clientes
                </h1>

                <p class="mt-1 text-neutral-500">
                    {{ clientes.length }} clientes cadastrados
                </p>
            </div>

            <RouterLink to="/clientes/novo"
                class="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover">
                + Novo cliente
            </RouterLink>
        </div>

        <div v-if="error" class="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {{ error }}
        </div>

        <div class="overflow-hidden rounded-2xl border border-border bg-card">
            <div v-if="loading" class="p-10 text-center text-sm text-neutral-500">
                Carregando clientes...
            </div>

            <div v-else-if="clientes.length === 0" class="p-10 text-center text-sm text-neutral-500">
                Nenhum cliente encontrado.
            </div>

            <div v-else class="overflow-x-auto">
                <div class="min-w-[900px]">
                    <div
                        class="grid grid-cols-[minmax(180px,1fr)_minmax(220px,1fr)_180px_160px_100px] gap-4 border-b border-border px-5 py-4 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                        <span>Nome</span>
                        <span>E-mail</span>
                        <span>Telefone</span>
                        <span>Criado em</span>
                        <span></span>
                    </div>

                    <div v-for="cliente in clientes" :key="cliente.id"
                        class="grid grid-cols-[minmax(180px,1fr)_minmax(220px,1fr)_180px_160px_100px] items-center gap-4 border-b border-border px-5 py-4 last:border-b-0">
                        <span class="truncate font-medium">
                            {{ cliente.nome }}
                        </span>

                        <span class="truncate text-sm text-neutral-600">
                            {{ cliente.email }}
                        </span>

                        <span class="text-sm text-neutral-600">
                            {{ cliente.telefone }}
                        </span>

                        <span class="text-sm text-neutral-500">
                            {{ formatDate(cliente.criado_em) }}
                        </span>

                        <button type="button" :disabled="deletingId === cliente.id"
                            class="text-sm font-medium text-red-600 transition hover:text-red-700 disabled:opacity-50"
                            @click="removeCliente(cliente)">
                            {{
                                deletingId === cliente.id
                                    ? 'Removendo...'
                                    : 'Remover'
                            }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
