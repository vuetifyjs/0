/**
 * Common state types used across components
 * These provide consistency and type safety for component states
 */

/**
 * Loading states for async operations
 */
export type LoadingState = 'loading' | 'loaded' | 'error'

/**
 * Open/closed states for toggleable components
 */
export type OpenState = 'open' | 'closed'

/**
 * Visibility states for conditional rendering
 */
export type VisibilityState = 'visible' | 'hidden'

/**
 * Disabled states for interactive components
 */
export type DisabledState = 'enabled' | 'disabled'

/**
 * Focus states for accessibility
 */
export type FocusState = 'focused' | 'blurred'

/**
 * Selection states for selectable items
 */
export type SelectionState = 'selected' | 'unselected'

/**
 * Validation states for form components
 */
export type ValidationState = 'valid' | 'invalid' | 'pending'

/**
 * Size variants commonly used across components
 */
export type SizeVariant = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

/**
 * Color variants for theming
 */
export type ColorVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'

/**
 * Orientation for layout components
 */
export type Orientation = 'horizontal' | 'vertical'

/**
 * Direction for directional components
 */
export type Direction = 'ltr' | 'rtl'

/**
 * Alignment options
 */
export type Alignment = 'start' | 'center' | 'end'

/**
 * Position options for floating elements
 */
export type Position =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end'

/**
 * Animation states
 */
export type AnimationState = 'entering' | 'entered' | 'exiting' | 'exited'

/**
 * Interaction states
 */
export type InteractionState = 'idle' | 'hover' | 'active' | 'focus'

/**
 * Data states for data-driven components
 */
export type DataState = 'empty' | 'loading' | 'error' | 'success'

/**
 * Generic state machine type
 */
export interface StateMachine<T extends string> {
  current: T
  previous?: T
  transition: (newState: T) => void
  canTransition: (from: T, to: T) => boolean
}

/**
 * State change event
 */
export interface StateChangeEvent<T extends string> {
  from: T
  to: T
  timestamp: number
}
