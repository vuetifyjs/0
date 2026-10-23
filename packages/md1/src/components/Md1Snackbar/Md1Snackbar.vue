<script lang="ts">
  // Framework
  import { isElement, isString, Snackbar, toElement, useId, useLocale, useLogger, usePresence, useRaf, useResizeObserver, useSnackbarQueueContext, useTimer } from '@vuetify/v0'

  // Context
  import { orphan, MD1_SNACKBAR_NAMESPACE, useMd1SnackbarPortal } from './Md1SnackbarPortal.vue'
  import { useMd1SnackbarQueue } from './Md1SnackbarQueue.vue'

  // Utilities
  import { nextTick, onBeforeUnmount, shallowRef, toRef, useTemplateRef, watch } from 'vue'

  // Types
  import type { SnackbarRootProps } from '@vuetify/v0'
  import type { ComponentPublicInstance } from 'vue'

  // Components
  import Md1Button from '../Md1Button/Md1Button.vue'

  /** Where the tablet and desktop snackbar sits; handsets are always full width. */
  export type Md1SnackbarAlign = 'center' | 'start'

  /**
   * Material Design 1 withholds `urgent`, `as` and `renderless` from v0's root: the
   * snackbars page names no urgency level and critical errors never go in a
   * snackbar, so the root is always `role="status"`.
   */
  export interface Md1SnackbarProps extends Pick<SnackbarRootProps, 'id' | 'namespace'> {
    /**
     * The one text action, sentence case (the stylesheet capitalises it).
     * Choosing it emits `action` and dismisses the snackbar. "Dismiss" and
     * "Cancel" are not snackbar actions (snackbars page) and warn in dev.
     */
    action?: string
    /** The two-line handset form: 80 dp, the message wrapping to a second line. */
    multiline?: boolean
    /** Tablet and desktop placement: centred on the bottom edge, or 24 dp in from the start and bottom edges. */
    align?: Md1SnackbarAlign
    /**
     * Auto-dismiss in ms for a snackbar driven by `v-model`. The guidelines
     * give no duration; 6000 ms is Material Design 1's default (Vuetify 1.5's). Inside
     * `Md1Snackbar.Queue` the queue's `timeout` applies instead.
     */
    timeout?: number
  }

  /** Wider than this, the action of a two-line snackbar moves to its own row (the 112 dp form). */
  const INLINE = 128

  /** The custom property `Md1Fab` adds to its bottom inset, so the button rides above the snackbar. */
  const HEIGHT = '--md1-snackbar-height'
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1Snackbar' })

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
  } = defineProps<Md1SnackbarProps>()

  /** Shown or not, when the snackbar is not inside an `Md1Snackbar.Queue`. Mounting it unbound shows it once. */
  const model = defineModel<boolean>({ default: true })

  const portal = useMd1SnackbarPortal()
  const queue = useMd1SnackbarQueue()
  const locale = useLocale()
  const logger = useLogger()

  orphan('Md1Snackbar', portal)

  const namespace = _namespace ?? portal?.namespace.value ?? MD1_SNACKBAR_NAMESPACE
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
    // Md1Button renders a fragment (Button.Root plus its optional hidden input), so the action is found, not ref'd.
    const node = el.value?.querySelector<HTMLElement>('.md1-snackbar__action')

    width.value = node?.offsetWidth ?? 0

    publish()
  }

  // A frame later: measuring flips `stacked`, which resizes the observed root inside its own callback.
  const remeasure = useRaf(measure)

  useResizeObserver(el, remeasure)

  watch(() => action, () => nextTick(remeasure))

  /*
   * The height a visible snackbar takes from the bottom edge, published on the
   * element that holds the portal (the body, or a docs screen) so an Md1Fab under
   * it moves up instead of being covered (snackbars page).
   */
  let host: HTMLElement | null = null

  function publish () {
    const node = el.value

    if (state.value !== 'present' || !isElement(node)) return

    host = node.closest('.md1-snackbar-portal')?.parentElement ?? null
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
        locale.ti('Md1.dismiss') ?? 'Dismiss',
        locale.ti('Md1.cancel') ?? 'Cancel',
        'Dismiss',
        'Cancel',
      ].map(word => word.toLowerCase())

      if (refused.includes(label.trim().toLowerCase())) {
        logger.warn(`[Md1Snackbar] "${label}" is not a snackbar action (snackbars page): a snackbar dismisses itself, so leave \`action\` unset`)
      }
    }, { immediate: true })

    watch(() => !queue && timeout <= 0, wrong => {
      if (wrong) logger.warn('[Md1Snackbar] snackbars are never persistent (snackbars page); `timeout` must be positive')
    }, { immediate: true })
  }
</script>

<template>
  <Snackbar.Root
    v-if="isMounted"
    :id
    ref="root"
    class="md1-snackbar"
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
    <Snackbar.Content as="span" class="md1-snackbar__text">
      <slot />
    </Snackbar.Content>

    <template v-if="action">
      {{ ' ' }}
      <Md1Button class="md1-snackbar__action" @click="onAction">{{ action }}</Md1Button>
    </template>
  </Snackbar.Root>
</template>

