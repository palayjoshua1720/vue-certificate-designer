import type { CertificateTemplate } from '../types'
import { createTextElement, createShapeElement } from '../composables/useCanvasElements'

// ─── Classic Template ────────────────────────────────────────
// Formal serif fonts, gold border, cream background
const classicTemplate: CertificateTemplate = {
    id: 'classic',
    name: 'Classic Certificate',
    description: 'A traditional formal certificate with serif fonts and gold accents.',
    canvas: { width: 800, height: 600 },
    background: { type: 'color', value: '#FDF8E8' },
    border: {
        enabled: true,
        style: 'double',
        width: 6,
        color: '#C9A84C',
        cornerRadius: 0
    },
    elements: [
        createTextElement({
            id: 'classic-title',
            name: 'Title',
            text: 'Certificate of Achievement',
            fontSize: 38,
            fontFamily: 'Georgia',
            fontStyle: 'bold',
            fill: '#2C3E50',
            align: 'center',
            x: 100,
            y: 60,
            width: 600
        }),
        createShapeElement({
            id: 'classic-line-top',
            name: 'Gold Divider',
            shapeType: 'rect',
            x: 200,
            y: 120,
            width: 400,
            height: 3,
            fill: '#C9A84C',
            stroke: '',
            strokeWidth: 0
        }),
        createTextElement({
            id: 'classic-presented',
            name: 'Presented To',
            text: 'This certificate is proudly presented to',
            fontSize: 16,
            fontFamily: 'Georgia',
            fontStyle: 'italic',
            fill: '#555555',
            align: 'center',
            x: 100,
            y: 155,
            width: 600
        }),
        createTextElement({
            id: 'classic-name',
            name: 'Recipient Name',
            text: '{recipient_name}',
            fontSize: 44,
            fontFamily: 'Georgia',
            fontStyle: 'bold',
            fill: '#1A1A2E',
            align: 'center',
            x: 100,
            y: 195,
            width: 600
        }),
        createShapeElement({
            id: 'classic-line-mid',
            name: 'Gold Divider 2',
            shapeType: 'rect',
            x: 250,
            y: 260,
            width: 300,
            height: 2,
            fill: '#C9A84C',
            stroke: '',
            strokeWidth: 0
        }),
        createTextElement({
            id: 'classic-description',
            name: 'Description',
            text: 'In recognition of outstanding achievement and dedication\nin the successful completion of the program requirements.',
            fontSize: 14,
            fontFamily: 'Georgia',
            fill: '#444444',
            align: 'center',
            x: 100,
            y: 285,
            width: 600,
            lineHeight: 1.5
        }),
        createTextElement({
            id: 'classic-date',
            name: 'Date',
            text: '{date}',
            fontSize: 14,
            fontFamily: 'Georgia',
            fill: '#666666',
            align: 'center',
            x: 100,
            y: 400,
            width: 250
        }),
        createTextElement({
            id: 'classic-signature',
            name: 'Signature Label',
            text: '____________________\nAuthorized Signature',
            fontSize: 12,
            fontFamily: 'Georgia',
            fill: '#666666',
            align: 'center',
            x: 450,
            y: 390,
            width: 250,
            lineHeight: 1.8
        }),
        createTextElement({
            id: 'classic-org',
            name: 'Organization',
            text: '{organization_name}',
            fontSize: 16,
            fontFamily: 'Georgia',
            fontStyle: 'bold',
            fill: '#2C3E50',
            align: 'center',
            x: 100,
            y: 500,
            width: 600
        })
    ]
}

// ─── Modern Template ─────────────────────────────────────────
// Clean sans-serif, blue accent, white background
const modernTemplate: CertificateTemplate = {
    id: 'modern',
    name: 'Modern Certificate',
    description: 'A clean modern design with blue accents and sans-serif typography.',
    canvas: { width: 800, height: 600 },
    background: { type: 'color', value: '#FFFFFF' },
    border: {
        enabled: false,
        style: 'solid',
        width: 2,
        color: '#333333',
        cornerRadius: 0
    },
    elements: [
        createShapeElement({
            id: 'modern-accent-bar',
            name: 'Accent Bar',
            shapeType: 'rect',
            x: 0,
            y: 0,
            width: 800,
            height: 8,
            fill: '#2563EB',
            stroke: '',
            strokeWidth: 0
        }),
        createShapeElement({
            id: 'modern-sidebar',
            name: 'Left Sidebar',
            shapeType: 'rect',
            x: 0,
            y: 0,
            width: 6,
            height: 600,
            fill: '#2563EB',
            stroke: '',
            strokeWidth: 0
        }),
        createTextElement({
            id: 'modern-label',
            name: 'Certificate Label',
            text: 'CERTIFICATE',
            fontSize: 14,
            fontFamily: 'Arial',
            fontStyle: 'bold',
            fill: '#2563EB',
            x: 50,
            y: 50,
            width: 700
        }),
        createTextElement({
            id: 'modern-of',
            name: 'Of Label',
            text: 'OF COMPLETION',
            fontSize: 32,
            fontFamily: 'Arial',
            fontStyle: 'bold',
            fill: '#1E293B',
            x: 50,
            y: 72,
            width: 700
        }),
        createShapeElement({
            id: 'modern-divider',
            name: 'Divider',
            shapeType: 'rect',
            x: 50,
            y: 125,
            width: 60,
            height: 4,
            fill: '#2563EB',
            stroke: '',
            strokeWidth: 0
        }),
        createTextElement({
            id: 'modern-presented',
            name: 'Presented To',
            text: 'This is to certify that',
            fontSize: 14,
            fontFamily: 'Arial',
            fill: '#64748B',
            x: 50,
            y: 155,
            width: 700
        }),
        createTextElement({
            id: 'modern-name',
            name: 'Recipient Name',
            text: '{recipient_name}',
            fontSize: 42,
            fontFamily: 'Arial Black',
            fill: '#0F172A',
            x: 50,
            y: 185,
            width: 700
        }),
        createTextElement({
            id: 'modern-description',
            name: 'Description',
            text: 'Has successfully completed all course requirements\nand demonstrated proficiency in the subject matter.',
            fontSize: 14,
            fontFamily: 'Arial',
            fill: '#475569',
            x: 50,
            y: 260,
            width: 700,
            lineHeight: 1.6
        }),
        createTextElement({
            id: 'modern-date',
            name: 'Date',
            text: 'Date: {date}',
            fontSize: 13,
            fontFamily: 'Arial',
            fill: '#64748B',
            x: 50,
            y: 400,
            width: 250
        }),
        createTextElement({
            id: 'modern-signature',
            name: 'Signature',
            text: '____________________\nProgram Director',
            fontSize: 12,
            fontFamily: 'Arial',
            fill: '#64748B',
            align: 'center',
            x: 500,
            y: 390,
            width: 250,
            lineHeight: 1.8
        }),
        createShapeElement({
            id: 'modern-bottom-bar',
            name: 'Bottom Bar',
            shapeType: 'rect',
            x: 0,
            y: 592,
            width: 800,
            height: 8,
            fill: '#2563EB',
            stroke: '',
            strokeWidth: 0
        })
    ]
}

