import { ref, type Ref } from 'vue'
import type { CertificateTemplate } from '../types'
import { builtInTemplates } from '../templates'

export function useTemplates() {
    const templates: Ref<CertificateTemplate[]> = ref([...builtInTemplates])

    function getTemplate(id: string): CertificateTemplate | undefined {
        return templates.value.find(t => t.id === id)
    }

    function registerTemplate(template: CertificateTemplate) {
        // Replace if ID already exists, otherwise add
        const idx = templates.value.findIndex(t => t.id === template.id)
        if (idx >= 0) {
            templates.value[idx] = template
        } else {
            templates.value.push(template)
        }
    }

    function removeTemplate(id: string) {
        templates.value = templates.value.filter(t => t.id !== id)
    }

    return {
        templates,
        getTemplate,
        registerTemplate,
        removeTemplate
    }
}
