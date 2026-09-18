<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
    <div class="min-h-screen bg-background text-neutral-900">
        <header class="fixed inset-x-0 top-0 z-50 h-16 border-b border-border bg-background">
            <div class="mx-auto flex h-full max-w-[1600px] items-center gap-6 px-6">
                <RouterLink to="/" class="flex items-center gap-3">
                    <div class="flex size-9 items-center justify-center rounded-full bg-primary font-bold text-white">
                        B
                    </div>

                    <div class="flex items-center gap-3">
                        <strong class="text-lg text-primary">
                            Bold chamados
                        </strong>

                        <span
                            class="hidden text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-400 sm:inline">
                            Suporte interno
                        </span>
                    </div>
                </RouterLink>

                <nav class="ml-auto flex items-center gap-2">
                    <RouterLink to="/"
                        class="rounded-full px-4 py-2 text-sm font-medium transition hover:bg-primary-soft"
                        active-class="bg-primary-soft text-primary">
                        Tickets
                    </RouterLink>

                    <RouterLink to="/clientes"
                        class="rounded-full px-4 py-2 text-sm font-medium transition hover:bg-primary-soft"
                        active-class="bg-primary-soft text-primary">
                        Clientes
                    </RouterLink>
                </nav>
            </div>
        </header>

        <main class="mx-auto w-full max-w-[1600px] px-6 pb-10 pt-24">
            <RouterView />
        </main>
    </div>
</template>