// ─── Elegant Template ────────────────────────────────────────
// Script heading, thin borders, soft gray tones
const elegantTemplate: CertificateTemplate = {
    id: 'elegant',
    name: 'Elegant Certificate',
    description: 'A sophisticated design with delicate typography and soft gray tones.',
    canvas: { width: 800, height: 600 },
    background: { type: 'color', value: '#F9FAFB' },
    border: {
        enabled: true,
        style: 'solid',
        width: 1,
        color: '#D1D5DB',
        cornerRadius: 12
    },
    elements: [
        createShapeElement({
            id: 'elegant-inner-border',
            name: 'Inner Border',
            shapeType: 'rect',
            x: 20,
            y: 20,
            width: 760,
            height: 560,
            fill: '',
            stroke: '#E5E7EB',
            strokeWidth: 1
        }),
        createTextElement({
            id: 'elegant-header',
            name: 'Header',
            text: '✦  CERTIFICATE OF EXCELLENCE  ✦',
            fontSize: 16,
            fontFamily: 'Georgia',
            fill: '#9CA3AF',
            align: 'center',
            x: 100,
            y: 55,
            width: 600
        }),
        createShapeElement({
            id: 'elegant-line1',
            name: 'Decorative Line 1',
            shapeType: 'rect',
            x: 300,
            y: 90,
            width: 200,
            height: 1,
            fill: '#D1D5DB',
            stroke: '',
            strokeWidth: 0
        }),
        createTextElement({
            id: 'elegant-presented',
            name: 'Presented To',
            text: 'Awarded to',
            fontSize: 15,
            fontFamily: 'Georgia',
            fontStyle: 'italic',
            fill: '#6B7280',
            align: 'center',
            x: 100,
            y: 120,
            width: 600
        }),
        createTextElement({
            id: 'elegant-name',
            name: 'Recipient Name',
            text: '{recipient_name}',
            fontSize: 48,
            fontFamily: 'Georgia',
            fontStyle: 'italic',
            fill: '#111827',
            align: 'center',
            x: 50,
            y: 155,
            width: 700
        }),
        createShapeElement({
            id: 'elegant-line2',
            name: 'Decorative Line 2',
            shapeType: 'rect',
            x: 250,
            y: 225,
            width: 300,
            height: 1,
            fill: '#D1D5DB',
            stroke: '',
            strokeWidth: 0
        }),
        createTextElement({
            id: 'elegant-description',
            name: 'Description',
            text: 'For demonstrating exceptional skill and unwavering commitment\nto excellence throughout the program duration.',
            fontSize: 13,
            fontFamily: 'Georgia',
            fill: '#6B7280',
            align: 'center',
            x: 100,
            y: 250,
            width: 600,
            lineHeight: 1.7
        }),
        createTextElement({
            id: 'elegant-date',
            name: 'Date',
            text: '{date}',
            fontSize: 13,
            fontFamily: 'Georgia',
            fontStyle: 'italic',
            fill: '#9CA3AF',
            align: 'center',
            x: 50,
            y: 390,
            width: 300
        }),
        createTextElement({
            id: 'elegant-signature',
            name: 'Signature',
            text: '____________________\nDirector',
            fontSize: 12,
            fontFamily: 'Georgia',
            fill: '#9CA3AF',
            align: 'center',
            x: 450,
            y: 380,
            width: 300,
            lineHeight: 1.8
        }),
        createTextElement({
            id: 'elegant-org',
            name: 'Organization',
            text: '{organization_name}',
            fontSize: 14,
            fontFamily: 'Georgia',
            fill: '#374151',
            align: 'center',
            x: 100,
            y: 490,
            width: 600
        })
    ]
}

export const builtInTemplates: CertificateTemplate[] = [
    classicTemplate,
    modernTemplate,
    elegantTemplate
]
