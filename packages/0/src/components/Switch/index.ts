export { default as SwitchGroup } from './SwitchGroup.vue'
export { provideSwitchGroup, useSwitchGroup } from './SwitchGroup.vue'

export { default as SwitchHiddenInput } from './SwitchHiddenInput.vue'

export { default as SwitchRoot } from './SwitchRoot.vue'
export { provideSwitchRoot, useSwitchRoot } from './SwitchRoot.vue'

export { default as SwitchSelectAll } from './SwitchSelectAll.vue'

export { default as SwitchThumb } from './SwitchThumb.vue'

export { default as SwitchTrack } from './SwitchTrack.vue'

export type { SwitchGroupProps, SwitchGroupSlotProps } from './SwitchGroup.vue'
export type { SwitchHiddenInputProps } from './SwitchHiddenInput.vue'
export type { SwitchRootContext, SwitchRootProps, SwitchRootSlotProps, SwitchState } from './SwitchRoot.vue'
export type { SwitchSelectAllProps, SwitchSelectAllSlotProps } from './SwitchSelectAll.vue'
export type { SwitchThumbProps, SwitchThumbSlotProps } from './SwitchThumb.vue'
export type { SwitchTrackProps, SwitchTrackSlotProps } from './SwitchTrack.vue'

// Components
import Group from './SwitchGroup.vue'
import HiddenInput from './SwitchHiddenInput.vue'
import Root from './SwitchRoot.vue'
import SelectAll from './SwitchSelectAll.vue'
import Thumb from './SwitchThumb.vue'
import Track from './SwitchTrack.vue'

/**
 * Switch component with sub-components for toggle controls.
 *
 * @see https://0.vuetifyjs.com/components/forms/switch
 *
 * @example
 * ```vue
 * <script lang="ts" setup>
 *   import { Switch } from '@vuetify/v0'
 *   import { ref } from 'vue'
 *
 *   const enabled = ref(false)
 * </script>
 *
 * <template>
 *   <label>
 *     <Switch.Root v-model="enabled">
 *       <Switch.Track>
 *         <Switch.Thumb />
 *       </Switch.Track>
 *     </Switch.Root>
 *     Enable notifications
 *   </label>
 * </template>
 * ```
 */
export const Switch = {
  Group,
  HiddenInput,
  Root,
  SelectAll,
  Thumb,
  Track,
}
