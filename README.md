# Certificate Designer

A Vue 3 component for designing certificates and other canvas-based layouts using Konva.

Features interactive dragging, resizing, selection, customizable grids, background management, history (undo/redo), and image export.

## Installation

```bash
npm install @joshuap/certificate-designer
```

### Peer Dependencies
This library relies on Vue 3 and Konva. Ensure you have them installed in your project:
```bash
npm install vue vue-konva konva
```

## Setup

First, make sure you register `vue-konva` in your Vue application if you haven't already:

```ts
import { createApp } from 'vue'
import App from './App.vue'
import VueKonva from 'vue-konva'

const app = createApp(App)
app.use(VueKonva)
app.mount('#app')
```

## Basic Usage

```vue
<template>
    <div style="width: 100vw; height: 100vh; display: flex; justify-content: center; align-items: center; background: #f0f0f0;">
        <CertificateDesigner
            :width="800"
            :height="600"
            :show-grid="true"
            :grid-size="50"
            background-color="#ffffff"
            :border-enabled="true"
            border-color="#333333"
            :border-width="2"
            @element-selected="onElementSelected"
            @element-dragstart="onDragStart"
            @element-dragend="onDragEnd"
            ref="designer"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// You can import the main component directly or setup the library globally
import { CertificateDesigner } from '@joshuap/certificate-designer'

const designer = ref<InstanceType<typeof CertificateDesigner> | null>(null)

function onElementSelected(id: string | null) {
  console.log('Selected Element ID:', id)
}

function onDragStart(id: string) {
  console.log('Drag Start:', id)
}

function onDragEnd(id: string, x: number, y: number) {
  console.log(`Drag End: ${id} at (${x}, ${y})`)
}

onMounted(() => {
    // Use designer methods here
    if (designer.value) {
        designer.value.addElement({
            id: 'title',
            type: 'text',
            text: 'Certificate of Achievement',
            x: 200,
            y: 100,
            fontSize: 32,
            fontFamily: 'Arial',
            fill: '#000000',
            width: 400,
            draggable: true
        })
    }
})
</script>
```

## Props

The `CertificateDesigner` component accepts the following props:

| Prop | Type | Default | Description |
|---|---|---|---|
| `width` | `number` | `800` | Canvas width |
| `height` | `number` | `600` | Canvas height |
| `initialScale` | `number` | `1` | Initial Zoom Scale |
| `initialElements` | `CanvasElement[]` | `[]` | Loading pre-existing elements on mount |
| `showGrid` | `boolean` | `false` | Whether to display background grid lines |
| `gridSize` | `number` | `50` | Size of the grid cells |
| `backgroundColor` | `string` | `'#ffffff'` | The canvas background color |
| `borderEnabled` | `boolean` | `false` | Whether the canvas has a border |
| `borderColor` | `string` | `'#333333'` | Canvas border outline color |
| `borderWidth` | `number` | `2` | Canvas border thickness |

## Events

- `@element-selected(id: string | null)`: Fired when an element is clicked or selection is cleared.
- `@element-dragstart(id: string)`: Fired when an element drag initiates.
- `@element-dragend(id: string, x: number, y: number)`: Fired when the element is dropped.

## Component Ref Methods & State

By placing a template ref on `<CertificateDesigner>`, you gain access to the underlying API:

### Element Management
- `elements`: Ref containing all canvas components.
- `addElement(element: CanvasElement)`: Add a text, shape, or image.
- `removeElement(id: string)`: Remove an element by its ID.
- `updateElement(id: string, updates: Partial<CanvasElement>)`: Modify an element's properties.
- `clearElements()`: Removes all objects from the canvas.

### Layer Ordering
- `bringForward(id: string)`
- `sendBackward(id: string)`
- `bringToFront(id: string)`
- `sendToBack(id: string)`

### Selection
- `select(id: string)`: Selects a specific element, showing transform handles.
- `deselect()`: Clears the selection.
- `selectedElementId`: Readonly Ref containing the currently selected ID.

### Zoom & Panning
- `zoomLevel` / `zoomPercent`: Refs managing the current active zoom state.
- `zoomIn()`, `zoomOut()`, `zoomTo(level: number)`, `resetZoom()`
*(You can also use Ctrl+Mouse Wheel to zoom on the canvas).*

### History
- `undo()`, `redo()`, `clearHistory()`: Manages action history. *(Or use `Ctrl+Z` / `Ctrl+Shift+Z` keyboard shortcuts)*
- `canUndo`, `canRedo`: Computed refs available for UI binding.

### Background & Border
- `setBackground(config: BackgroundConfig)`
- `setBorder(config: BorderConfig)`
- `gridVisible`, `setShowGrid(show: boolean)`

### Export Options
*(These are internally implemented inside the component, you can examine `CertificateDesigner.vue` for details on how `exportToPNG` or `exportToJSON` are implemented).*

## Composables

The library also exports several composables to manage your own state or create default objects:

- `useCanvasElements`
- `useCanvasSelection`
- `useCanvasHistory`
- `useCanvasZoom`
- `useCanvasBackground`

Use the helper functions to quickly instantiate layout objects:
```ts
import { 
  createTextElement, 
  createShapeElement, 
  createImageElement 
} from '@joshuap/certificate-designer'

const title = createTextElement({ text: 'Certificate' })
const badge = createShapeElement({ shapeType: 'circle', fill: '#FFD700' })
```
