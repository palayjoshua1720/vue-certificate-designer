import type { FontStyle, TextAlign, TextDecoration } from './style'

// ─── Element Type Discriminator ──────────────────────────────
export type ElementType = 'text' | 'image' | 'shape' | 'qrcode' | 'signature'

// ─── Base Element ────────────────────────────────────────────
/** Shared properties every canvas element has */
export interface BaseElement {
    /** Unique identifier */
    id: string
    /** Discriminator for the element type */
    type: ElementType
    /** Display name shown in the layers panel */
    name: string

    // ── Position & Size ──
    x: number
    y: number
    width: number
    height: number
    rotation: number

    // ── Visual ──
    opacity: number
    visible: boolean

    // ── Interaction ──
    draggable: boolean
    /** When locked, the element cannot be moved or resized */
    locked: boolean
}

// ─── Concrete Element Types ──────────────────────────────────

export interface TextElement extends BaseElement {
    type: 'text'
    text: string
    fontSize: number
    fontFamily: string
    fill: string
    fontStyle: FontStyle
    textDecoration: TextDecoration
    align: TextAlign
    lineHeight: number
}

export interface ImageElement extends BaseElement {
    type: 'image'
    /** Image URL or base64 data URI */
    src: string
    /** Clip shape for the image */
    clipShape: 'none' | 'rect' | 'roundedRect' | 'circle'
    /** Corner radius for roundedRect clip */
    cornerRadius: number
    /** Border stroke color */
    stroke: string
    /** Border stroke width */
    strokeWidth: number
}

export interface ShapeElement extends BaseElement {
    type: 'shape'
    shapeType: 'rect' | 'circle' | 'line'
    fill: string
    stroke: string
    strokeWidth: number
}

export interface QRCodeElement extends BaseElement {
    type: 'qrcode'
    /** The data encoded into the QR code */
    data: string
    /** Error correction level */
    errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H'
}

export interface SignatureElement extends BaseElement {
    type: 'signature'
    /** Signature image URL or base64 data URI */
    src: string
    /** Placeholder text shown when no signature is set */
    placeholder: string
}

// ─── Discriminated Union ─────────────────────────────────────
/** Any element that can exist on the canvas */
export type CanvasElement =
    | TextElement
    | ImageElement
    | ShapeElement
    | QRCodeElement
    | SignatureElement
