<script lang="ts">
  // Framework
  import { Dialog, IN_BROWSER, createContext, isNullOrUndefined, isUndefined, useEventListener, useTimer } from '@vuetify/v0'

  // Utilities
  import { mergeProps, onMounted, onScopeDispose, shallowRef, toRef, useAttrs, useTemplateRef, watch } from 'vue'

  export interface BDialogProps {
    /**
     * Ignore backdrop clicks.
     *
     * Maps to Bootstrap's `backdrop: "static"`. The click bounces and does
     * not close. Escape still closes unless `keyboard` is false.
     */
    blocking?: boolean
    /**
     * Close on Escape.
     *
     * When false, Escape bounces a modal dialog and does not close it. A
     * non-modal dialog ignores Escape with no bounce.
     */
    keyboard?: boolean
    /**
     * Open with `showModal()`.
     *
     * False calls `show()`, adds `.dialog-nonmodal`, and does not lock page
     * scroll. There is no backdrop to click.
     */
    modal?: boolean
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

  const {
    blocking = false,
    keyboard = true,
    modal = true,
    size,
  } = defineProps<BDialogProps>()

  const model = defineModel<boolean>({ default: false })

  const attrs = useAttrs()
  const dialogEl = useTemplateRef<HTMLDialogElement>('dialog')
  const exitEl = shallowRef<HTMLDialogElement | null>(null)

  const classes = toRef(() => {
    const list = ['dialog']
    if (!modal) list.push('dialog-nonmodal')
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
    // A scroll drawer stays modal but must not hold the lock. It sets data-scroll.
    if (isNullOrUndefined(document.querySelector('dialog[open]:modal:not([data-scroll])'))) {
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
    if (!element.open) {
      if (modal) element.showModal()
      else element.show()
    }
    if (modal) document.documentElement.classList.add('dialog-open')
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
    if (!keyboard) {
      bounce()
      return
    }
    close()
  }

  function onKeydown (event: KeyboardEvent) {
    if (modal || event.key !== 'Escape') return
    event.preventDefault()
    if (!keyboard) return
    close()
  }

  // Dialog.Content's cancel handler closes the model. Escape has to go
  // through `keyboard` first, so that handler stays off this element.
  function dialogAttrs (described: Record<string, unknown>) {
    const { onCancel: _cancel, onClose: _close, ...rest } = described
    if (!modal) rest['aria-modal'] = undefined
    return rest
  }

  function onBackdrop (event: MouseEvent) {
    // Non-modal has no backdrop. A click on the dialog element is the panel.
    if (!modal) return
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

  // The class updates on its own. show/showModal does not, so a live flip
  // would leave a modal dialog wearing .dialog-nonmodal, or the reverse.
  watch(() => modal, value => {
    const element = dialogEl.value
    if (!model.value || isNullOrUndefined(element) || !IN_BROWSER || !element.open) return
    element.close()
    if (value) {
      element.showModal()
      document.documentElement.classList.add('dialog-open')
    } else {
      element.show()
      unlock()
    }
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
        v-bind="mergeProps(attrs, dialogAttrs(described), { onCancel, onClick: onBackdrop, onKeydown })"
      >
        <slot />
      </dialog>
    </Dialog.Content>
  </Dialog.Root>
</template>
