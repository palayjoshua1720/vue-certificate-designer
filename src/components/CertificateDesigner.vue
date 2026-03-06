<template>
	<div class="cd-certificate-canvas" @wheel="onWheel" tabindex="0" @keydown="onKeydown">
		<v-stage
			ref="stageRef"
			:config="stageConfig"
			@click="onStageClick"
			@tap="onStageClick"
		>
			<!-- Background + Grid Layer (behind elements) -->
			<v-layer :config="{ listening: false }">
				<!-- Background Fill -->
				<v-rect :config="backgroundRectConfig" />
				<!-- Background Image -->
				<v-image v-if="bgImage" :config="bgImageConfig" />

				<!-- Grid Lines -->
				<v-line
					v-for="line in visibleGridLines"
					:key="line.key"
					:config="line"
				/>

				<!-- Border -->
				<v-rect v-if="border.enabled" :config="borderRectConfig" />
			</v-layer>

			<!-- Elements Layer -->
			<v-layer ref="layerRef">
				<template v-for="el in elements" :key="el.id">
					<!-- Text Element -->
					<v-text
						v-if="el.type === 'text'"
						:ref="(node: any) => setNodeRef(el.id, node)"
						:config="getTextConfig(el)"
						@click="onElementClick(el.id, $event)"
						@tap="onElementClick(el.id, $event)"
						@dragstart="onDragStart(el.id, $event)"
						@dragend="onDragEnd(el.id, $event)"
						@transformend="onTransformEnd(el.id, $event)"
					/>

					<!-- Shape Element: Rect -->
					<v-rect
						v-else-if="el.type === 'shape' && el.shapeType === 'rect'"
						:ref="(node: any) => setNodeRef(el.id, node)"
						:config="getShapeConfig(el)"
						@click="onElementClick(el.id, $event)"
						@tap="onElementClick(el.id, $event)"
						@dragstart="onDragStart(el.id, $event)"
						@dragend="onDragEnd(el.id, $event)"
						@transformend="onTransformEnd(el.id, $event)"
					/>

					<!-- Shape Element: Circle -->
					<v-circle
						v-else-if="el.type === 'shape' && el.shapeType === 'circle'"
						:ref="(node: any) => setNodeRef(el.id, node)"
						:config="getCircleConfig(el)"
						@click="onElementClick(el.id, $event)"
						@tap="onElementClick(el.id, $event)"
						@dragstart="onDragStart(el.id, $event)"
						@dragend="onDragEnd(el.id, $event)"
						@transformend="onTransformEnd(el.id, $event)"
					/>

					<!-- Image Element -->
					<v-group
						v-else-if="el.type === 'image' && imageCache.get(el.id)"
						:ref="(node: any) => setNodeRef(el.id, node)"
						:config="getImageGroupConfig(el)"
						@click="onElementClick(el.id, $event)"
						@tap="onElementClick(el.id, $event)"
						@dragstart="onDragStart(el.id, $event)"
						@dragend="onDragEnd(el.id, $event)"
						@transformend="onTransformEnd(el.id, $event)"
					>
						<v-image :config="getImageConfig(el)" />
						<!-- Image Border (rendered inside group but not clipped since it matches the clip path) -->
						<v-rect
							v-if="el.strokeWidth > 0 && el.clipShape !== 'circle'"
							:config="{
								x: 0, y: 0,
								width: el.width, height: el.height,
								stroke: el.stroke,
								strokeWidth: el.strokeWidth,
								cornerRadius: el.clipShape === 'roundedRect' ? (el.cornerRadius || 10) : 0,
								listening: false
							}"
						/>
						<v-circle
							v-if="el.strokeWidth > 0 && el.clipShape === 'circle'"
							:config="{
								x: el.width / 2, y: el.height / 2,
								radius: Math.min(el.width, el.height) / 2,
								stroke: el.stroke,
								strokeWidth: el.strokeWidth,
								listening: false
							}"
						/>
					</v-group>
				</template>

				<!-- Selection Transformer -->
				<v-transformer ref="transformerRef" :config="transformerConfig" />
			</v-layer>
		</v-stage>
	</div>
</template>

<script setup lang="ts">
import { computed, watch, nextTick, ref as vueRef, onMounted, onBeforeUnmount } from 'vue'
import type { CanvasElement, TextElement, ShapeElement, ImageElement } from '../types'
import { useCanvasElements } from '../composables/useCanvasElements'
import { useCanvasSelection } from '../composables/useCanvasSelection'
import { useCanvasZoom } from '../composables/useCanvasZoom'
import { useCanvasHistory } from '../composables/useCanvasHistory'
import { useCanvasBackground } from '../composables/useCanvasBackground'

