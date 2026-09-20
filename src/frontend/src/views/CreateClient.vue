<script setup lang="ts">
import { ref } from 'vue'
import { ApiError, createCliente } from '@/services/api'

const nome = ref('')
const email = ref('')
const telefone = ref('')

const loading = ref(false)
const success = ref<string | null>(null)
const error = ref<string | null>(null)
const errorDetails = ref<string[]>([])

async function submit() {
    success.value = null
    error.value = null
    errorDetails.value = []
    loading.value = true

    try {
        const cliente = await createCliente({
            nome: nome.value.trim(),
            email: email.value.trim(),
            telefone: telefone.value.trim(),
        })

        success.value = `Cliente criado com sucesso: ${cliente.nome}`

        nome.value = ''
        email.value = ''
        telefone.value = ''
    } catch (err) {
        if (err instanceof ApiError) {
            error.value = err.message
            errorDetails.value = err.details ?? []
        } else {
            error.value = 'Não foi possível criar o cliente'
        }
    } finally {
        loading.value = false
    }
}

function formatTelefone(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 11)

    if (digits.length <= 2) {
        return digits
    }

    const ddd = digits.slice(0, 2)
    const numero = digits.slice(2)

    if (numero.length <= 4) {
        return `(${ddd}) ${numero}`
    }

    if (numero.length <= 8) {
        return `(${ddd}) ${numero.slice(0, 4)}-${numero.slice(4)}`
    }

    return `(${ddd}) ${numero.slice(0, 5)}-${numero.slice(5)}`
}

function handleTelefoneInput(event: Event) {
    const input = event.target as HTMLInputElement

    telefone.value = formatTelefone(input.value)
}
</script>

<template>
    <div class="mx-auto w-full max-w-3xl">
        <div class="mb-6">
            <h1 class="text-3xl font-bold tracking-tight">
                Novo cliente
            </h1>

            <p class="mt-1 text-sm text-muted">
                Adicione um cliente no sistema.
            </p>
        </div>

        <div class="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <form class="space-y-5" @submit.prevent="submit">
                <div>
                    <label for="nome" class="mb-2 block text-sm font-medium">
                        Nome
                    </label>

                    <input id="nome" v-model="nome" type="text" required minlength="2"
                        class="w-full rounded-xl border border-border bg-white px-4 py-3 outline-none transition focus:border-primary"
                        placeholder="Nome do cliente" />
                </div>

                <div>
                    <label for="email" class="mb-2 block text-sm font-medium">
                        E-mail
                    </label>

                    <input id="email" v-model="email" type="email" required
                        class="w-full rounded-xl border border-border bg-white px-4 py-3 outline-none transition focus:border-primary"
                        placeholder="cliente@empresa.com" />
                </div>

                <div>
                    <label for="telefone" class="mb-2 block text-sm font-medium">
                        Telefone
                    </label>

                    <input id="telefone" :value="telefone" type="tel" inputmode="numeric" autocomplete="tel"
                        maxlength="15" required
                        class="w-full rounded-xl border border-border bg-white px-4 py-3 outline-none transition focus:border-primary"
                        placeholder="(75) 99999-9999" @input="handleTelefoneInput" />
                </div>

                <div v-if="success"
                    class="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {{ success }}
                </div>

                <div v-if="error" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                    <p class="text-sm font-medium text-red-700">
                        {{ error }}
                    </p>

                    <ul v-if="errorDetails.length" class="mt-2 list-disc space-y-1 pl-5 text-sm text-red-600">
                        <li v-for="detail in errorDetails" :key="detail">
                            {{ detail }}
                        </li>
                    </ul>
                </div>

                <div class="pt-2">
                    <button type="submit" :disabled="loading"
                        class="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50">
                        {{ loading ? 'Criando...' : 'Criar cliente' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
