<script lang="ts">
  // Framework
  import { AlertDialog, Dialog, isElement, useAlertDialogContext, useDialogContext, useLocale, useResizeObserver } from '@vuetify/v0'

  // Context
  import QuDialog, { orphan, useQuDialog } from './QuDialog.vue'
  // Components
  import QuDialogActions from './QuDialogActions.vue'
  import QuDialogCancel from './QuDialogCancel.vue'
  import QuDialogConfirm from './QuDialogConfirm.vue'
  import QuDialogText from './QuDialogText.vue'

  // Utilities
  import { onUpdated, shallowRef, toRef, useAttrs, useTemplateRef } from 'vue'

  // Types
  import type { DialogContentProps } from '@vuetify/v0'

  /**
   * Quantum withholds `as`, `renderless`, `blocking`, `scrim` and
   * `closeOnClickOutside` from v0's content props: the element is always the
   * native `<dialog>`, the scrim is its `::backdrop`, and dismissal is the
   * root's `dismissible`.
   */
  export interface QuDialogContentProps extends Pick<DialogContentProps, 'namespace'> {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuDialogContent' })

  defineSlots<{
    /** Title, text, the content, and the actions. */
    default?: () => any
  }>()

  const { namespace: _namespace } = defineProps<QuDialogContentProps>()

  const context = useQuDialog()

  orphan('QuDialogContent', context)

  const locale = useLocale()

  const namespace = toRef(() => _namespace ?? context?.namespace.value)
  const variant = toRef(() => context?.variant.value ?? 'alert')
  const alert = toRef(() => variant.value === 'alert')
  const full = toRef(() => variant.value === 'full-screen')
  const dismissible = toRef(() => context?.dismissible.value ?? true)
  const isOpen = toRef(() => context?.isOpen.value ?? false)
  const confirming = toRef(() => context?.confirming.value ?? false)

  // The v0 root this part renders under; the variant picks the root, so it is fixed for this instance.
  const root = alert.value
    ? useAlertDialogContext(namespace.value ?? 'v0:alert-dialog')
    : useDialogContext(namespace.value ?? 'v0:dialog')

  const attrs = useAttrs()

  // Most alerts have no title bar (dialogs page), and v0 names the dialog only
  // by its title. Without one the text, the question itself, names the dialog
  // instead of describing it, unless the consumer named it.
  const name = toRef(() => {
    if (root.hasTitle.value || !root.hasDescription.value || attrs['aria-label']) return {}

    return { 'aria-labelledby': root.descriptionId, 'aria-describedby': undefined }
  })

  // A full-screen dialog has no outside: every click lands inside it.
  const outside = toRef(() => dismissible.value && !full.value)

  const sheet = useTemplateRef<HTMLElement>('sheet')
  const scrolled = shallowRef(false)

  // Content that overflows the height limit scrolls inside the sheet; the
  // stroke above the actions appears while it does.
  function measure () {
    const el = sheet.value

    scrolled.value = !!el && el.scrollHeight - el.clientHeight > 1
  }

  useResizeObserver(sheet, measure)
  onUpdated(measure)

  const hooks = toRef(() => ({
    'data-dismissible': dismissible.value || undefined,
    'data-open': isOpen.value || undefined,
    'data-scrolled': scrolled.value || undefined,
    'data-variant': variant.value,
  }))

  function onConfirming (value: boolean) {
    if (context) context.confirming.value = value
  }

  // Escape is the web's Back gesture. Dialog.Content has no closeOnEscape, so
  // the keydown is stopped before the native cancel it would trigger.
  function onKeydown (event: KeyboardEvent) {
    if (event.key !== 'Escape') return

    // A dialog opened from this one (a picker, the discard prompt) owns its own Escape.
    if (isElement(event.target) && event.target.closest('dialog') !== sheet.value?.parentElement) return

    if (!dismissible.value) {
      event.preventDefault()
    } else if (full.value) {
      // X and Back close and discard, through the prompt when the dialog is dirty.
      event.preventDefault()
      context?.close()
    }
  }

  const discardText = toRef(() => locale.ti('Quantum.discardChanges') ?? 'Discard changes?')
  const discardLabel = toRef(() => locale.ti('Quantum.discard') ?? 'Discard')
</script>

<!--
  The native <dialog>: showModal() gives focus containment, Escape and the
  backdrop; scrim is false on every Dialog.Content Quantum renders (#910).
-->
<template>
  <AlertDialog.Content
    v-if="alert"
    class="quantum-dialog"
    :close-on-click-outside="outside"
    :close-on-escape="dismissible"
    v-bind="{ ...hooks, ...name }"
    :namespace
    :scrim="false"
    @keydown="onKeydown"
  >
    <div ref="sheet" class="quantum-dialog__sheet">
      <slot />
    </div>
  </AlertDialog.Content>

  <Dialog.Content
    v-else
    class="quantum-dialog"
    :close-on-click-outside="outside"
    v-bind="{ ...hooks, ...name }"
    :namespace
    :scrim="false"
    @keydown="onKeydown"
  >
    <div ref="sheet" class="quantum-dialog__sheet">
      <slot />
    </div>

    <!-- The discard prompt a dirty full-screen dialog raises: full-screen dialogs may open other dialogs (dialogs page). -->
    <QuDialog
      v-if="full && context"
      :model-value="confirming"
      variant="alert"
      @update:model-value="onConfirming"
    >
      <QuDialogContent class="quantum-dialog__discard">
        <QuDialogText>{{ discardText }}</QuDialogText>

        <QuDialogActions>
          <QuDialogCancel />

          <QuDialogConfirm @confirm="context.discard()">{{ discardLabel }}</QuDialogConfirm>
        </QuDialogActions>
      </QuDialogContent>
    </QuDialog>
  </Dialog.Content>
</template>

<!-- Unscoped: Dialog.Content is an Atom; a scoped data-v never lands on the <dialog>. -->
<style>
  /*
   * The <dialog> is the top-layer shell: it keeps the spec's distances from the
   * screen edges (at least 40 dp at the sides, 24 dp above and below) and
   * paints the scrim through ::backdrop. `display` is left to the UA so a
   * closed dialog stays hidden; the open rule turns it into a column so the
   * sheet can shrink under the height limit and scroll.
   */
  .quantum-dialog {
    box-sizing: border-box;
    max-width: calc(100% - 2 * var(--quantum-spacing-5, 40px));
    max-height: calc(100% - 2 * var(--quantum-spacing-3, 24px));
    padding: 0;
    margin: auto;
    border: 0;
    background: transparent;
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    overflow: visible;
    opacity: 0;
    transform: scale(0.9);
    transition:
      opacity var(--quantum-duration-leave, 195ms) var(--quantum-easing-accelerate, cubic-bezier(0.4, 0, 1, 1)),
      transform var(--quantum-duration-leave, 195ms) var(--quantum-easing-accelerate, cubic-bezier(0.4, 0, 1, 1)),
      overlay var(--quantum-duration-leave, 195ms) allow-discrete,
      display var(--quantum-duration-leave, 195ms) allow-discrete;
  }

  /*
   * Enter: 225 ms on the deceleration curve, fading in while settling from a
   * slightly smaller size; leave: 195 ms on the acceleration curve. The page
   * states no dialog transition; these are the motion page's values.
   */
  .quantum-dialog[open] {
    display: flex;
    flex-direction: column;
    opacity: 1;
    transform: none;
    transition-duration: var(--quantum-duration-enter, 225ms);
    transition-timing-function: var(--quantum-easing-decelerate, cubic-bezier(0, 0, 0.2, 1));
  }

  @starting-style {
    .quantum-dialog[open] {
      opacity: 0;
      transform: scale(0.9);
    }
  }

  /* Native backdrop in the scrim colour: Quantum never mounts v0's Scrim (#910). */
  .quantum-dialog::backdrop {
    background: var(--quantum-scrim, rgba(33, 33, 33, 0.46));
    opacity: 0;
    transition:
      opacity var(--quantum-duration-leave, 195ms) var(--quantum-easing-accelerate, cubic-bezier(0.4, 0, 1, 1)),
      overlay var(--quantum-duration-leave, 195ms) allow-discrete,
      display var(--quantum-duration-leave, 195ms) allow-discrete;
  }

  .quantum-dialog[open]::backdrop {
    opacity: 1;
    transition-duration: var(--quantum-duration-enter, 225ms);
    transition-timing-function: var(--quantum-easing-decelerate, cubic-bezier(0, 0, 0.2, 1));
  }

  @starting-style {
    .quantum-dialog[open]::backdrop {
      opacity: 0;
    }
  }

  /*
   * The sheet: a 24 dp surface that sizes to its content between 280 px (five
   * 56 dp units, the mobile minimum) and 560 px (ten, a Quantum decision), and
   * scrolls when the content exceeds the height limit. The parts carry the
   * 24 dp content paddings so the action area can sit flush with the edges.
   */
  .quantum-dialog__sheet {
    box-sizing: border-box;
    width: fit-content;
    min-width: min(280px, calc(100vw - 2 * var(--quantum-spacing-5, 40px)));
    max-width: min(560px, calc(100vw - 2 * var(--quantum-spacing-5, 40px)));
    overflow-x: clip;
    overflow-y: auto;
    background: var(--quantum-surface, #FFFFFF);
    border-radius: var(--quantum-radius, 2px);
    box-shadow: var(--quantum-elevation-24, 0px 11px 15px -7px rgba(0, 0, 0, 0.2), 0px 24px 38px 3px rgba(0, 0, 0, 0.14), 0px 9px 46px 8px rgba(0, 0, 0, 0.12));
  }

  /* Mouse and keyboard: every resting elevation drops 2 dp (elevation page), so the sheet rests at 22 dp. */
  @media (pointer: fine) {
    .quantum-dialog__sheet {
      box-shadow: var(--quantum-elevation-22, 0px 10px 14px -6px rgba(0, 0, 0, 0.2), 0px 22px 35px 3px rgba(0, 0, 0, 0.14), 0px 8px 42px 7px rgba(0, 0, 0, 0.12));
    }
  }

  /* A simple dialog ends 8 dp below its last row (dialogs page). */
  .quantum-dialog[data-variant='simple'] .quantum-dialog__sheet {
    padding-bottom: var(--quantum-spacing-1, 8px);
  }

  /* Full-screen dialogs are mobile only; from 600 px the same tree is a standard sheet at the desktop width. */
  .quantum-dialog[data-variant='full-screen'] .quantum-dialog__sheet {
    width: 560px;
  }

  @media (max-width: 599.98px) {
    .quantum-dialog[data-variant='full-screen'] {
      width: 100%;
      height: 100%;
      max-width: none;
      max-height: none;
      margin: 0;
    }

    /* The sheet is the screen: no margins, corners or shadow; its app bar carries the 4 dp. */
    .quantum-dialog[data-variant='full-screen'] .quantum-dialog__sheet {
      flex: 1 1 auto;
      width: 100%;
      min-width: 0;
      max-width: none;
      border-radius: 0;
      box-shadow: none;
    }
  }

  /* Reduced motion: the dialog appears and leaves at once. The plugin's body attribute wins over the OS query. */
  body[data-reduced-motion='reduce'] .quantum-dialog,
  body[data-reduced-motion='reduce'] .quantum-dialog::backdrop {
    transition: none;
  }

  @media (prefers-reduced-motion: reduce) {
    body:not([data-reduced-motion='no-preference']) .quantum-dialog,
    body:not([data-reduced-motion='no-preference']) .quantum-dialog::backdrop {
      transition: none;
    }
  }
</style>