const props = defineProps<{
	width?: number
	height?: number
	initialScale?: number
	initialElements?: CanvasElement[]
	showGrid?: boolean
	gridSize?: number
	backgroundColor?: string
	borderEnabled?: boolean
	borderColor?: string
	borderWidth?: number
}>()

const emit = defineEmits<{
	'element-dragstart': [id: string]
	'element-dragend': [id: string, x: number, y: number]
	'element-selected': [id: string | null]
}>()

// ─── Canvas Elements ─────────────────────────────────────────
const {
	elements,
	addElement: _addElement,
	removeElement: _removeElement,
	updateElement: _updateElement,
	getElementById,
	clearElements: _clearElements,
	bringForward: _bringForward,
	sendBackward: _sendBackward,
	bringToFront: _bringToFront,
	sendToBack: _sendToBack
} = useCanvasElements(props.initialElements)

// ─── History ─────────────────────────────────────────────────
const {
	undo: _undo,
	redo: _redo,
	canUndo,
	canRedo,
	saveSnapshot,
	clearHistory
} = useCanvasHistory(elements)

// ─── History-Aware Wrappers ──────────────────────────────────
// Save snapshot before every mutation so undo always works

function addElement(element: CanvasElement) {
	saveSnapshot()
	_addElement(element)
}

function removeElement(id: string) {
	saveSnapshot()
	_removeElement(id)
}

function updateElement(id: string, updates: Partial<CanvasElement>) {
	saveSnapshot()
	_updateElement(id, updates)
}

function clearElements() {
	saveSnapshot()
	_clearElements()
}

function bringForward(id: string) {
	saveSnapshot()
	_bringForward(id)
}

function sendBackward(id: string) {
	saveSnapshot()
	_sendBackward(id)
}

function bringToFront(id: string) {
	saveSnapshot()
	_bringToFront(id)
}

function sendToBack(id: string) {
	saveSnapshot()
	_sendToBack(id)
}

function undo() {
	_undo()
	deselect()
}

function redo() {
	_redo()
	deselect()
}

// ─── Selection ───────────────────────────────────────────────
const {
	selectedElementId,
	selectedElement,
	select,
	deselect,
	isSelected,
	updateSelectedElement: _updateSelectedElement
} = useCanvasSelection(elements, updateElement)

// Override updateSelectedElement to use our history-aware updateElement
function updateSelectedElement(updates: Partial<CanvasElement>) {
	if (selectedElementId.value) {
		updateElement(selectedElementId.value, updates)
	}
}

// ─── Zoom ────────────────────────────────────────────────────
const {
	zoomLevel,
	zoomPercent,
	zoomIn,
	zoomOut,
	zoomTo,
	resetZoom
} = useCanvasZoom({ min: 0.1, max: 4, step: 0.1 })

const canvasWidth = computed(() => props.width ?? 800)
const canvasHeight = computed(() => props.height ?? 600)

// ─── Background & Border ─────────────────────────────────────
const {
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
} = useCanvasBackground({
	background: { type: 'color', value: props.backgroundColor ?? '#ffffff' },
	border: {
		enabled: props.borderEnabled ?? false,
		color: props.borderColor ?? '#333333',
		width: props.borderWidth ?? 2
	}
})

// Sync props to composable
watch(() => props.backgroundColor, (val) => { if (val) setBackgroundColor(val) })
watch(() => props.borderEnabled, (val) => { if (val !== undefined) setBorderEnabled(val) })
watch(() => props.borderColor, (val) => { if (val) setBorderColor(val) })
watch(() => props.borderWidth, (val) => { if (val !== undefined) setBorderWidth(val) })

// Background rect config
const backgroundRectConfig = computed(() => ({
	x: 0,
	y: 0,
	width: canvasWidth.value,
	height: canvasHeight.value,
	fill: background.value.type === 'color' ? background.value.value : '#ffffff',
	listening: false
}))

// Background image loading
const bgImage = vueRef<HTMLImageElement | null>(null)

watch(background, (bg) => {
	if (bg.type === 'image' && bg.value) {
		const img = new Image()
		img.crossOrigin = 'anonymous'
		img.onload = () => { bgImage.value = img }
		img.src = bg.value
	} else {
		bgImage.value = null
	}
}, { immediate: true, deep: true })

const bgImageConfig = computed(() => ({
	image: bgImage.value,
	x: 0,
	y: 0,
	width: canvasWidth.value,
	height: canvasHeight.value,
	listening: false
}))

