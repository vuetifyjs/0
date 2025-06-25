import type { DOMElement } from '@/types'

export { default as Atom } from './Atom.vue'

export type AtomProps = {
  as?: DOMElement
  renderless?: boolean
}
