/**
 * @module useResponsivePagination
 *
 * @remarks
 * Responsive pagination composable that auto-calculates visible buttons
 * based on container width using ResizeObserver.
 *
 * Key features:
 * - Uses useElementSize to track container dimensions
 * - Computes optimal visible buttons based on available space
 * - Configurable button width and gap settings
 * - Returns a reactive visible ref for use with usePagination
 *
 * Works in conjunction with usePagination to provide responsive behavior.
 */

// Composables
import { useElementSize } from '#v0/composables/useResizeObserver'

// Vue
import { computed, toValue, type ComputedRef, type MaybeRefOrGetter, type Ref } from 'vue'

export interface ResponsivePaginationOptions {
  /** Width of each page button in pixels. @default 36 */
  buttonWidth?: MaybeRefOrGetter<number>
  /** Gap between buttons in pixels. @default 4 */
  gap?: MaybeRefOrGetter<number>
  /** Number of navigation buttons (first, prev, next, last). @default 4 */
  navButtons?: MaybeRefOrGetter<number>
  /** Minimum number of visible page buttons. @default 1 */
  minVisible?: MaybeRefOrGetter<number>
  /** Maximum number of visible page buttons. @default Infinity */
  maxVisible?: MaybeRefOrGetter<number>
  /** Reserved space for other elements (e.g., text) in pixels. @default 0 */
  reservedSpace?: MaybeRefOrGetter<number>
}

export interface UseResponsivePaginationReturn {
  /** Computed optimal number of visible page buttons */
  visible: ComputedRef<number>
  /** Current container width */
  width: Ref<number>
  /** Current container height */
  height: Ref<number>
  /** Pause the resize observer */
  pause: () => void
  /** Resume the resize observer */
  resume: () => void
  /** Stop the resize observer */
  stop: () => void
}

/**
 * Creates a responsive pagination controller that auto-calculates visible
 * buttons based on container width.
 *
 * @param target The container element to observe for size changes.
 * @param options Configuration options for button sizing.
 * @returns An object with a reactive `visible` computed and observer controls.
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue'
 * import { useResponsivePagination, createPagination } from '@vuetify/v0'
 *
 * const container = ref<HTMLElement>()
 * const { visible } = useResponsivePagination(container, {
 *   buttonWidth: 36,
 *   gap: 4,
 * })
 *
 * const pagination = createPagination({
 *   size: 100,
 *   visible, // reactive - updates as container resizes
 * })
 * </script>
 *
 * <template>
 *   <div ref="container" class="flex gap-1">
 *     <!-- Pagination buttons automatically adjust to fit -->
 *   </div>
 * </template>
 * ```
 */
export function useResponsivePagination (
  target: Ref<Element | undefined>,
  options: ResponsivePaginationOptions = {},
): UseResponsivePaginationReturn {
  const {
    buttonWidth: _buttonWidth = 36,
    gap: _gap = 4,
    navButtons: _navButtons = 4,
    minVisible: _minVisible = 1,
    maxVisible: _maxVisible = Infinity,
    reservedSpace: _reservedSpace = 0,
  } = options

  const { width, height, pause, resume, stop } = useElementSize(target)

  const visible = computed(() => {
    const containerWidth = width.value
    const buttonWidth = toValue(_buttonWidth)
    const gap = toValue(_gap)
    const navButtons = toValue(_navButtons)
    const minVisible = toValue(_minVisible)
    const maxVisible = toValue(_maxVisible)
    const reservedSpace = toValue(_reservedSpace)

    if (containerWidth <= 0) return minVisible

    // Calculate space taken by navigation buttons
    // navButtons * (buttonWidth + gap)
    const navSpace = navButtons * (buttonWidth + gap)

    // Available space for page buttons
    const availableSpace = containerWidth - navSpace - reservedSpace

    if (availableSpace <= 0) return minVisible

    // Calculate how many page buttons can fit
    // Each button takes buttonWidth + gap (except last one)
    // So for n buttons: n * buttonWidth + (n-1) * gap = n * (buttonWidth + gap) - gap
    // availableSpace >= n * (buttonWidth + gap) - gap
    // availableSpace + gap >= n * (buttonWidth + gap)
    // n <= (availableSpace + gap) / (buttonWidth + gap)
    const maxButtons = Math.floor((availableSpace + gap) / (buttonWidth + gap))

    // Ensure we stay within min/max bounds
    return Math.min(maxVisible, Math.max(minVisible, maxButtons))
  })

  return {
    visible,
    width,
    height,
    pause,
    resume,
    stop,
  }
}
