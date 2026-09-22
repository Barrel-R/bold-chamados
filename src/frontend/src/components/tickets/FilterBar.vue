<script setup lang="ts">
import { onMounted, ref } from 'vue'

import type { Cliente } from '@/types'
import { getClientes } from '@/services/api'
import { useTicketsStore } from '@/stores/tickets'

const ticketsStore = useTicketsStore()

const clientes = ref<Cliente[]>([])
const loadingClientes = ref(false)

async function loadClientes() {
    loadingClientes.value = true

    try {
        clientes.value = await getClientes()
    } finally {
        loadingClientes.value = false
    }
}

onMounted(loadClientes)
</script>

<template>
    <section class="flex min-h-16 flex-wrap items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3">
        <select v-model="ticketsStore.filters.status"
            class="h-10 rounded-full border border-border bg-background px-4 text-sm outline-none transition focus:border-primary">
            <option :value="null">
                Status: Todos
            </option>

            <option value="aberto">
                Aberto
            </option>

            <option value="em_atendimento">
                Em atendimento
            </option>

            <option value="aguardando_cliente">
                Aguardando cliente
            </option>

            <option value="resolvido">
                Resolvido
            </option>

            <option value="cancelado">
                Cancelado
            </option>
        </select>

        <select v-model="ticketsStore.filters.prioridade"
            class="h-10 rounded-full border border-border bg-background px-4 text-sm outline-none transition focus:border-primary">
            <option :value="null">
                Prioridade: Todas
            </option>

            <option value="baixa">
                Baixa
            </option>

            <option value="media">
                Média
            </option>

            <option value="alta">
                Alta
            </option>
        </select>

        <span v-if="loadingClientes" class="text-xs text-neutral-400">
            Carregando clientes...
        </span>

        <button type="button" class="ml-auto text-sm text-neutral-500 transition hover:text-primary"
            @click="ticketsStore.clearFilters">
            Limpar filtros
        </button>
    </section>
</template>