// Border rect config
const borderDashMap: Record<string, number[]> = {
	solid: [],
	dashed: [10, 5],
	dotted: [2, 4],
	double: [0]
}

const borderRectConfig = computed(() => {
	const bw = border.value.width
	return {
		x: bw / 2,
		y: bw / 2,
		width: canvasWidth.value - bw,
		height: canvasHeight.value - bw,
		stroke: border.value.color,
		strokeWidth: bw,
		cornerRadius: border.value.cornerRadius,
		dash: borderDashMap[border.value.style] || [],
		listening: false
	}
})

// ─── Grid ────────────────────────────────────────────────────
const gridVisible = vueRef(props.showGrid ?? false)
const currentGridSize = vueRef(props.gridSize ?? 50)

watch(() => props.showGrid, (val) => { if (val !== undefined) gridVisible.value = val })
watch(() => props.gridSize, (val) => { if (val !== undefined) currentGridSize.value = val })

function setShowGrid(show: boolean) {
	gridVisible.value = show
}

function setGridSize(size: number) {
	currentGridSize.value = Math.max(10, size)
}


const gridLines = computed(() => {
	const lines: any[] = []
	const w = canvasWidth.value
	const h = canvasHeight.value
	const size = currentGridSize.value

	for (let x = 0; x <= w; x += size) {
		lines.push({
			key: `gv-${x}`,
			points: [x, 0, x, h],
			stroke: '#4d6aff',
			strokeWidth: x === 0 ? 1 : 0.5,
			listening: false
		})
	}

	for (let y = 0; y <= h; y += size) {
		lines.push({
			key: `gh-${y}`,
			points: [0, y, w, y],
			stroke: '#4d6aff',
			strokeWidth: y === 0 ? 1 : 0.5,
			listening: false
		})
	}

	return lines
})

const visibleGridLines = computed(() => {
	return gridVisible.value ? gridLines.value : []
})

// ─── Image Loading Cache ─────────────────────────────────────
const imageCache = vueRef(new Map<string, HTMLImageElement>())
const _imageCacheVersion = vueRef(0)

function loadImage(id: string, src: string) {
	if (!src) return
	// Skip if already loaded with same src
	const existing = imageCache.value.get(id)
	if (existing && existing.src === src) return

	const img = new Image()
	img.crossOrigin = 'anonymous'
	img.onload = () => {
		imageCache.value.set(id, img)
		_imageCacheVersion.value++
	}
	img.onerror = () => {
		console.warn(`Failed to load image for element ${id}: ${src}`)
	}
	img.src = src
}

// Watch elements and load images
watch(elements, (els) => {
	for (const el of els) {
		if (el.type === 'image' && el.src) {
			loadImage(el.id, el.src)
		}
	}
	// Clean cache of removed elements
	const ids = new Set(els.map(e => e.id))
	for (const key of imageCache.value.keys()) {
		if (!ids.has(key)) imageCache.value.delete(key)
	}
}, { immediate: true, deep: true })

// ─── Image Konva Configs ─────────────────────────────────────

function getImageGroupConfig(el: ImageElement) {
	const config: any = {
		x: el.x,
		y: el.y,
		rotation: el.rotation,
		opacity: el.opacity,
		visible: el.visible,
		draggable: el.draggable && !el.locked
	}

	// Apply clip shape
	if (el.clipShape === 'circle') {
		const r = Math.min(el.width, el.height) / 2
		config.clipFunc = (ctx: any) => {
			ctx.arc(el.width / 2, el.height / 2, r, 0, Math.PI * 2, false)
		}
	} else if (el.clipShape === 'roundedRect') {
		const cr = el.cornerRadius || 10
		config.clipFunc = (ctx: any) => {
			const w = el.width, h = el.height
			ctx.moveTo(cr, 0)
			ctx.lineTo(w - cr, 0)
			ctx.arcTo(w, 0, w, cr, cr)
			ctx.lineTo(w, h - cr)
			ctx.arcTo(w, h, w - cr, h, cr)
			ctx.lineTo(cr, h)
			ctx.arcTo(0, h, 0, h - cr, cr)
			ctx.lineTo(0, cr)
			ctx.arcTo(0, 0, cr, 0, cr)
			ctx.closePath()
		}
	}

	return config
}

function getImageConfig(el: ImageElement) {
	// Force reactivity on cache changes
	_imageCacheVersion.value
	const img = imageCache.value.get(el.id)
	return {
		image: img,
		x: 0,
		y: 0,
		width: el.width,
		height: el.height
	}
}

