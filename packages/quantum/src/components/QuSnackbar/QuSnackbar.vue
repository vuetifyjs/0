<script lang="ts">
  // Framework
  import { isElement, isString, Snackbar, toElement, useId, useLocale, useLogger, usePresence, useRaf, useResizeObserver, useSnackbarQueueContext, useTimer } from '@vuetify/v0'

  // Context
  import { orphan, QU_SNACKBAR_NAMESPACE, useQuSnackbarPortal } from './QuSnackbarPortal.vue'
  import { useQuSnackbarQueue } from './QuSnackbarQueue.vue'

  // Utilities
  import { nextTick, onBeforeUnmount, shallowRef, toRef, useTemplateRef, watch } from 'vue'

  // Types
  import type { SnackbarRootProps } from '@vuetify/v0'
  import type { ComponentPublicInstance } from 'vue'

  // Components
  import QuButton from '../QuButton/QuButton.vue'

  /** Where the tablet and desktop snackbar sits; handsets are always full width. */
  export type QuSnackbarAlign = 'center' | 'start'

  /**
   * Quantum withholds `urgent`, `as` and `renderless` from v0's root: the
   * snackbars page names no urgency level and critical errors never go in a
   * snackbar, so the root is always `role="status"`.
   */
  export interface QuSnackbarProps extends Pick<SnackbarRootProps, 'id' | 'namespace'> {
    /**
     * The one text action, sentence case (the stylesheet capitalises it).
     * Choosing it emits `action` and dismisses the snackbar. "Dismiss" and
     * "Cancel" are not snackbar actions (snackbars page) and warn in dev.
     */
    action?: string
    /** The two-line handset form: 80 dp, the message wrapping to a second line. */
    multiline?: boolean
    /** Tablet and desktop placement: centred on the bottom edge, or 24 dp in from the start and bottom edges. */
    align?: QuSnackbarAlign
    /**
     * Auto-dismiss in ms for a snackbar driven by `v-model`. The guidelines
     * give no duration; 6000 ms is Quantum's default (Vuetify 1.5's). Inside
     * `QuSnackbar.Queue` the queue's `timeout` applies instead.
     */
    timeout?: number
  }

  /** Wider than this, the action of a two-line snackbar moves to its own row (the 112 dp form). */
  const INLINE = 128

  /** The custom property `QuFab` adds to its bottom inset, so the button rides above the snackbar. */
  const HEIGHT = '--quantum-snackbar-height'
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuSnackbar' })

  defineSlots<{
    /** The message: a short line directly related to the operation, no icons. */
    default?: () => any
  }>()

  const emit = defineEmits<{
    /** The action was chosen; the snackbar is on its way out. */
    action: []
  }>()

  const {
    id: _id,
    namespace: _namespace,
    action,
    multiline = false,
    align = 'center',
    timeout = 6000,
  } = defineProps<QuSnackbarProps>()

  /** Shown or not, when the snackbar is not inside a `QuSnackbar.Queue`. Mounting it unbound shows it once. */
  const model = defineModel<boolean>({ default: true })

  const portal = useQuSnackbarPortal()
  const queue = useQuSnackbarQueue()
  const locale = useLocale()
  const logger = useLogger()

  orphan('QuSnackbar', portal)

  const namespace = _namespace ?? portal?.namespace.value ?? QU_SNACKBAR_NAMESPACE
  const fallback = useId()
  const id = toRef(() => _id ?? queue?.id.value ?? fallback)

  // v0's queue part owns dismissal when there is one: it removes the notification.
  const notifications = useSnackbarQueueContext(namespace, null)

  const present = toRef(() => queue ? queue.present.value : model.value)

  const { state, isMounted, done } = usePresence({ present, immediate: false })

  const root = useTemplateRef<ComponentPublicInstance>('root')
  const el = toRef(() => toElement(root.value) ?? null)

  const width = shallowRef(0)
  const stacked = toRef(() => multiline && width.value > INLINE)

  function measure () {
    // QuButton renders a fragment (Button.Root plus its optional hidden input), so the action is found, not ref'd.
    const node = el.value?.querySelector<HTMLElement>('.quantum-snackbar__action')

    width.value = node?.offsetWidth ?? 0

    publish()
  }

  // A frame later: measuring flips `stacked`, which resizes the observed root inside its own callback.
  const remeasure = useRaf(measure)

  useResizeObserver(el, remeasure)

  watch(() => action, () => nextTick(remeasure))

  /*
   * The height a visible snackbar takes from the bottom edge, published on the
   * element that holds the portal (the body, or a docs screen) so a QuFab under
   * it moves up instead of being covered (snackbars page).
   */
  let host: HTMLElement | null = null

  function publish () {
    const node = el.value

    if (state.value !== 'present' || !isElement(node)) return

    host = node.closest('.quantum-snackbar-portal')?.parentElement ?? null
    host?.style.setProperty(HEIGHT, `${(node as HTMLElement).offsetHeight}px`)
  }

  function retract () {
    host?.style.removeProperty(HEIGHT)
    host = null
  }

  // Standalone timing; a queued snackbar is timed by the notifications queue.
  const timer = useTimer(() => {
    model.value = false
  }, { duration: () => timeout })

  /*
   * A leave that never sees its animationend (a hidden host, no animations)
   * must still finish, or a queue would wait forever for the next snackbar.
   */
  const safety = useTimer(done, { duration: 400 })

  watch(state, (value, prev) => {
    if (value === 'present') {
      nextTick(publish)

      if (!queue && timeout > 0) timer.start()
    } else if (value === 'leaving') {
      retract()
      timer.stop()
      safety.start()
    } else if (value === 'unmounted' && prev === 'leaving') {
      safety.stop()
      queue?.settle()
    }
  })

  onBeforeUnmount(retract)

  const reasons = new Set<string>()

  function hold (reason: string) {
    if (queue) return

    reasons.add(reason)
    timer.pause()
  }

  function release (reason: string) {
    if (queue || !reasons.delete(reason) || reasons.size > 0) return

    timer.resume()
  }

  function onMouseenter () {
    hold('hover')
  }

  function onMouseleave () {
    release('hover')
  }

  function onFocusin () {
    hold('focus')
  }

  function onFocusout (event: FocusEvent) {
    const node = el.value

    if (isElement(node) && isElement(event.relatedTarget) && node.contains(event.relatedTarget)) return

    release('focus')
  }

  function onAnimationend (event: AnimationEvent) {
    if (event.target !== event.currentTarget || state.value !== 'leaving') return

    done()
  }

  function onAction () {
    emit('action')

    if (queue) notifications?.dismiss(id.value)
    else model.value = false
  }

  if (__DEV__) {
    watch(() => action, label => {
      if (!isString(label)) return

      const refused = [
        locale.ti('Quantum.dismiss') ?? 'Dismiss',
        locale.ti('Quantum.cancel') ?? 'Cancel',
        'Dismiss',
        'Cancel',
      ].map(word => word.toLowerCase())

      if (refused.includes(label.trim().toLowerCase())) {
        logger.warn(`[QuSnackbar] "${label}" is not a snackbar action (snackbars page): a snackbar dismisses itself, so leave \`action\` unset`)
      }
    }, { immediate: true })

    watch(() => !queue && timeout <= 0, wrong => {
      if (wrong) logger.warn('[QuSnackbar] snackbars are never persistent (snackbars page); `timeout` must be positive')
    }, { immediate: true })
  }
