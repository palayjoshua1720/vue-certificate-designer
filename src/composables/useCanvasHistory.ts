import { ref, computed, type Ref, type ComputedRef } from 'vue'
import type { CanvasElement } from '../types'

export interface HistoryOptions {
    maxHistory?: number
}

export function useCanvasHistory(
    elements: Ref<CanvasElement[]>,
    options?: HistoryOptions
) {
    const maxHistory = options?.maxHistory ?? 50

    const undoStack: CanvasElement[][] = []
    const redoStack: CanvasElement[][] = []

    const canUndo: ComputedRef<boolean> = computed(() => undoStack.length > 0)
    const canRedo: ComputedRef<boolean> = computed(() => redoStack.length > 0)

    // Force reactivity update for computed
    const _version = ref(0)

    function deepClone(els: CanvasElement[]): CanvasElement[] {
        return JSON.parse(JSON.stringify(els))
    }

    function saveSnapshot() {
        undoStack.push(deepClone(elements.value))
        if (undoStack.length > maxHistory) {
            undoStack.shift()
        }
        // Any new action clears the redo stack
        redoStack.length = 0
        _version.value++
    }

    function undo() {
        if (undoStack.length === 0) return
        // Save current state to redo stack
        redoStack.push(deepClone(elements.value))
        // Restore previous state
        const previous = undoStack.pop()!
        elements.value = previous
        _version.value++
    }

    function redo() {
        if (redoStack.length === 0) return
        // Save current state to undo stack
        undoStack.push(deepClone(elements.value))
        // Restore next state
        const next = redoStack.pop()!
        elements.value = next
        _version.value++
    }

    function clearHistory() {
        undoStack.length = 0
        redoStack.length = 0
        _version.value++
    }

    return {
        undo,
        redo,
        canUndo: computed(() => { _version.value; return undoStack.length > 0 }),
        canRedo: computed(() => { _version.value; return redoStack.length > 0 }),
        saveSnapshot,
        clearHistory
    }
}