// ─── Export Methods ──────────────────────────────────────────

async function exportToPNG(): Promise<string> {
	const stage = stageRef.value?.getNode()
	if (!stage) throw new Error('Stage not available')

	// Save current state
	const currentZoom = zoomLevel.value
	const wasGridVisible = gridVisible.value
	const transformer = transformerRef.value?.getNode()

	// Temporarily reset for clean export
	zoomTo(1)
	gridVisible.value = false
	if (transformer) transformer.nodes([])

	await nextTick()
	await new Promise(r => setTimeout(r, 50))

	const dataUrl = stage.toDataURL({
		pixelRatio: 2,
		mimeType: 'image/png',
		width: canvasWidth.value,
		height: canvasHeight.value
	})

	// Restore
	zoomTo(currentZoom)
	gridVisible.value = wasGridVisible
	if (selectedElementId.value) {
		const vueNode = nodeRefs.get(selectedElementId.value)
		const konvaNode = vueNode?.getNode?.()
		if (konvaNode && transformer) {
			transformer.nodes([konvaNode])
		}
	}

	return dataUrl
}

function exportToJSON(): string {
	return JSON.stringify({
		version: 1,
		canvas: {
			width: canvasWidth.value,
			height: canvasHeight.value
		},
		background: background.value,
		border: border.value,
		elements: elements.value
	}, null, 2)
}

function loadFromJSON(json: string) {
	const data = JSON.parse(json)
	if (data.background) setBackground(data.background)
	if (data.border) setBorder(data.border)
	saveSnapshot()
	elements.value = data.elements || []
	deselect()
	clearHistory()
}

const stageRef = vueRef<any>(null)
const layerRef = vueRef<any>(null)
const transformerRef = vueRef<any>(null)
const nodeRefs = new Map<string, any>()

function setNodeRef(id: string, node: any) {
	if (node) {
		nodeRefs.set(id, node)
	} else {
		nodeRefs.delete(id)
	}
}

// ─── Transformer Config ─────────────────────────────────────
const transformerConfig = {
	anchorSize: 8,
	anchorStroke: '#4A90D9',
	anchorFill: '#ffffff',
	anchorCornerRadius: 2,
	borderStroke: '#4A90D9',
	borderStrokeWidth: 1.5,
	borderDash: [4, 4],
	rotateAnchorOffset: 25,
	enabledAnchors: [
		'top-left', 'top-right',
		'bottom-left', 'bottom-right',
		'middle-left', 'middle-right',
		'top-center', 'bottom-center'
	],
	boundBoxFunc: (oldBox: any, newBox: any) => {
		if (newBox.width < 10 || newBox.height < 10) {
			return oldBox
		}
		return newBox
	}
}

// ─── Stage Config ────────────────────────────────────────────
const stageConfig = computed(() => ({
	width: canvasWidth.value * zoomLevel.value,
	height: canvasHeight.value * zoomLevel.value,
	scaleX: zoomLevel.value,
	scaleY: zoomLevel.value
}))

// ─── Wheel Zoom (Ctrl+Scroll) ───────────────────────────────
function onWheel(e: WheelEvent) {
	if (!e.ctrlKey && !e.metaKey) return
	e.preventDefault()

	if (e.deltaY < 0) {
		zoomIn()
	} else {
		zoomOut()
	}
}

// ─── Keyboard Shortcuts ──────────────────────────────────────
function onKeydown(e: KeyboardEvent) {
	const isCtrl = e.ctrlKey || e.metaKey

	// Undo: Ctrl+Z
	if (isCtrl && !e.shiftKey && e.key === 'z') {
		e.preventDefault()
		undo()
		return
	}

	// Redo: Ctrl+Shift+Z or Ctrl+Y
	if (isCtrl && e.shiftKey && e.key === 'Z') {
		e.preventDefault()
		redo()
		return
	}
	if (isCtrl && e.key === 'y') {
		e.preventDefault()
		redo()
		return
	}

	// Delete selected element
	if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElementId.value) {
		// Don't delete if user is typing in an input
		if ((e.target as HTMLElement)?.tagName === 'INPUT' || (e.target as HTMLElement)?.tagName === 'TEXTAREA') return
		e.preventDefault()
		removeElement(selectedElementId.value)
		deselect()
		emit('element-selected', null)
	}
}

// ─── Watch selection and attach Transformer ──────────────────
watch(selectedElementId, async (newId) => {
	await nextTick()
	const transformer = transformerRef.value?.getNode()
	if (!transformer) return

	if (newId) {
		const vueNode = nodeRefs.get(newId)
		const konvaNode = vueNode?.getNode?.()
		if (konvaNode) {
			transformer.nodes([konvaNode])
		} else {
			transformer.nodes([])
		}
	} else {
		transformer.nodes([])
	}

	transformer.getLayer()?.batchDraw()
})

