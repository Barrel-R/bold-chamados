<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import type { Cliente, Prioridade, Status } from '@/types'
import { ApiError, createTicket, getClientes } from '@/services/api'

const router = useRouter()

const clientes = ref<Cliente[]>([])

const clienteUuid = ref('')
const titulo = ref('')
const descricao = ref('')
const prioridade = ref<Prioridade>('media')

const loading = ref(false)
const loadingClientes = ref(false)

const success = ref<string | null>(null)
const error = ref<string | null>(null)
const errorDetails = ref<string[]>([])

async function loadClientes() {
    loadingClientes.value = true

    try {
        clientes.value = await getClientes()
    } catch (err) {
        if (err instanceof ApiError) {
            error.value = err.message
            errorDetails.value = err.details ?? []
        } else {
            error.value = 'Não foi possível obter os clientes'
        }
    } finally {
        loadingClientes.value = false
    }
}

async function submit() {
    success.value = null
    error.value = null
    errorDetails.value = []

    if (!clienteUuid.value) {
        error.value = 'Selecione um cliente'
        return
    }

    loading.value = true

    try {
        const ticket = await createTicket({
            cliente_id: clienteUuid.value,
            titulo: titulo.value.trim(),
            descricao: descricao.value.trim(),
            prioridade: prioridade.value,
        })

        success.value = `Ticket ${ticket.protocolo} criado com sucesso`

        setTimeout(() => {
            router.push('/')
        }, 800)
    } catch (err) {
        if (err instanceof ApiError) {
            error.value = err.message
            errorDetails.value = err.details ?? []
        } else {
            error.value = 'Não foi possível criar o ticket'
        }
    } finally {
        loading.value = false
    }
}

onMounted(loadClientes)

</script>

<template>
    <div class="mx-auto w-full max-w-3xl">
        <div class="mb-6">
            <h1 class="text-3xl font-bold tracking-tight">
                Novo ticket
            </h1>

            <p class="mt-1 text-sm text-muted">
                Registre um novo chamado para um cliente.
            </p>
        </div>

        <div class="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <form class="space-y-6" @submit.prevent="submit">
                <div>
                    <label for="cliente" class="mb-2 block text-sm font-medium">
                        Cliente
                    </label>

                    <select id="cliente" v-model="clienteUuid" required :disabled="loadingClientes"
                        class="w-full rounded-xl border border-border bg-white px-4 py-3 outline-none transition focus:border-primary disabled:opacity-50">
                        <option value="" disabled>
                            {{
                                loadingClientes
                                    ? 'Carregando clientes...'
                                    : 'Selecione um cliente'
                            }}
                        </option>

                        <option v-for="cliente in clientes" :key="cliente.id" :value="cliente.id">
                            {{ cliente.nome }}
                        </option>
                    </select>
                </div>

                <div>
                    <label for="titulo" class="mb-2 block text-sm font-medium">
                        Título
                    </label>

                    <input id="titulo" v-model="titulo" type="text" required minlength="2"
                        class="w-full rounded-xl border border-border bg-white px-4 py-3 outline-none transition focus:border-primary"
                        placeholder="Ex: Erro ao acessar relatório" />
                </div>

                <div>
                    <label for="descricao" required minlength="8" class="mb-2 block text-sm font-medium">
                        Descrição
                    </label>

                    <textarea id="descricao" v-model="descricao" rows="6" required minlength="8"
                        class="w-full resize-none rounded-xl border border-border bg-white px-4 py-3 outline-none transition focus:border-primary"
                        placeholder="Descreva o problema com mais detalhes..." />
                </div>

                <div class="grid gap-5">
                    <div>
                        <label for="prioridade" class="mb-2 block text-sm font-medium">
                            Prioridade
                        </label>

                        <select id="prioridade" v-model="prioridade"
                            class="w-full rounded-xl border border-border bg-white px-4 py-3 outline-none transition focus:border-primary">
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
                        <button type="submit" :disabled="loading || loadingClientes"
                            class="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50">
                            {{
                                loading
                                    ? 'Criando ticket...'
                                    : 'Criar ticket'
                            }}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>
