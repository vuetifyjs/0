<script lang="ts">
  // Framework
  import { createContext, isElement, isNull, useTimer } from '@vuetify/v0'

  // Utilities
  import { toRef, useTemplateRef, watch } from 'vue'

  export interface BToastProps {
    /**
     * Hide the toast after `delay` once it is shown.
     *
     * @default true
     */
    autohide?: boolean
    /**
     * Milliseconds before an open toast hides itself.
     *
     * @default 5000
     */
    delay?: number
    /**
     * Adds `.toast-instant`, which skips the opacity transition.
     *
     * @default false
     */
    instant?: boolean
  }

  export interface BToastContext {
    close: () => void
  }

  const [useBToast, provideBToast] = createContext<BToastContext | null>('bootstrap:toast', null)

  export { useBToast }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BToast' })

  defineSlots<{
    /** Header, body, and close button. */
    default?: () => any
  }>()

  defineEmits<{
    'update:model-value': [value: boolean]
  }>()

  const model = defineModel<boolean>({ default: false })

  const {
    autohide = true,
    delay = 5000,
    instant = false,
  } = defineProps<BToastProps>()

  const root = useTemplateRef<HTMLElement>('root')

  // Bootstrap clears the timer on hover and starts the full delay again on leave.
  const timer = useTimer(() => {
    model.value = false
  }, {
    duration: () => delay,
  })

  function close () {
    model.value = false
  }

  provideBToast({ close })

  function arm () {
    if (!model.value || !autohide) {
      timer.stop()
      return
    }

    timer.start()
  }

  function onEnter () {
    if (!autohide) return

    timer.stop()
  }

  function onLeave (event: MouseEvent | FocusEvent) {
    const next = event.relatedTarget
    const host = root.value

    if (isElement(next) && !isNull(host) && host.contains(next)) return

    arm()
  }

  const toastClass = toRef(() => {
    const list = ['toast']

    if (model.value) list.push('show')
    if (instant) list.push('toast-instant')

    return list
  })

  watch(() => [model.value, autohide] as const, () => {
    arm()
  }, { immediate: true })
</script>

<template>
  <div
    ref="root"
    aria-atomic="true"
    aria-live="assertive"
    :class="toastClass"
    role="alert"
    @focusin="onEnter"
    @focusout="onLeave"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
  >
    <slot />
  </div>
</template>
