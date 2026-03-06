import { ref, computed, type Ref, type ComputedRef } from 'vue'
import type { CanvasElement } from '../types'

type UpdateElementFn = (id: string, updates: Partial<CanvasElement>) => void

export function useCanvasSelection(
    elements: Ref<CanvasElement[]>,
    updateElement?: UpdateElementFn
) {
    const selectedElementId: Ref<string | null> = ref(null)

    const selectedElement: ComputedRef<CanvasElement | undefined> = computed(() => {
        if (!selectedElementId.value) return undefined
        return elements.value.find(el => el.id === selectedElementId.value)
    })

    function select(id: string) {
        selectedElementId.value = id
    }

    function deselect() {
        selectedElementId.value = null
    }

    function isSelected(id: string): boolean {
        return selectedElementId.value === id
    }

    function updateSelectedElement(updates: Partial<CanvasElement>) {
        if (selectedElementId.value && updateElement) {
            updateElement(selectedElementId.value, updates)
        }
    }

    return {
        selectedElementId,
        selectedElement,
        select,
        deselect,
        isSelected,
        updateSelectedElement
    }
}
