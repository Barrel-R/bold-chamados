<script setup lang="ts">
import { useTicketsStore } from '@/stores/tickets'

const ticketsStore = useTicketsStore()
</script>

<template>
    <section class="grid gap-3 md:grid-cols-3">
        <div class="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
            <div
                class="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl font-semibold text-blue-600">
                {{ ticketsStore.totalAbertos }}
            </div>

            <div>
                <p class="font-semibold">
                    Abertos
                </p>

                <p class="text-sm text-neutral-500">
                    na fila de atendimento
                </p>
            </div>
        </div>

        <div class="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
            <div
                class="flex size-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-xl font-semibold text-primary">
                {{ ticketsStore.totalEmAtendimento }}
            </div>

            <div>
                <p class="font-semibold">
                    Em atendimento
                </p>

                <p class="text-sm text-neutral-500">
                    sendo atendidos agora
                </p>
            </div>
        </div>

        <div class="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
            <div
                class="flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-xl font-semibold text-emerald-700">
                {{ ticketsStore.totalResolvidos }}
            </div>

            <div>
                <p class="font-semibold">
                    Resolvidos
                </p>

                <p class="text-sm text-neutral-500">
                    concluídos
                </p>
            </div>
        </div>
    </section>
</template>
