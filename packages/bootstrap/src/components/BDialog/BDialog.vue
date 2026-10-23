<script lang="ts">
  // Framework
  import { Dialog, IN_BROWSER, createContext, isNullOrUndefined, isUndefined, useEventListener, useTimer } from '@vuetify/v0'

  // Utilities
  import { mergeProps, onMounted, onScopeDispose, shallowRef, toRef, useAttrs, useTemplateRef, watch } from 'vue'

  export interface BDialogProps {
    /**
     * Ignore backdrop clicks.
     *
     * Maps to Bootstrap's `backdrop: "static"`. Escape still closes.
     * Bootstrap's separate `keyboard: false` option is not a prop.
     */
    blocking?: boolean
    /** `.dialog-sm` / `.dialog-lg` / `.dialog-xl`. Omit for the 500px default. */
    size?: 'sm' | 'lg' | 'xl'
  }

  export interface BDialogContext {
    /** Close the dialog. */
    close: () => void
  }

  const [useBDialog, provideBDialog] = createContext<BDialogContext | null>('bootstrap:dialog', null)

  export { useBDialog }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BDialog', inheritAttrs: false })

  defineSlots<{
    /** Header, body, and footer parts. */
    default?: () => any
  }>()

  defineEmits<{
    'update:model-value': [value: boolean]
  }>()

  const { blocking = false, size } = defineProps<BDialogProps>()

  const model = defineModel<boolean>({ default: false })

  const attrs = useAttrs()
  const dialogEl = useTemplateRef<HTMLDialogElement>('dialog')
  const exitEl = shallowRef<HTMLDialogElement | null>(null)

  const classes = toRef(() => {
    const list = ['dialog']
    if (!isUndefined(size)) list.push(`dialog-${size}`)
    return list
  })

  function close () {
    model.value = false
  }

  provideBDialog({ close })

  function animated (element: HTMLElement): boolean {
    if (element.classList.contains('dialog-instant')) return false
    const duration = getComputedStyle(element).transitionDuration
    return duration.split(',').some(part => Number.parseFloat(part) > 0)
  }

  function unlock () {
    if (!IN_BROWSER) return
    if (isNullOrUndefined(document.querySelector('dialog[open]:modal'))) {
      document.documentElement.classList.remove('dialog-open')
    }
  }

  function clearPending () {
    exitEl.value = null
    fallback.stop()
  }

  function release () {
    const element = dialogEl.value
    clearPending()
    if (!isNullOrUndefined(element)) {
      if (element.open) element.close()
      element.classList.remove('hiding')
    }
    unlock()
  }

  function endBounce () {
    const element = dialogEl.value
    if (isNullOrUndefined(element)) return
    element.classList.remove('dialog-static')
  }

  // 400ms is past the pin's 0.3s exit. 300ms matches `.dialog-static`.
  const fallback = useTimer(release, { duration: 400 })
  const bounceTimer = useTimer(endBounce, { duration: 300 })

  function onExit (event: TransitionEvent) {
    const element = dialogEl.value
    if (isNullOrUndefined(element) || event.target !== element) return
    release()
  }

  useEventListener(() => exitEl.value, 'transitionend', onExit)

  // Dialog.Content is renderless, so its own showModal() watches a null atom.
  // `.hiding` has to land before close(): Bootstrap keeps the dialog in the
  // top layer for the exit transition, and close() drops that layer immediately.
  function show () {
    const element = dialogEl.value
    if (isNullOrUndefined(element) || !IN_BROWSER) return
    clearPending()
    element.classList.remove('hiding')
    if (!element.open) element.showModal()
    document.documentElement.classList.add('dialog-open')
  }

  function hide () {
    const element = dialogEl.value
    if (isNullOrUndefined(element) || !IN_BROWSER) return
    if (!element.open || element.classList.contains('hiding')) return

    element.classList.add('hiding')
    if (!animated(element)) {
      release()
      return
    }

    exitEl.value = element
    fallback.start()
  }

  function bounce () {
    const element = dialogEl.value
    if (isNullOrUndefined(element)) return
    element.classList.add('dialog-static')
    bounceTimer.start()
  }

  function onCancel (event: Event) {
    event.preventDefault()
    close()
  }

  function onBackdrop (event: MouseEvent) {
    if (event.target !== event.currentTarget) return
    if (blocking) {
      bounce()
      return
    }
    close()
  }

  function sync (open: boolean) {
    if (open) show()
    else hide()
  }

  watch(model, open => {
    sync(open)
  })

  onMounted(() => {
    sync(model.value)
  })

  onScopeDispose(() => {
    clearPending()
    const element = dialogEl.value
    if (isNullOrUndefined(element)) return
    if (element.open) element.close()
    element.classList.remove('hiding')
    unlock()
  })
</script>

<template>
  <Dialog.Root v-model="model">
    <Dialog.Content
      v-slot="{ attrs: described }"
      :blocking
      :close-on-click-outside="false"
      renderless
      :scrim="false"
    >
      <dialog
        ref="dialog"
        :class="classes"
        v-bind="mergeProps(attrs, described, { onCancel, onClick: onBackdrop })"
      >
        <slot />
      </dialog>
    </Dialog.Content>
  </Dialog.Root>
</template>
