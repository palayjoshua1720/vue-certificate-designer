// ─── Background ──────────────────────────────────────────────
export type BackgroundType = 'color' | 'image' | 'gradient'

export interface BackgroundConfig {
    type: BackgroundType
    /** Depending on type: hex color, image URL, or CSS gradient string */
    value: string
}

// ─── Border ──────────────────────────────────────────────────
export interface BorderConfig {
    enabled: boolean
    style: 'solid' | 'dashed' | 'dotted' | 'double'
    width: number
    color: string
    cornerRadius: number
}

// ─── Canvas ──────────────────────────────────────────────────
export interface CanvasConfig {
    /** Canvas width in pixels */
    width: number
    /** Canvas height in pixels */
    height: number
    scaleX: number
    scaleY: number
    background: BackgroundConfig
    border: BorderConfig
}