</script>

<template>
  <Snackbar.Root
    v-if="isMounted"
    :id
    ref="root"
    class="quantum-snackbar"
    :data-align="align"
    :data-multiline="multiline || undefined"
    :data-stacked="stacked || undefined"
    :data-state="state"
    :namespace
    @animationend="onAnimationend"
    @focusin="onFocusin"
    @focusout="onFocusout"
    @mouseenter="onMouseenter"
    @mouseleave="onMouseleave"
  >
    <Snackbar.Content as="span" class="quantum-snackbar__text">
      <slot />
    </Snackbar.Content>

    <template v-if="action">
      {{ ' ' }}
      <QuButton class="quantum-snackbar__action" @click="onAction">{{ action }}</QuButton>
    </template>
  </Snackbar.Root>
</template>

<!-- Unscoped: the root renders through v0's Snackbar.Root and Atom, where a scoped data-v never lands. -->
<style>
  /* Handset form: full width, square, flush with the bottom edge. */
  .quantum-snackbar {
    position: relative;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    height: 48px;
    margin: 0;
    padding: 14px var(--quantum-spacing-3, 24px);
    border-radius: 0;
    background: var(--quantum-snackbar, #323232);
    color: var(--quantum-snackbar-text, #FFFFFF);
    box-shadow: var(--quantum-elevation-6, 0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12));
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    pointer-events: auto;
  }

  /* Entrance: upward from the bottom edge, decelerating. Exit: downward, accelerating (motion page). */
  .quantum-snackbar[data-state='mounted'],
  .quantum-snackbar[data-state='present'] {
    animation: quantum-snackbar-enter var(--quantum-duration-enter, 225ms) var(--quantum-easing-decelerate, cubic-bezier(0, 0, 0.2, 1)) both;
  }

  .quantum-snackbar[data-state='leaving'] {
    animation: quantum-snackbar-leave var(--quantum-duration-leave, 195ms) var(--quantum-easing-accelerate, cubic-bezier(0.4, 0, 1, 1)) forwards;
  }

  /* The message: Body 1, one line, cut with an ellipsis rather than growing the bar. */
  .quantum-snackbar__text {
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    font-size: var(--quantum-type-body-1-size, 14px);
    font-weight: var(--quantum-type-body-1-weight, 400);
    line-height: var(--quantum-type-body-1-leading, 20px);
    letter-spacing: var(--quantum-type-body-1-tracking, 0.01em);
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /*
   * The action: a flat QuButton in the accent. Its 8 dp side padding is pulled
   * out of the layout so the label sits 24 dp from the edge and 24 dp from the
   * message (16 dp margin plus 8 dp padding; 40 plus 8 for the 48 dp desktop
   * gap); it never grows the 48 dp bar.
   */
  .quantum-snackbar .quantum-snackbar__action {
    flex: none;
    min-width: 0;
    margin-block: -8px;
    margin-inline: var(--quantum-spacing-2, 16px) calc(-1 * var(--quantum-spacing-1, 8px));
    padding: 0 var(--quantum-spacing-1, 8px);
    color: var(--quantum-accent, #FF4081);
  }

  /* Two lines: 80 dp, the 20 dp line pitch centred between 24 dp paddings. */
  .quantum-snackbar[data-multiline] {
    height: 80px;
    padding-block: var(--quantum-spacing-3, 24px);
  }

  .quantum-snackbar[data-multiline] .quantum-snackbar__text {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    white-space: normal;
  }

  /*
   * A long action under two lines of text takes its own row: 112 dp, 24 dp
   * above the message, the action at the end with its label 14 dp off the
   * bottom edge. The action is pinned to the bottom, so a one-line message
   * keeps that 14 dp instead of leaving the slack under the button; two lines
   * (24 + 40 + 12 + 36) fill the 112 dp exactly.
   */
  .quantum-snackbar[data-stacked] {
    flex-direction: column;
    align-items: stretch;
    height: 112px;
    padding: var(--quantum-spacing-3, 24px) var(--quantum-spacing-3, 24px) 0;
  }

  .quantum-snackbar[data-stacked] .quantum-snackbar__text {
    flex: none;
  }

  .quantum-snackbar[data-stacked] .quantum-snackbar__action {
    align-self: flex-end;
    margin: auto calc(-1 * var(--quantum-spacing-1, 8px)) 0 0;
  }

  /* Tablet and desktop: 288 to 568 dp wide, 2 dp corners, centred or 24 dp in from the start and bottom edges. */
  @media (min-width: 600px) {
    .quantum-snackbar {
      align-self: center;
      width: auto;
      min-width: 288px;
      max-width: 568px;
      border-radius: var(--quantum-radius, 2px);
    }

    .quantum-snackbar[data-align='start'] {
      align-self: flex-start;
      margin-inline-start: var(--quantum-spacing-3, 24px);
      margin-bottom: var(--quantum-spacing-3, 24px);
    }

    .quantum-snackbar[data-align='start'][data-state='mounted'],
    .quantum-snackbar[data-align='start'][data-state='present'] {
      animation-name: quantum-snackbar-enter-inset;
    }

    .quantum-snackbar[data-align='start'][data-state='leaving'] {
      animation-name: quantum-snackbar-leave-inset;
    }

    .quantum-snackbar .quantum-snackbar__action {
      margin-inline-start: var(--quantum-spacing-5, 40px);
    }

    .quantum-snackbar[data-stacked] .quantum-snackbar__action {
      margin-inline-start: 0;
    }
  }

  /* Desktop resting elevations sit 2 dp lower (elevation page). */
  @media (pointer: fine) {
    .quantum-snackbar {
      box-shadow: var(--quantum-elevation-4, 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12));
    }
  }

  /* Reduced motion keeps the animation events (the queue waits on them) and drops the travel. */
  body[data-reduced-motion='reduce'] .quantum-snackbar {
    animation-duration: 1ms;
  }

  @media (prefers-reduced-motion: reduce) {
    body:not([data-reduced-motion='no-preference']) .quantum-snackbar {
      animation-duration: 1ms;
    }
  }

  @keyframes quantum-snackbar-enter {
    from { transform: translateY(100%); }
    to { transform: none; }
  }

  @keyframes quantum-snackbar-leave {
    from { transform: none; }
    to { transform: translateY(100%); }
  }

  @keyframes quantum-snackbar-enter-inset {
    from { transform: translateY(calc(100% + var(--quantum-spacing-3, 24px))); }
    to { transform: none; }
  }

  @keyframes quantum-snackbar-leave-inset {
    from { transform: none; }
    to { transform: translateY(calc(100% + var(--quantum-spacing-3, 24px))); }
  }
</style>
