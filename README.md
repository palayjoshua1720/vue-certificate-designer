# @juswap/certificate-designer

A Vue 3 + Konva library for building interactive, drag-and-drop certificate designers with templates, image clipping, export, and dynamic placeholders.

**[Live Demo](https://vue-certificate-designer-demo.vercel.app/)**

## Features

- **Canvas Editor** — Drag, resize, rotate text, shapes, and images on an interactive Konva canvas
- **Selection & Transform** — Click elements to select with resize/rotate handles
- **Templates** — 3 built-in certificate templates (Classic, Modern, Elegant) + register your own
- **Dynamic Placeholders** — Replace `{recipient_name}`, `{date}`, etc. in text elements programmatically
- **Canvas Presets** — A4, Letter, HD, Square, and custom canvas sizes with proportional element scaling
- **Image Elements** — Upload images with clip shapes (circle, rounded rectangle) and borders
- **Background** — Solid color or image backgrounds + configurable borders (solid/dashed/dotted)
- **Zoom** — Buttons and Ctrl+scroll wheel zoom (10%–400%)
- **Grid Lines** — Toggleable grid overlay for precise alignment
- **History** — Undo/redo with keyboard shortcuts (Ctrl+Z, Ctrl+Shift+Z)
- **Layer Ordering** — Bring forward/backward, send to front/back
- **Export** — High-res PNG and PDF support, plus JSON (full state serialization with load)

## Installation

```bash
npm install @juswap/certificate-designer
```

### Peer Dependencies

```bash
npm install vue vue-konva konva jspdf
```

## Setup

Register `vue-konva` in your Vue app:

```ts
import { createApp } from 'vue'
import App from './App.vue'
import VueKonva from 'vue-konva'

const app = createApp(App)
app.use(VueKonva)
app.mount('#app')
```

## Quick Start

```vue
<template>
  <CertificateDesigner
    ref="designer"
    :width="800"
    :height="600"
    :show-grid="true"
    background-color="#ffffff"
    :border-enabled="true"
    @element-selected="onSelected"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  CertificateDesigner,
  createTextElement,
  createImageElement,
  createShapeElement
} from '@juswap/certificate-designer'

const designer = ref<InstanceType<typeof CertificateDesigner> | null>(null)

function onSelected(id: string | null) {
  console.log('Selected:', id)
}

onMounted(() => {
  // Add text
  designer.value?.addElement(
    createTextElement({
      text: 'Certificate of Achievement',
      x: 200, y: 100,
      fontSize: 32,
      fontFamily: 'Georgia',
      fill: '#222222'
    })
  )

  // Add shape
  designer.value?.addElement(
    createShapeElement({
      shapeType: 'rect',
      x: 100, y: 300,
      fill: '#4A90D9',
      stroke: '#2C5F8A'
    })
  )
})
</script>
```

## Templates

Load built-in templates or register your own:

```ts
// Load a built-in template
designer.value.loadTemplate('classic')   // 'classic' | 'modern' | 'elegant'

// Fill placeholders with real data
designer.value.fillPlaceholders({
  recipient_name: 'Jane Smith',
  date: 'March 13, 2026',
  organization_name: 'Tech Academy'
})

// Register a custom template
import type { CertificateTemplate } from '@juswap/certificate-designer'

designer.value.registerTemplate({
  id: 'my-template',
  name: 'My Design',
  description: 'Custom certificate layout',
  canvas: { width: 800, height: 600 },
  background: { type: 'color', value: '#fff' },
  border: { enabled: true, style: 'solid', width: 2, color: '#333', cornerRadius: 0 },
  elements: [
    createTextElement({ text: '{recipient_name}', x: 200, y: 200, fontSize: 36 })
  ]
})
```

### Built-in Templates

| ID | Name | Style |
|----|------|-------|
| `classic` | Classic Certificate | Formal serif fonts, gold border, cream background |
| `modern` | Modern Certificate | Blue accents, sans-serif, clean white |
| `elegant` | Elegant Certificate | Script heading, soft gray tones, thin borders |

## Canvas Size Presets

Switch between standard sizes — elements scale proportionally:

```ts
import { CANVAS_PRESETS } from '@juswap/certificate-designer'

// Use a preset
designer.value.setCanvasSize(1122, 794, true) // A4 Landscape, scale elements

// Available presets
// 'a4-landscape'     (1122×794)
// 'a4-portrait'      (794×1122)
// 'letter-landscape'  (1100×850)
// 'letter-portrait'   (850×1100)
// 'hd-landscape'      (1280×720)
// 'square'            (800×800)
// 'certificate'       (800×600)
```

## Image Elements

Add images with optional clip shapes and borders:

```ts
designer.value.addElement(
  createImageElement({
    src: 'data:image/png;base64,...', // or URL
    x: 300, y: 200,
    width: 150, height: 150,
    clipShape: 'circle',       // 'none' | 'circle' | 'roundedRect'
    cornerRadius: 15,          // border radius or radius for roundedRect
    stroke: '#333',            // border color
    strokeWidth: 2             // border width
  })
)
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | `number` | `800` | Canvas width in pixels |
| `height` | `number` | `600` | Canvas height in pixels |
| `initialScale` | `number` | `1` | Initial zoom level |
| `initialElements` | `CanvasElement[]` | `[]` | Pre-existing elements |
| `showGrid` | `boolean` | `false` | Show grid lines |
| `gridSize` | `number` | `50` | Grid cell size |
| `backgroundColor` | `string` | `'#ffffff'` | Background color |
| `borderEnabled` | `boolean` | `false` | Show canvas border |
| `borderColor` | `string` | `'#333333'` | Border color |
| `borderWidth` | `number` | `2` | Border thickness |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `element-selected` | `id: string \| null` | Element selected or deselected |
| `element-dragstart` | `id: string` | Drag initiated |
| `element-dragend` | `id: string, x: number, y: number` | Element dropped |

## Component API (via template ref)

### Elements
- `addElement(element)` — Add text, shape, or image
- `removeElement(id)` — Remove by ID
- `updateElement(id, updates)` — Partial update
- `clearElements()` — Remove all
- `getElementById(id)` — Get element data

### Selection
- `select(id)` / `deselect()` — Manage selection
- `selectedElementId` / `selectedElement` — Current selection
- `updateSelectedElement(updates)` — Update selected element

### Templates
- `loadTemplate(id)` — Load built-in or registered template
- `registerTemplate(template)` / `removeTemplate(id)`
- `templates` — Ref with all available templates
- `fillPlaceholders(data)` — Replace `{key}` in text elements

### Canvas Size
- `setCanvasSize(width, height, scaleElements?)` — Resize with optional proportional scaling
- `canvasWidth` / `canvasHeight` — Current dimensions
- `CANVAS_PRESETS` — Available size presets

### Zoom
- `zoomIn()` / `zoomOut()` / `zoomTo(level)` / `resetZoom()`
- `zoomLevel` / `zoomPercent`
- Ctrl+scroll wheel on canvas

### History
- `undo()` / `redo()` / `clearHistory()`
- `canUndo` / `canRedo`
- Keyboard: Ctrl+Z, Ctrl+Shift+Z

### Layer Ordering
- `bringForward(id)` / `sendBackward(id)`
- `bringToFront(id)` / `sendToBack(id)`

### Background & Border
- `setBackgroundColor(color)` / `setBackgroundImage(dataUrl)`
- `setBorderEnabled(bool)` / `setBorderColor(color)` / `setBorderWidth(n)`
- `setBorderStyle('solid' | 'dashed' | 'dotted')` / `setBorderRadius(n)`

### Grid
- `setShowGrid(bool)` / `setGridSize(n)`
- `gridVisible` / `currentGridSize`

### Export
- `exportToPNG()` — Returns data URL (2x resolution, clean export)
- `exportToPDF(options?)` — Generates and downloads a high-quality PDF
- `exportToJSON()` — Returns JSON string (full state)
- `loadFromJSON(json)` — Restore from JSON

## Factory Functions

```ts
import {
  createTextElement,
  createShapeElement,
  createImageElement
} from '@juswap/certificate-designer'

const title = createTextElement({ text: 'Certificate', fontSize: 36 })
const badge = createShapeElement({ shapeType: 'circle', fill: '#FFD700' })
const logo = createImageElement({ src: '...', clipShape: 'circle' })
```

## Composables

For advanced usage, the library exports composables:

```ts
import {
  useCanvasElements,
  useCanvasSelection,
  useCanvasHistory,
  useCanvasZoom,
  useCanvasBackground,
  useTemplates
} from '@juswap/certificate-designer'
```

## License

MIT © 2026 Joshua P