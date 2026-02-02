import { createSelectionContext } from '@vuetify/v0'

export interface OverlayValue {
  title: string
  blocking?: boolean
}

/**
 * Selection context for managing overlay open/close state.
 *
 * - `multiple: true` allows multiple overlays to be open simultaneously
 * - Each ticket's `isSelected` state represents whether the overlay is open
 * - Use `select(id)` to open, `unselect(id)` to close, `unselectAll()` to close all
 */
export const [
  useOverlaySelection,
  provideOverlaySelection,
] = createSelectionContext({
  namespace: 'v0:overlay-selection',
  multiple: true,
})

/** Overlay definitions to register */
export const overlayDefinitions: Array<{ id: string } & OverlayValue> = [
  { id: 'modal-1', title: 'Settings' },
  { id: 'modal-2', title: 'Confirm' },
  { id: 'modal-3', title: 'Alert', blocking: true },
]
