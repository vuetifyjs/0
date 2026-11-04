<script lang="ts">
  // Framework
  import { Alert, isString, useMediaQuery, usePresence, useTimer } from '@vuetify/v0'

  // Utilities
  import { mergeProps, toRef, useAttrs, watch } from 'vue'

  export interface BAlertProps {
    /**
     * Adds `.alert-instant` and unmounts without waiting for the fade.
     *
     * @default false
     */
    instant?: boolean
    /** Adds `theme-{theme}` on the root. */
    theme?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BAlert', inheritAttrs: false })

  defineSlots<{
    /** Alert content. A `BClose` in the slot is the dismiss control. */
    default?: () => any
  }>()

  const emit = defineEmits<{
    'update:model-value': [value: boolean]
    /** The alert has left the document. The fade is finished. */
    'after-leave': []
  }>()

  const open = defineModel<boolean>({ default: true })

  const {
    instant = false,
    theme,
  } = defineProps<BAlertProps>()

  const attrs = useAttrs()
  const motion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const { done, isLeaving, isMounted } = usePresence({
    present: open,
    immediate: false,
  })

  // Pin transition is `--bs-alert-transition-duration: .15s`.
  const timer = useTimer(done, { duration: 150 })

  watch(isMounted, mounted => {
    if (!mounted) emit('after-leave')
  })

  watch(isLeaving, leaving => {
    if (!leaving) {
      timer.stop()
      return
    }

    if (instant || motion.matches.value) {
      done()
      return
    }

    timer.start()
  })

  const alertClass = toRef(() => {
    const list = ['alert']

    if (isString(theme) && theme.length > 0) list.push(`theme-${theme}`)
    if (instant) list.push('alert-instant')
    if (isLeaving.value) list.push('hiding')

    return list
  })
</script>

<template>
  <Alert.Root v-slot="{ attrs: live }" renderless>
    <div
      v-if="isMounted"
      v-bind="mergeProps(attrs, {
        'aria-atomic': live['aria-atomic'],
        'aria-live': live['aria-live'],
        role: live.role,
      })"
      :class="alertClass"
    >
      <slot />
    </div>
  </Alert.Root>
</template>
