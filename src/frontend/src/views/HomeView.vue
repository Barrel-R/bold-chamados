<script setup lang="ts">
import { onMounted } from 'vue'

import FilterBar from '@/components/tickets/FilterBar.vue'
import StatsCards from '@/components/tickets/StatsCards.vue'
import TicketDetailPanel from '@/components/tickets/TicketDetailPanel.vue'
import TicketTable from '@/components/tickets/TicketTable.vue'

import { useTicketsStore } from '@/stores/tickets'
import { onBeforeRouteLeave } from 'vue-router'

const ticketsStore = useTicketsStore()

onMounted(() => {
    ticketsStore.fetchTickets()
})

onBeforeRouteLeave(() => {
    ticketsStore.clearSelectedTicket()
})
</script>

<template>
    <div>
        <div class="mb-6 flex items-end justify-between gap-4">
            <div>
                <h1 class="text-4xl font-bold tracking-tight">
                    Caixa de entrada
                </h1>

                <p class="mt-1 text-neutral-500">
                    {{ ticketsStore.totalTickets }} tickets no total
                </p>
            </div>

            <RouterLink to="/tickets/novo"
                class="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover">
                + Novo ticket
            </RouterLink>
        </div>

        <div class="space-y-5">
            <StatsCards />

            <FilterBar />

            <section class="grid gap-5" :class="ticketsStore.selectedTicket
                ? 'xl:grid-cols-[minmax(0,1fr)_400px]'
                : 'grid-cols-1'
                ">
                <TicketTable />

                <TicketDetailPanel />
            </section>
        </div>
    </div>
</template>
