<script lang="ts">
  // Framework
  import {
    createContext,
    createTourContext,
    isNull,
    Portal,
    toElement,
    Tour,
    useClickOutside,
    useId,
    useLogger,
    useMediaQuery,
    usePresence,
    useRaf,
  } from '@vuetify/v0'

  // Utilities
  import { shallowRef, toRef, useTemplateRef, watch } from 'vue'

  // Types
  import type { TourPlacement } from '@vuetify/v0'
  import type { CSSProperties, Ref } from 'vue'

  // Components
  import QuRipple from '../QuRipple/QuRipple.vue'

  /** The two prompt colours of the feature discovery page's figures. */
  export type QuFeatureDiscoveryColor = 'primary' | 'accent'

  /** The inline side the background moves 20 dp toward, by writing direction. */
  export type QuFeatureDiscoveryPlacement = 'start' | 'end'

  /** Where the background sits: offset toward a side, or centred on the target by an edge rule. */
  export type QuFeatureDiscoverySide = QuFeatureDiscoveryPlacement | 'center'

  export interface QuFeatureDiscoveryContext {
    /** The tour namespace every v0 `Tour` part of this prompt reads. */
    namespace: string
    /** The prompt's single step id. */
    step: string
    color: Readonly<Ref<QuFeatureDiscoveryColor>>
    /** The prompt is showing (the tour is active). */
    isOpen: Readonly<Ref<boolean>>
    /** The circles are mounted: open, or animating out. */
    isShown: Readonly<Ref<boolean>>
    /** The z-index of the circles; the promoted action is lifted one above it. */
    depth: Readonly<Ref<number>>
    /** The element inside `Tour.Content` that `Title` and `Text` render into. */
    body: Readonly<Ref<HTMLElement | null>>
    /** Mark the prompt complete: the promoted action was tapped. */
    complete: () => void
  }

  export interface QuFeatureDiscoveryProps {
    /** `primary` (the page's default) or `accent`, the figures' alternative. */
    color?: QuFeatureDiscoveryColor
    /**
     * Limit the prompt to the surface the target rests on (the closest
     * `QuCard`, else the Target's parent): the desktop and tablet rule. Unset,
     * it applies from 600 px up whenever the target sits on a card.
     */
    contained?: boolean
    /**
     * Force the side the background moves 20 dp toward. Unset, it is the side
     * away from the nearer screen edge, and the writing direction's end for a
     * centred target. The edge rules that centre the background still win.
     */
    placement?: QuFeatureDiscoveryPlacement
  }

  export interface QuFeatureDiscoveryEmits {
    /** The promoted action was tapped. */
    complete: []
    /** Dismissed by a tap outside the background or by Escape. */
    dismiss: []
  }

  interface Area {
    left: number
    top: number
    right: number
    bottom: number
    width: number
    height: number
  }

  interface Geometry {
    /** Target centre, from the layer's origin. */
    x: number
    y: number
    /** Target circle diameter. */
    size: number
    /** Background centre and radius. */
    cx: number
    cy: number
    radius: number
    side: QuFeatureDiscoverySide
    /** The prompt is clipped to its surface. */
    clipped: boolean
    clip: string | undefined
    /** Where `Tour.Content` sits against the target. */
    placement: TourPlacement
    /** `Tour.Content`'s gap from the target, clearing the target circle. */
    offset: number
    /** Horizontal nudge that keeps the text inside the screen, or inside the surface it is limited to. */
    shift: number
  }

  /** Target circle diameter: the page's own 88 dp edge threshold (decision, low). */
  const TARGET = 88
  /** Background diameter against the target's (decision, low). */
  const SCALE = 2.5
  /** Mobile edge band and surface edge band (feature discovery page). */
  const EDGE = 88
  /** The background's offset from the target (feature discovery page). */
  const SHIFT = 20
  /** Desktop and tablet screen edge bands (feature discovery page). */
  const BAND_Y = 144
  const BAND_X = 200
  /** A surface below both is small: the prompt extends past its edges (feature discovery page). */
  const SMALL_HEIGHT = 280
  const SMALL_WIDTH = 360
  /** Room kept between the text and the background's edge: one step of the 8 dp grid. */
  const PADDING = 8

  const [useQuFeatureDiscovery, provideQuFeatureDiscovery] = createContext<QuFeatureDiscoveryContext | null>('quantum:feature-discovery', null)

  export { useQuFeatureDiscovery }

  /**
   * Parts read the root through the optional context, so a part placed outside
   * `QuFeatureDiscovery` renders inert instead of throwing on v0's account; the
   * warning says why nothing happens.
   */
  export function orphan (part: string, context: QuFeatureDiscoveryContext | null) {
    if (__DEV__ && isNull(context)) {
      useLogger().warn(`[${part}] rendered outside <QuFeatureDiscovery>; its state is inert`)
    }
  }

  function relative (rect: DOMRect, origin: DOMRect): Area {
    const left = rect.left - origin.left
    const top = rect.top - origin.top

    return { left, top, right: left + rect.width, bottom: top + rect.height, width: rect.width, height: rect.height }
  }

  function same (a: Geometry | null, b: Geometry): boolean {
    if (isNull(a)) return false

    for (const key of Object.keys(b) as (keyof Geometry)[]) {
      if (a[key] !== b[key]) return false
    }

    return true
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuFeatureDiscovery' })

  defineSlots<{
    /** The Target around the promoted action, then the Title and Text. */
    default?: () => any
  }>()

  const emit = defineEmits<QuFeatureDiscoveryEmits & {
    'update:model-value': [value: boolean]
  }>()

  const {
    color = 'primary',
    contained = undefined,
    placement = undefined,
  } = defineProps<QuFeatureDiscoveryProps>()

  const open = defineModel<boolean>({ default: false })

  // One tour per prompt: two prompts on a page never share a step or an anchor name.
  const id = useId().replace(/[^\w-]/g, '')
  const namespace = `quantum:feature-discovery:${id}`
  const step = `quantum-feature-discovery-${id}`

  const [, provideTour, tour] = createTourContext({ namespace })

  provideTour()

  tour.steps.onboard([{ id: step }])

  const presence = usePresence({
    present: () => tour.isActive.value,
    immediate: false,
  })

  const wide = useMediaQuery('(min-width: 600px)')

  const layer = useTemplateRef<HTMLElement>('layer')
  const background = useTemplateRef<HTMLElement>('background')
  const disc = useTemplateRef<HTMLElement>('disc')
  const body = useTemplateRef<HTMLElement>('body')

  const geometry = shallowRef<Geometry | null>(null)
  const depth = shallowRef(0)
  const exit = shallowRef<'complete' | 'dismiss'>('dismiss')

  function activator (): HTMLElement | undefined {
    const el = toElement(tour.activators.get(step)?.element)

    return el instanceof HTMLElement ? el : undefined
  }

  function surface (target: HTMLElement): Element | null {
    const confine = contained ?? wide.matches.value

    if (!confine) return null

    return target.closest('.quantum-card') ?? (contained === true ? target.parentElement : null)
  }

  function measure () {
    const el = layer.value
    const target = activator()

    if (!el || !target) return

    depth.value = Number.parseInt(el.style.zIndex) || 0

    // The layer is fixed at inset 0, so its box is the containing block the
    // circles are drawn in: the viewport, or a contained screen (the docs frame).
    const screen = el.getBoundingClientRect()
    const action = relative(target.getBoundingClientRect(), screen)
    const size = Math.max(TARGET, Math.ceil(Math.hypot(action.width, action.height)))
    const x = action.left + action.width / 2
    const y = action.top + action.height / 2
    const rtl = getComputedStyle(target).direction === 'rtl'
    const view: Area = { left: 0, top: 0, right: screen.width, bottom: screen.height, width: screen.width, height: screen.height }
    const host = surface(target)

    let area = view
    let centred = false
    let clipped = false

    if (host) {
      const box = relative(host.getBoundingClientRect(), screen)
      const small = box.height < SMALL_HEIGHT && box.width < SMALL_WIDTH
      const banded = action.top < BAND_Y
        || view.bottom - action.bottom < BAND_Y
        || action.left < BAND_X
        || view.right - action.right < BAND_X

      if (banded) {
        // Near the screen edge the background centres on the target, above other elements.
        centred = true
      } else if (!small) {
        area = box
        clipped = true
        centred = action.top - box.top < EDGE
          || box.bottom - action.bottom < EDGE
          || action.left - box.left < EDGE
          || box.right - action.right < EDGE
      }
    } else {
      centred = action.top < EDGE || view.bottom - action.bottom < EDGE
    }

    let side: QuFeatureDiscoverySide = 'center'

    if (!centred) {
      const middle = area.left + area.width / 2

      if (placement) {
        side = placement
      } else if (action.left <= middle && middle <= action.right) {
        side = 'end'
      } else {
        side = (x > middle) === rtl ? 'end' : 'start'
      }
    }

    const sign = side === 'start' ? -1 : (side === 'end' ? 1 : 0)
    const cx = x + sign * (rtl ? -SHIFT : SHIFT)
    const cy = y

    let radius = (size * SCALE) / 2

    // The text stays inside the screen, or the surface it is limited to, and
    // the background always holds it: white ink off the background is unreadable.
    const content = body.value?.parentElement

    let shift = 0

    if (content) {
      const box = relative(content.getBoundingClientRect(), screen)

      if (box.width > 0 && box.height > 0) {
        const left = box.left - (geometry.value?.shift ?? 0)
        const min = area.left + 16
        const max = area.right - 16 - box.width

        shift = Math.round(max < min ? min - left : Math.min(Math.max(left, min), max) - left)

        const from = left + shift
        const to = from + box.width

        for (const [px, py] of [[from, box.top], [to, box.top], [from, box.bottom], [to, box.bottom]] as const) {
          radius = Math.max(radius, Math.ceil(Math.hypot(px - cx, py - cy)) + PADDING)
        }
      }
    }

    const next: Geometry = {
      x,
      y,
      size,
      cx,
      cy,
      radius,
      side,
      clipped,
      clip: clipped ? `inset(${area.top}px ${view.right - area.right}px ${view.bottom - area.bottom}px ${area.left}px)` : undefined,
      placement: y < area.top + area.height / 2 ? 'bottom' : 'top',
      offset: Math.max(16, Math.ceil((size - action.height) / 2) + PADDING),
      shift,
    }

    if (!same(geometry.value, next)) geometry.value = next
  }

  const loop = useRaf(() => {
    measure()

    if (tour.isActive.value) loop()
  })

  watch(() => presence.isMounted.value && tour.isActive.value, active => {
    if (active) {
      loop()

      return
    }

    loop.cancel()
  }, { immediate: true })

  watch(() => presence.isMounted.value, mounted => {
    if (!mounted) geometry.value = null
  })

  watch(open, value => {
    if (value) tour.start()
    else tour.stop()
  }, { immediate: true })

  watch(() => tour.isActive.value, active => {
    if (active) return

    exit.value = tour.isComplete.value ? 'complete' : 'dismiss'

    // Closed by the model: the consumer already knows, so no event.
    if (!open.value) return

    open.value = false

    if (exit.value === 'complete') emit('complete')
    else emit('dismiss')
  })

  function complete () {
    if (!tour.isActive.value) return

    void tour.complete()
  }

  function onOutside () {
    if (tour.isActive.value) tour.stop()
  }

  // A tap outside the background dismisses (feature discovery page); the target,
  // the action and the text are inside it.
  useClickOutside([background, disc, activator, () => body.value?.parentElement], onOutside)

  // The target circle is the tap target: a tap on it is a tap on the action.
  function onDisc () {
    const target = activator()
    const control = target?.querySelector<HTMLElement>('button, a[href], [role="button"]') ?? target

    control?.click()
  }

  function onEnd (event: AnimationEvent) {
    if (event.target === event.currentTarget && presence.isLeaving.value) presence.done()
  }

  provideQuFeatureDiscovery({
    namespace,
    step,
    color: toRef(() => color),
    isOpen: toRef(() => tour.isActive.value),
    isShown: toRef(() => presence.isMounted.value),
    depth,
    body,
    complete,
  })

  const disk = toRef((): CSSProperties | undefined => {
    const shape = geometry.value

    if (isNull(shape)) return undefined

    return {
      left: `${shape.x - shape.size / 2}px`,
      top: `${shape.y - shape.size / 2}px`,
      width: `${shape.size}px`,
      height: `${shape.size}px`,
    }
  })

  const field = toRef((): CSSProperties => {
    const shape = geometry.value

    if (isNull(shape)) return { visibility: 'hidden' }

    // The background grows out of the promoted icon (feature discovery page, motion).
    return {
      left: `${shape.cx - shape.radius}px`,
      top: `${shape.cy - shape.radius}px`,
      width: `${shape.radius * 2}px`,
      height: `${shape.radius * 2}px`,
      transformOrigin: `${shape.x - shape.cx + shape.radius}px ${shape.y - shape.cy + shape.radius}px`,
    }
  })

  const side = toRef(() => geometry.value?.side)
  const clip = toRef(() => geometry.value?.clip)
  const offset = toRef(() => geometry.value?.offset ?? 16)
  const where = toRef((): TourPlacement => geometry.value?.placement ?? 'bottom')
  // v0 owns the content's position; `translate` is the one positioning property it leaves free.
  const nudge = toRef((): CSSProperties | undefined => geometry.value?.shift ? { translate: `${geometry.value.shift}px 0` } : undefined)
</script>

<template>
  <Tour.Root :namespace :step>
    <slot />

    <Portal
      v-if="presence.isMounted.value"
      v-slot="{ zIndex }"
      disabled
      :promote="0"
      :scrim="false"
    >
      <div
        ref="layer"
        class="quantum-feature-discovery"
        :data-color="color"
        :data-contained="geometry?.clipped || undefined"
        :data-exit="exit"
        :data-open="tour.isActive.value || undefined"
        :data-placement="side"
        :data-state="presence.state.value"
        :style="{ zIndex, clipPath: clip }"
      >
        <div
          ref="background"
          aria-hidden="true"
          class="quantum-feature-discovery__background"
          :style="field"
          @animationend="onEnd"
        />

        <div
          v-if="disk"
          ref="disc"
          aria-hidden="true"
          class="quantum-feature-discovery__target"
          :style="disk"
          @click="onDisc"
        >
          <QuRipple center />
        </div>
      </div>
    </Portal>

    <Tour.Content
      class="quantum-feature-discovery__content"
      :data-color="color"
      :namespace
      :offset
      :placement="where"
      :style="nudge"
    >
      <div ref="body" class="quantum-feature-discovery__body" />
    </Tour.Content>
  </Tour.Root>
</template>

<!-- Unscoped: the layer and the content are rendered through v0 parts a scoped data-v never reaches. -->
<style>
  /* The screen the prompt is drawn on: fixed at inset 0, it takes no taps itself. */
  .quantum-feature-discovery {
    position: fixed;
    inset: 0;
    pointer-events: none;
  }

  /* The background: the prompt colour at the page's 96% opacity, a circle around the target. */
  .quantum-feature-discovery__background {
    position: absolute;
    box-sizing: border-box;
    border-radius: 50%;
    background: rgb(var(--quantum-primary-channels, 63 81 181) / 0.96);
    pointer-events: auto;
    animation: quantum-feature-discovery-appear var(--quantum-duration-enter, 225ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)) both;
  }

  .quantum-feature-discovery[data-color='accent'] .quantum-feature-discovery__background {
    background: rgb(var(--quantum-accent-channels, 255 64 129) / 0.96);
  }

  /*
   * The target: a light disc under the promoted action, which is lifted above it.
   * The page states no colour; its figures show a light disc (decision, low).
   * The ring is the touch ripple the idle pulse sends out at its largest size.
   */
  .quantum-feature-discovery__target {
    position: absolute;
    box-sizing: border-box;
    border-radius: 50%;
    background: var(--quantum-white, #FFFFFF);
    cursor: pointer;
    pointer-events: auto;
    animation: quantum-feature-discovery-appear var(--quantum-duration-enter, 225ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)) both;
  }

  .quantum-feature-discovery__target::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: var(--quantum-white, #FFFFFF);
    opacity: 0;
    pointer-events: none;
  }

  .quantum-feature-discovery[data-state='present'] .quantum-feature-discovery__target::after {
    animation: quantum-feature-discovery-ripple 2s var(--quantum-easing-decelerate, cubic-bezier(0, 0, 0.2, 1)) infinite;
  }

  /* Tap on the action: the prompt expands, then fades, with an ease out. */
  .quantum-feature-discovery[data-state='leaving'][data-exit='complete'] .quantum-feature-discovery__background,
  .quantum-feature-discovery[data-state='leaving'][data-exit='complete'] .quantum-feature-discovery__target {
    animation: quantum-feature-discovery-complete var(--quantum-duration-leave, 195ms) var(--quantum-easing-decelerate, cubic-bezier(0, 0, 0.2, 1)) both;
  }

  /* Tap outside: the prompt shrinks and fades, with an ease out. */
  .quantum-feature-discovery[data-state='leaving'][data-exit='dismiss'] .quantum-feature-discovery__background,
  .quantum-feature-discovery[data-state='leaving'][data-exit='dismiss'] .quantum-feature-discovery__target {
    animation: quantum-feature-discovery-dismiss var(--quantum-duration-leave, 195ms) var(--quantum-easing-decelerate, cubic-bezier(0, 0, 0.2, 1)) both;
  }

  /* The text: Title 20 sp white and Subheading 16 sp white at 70% over the background (decision, low). */
  .quantum-feature-discovery__content {
    margin: 0;
    padding: 0;
    border: 0;
    outline: none;
    background: transparent;
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    color: var(--quantum-on-primary, #FFFFFF);
    animation: quantum-feature-discovery-fade var(--quantum-duration-enter, 225ms) var(--quantum-easing-decelerate, cubic-bezier(0, 0, 0.2, 1)) both;
  }

  .quantum-feature-discovery__content[data-color='accent'] {
    color: var(--quantum-on-accent, #FFFFFF);
  }

  .quantum-feature-discovery__body {
    display: flex;
    flex-direction: column;
    gap: var(--quantum-spacing-1, 8px);
    max-width: 280px;
  }

  @keyframes quantum-feature-discovery-appear {
    from {
      transform: scale(0);
      opacity: 0;
    }

    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes quantum-feature-discovery-complete {
    from {
      transform: scale(1);
      opacity: 1;
    }

    50% {
      transform: scale(1.15);
      opacity: 1;
    }

    to {
      transform: scale(1.3);
      opacity: 0;
    }
  }

  @keyframes quantum-feature-discovery-dismiss {
    from {
      transform: scale(1);
      opacity: 1;
    }

    to {
      transform: scale(0);
      opacity: 0;
    }
  }

  @keyframes quantum-feature-discovery-fade {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  @keyframes quantum-feature-discovery-vanish {
    from {
      opacity: 1;
    }

    to {
      opacity: 0;
    }
  }

  /* The ripple leaves the target as the pulse peaks, halfway through each 2 s cycle. */
  @keyframes quantum-feature-discovery-ripple {
    0%,
    50% {
      transform: scale(1);
      opacity: 0;
    }

    55% {
      opacity: 0.5;
    }

    to {
      transform: scale(1.6);
      opacity: 0;
    }
  }

  /*
   * Reduced motion: no pulse, no ripple, no scaling. The prompt still fades in
   * and out, so the leave keeps an animationend to unmount on.
   */
  body[data-reduced-motion='reduce'] .quantum-feature-discovery__background,
  body[data-reduced-motion='reduce'] .quantum-feature-discovery__target {
    animation-name: quantum-feature-discovery-fade;
  }

  body[data-reduced-motion='reduce'] .quantum-feature-discovery[data-state='leaving'] .quantum-feature-discovery__background,
  body[data-reduced-motion='reduce'] .quantum-feature-discovery[data-state='leaving'] .quantum-feature-discovery__target {
    animation-name: quantum-feature-discovery-vanish;
  }

  body[data-reduced-motion='reduce'] .quantum-feature-discovery__target::after {
    animation: none !important;
  }

  @media (prefers-reduced-motion: reduce) {
    body:not([data-reduced-motion='no-preference']) .quantum-feature-discovery__background,
    body:not([data-reduced-motion='no-preference']) .quantum-feature-discovery__target {
      animation-name: quantum-feature-discovery-fade;
    }

    body:not([data-reduced-motion='no-preference']) .quantum-feature-discovery[data-state='leaving'] .quantum-feature-discovery__background,
    body:not([data-reduced-motion='no-preference']) .quantum-feature-discovery[data-state='leaving'] .quantum-feature-discovery__target {
      animation-name: quantum-feature-discovery-vanish;
    }

    body:not([data-reduced-motion='no-preference']) .quantum-feature-discovery__target::after {
      animation: none !important;
    }
  }
</style>
