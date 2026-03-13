import type { BackgroundConfig, BorderConfig } from './canvas'
import type { CanvasElement } from './element'

export interface CertificateTemplate {
    /** Unique template identifier */
    id: string
    /** Display name */
    name: string
    /** Short description */
    description: string
    /** Optional thumbnail for preview (base64 or URL) */
    thumbnail?: string
    /** Canvas dimensions */
    canvas: {
        width: number
        height: number
    }
    /** Background configuration */
    background: BackgroundConfig
    /** Border configuration */
    border: BorderConfig
    /** Pre-built elements */
    elements: CanvasElement[]
}
