<script lang="ts">
  // Framework
  import { Dialog, IN_BROWSER } from '@vuetify/v0'

  // Utilities
  import { mergeProps, nextTick, onScopeDispose, useAttrs, useTemplateRef, watch } from 'vue'

  export interface BuModalProps {
    /** Render the `.modal-card` variant with header and footer regions. */
    card?: boolean
    /** Prevent background clicks from closing the modal. */
    blocking?: boolean
  }

  const FOCUSABLE = [
    'a[href]',
    'area[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ')
</script>

<script setup lang="ts">
  defineOptions({ name: 'BuModal', inheritAttrs: false })

  defineSlots<{
    /** Modal content: `.modal-content` body, or `.modal-card-body` in card mode. */
    default?: () => any
    /** Card variant title, rendered inside `p.modal-card-title`. */
    header?: () => any
    /** Card variant footer, rendered inside `footer.modal-card-foot`. */
    footer?: () => any
  }>()

  defineEmits<{
    'update:model-value': [value: boolean]
  }>()

  const {
    card = false,
    blocking = false,
  } = defineProps<BuModalProps>()

  const model = defineModel<boolean>({ default: false })

  const attrs = useAttrs()
  const root = useTemplateRef<HTMLElement>('root')
  const panel = useTemplateRef<HTMLElement>('panel')

  let restore: HTMLElement | null = null

  function targets (): HTMLElement[] {
    return root.value ? [...root.value.querySelectorAll<HTMLElement>(FOCUSABLE)] : []
  }

  function close () {
    model.value = false
  }

  function onBackground () {
    if (!blocking) close()
  }

  // Hand-rolled focus trap: v0 ships no focus-trap composable and a non-native
  // <dialog> host gets no top-layer trapping (v0-core follow-up candidate).
  function onKeydown (event: KeyboardEvent, top: boolean) {
    if (event.key === 'Escape') {
      if (!top) return
      event.preventDefault()
      close()
      return
    }

    if (event.key !== 'Tab') return

    const items = targets()

    if (items.length === 0) {
      event.preventDefault()
      panel.value?.focus()
      return
    }

    const first = items[0]
    const last = items.at(-1)!
    const active = document.activeElement

    if (event.shiftKey && (active === first || active === panel.value)) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && active === last) {
      event.preventDefault()
      first.focus()
    }
  }

  watch(model, async open => {
    if (!IN_BROWSER) return

    if (open) {
      restore = document.activeElement instanceof HTMLElement ? document.activeElement : null
      await nextTick()
      const target = targets()[0] ?? panel.value
      target?.focus()
    } else if (restore) {
      // The trigger may have been unmounted while the modal was open — fall
      // back to the body instead of stranding focus on a detached node.
      if (restore.isConnected) restore.focus()
      else document.body.focus()
      restore = null
    }
  }, { immediate: true })

  // Unmount-while-open (v-if on a parent, route change) never flips the
  // watcher — hand focus back on scope teardown too.
  onScopeDispose(() => {
    if (model.value && restore?.isConnected) restore.focus()
  })
</script>

<template>
  <Dialog.Root v-model="model">
    <Dialog.Content
      v-slot="{ isOpen, globalTop, zIndex, attrs: content }"
      :blocking
      :close-on-click-outside="false"
      renderless
    >
      <!--
        tabindex=-1 keeps backdrop clicks from blurring to <body> (which would
        kill the subtree-bound Esc/Tab trap); pointerdown.prevent on the
        backdrop stops the focus move entirely.
      -->
      <div
        ref="root"
        class="modal"
        :class="{ 'is-active': isOpen }"
        tabindex="-1"
        v-bind="mergeProps(attrs, { style: { zIndex } })"
        @keydown="onKeydown($event, globalTop)"
      >
        <div
          class="modal-background"
          @click="onBackground"
          @pointerdown.prevent
        />

        <div
          v-if="card"
          :id="content.id"
          ref="panel"
          :aria-labelledby="content['aria-labelledby']"
          :aria-modal="content['aria-modal']"
          class="modal-card"
          :role="content.role"
          tabindex="-1"
        >
          <header class="modal-card-head">
            <Dialog.Title
              as="p"
              class="modal-card-title"
            >
              <slot name="header" />
            </Dialog.Title>

            <Dialog.Close class="delete" />
          </header>

          <section class="modal-card-body">
            <slot />
          </section>

          <footer
            v-if="$slots.footer"
            class="modal-card-foot"
          >
            <slot name="footer" />
          </footer>
        </div>

        <template v-else>
          <div
            :id="content.id"
            ref="panel"
            :aria-modal="content['aria-modal']"
            class="modal-content"
            :role="content.role"
            tabindex="-1"
          >
            <slot />
          </div>

          <Dialog.Close class="modal-close is-large" />
        </template>
      </div>
    </Dialog.Content>
  </Dialog.Root>
</template>
