export type { AtomExpose, AtomProps, AtomSlots } from './Atom.vue'

/**
 * Polymorphic foundation component that can render as any HTML element.
 *
 * @see https://0.vuetifyjs.com/components/primitives/atom
 *
 * @example
 * ```vue
 * <script lang="ts" setup>
 *   import { Atom } from '@vuetify/v0'
 *
 *   function onClick() {
 *     console.log('clicked')
 *   }
 * </script>
 *
 * <template>
 *   <Atom as="button" @click="onClick">
 *     Click me
 *   </Atom>
 * </template>
 * ```
 */
export { default as Atom } from './Atom.vue'
