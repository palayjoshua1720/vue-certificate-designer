export interface CanvasPreset {
    width: number
    height: number
    label: string
}

export const CANVAS_PRESETS: Record<string, CanvasPreset> = {
    'a4-landscape': { width: 1122, height: 794, label: 'A4 Landscape' },
    'a4-portrait': { width: 794, height: 1122, label: 'A4 Portrait' },
    'letter-landscape': { width: 1100, height: 850, label: 'Letter Landscape' },
    'letter-portrait': { width: 850, height: 1100, label: 'Letter Portrait' },
    'hd-landscape': { width: 1280, height: 720, label: '720p HD' },
    'square': { width: 800, height: 800, label: 'Square' },
    'certificate': { width: 800, height: 600, label: 'Certificate (Default)' }
}
