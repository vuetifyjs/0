import type { h } from 'vue'

export type DOMElement = Parameters<typeof h>[0]

export type AtomDOMElement = DOMElement | 'renderless'