// ─── Element → Konva Config Mappers ─────────────────────────

function getTextConfig(el: TextElement) {
	return {
		x: el.x,
		y: el.y,
		text: el.text,
		fontSize: el.fontSize,
		fontFamily: el.fontFamily,
		fill: el.fill,
		fontStyle: el.fontStyle,
		textDecoration: el.textDecoration,
		align: el.align,
		lineHeight: el.lineHeight,
		rotation: el.rotation,
		opacity: el.opacity,
		visible: el.visible,
		draggable: el.draggable && !el.locked,
		width: el.width > 0 ? el.width : undefined
	}
}

function getShapeConfig(el: ShapeElement) {
	return {
		x: el.x,
		y: el.y,
		width: el.width,
		height: el.height,
		fill: el.fill,
		stroke: el.stroke,
		strokeWidth: el.strokeWidth,
		rotation: el.rotation,
		opacity: el.opacity,
		visible: el.visible,
		draggable: el.draggable && !el.locked
	}
}

function getCircleConfig(el: ShapeElement) {
	return {
		x: el.x,
		y: el.y,
		radius: Math.min(el.width, el.height) / 2,
		fill: el.fill,
		stroke: el.stroke,
		strokeWidth: el.strokeWidth,
		rotation: el.rotation,
		opacity: el.opacity,
		visible: el.visible,
		draggable: el.draggable && !el.locked
	}
}

// ─── Click Handlers ──────────────────────────────────────────

function onStageClick(e: any) {
	const clickedOnEmpty = e.target === e.target.getStage()
	if (clickedOnEmpty) {
		deselect()
		emit('element-selected', null)
	}
}

function onElementClick(id: string, e: any) {
	e.cancelBubble = true
	select(id)
	emit('element-selected', id)
}

// ─── Drag Handlers ───────────────────────────────────────────

function onDragStart(id: string, _e: any) {
	saveSnapshot()
	emit('element-dragstart', id)
}

function onDragEnd(id: string, e: any) {
	const newX = e.target.x()
	const newY = e.target.y()
	_updateElement(id, { x: newX, y: newY })
	emit('element-dragend', id, newX, newY)
}

// ─── Transform Handler ──────────────────────────────────────

function onTransformEnd(id: string, e: any) {
	const node = e.target
	const scaleX = node.scaleX()
	const scaleY = node.scaleY()

	const updates: Partial<CanvasElement> = {
		x: node.x(),
		y: node.y(),
		rotation: node.rotation()
	}

	const el = getElementById(id)
	if (el && el.type === 'shape') {
		updates.width = Math.max(10, node.width() * scaleX)
		updates.height = Math.max(10, node.height() * scaleY)
		node.scaleX(1)
		node.scaleY(1)
	}

	if (el && el.type === 'text') {
		updates.width = Math.max(10, node.width() * scaleX)
		;(updates as Partial<TextElement>).fontSize = Math.max(8, el.fontSize * scaleY)
		node.scaleX(1)
		node.scaleY(1)
	}

	if (el && el.type === 'image') {
		updates.width = Math.max(10, node.width() * scaleX)
		updates.height = Math.max(10, node.height() * scaleY)
		node.scaleX(1)
		node.scaleY(1)
	}

	_updateElement(id, updates)
}

// ─── Expose API to parent via template ref ───────────────────
defineExpose({
	elements,
	addElement,
	removeElement,
	updateElement,
	getElementById,
	clearElements,
	selectedElementId,
	selectedElement,
	select,
	deselect,
	isSelected,
	updateSelectedElement,
	// Zoom
	zoomLevel,
	zoomPercent,
	zoomIn,
	zoomOut,
	zoomTo,
	resetZoom,
	// Grid
	gridVisible,
	setShowGrid,
	setGridSize,
	currentGridSize,
	// History
	undo,
	redo,
	canUndo,
	canRedo,
	clearHistory,
	// Layer ordering
	bringForward,
	sendBackward,
	bringToFront,
	sendToBack,
	// Background & Border
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
	setBorder,
	// Export
	exportToPNG,
	exportToJSON,
	loadFromJSON
})
</script>

<style scoped>
.cd-certificate-canvas {
	border: 1px solid black;
	background: #f8f9fa;
	width: 100%;
	overflow: auto;
	outline: none;
}
</style>