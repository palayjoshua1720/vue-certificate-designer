import { ref, computed, type Ref, type ComputedRef } from 'vue'

export interface ZoomOptions {
    min?: number
    max?: number
    step?: number
}

export function useCanvasZoom(options?: ZoomOptions) {
    const min = options?.min ?? 0.1
    const max = options?.max ?? 4
    const step = options?.step ?? 0.1

    const zoomLevel: Ref<number> = ref(1)

    const zoomPercent: ComputedRef<number> = computed(() => {
        return Math.round(zoomLevel.value * 100)
    })

    function clamp(value: number): number {
        return Math.min(max, Math.max(min, value))
    }

    function zoomIn() {
        zoomLevel.value = clamp(
            Math.round((zoomLevel.value + step) * 100) / 100
        )
    }

    function zoomOut() {
        zoomLevel.value = clamp(
            Math.round((zoomLevel.value - step) * 100) / 100
        )
    }

    function zoomTo(level: number) {
        zoomLevel.value = clamp(level)
    }

    function resetZoom() {
        zoomLevel.value = 1
    }

    return {
        zoomLevel,
        zoomPercent,
        zoomIn,
        zoomOut,
        zoomTo,
        resetZoom
    }
}
