import type { h } from 'vue'

export type DOMElement = Parameters<typeof h>[0]
export type GenericObject = Record<string, any>
export type UnknownObject = Record<string, unknown>
export type ID = string | number
