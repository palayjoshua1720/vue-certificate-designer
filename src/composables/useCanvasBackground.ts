import { ref, type Ref } from 'vue'
import type { BackgroundConfig, BorderConfig } from '../types'

export interface CanvasBackgroundOptions {
    background?: Partial<BackgroundConfig>
    border?: Partial<BorderConfig>
}

export function useCanvasBackground(options?: CanvasBackgroundOptions) {
    const background: Ref<BackgroundConfig> = ref({
        type: 'color',
        value: '#ffffff',
        ...options?.background
    })

    const border: Ref<BorderConfig> = ref({
        enabled: false,
        style: 'solid',
        width: 2,
        color: '#333333',
        cornerRadius: 0,
        ...options?.border
    })

    // ─── Background Setters ──────────────────────────────────

    function setBackgroundColor(color: string) {
        background.value = { type: 'color', value: color }
    }

    function setBackgroundImage(url: string) {
        background.value = { type: 'image', value: url }
    }

    function setBackground(config: Partial<BackgroundConfig>) {
        background.value = { ...background.value, ...config }
    }

    // ─── Border Setters ──────────────────────────────────────

    function setBorderEnabled(enabled: boolean) {
        border.value = { ...border.value, enabled }
    }

    function setBorderColor(color: string) {
        border.value = { ...border.value, color }
    }

    function setBorderWidth(width: number) {
        border.value = { ...border.value, width: Math.max(0, width) }
    }

    function setBorderStyle(style: BorderConfig['style']) {
        border.value = { ...border.value, style }
    }

    function setBorderRadius(cornerRadius: number) {
        border.value = { ...border.value, cornerRadius: Math.max(0, cornerRadius) }
    }

    function setBorder(config: Partial<BorderConfig>) {
        border.value = { ...border.value, ...config }
    }

    return {
        background,
        border,
        setBackgroundColor,
        setBackgroundImage,
        setBackground,
        setBorderEnabled,
        setBorderColor,
        setBorderWidth,
        setBorderStyle,
        setBorderRadius,
        setBorder
    }
}
