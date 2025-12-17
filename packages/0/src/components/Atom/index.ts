export type { AtomExpose, AtomProps, AtomSlots } from './Atom.vue'

/**
 * Polymorphic foundation component that can render as any HTML element.
 *
 * @see https://0.vuetifyjs.com/components/atom
 *
 * @example
 * ```vue
 * <script lang="ts" setup>
 *   import { Atom } from '@vuetify/v0'
 *
 *   function handleClick() {
 *     console.log('clicked')
 *   }
 * </script>
 *
 * <template>
 *   <Atom as="button" @click="handleClick">
 *     Click me
 *   </Atom>
 * </template>
 * ```
 */
export { default as Atom } from './Atom.vue'