<!-- Unscoped: the root renders through v0's Snackbar.Root and Atom, where a scoped data-v never lands. -->
<style>
  /* Handset form: full width, square, flush with the bottom edge. */
  .md1-snackbar {
    position: relative;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    height: 48px;
    margin: 0;
    padding: 14px var(--md1-spacing-3, 24px);
    border-radius: 0;
    background: var(--md1-snackbar, #323232);
    color: var(--md1-snackbar-text, #FFFFFF);
    box-shadow: var(--md1-elevation-6, 0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12));
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    pointer-events: auto;
  }

  /* Entrance: upward from the bottom edge, decelerating. Exit: downward, accelerating (motion page). */
  .md1-snackbar[data-state='mounted'],
  .md1-snackbar[data-state='present'] {
    animation: md1-snackbar-enter var(--md1-duration-enter, 225ms) var(--md1-easing-decelerate, cubic-bezier(0, 0, 0.2, 1)) both;
  }

  .md1-snackbar[data-state='leaving'] {
    animation: md1-snackbar-leave var(--md1-duration-leave, 195ms) var(--md1-easing-accelerate, cubic-bezier(0.4, 0, 1, 1)) forwards;
  }

  /* The message: Body 1, one line, cut with an ellipsis rather than growing the bar. */
  .md1-snackbar__text {
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    font-size: var(--md1-type-body-1-size, 14px);
    font-weight: var(--md1-type-body-1-weight, 400);
    line-height: var(--md1-type-body-1-leading, 20px);
    letter-spacing: var(--md1-type-body-1-tracking, 0.01em);
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /*
   * The action: a flat Md1Button in the accent. Its 8 dp side padding is pulled
   * out of the layout so the label sits 24 dp from the edge and 24 dp from the
   * message (16 dp margin plus 8 dp padding; 40 plus 8 for the 48 dp desktop
   * gap); it never grows the 48 dp bar.
   */
  .md1-snackbar .md1-snackbar__action {
    flex: none;
    min-width: 0;
    margin-block: -8px;
    margin-inline: var(--md1-spacing-2, 16px) calc(-1 * var(--md1-spacing-1, 8px));
    padding: 0 var(--md1-spacing-1, 8px);
    color: var(--md1-accent, #FF4081);
  }

  /* Two lines: 80 dp, the 20 dp line pitch centred between 24 dp paddings. */
  .md1-snackbar[data-multiline] {
    height: 80px;
    padding-block: var(--md1-spacing-3, 24px);
  }

  .md1-snackbar[data-multiline] .md1-snackbar__text {
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
  .md1-snackbar[data-stacked] {
    flex-direction: column;
    align-items: stretch;
    height: 112px;
    padding: var(--md1-spacing-3, 24px) var(--md1-spacing-3, 24px) 0;
  }

  .md1-snackbar[data-stacked] .md1-snackbar__text {
    flex: none;
  }

  .md1-snackbar[data-stacked] .md1-snackbar__action {
    align-self: flex-end;
    margin: auto calc(-1 * var(--md1-spacing-1, 8px)) 0 0;
  }

  /* Tablet and desktop: 288 to 568 dp wide, 2 dp corners, centred or 24 dp in from the start and bottom edges. */
  @media (min-width: 600px) {
    .md1-snackbar {
      align-self: center;
      width: auto;
      min-width: 288px;
      max-width: 568px;
      border-radius: var(--md1-radius, 2px);
    }

    .md1-snackbar[data-align='start'] {
      align-self: flex-start;
      margin-inline-start: var(--md1-spacing-3, 24px);
      margin-bottom: var(--md1-spacing-3, 24px);
    }

    .md1-snackbar[data-align='start'][data-state='mounted'],
    .md1-snackbar[data-align='start'][data-state='present'] {
      animation-name: md1-snackbar-enter-inset;
    }

    .md1-snackbar[data-align='start'][data-state='leaving'] {
      animation-name: md1-snackbar-leave-inset;
    }

    .md1-snackbar .md1-snackbar__action {
      margin-inline-start: var(--md1-spacing-5, 40px);
    }

    .md1-snackbar[data-stacked] .md1-snackbar__action {
      margin-inline-start: 0;
    }
  }

  /* Desktop resting elevations sit 2 dp lower (elevation page). */
  @media (pointer: fine) {
    .md1-snackbar {
      box-shadow: var(--md1-elevation-4, 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12));
    }
  }

  /* Reduced motion keeps the animation events (the queue waits on them) and drops the travel. */
  body[data-reduced-motion='reduce'] .md1-snackbar {
    animation-duration: 1ms;
  }

  @media (prefers-reduced-motion: reduce) {
    body:not([data-reduced-motion='no-preference']) .md1-snackbar {
      animation-duration: 1ms;
    }
  }

  @keyframes md1-snackbar-enter {
    from { transform: translateY(100%); }
    to { transform: none; }
  }

  @keyframes md1-snackbar-leave {
    from { transform: none; }
    to { transform: translateY(100%); }
  }

  @keyframes md1-snackbar-enter-inset {
    from { transform: translateY(calc(100% + var(--md1-spacing-3, 24px))); }
    to { transform: none; }
  }

  @keyframes md1-snackbar-leave-inset {
    from { transform: none; }
    to { transform: translateY(calc(100% + var(--md1-spacing-3, 24px))); }
  }
</style>
