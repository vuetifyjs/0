export { provideSplitterRoot, useSplitterRoot } from './SplitterRoot.vue'
export { default as SplitterRoot } from './SplitterRoot.vue'
export { default as SplitterPanel } from './SplitterPanel.vue'
export { default as SplitterHandle } from './SplitterHandle.vue'

export type { SplitterContext, SplitterOrientation, SplitterPanelInput, SplitterPanelTicket, SplitterRootExpose, SplitterRootProps, SplitterRootSlotProps } from './SplitterRoot.vue'
export type { SplitterPanelExpose, SplitterPanelProps, SplitterPanelSlotProps } from './SplitterPanel.vue'
export type { SplitterHandleProps, SplitterHandleSlotProps, SplitterHandleState } from './SplitterHandle.vue'

// Context
import Handle from './SplitterHandle.vue'
import Panel from './SplitterPanel.vue'
import Root from './SplitterRoot.vue'

/**
 * Splitter component with sub-components for building resizable panel layouts.
 *
 * @see https://0.vuetifyjs.com/components/semantic/splitter
 *
 * @example
 * ```vue
 * <script lang="ts" setup>
 *   import { Splitter } from '@vuetify/v0'
 * </script>
 *
 * <template>
 *   <Splitter.Root orientation="horizontal">
 *     <Splitter.Panel :default-size="60" :min-size="20">
 *       Left content
 *     </Splitter.Panel>
 *
 *     <Splitter.Handle />
 *
 *     <Splitter.Panel :default-size="40" :min-size="20">
 *       Right content
 *     </Splitter.Panel>
 *   </Splitter.Root>
 * </template>
 * ```
 */
export const Splitter = {
  /**
   * Root container that provides splitter context and manages panel sizes.
   *
   * @see https://0.vuetifyjs.com/components/semantic/splitter
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { Splitter } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Splitter.Root orientation="horizontal">
   *     <Splitter.Panel :default-size="60" :min-size="20">
   *       Left content
   *     </Splitter.Panel>
   *
   *     <Splitter.Handle label="Resize panels" />
   *
   *     <Splitter.Panel :default-size="40" :min-size="20">
   *       Right content
   *     </Splitter.Panel>
   *   </Splitter.Root>
   * </template>
   * ```
   */
  Root,
  /**
   * Resizable panel within a splitter layout, sized via flex-basis percentage.
   *
   * @see https://0.vuetifyjs.com/components/semantic/splitter
   *
   * @example
   * ```vue
   * <Splitter.Panel :default-size="50" :min-size="20" :max-size="80">
   *   Panel content
   * </Splitter.Panel>
   * ```
   */
  Panel,
  /**
   * Draggable resize handle between two adjacent panels.
   *
   * @see https://0.vuetifyjs.com/components/semantic/splitter
   *
   * @example
   * ```vue
   * <Splitter.Handle label="Resize panels" />
   * ```
   */
  Handle,
}
