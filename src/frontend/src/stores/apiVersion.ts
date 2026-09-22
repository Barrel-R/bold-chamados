import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export type ApiVersion = 'v1' | 'v2'

export const useApiVersionStore = defineStore('apiVersion', () => {
    const saved = localStorage.getItem('api_version')

    const version = ref<ApiVersion>(
        saved === 'v1' ? 'v1' : 'v2',
    )

    const isV2 = computed(() => version.value === 'v2')

    function setVersion(value: ApiVersion) {
        version.value = value
        localStorage.setItem('api_version', value)
    }

    function toggleVersion() {
        setVersion(version.value === 'v2' ? 'v1' : 'v2')
        window.location.reload()
    }

    return {
        version,
        isV2,
        setVersion,
        toggleVersion,
    }
})
