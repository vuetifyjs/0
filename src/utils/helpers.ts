import type { AtomDOMElement } from '@/types'

export function toKebabCase (str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/^-/, '')
}

export function toCamelCase (str: string): string {
  return str
    .toLowerCase()
    .replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ''))
}

export function makeIsRenderless (as: AtomDOMElement): boolean {
  return as === 'renderless'
}
