/**
 * @module useDragDrop/adapters
 *
 * @remarks
 * Barrel exports for useDragDrop adapters: the contract types, the abstract
 * base class, and the two default concrete adapters (pointer + keyboard).
 */

export { DragDropAdapter } from './adapter'
export type { DragDropAdapterContext, DragDropAdapterEmit, DragDropAdapterInterface } from './adapter'
export { PointerAdapter } from './pointer'
export type { PointerAdapterOptions } from './pointer'
export { KeyboardAdapter } from './keyboard'
export type { KeyboardAdapterOptions } from './keyboard'
