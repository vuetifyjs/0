export type { PresenceAttrs, PresenceProps, PresenceSlotProps } from './Presence.vue'

/**
 * Renderless mount lifecycle component with exit animation support.
 *
 * @see https://0.vuetifyjs.com/components/primitives/presence
 *
 * @example
 * Basic usage with CSS animations:
 * ```vue
 * <script setup lang="ts">
 *   import { Presence } from '@vuetify/v0'
 *   import { ref } from 'vue'
 *
 *   const open = ref(false)
 * </script>
 *
 * <template>
 *   <button @click="open = !open">Toggle</button>
 *
 *   <Presence v-model="open" v-slot="{ attrs, done }">
 *     <div v-bind="attrs" @animationend="done">
 *       Content
 *     </div>
 *   </Presence>
 * </template>
 * ```
 *
 * @example
 * With lifecycle events and lazy mounting:
 * ```vue
 * <Presence
 *   v-model="open"
 *   lazy
 *   :immediate="false"
 *   @enter="onEnter"
 *   @leave="onLeave"
 *   @after-leave="onAfterLeave"
 *   v-slot="{ attrs, done }"
 * >
 *   <div v-bind="attrs">Content</div>
 * </Presence>
 * ```
 */
export { default as Presence } from './Presence.vue'
