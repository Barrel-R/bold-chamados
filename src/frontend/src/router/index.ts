import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CreateClienteView from "@/views/CreateClient.vue"
import CreateTicketView from "@/views/CreateTicket.vue"
import ClienteView from "@/views/ClientesView.vue"

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
        },
        {
            path: '/clientes',
            name: 'clientes',
            component: ClienteView,
        },
        {
            path: '/clientes/novo',
            name: 'create-cliente',
            component: CreateClienteView,
        },
        {
            path: '/tickets/novo',
            name: 'create-ticket',
            component: CreateTicketView
        },
    ],
})

export default router
