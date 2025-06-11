/**
 * Button component types and interfaces
 */

import type { Ref } from 'vue'

export type ButtonState = 'default' | 'active' | 'loading' | 'disabled'

export interface ButtonContextValue {
  state: Ref<ButtonState>
  setState: (state: ButtonState) => void
  isLoading: Ref<boolean>
  isDisabled: Ref<boolean>
  isActive: Ref<boolean>
}
