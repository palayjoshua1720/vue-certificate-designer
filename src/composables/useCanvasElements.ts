import { ref, type Ref } from 'vue'
import type {
    CanvasElement,
    TextElement,
    ImageElement,
    ShapeElement,
    BaseElement
} from '../types'

// ─── ID Generator ────────────────────────────────────────────
let counter = 0
function generateId(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID()
    }
    return `el-${Date.now()}-${++counter}`
}

// ─── Element Factory Functions ───────────────────────────────

/** Create sensible defaults shared by all elements */
function baseDefaults(type: CanvasElement['type'], overrides?: Partial<BaseElement>): BaseElement {
    return {
        id: generateId(),
        type,
        name: `${type}-${Date.now()}`,
        x: 100,
        y: 100,
        width: 200,
        height: 50,
        rotation: 0,
        opacity: 1,
        visible: true,
        draggable: true,
        locked: false,
        ...overrides
    }
}

export function createTextElement(overrides?: Partial<TextElement>): TextElement {
    return {
        ...baseDefaults('text', overrides),
        type: 'text',
        text: 'New Text',
        fontSize: 24,
        fontFamily: 'Arial',
        fill: '#333333',
        fontStyle: 'normal',
        textDecoration: 'none',
        align: 'left',
        lineHeight: 1.2,
        ...overrides
    }
}

export function createImageElement(overrides?: Partial<ImageElement>): ImageElement {
    return {
        ...baseDefaults('image', overrides),
        type: 'image',
        src: '',
        clipShape: 'none',
        cornerRadius: 0,
        stroke: '',
        strokeWidth: 0,
        width: 200,
        height: 200,
        ...overrides
    }
}

export function createShapeElement(overrides?: Partial<ShapeElement>): ShapeElement {
    return {
        ...baseDefaults('shape', overrides),
        type: 'shape',
        shapeType: 'rect',
        fill: '#4A90D9',
        stroke: '#2C5F8A',
        strokeWidth: 2,
        width: 150,
        height: 100,
        ...overrides
    }
}

// ─── Composable ──────────────────────────────────────────────

export function useCanvasElements(initialElements?: CanvasElement[]) {
    const elements: Ref<CanvasElement[]> = ref(initialElements ?? [])

    function addElement(element: CanvasElement) {
        elements.value.push(element)
    }

    function removeElement(id: string) {
        const index = elements.value.findIndex(el => el.id === id)
        if (index !== -1) {
            elements.value.splice(index, 1)
        }
    }

    function updateElement(id: string, updates: Partial<CanvasElement>) {
        const index = elements.value.findIndex(el => el.id === id)
        if (index !== -1) {
            elements.value[index] = { ...elements.value[index], ...updates } as CanvasElement
        }
    }

    function getElementById(id: string): CanvasElement | undefined {
        return elements.value.find(el => el.id === id)
    }

    function clearElements() {
        elements.value = []
    }

    // ─── Layer Ordering ──────────────────────────────────────────

    function bringForward(id: string) {
        const arr = elements.value
        const index = arr.findIndex(el => el.id === id)
        if (index !== -1 && index < arr.length - 1) {
            const temp = arr[index]
            arr[index] = arr[index + 1]
            arr[index + 1] = temp
            elements.value = [...arr]
        }
    }

    function sendBackward(id: string) {
        const arr = elements.value
        const index = arr.findIndex(el => el.id === id)
        if (index > 0) {
            const temp = arr[index]
            arr[index] = arr[index - 1]
            arr[index - 1] = temp
            elements.value = [...arr]
        }
    }

    function bringToFront(id: string) {
        const arr = elements.value
        const index = arr.findIndex(el => el.id === id)
        if (index !== -1 && index < arr.length - 1) {
            const [el] = arr.splice(index, 1)
            arr.push(el)
            elements.value = [...arr]
        }
    }

    function sendToBack(id: string) {
        const arr = elements.value
        const index = arr.findIndex(el => el.id === id)
        if (index > 0) {
            const [el] = arr.splice(index, 1)
            arr.unshift(el)
            elements.value = [...arr]
        }
    }

    return {
        elements,
        addElement,
        removeElement,
        updateElement,
        getElementById,
        clearElements,
        bringForward,
        sendBackward,
        bringToFront,
        sendToBack
    }
}
