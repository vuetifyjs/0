export { provideSplitterRoot, useSplitterRoot } from './SplitterRoot.vue'
export { default as SplitterRoot } from './SplitterRoot.vue'
export { default as SplitterPanel } from './SplitterPanel.vue'
export { default as SplitterHandle } from './SplitterHandle.vue'

export type { SplitterContext, SplitterOrientation, SplitterRootProps, SplitterRootSlotProps } from './SplitterRoot.vue'
export type { SplitterPanelProps, SplitterPanelSlotProps } from './SplitterPanel.vue'
export type { SplitterHandleProps, SplitterHandleSlotProps, SplitterHandleState } from './SplitterHandle.vue'

// Components
import Handle from './SplitterHandle.vue'
import Panel from './SplitterPanel.vue'
import Root from './SplitterRoot.vue'

/**
 * Splitter component with sub-components for building resizable panel layouts.
 *
 * @see https://0.vuetifyjs.com/components/splitter
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
  Root,
  Panel,
  Handle,
}
