import { ref, type Ref } from 'vue'
import type { CanvasElement } from '../types'

export function useCanvasClipboard() {
	const clipboard: Ref<CanvasElement | null> = ref(null)

	function copy(element: CanvasElement | null) {
		if (!element) {
			clipboard.value = null
			return
		}
		// Deep clone to avoid proxy references
		clipboard.value = JSON.parse(JSON.stringify(element))
	}

	function hasClipboard() {
		return clipboard.value !== null
	}

	// This is just a getter; pasting logic (which needs 'elements' and UUID generation) 
	// is typically handled in the main component.
	function getPastedElement(): CanvasElement | null {
		if (!clipboard.value) return null
		
		// Clone it again for paste
		const newEl = JSON.parse(JSON.stringify(clipboard.value))
		
		// Create a new ID
		newEl.id = Date.now().toString() + Math.random().toString(36).substring(2)
		
		// Offset slightly so it doesn't perfect overlap the original
		newEl.x += 20
		newEl.y += 20

		return newEl
	}

	return {
		clipboard,
		copy,
		hasClipboard,
		getPastedElement
	}
}
