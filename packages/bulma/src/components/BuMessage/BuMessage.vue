<script lang="ts">
  // Framework
  import { createContext, Presence } from '@vuetify/v0'

  // Utilities
  import { toRef, useAttrs } from 'vue'

  export interface BuMessageProps {
    /** Bulma color modifier, rendered as `is-{color}`. */
    color?: 'primary' | 'link' | 'info' | 'success' | 'warning' | 'danger'
    /** Bulma size modifier, rendered as `is-{size}`. */
    size?: 'small' | 'normal' | 'medium' | 'large'
  }

  export interface BuMessageContext {
    /** Dismiss the message — drives BuMessageDelete. */
    close: () => void
  }

  // Only the parent provides, so the provider stays module-local; parts import
  // the hook.
  const [useBuMessage, provideBuMessage] = createContext<BuMessageContext | null>('bulma:message', null)

  export { useBuMessage }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BuMessage', inheritAttrs: false })

  defineSlots<{
    /** `article.message` children — BuMessageHeader (with optional BuMessageDelete) and BuMessageBody. */
    default?: () => any
  }>()

  defineEmits<{
    'update:model-value': [value: boolean]
  }>()

  const {
    color,
    size,
  } = defineProps<BuMessageProps>()

  const model = defineModel<boolean>({ default: true })

  const attrs = useAttrs()

  const classes = toRef(() => [
    color && `is-${color}`,
    size && `is-${size}`,
  ])

  provideBuMessage({
    close: () => {
      model.value = false
    },
  })
</script>

<template>
  <Presence
    v-slot="{ attrs: state }"
    v-model="model"
  >
    <article
      class="message"
      :class="classes"
      :data-state="state['data-state']"
      v-bind="attrs"
    >
      <slot />
    </article>
  </Presence>
</template>
