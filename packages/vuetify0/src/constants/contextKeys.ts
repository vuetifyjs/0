import type { InjectionKey } from 'vue'

/**
 * Centralized context keys for all components
 * Using symbols ensures uniqueness and prevents conflicts
 */
export const CONTEXT_KEYS = {
  AVATAR: Symbol('AvatarContext'),
  BUTTON: Symbol('ButtonContext'),
  DIALOG: Symbol('DialogContext'),
  DROPDOWN: Symbol('DropdownContext'),
  ACCORDION: Symbol('AccordionContext'),
  TABS: Symbol('TabsContext'),
  MENU: Symbol('MenuContext'),
  POPOVER: Symbol('PopoverContext'),
  TOOLTIP: Symbol('TooltipContext'),
  FORM: Symbol('FormContext'),
  FIELD: Symbol('FieldContext'),
  RADIO_GROUP: Symbol('RadioGroupContext'),
  CHECKBOX_GROUP: Symbol('CheckboxGroupContext'),
  SELECT: Symbol('SelectContext'),
  COMBOBOX: Symbol('ComboboxContext'),
  LISTBOX: Symbol('ListboxContext'),
  NAVIGATION: Symbol('NavigationContext'),
  BREADCRUMB: Symbol('BreadcrumbContext'),
  PAGINATION: Symbol('PaginationContext'),
  TABLE: Symbol('TableContext'),
  TREE: Symbol('TreeContext'),
  CALENDAR: Symbol('CalendarContext'),
  DATE_PICKER: Symbol('DatePickerContext'),
  TIME_PICKER: Symbol('TimePickerContext'),
  SLIDER: Symbol('SliderContext'),
  PROGRESS: Symbol('ProgressContext'),
  STEPPER: Symbol('StepperContext'),
  CAROUSEL: Symbol('CarouselContext'),
  COLLAPSIBLE: Symbol('CollapsibleContext'),
  TOGGLE_GROUP: Symbol('ToggleGroupContext'),
} as const

/**
 * Type helper for context keys
 */
export type ContextKey = typeof CONTEXT_KEYS[keyof typeof CONTEXT_KEYS]

/**
 * Helper function to create typed injection keys
 */
export function createContextKey<T> (name: string): InjectionKey<T> {
  return Symbol(name) as InjectionKey<T>
}
