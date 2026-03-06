import type { App } from 'vue'
import CertificateDesigner from './components/CertificateDesigner.vue'

export { CertificateDesigner }
export * from './types'
export { useCanvasElements, createTextElement, createImageElement, createShapeElement } from './composables/useCanvasElements'
export { useCanvasSelection } from './composables/useCanvasSelection'
export { useCanvasZoom } from './composables/useCanvasZoom'
export { useCanvasHistory } from './composables/useCanvasHistory'
export { useCanvasBackground } from './composables/useCanvasBackground'

export default {
    install(app: App) {
        app.component('CertificateDesigner', CertificateDesigner)
    }
}