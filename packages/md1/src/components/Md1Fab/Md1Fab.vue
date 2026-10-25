<script lang="ts">
  // Framework
  import { Button, createContext, createRegistry, isNull, Menu, useId, useLogger } from '@vuetify/v0'

  // Utilities
  import { toRef, useAttrs, useSlots, watch } from 'vue'

  // Types
  import type { Md1IconName } from '../../icons'
  import type { ButtonRootProps, ID } from '@vuetify/v0'
  import type { Ref } from 'vue'

  // Components
  import Md1Icon from '../Md1Icon/Md1Icon.vue'
  import Md1Ripple from '../Md1Ripple/Md1Ripple.vue'

  /**
   * Where the FAB rests. `end` and `start` fix it to the viewport at the
   * keyline margin (16 dp, 24 dp from 600 px); `seam` straddles the bottom
   * edge of the positioned host it sits in by half its height; `static` leaves
   * it in the flow.
   */
  export type Md1FabPosition = 'end' | 'start' | 'static' | 'seam'

  export interface Md1FabContext {
    /** The v0 injection key the dial's menu parts share. */
    namespace: Readonly<Ref<string | undefined>>
    /** Counts a mounted action for the page's speed dial size rule. */
    register: (id: ID) => void
    unregister: (id: ID) => void
    /** Reports a chosen action; the root emits `select`. */
    select: (value: unknown) => void
  }

  /**
   * Material Design 1 withholds every v0 button prop but `disabled` and `namespace`:
   * the floating action button page has no loading, readonly or passive
   * state, and the FAB carries no text and submits nothing, so `name` and
   * `form` have no surface either.
   */
  export interface Md1FabProps extends Pick<ButtonRootProps, 'disabled' | 'namespace'> {
    /** The 24 dp glyph in the circle, an Md1Icon role. */
    icon: Md1IconName
    /**
     * The accessible name. Needed on every FAB: it carries no text and its
     * glyph is aria-hidden, so without it the control has no name and Material Design 1
     * warns in dev. Optional at the type level only so templates can write
     * the attribute form, `aria-label`, which vue-tsc does not map to a
     * required camel-case prop.
     */
    ariaLabel?: string
    /**
     * The 40 dp FAB, for visual continuity with other screen elements. Forced
     * on at screen widths of 460 dp or less whatever the prop says.
     */
    mini?: boolean
    position?: Md1FabPosition
  }

  /**
   * The dial flies out above the FAB and spans toward the side its labels sit
   * on: the start side for a FAB at the end edge, the end side for one at the
   * start edge, so no label runs off the screen. Physical keywords, as SPEC.md
   * states them, because a JS positioning adapter normalises only those; the
   * inline flip in `TRY` mirrors the dial under `dir="rtl"`, where the end
   * edge is the left one.
   */
  const AREA = {
    end: 'top span-left',
    start: 'top span-right',
    static: 'top span-left',
    seam: 'top span-left',
  } as const satisfies Record<Md1FabPosition, string>

  const TRY = 'flip-inline, flip-block, flip-block flip-inline'

  const [useMd1Fab, provideMd1Fab] = /* @__PURE__ */ createContext<Md1FabContext | null>('md1:fab', null)

  export { useMd1Fab }

  /** Dev warning for a part rendered outside the FAB; the part then renders nothing. */
  export function orphan (part: string, context: Md1FabContext | null): void {
    if (__DEV__ && isNull(context)) useLogger().warn(`[${part}] rendered outside <Md1Fab>; its state is inert`)
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1Fab', inheritAttrs: false })

  defineSlots<{
    /** `Md1Fab.Action` children. Any content turns the FAB into a speed dial. */
    default?: () => any
  }>()

  const emit = defineEmits<{
    /** A speed dial action was chosen: its `value`, or its `label` when it has none. */
    select: [value: unknown]
  }>()

  const {
    icon,
    ariaLabel,
    mini = false,
    position = 'end',
    disabled = false,
    namespace,
  } = defineProps<Md1FabProps>()

  /** Whether the speed dial is open. Inert without `Md1Fab.Action` children. */
  const open = defineModel<boolean>({ default: false })

  const attrs = useAttrs()
  const slots = useSlots()
  const logger = useLogger()

  // The FAB has no label to put in its slot, so any content is a set of actions.
  const dial = toRef(() => !!slots.default)
  const area = toRef(() => AREA[position])

  // One layer id for the life of the component, so the boolean model maps onto Menu.Root's `ID | null`.
  const layer = useId()

  const actions = createRegistry({ reactive: true })

  function register (id: ID) {
    actions.register({ id })
  }

  function unregister (id: ID) {
    actions.unregister(id)
  }

  function select (value: unknown) {
    emit('select', value)
  }

  provideMd1Fab({
    namespace: toRef(() => namespace),
    register,
    unregister,
    select,
  })

  // Menu.Root types its event payload loosely; the layer id is the only non-null value it sends.
  function onOpen (value: unknown) {
    open.value = !isNull(value)
  }

  if (__DEV__) {
    watch(() => !ariaLabel, wrong => {
      if (wrong) logger.warn('[Md1Fab] the FAB has no accessible name: its glyph is aria-hidden, so pass ariaLabel')
    }, { immediate: true })

    // The page's count: three to six options including the FAB itself, so two to five actions.
    watch(() => actions.size, size => {
      if (dial.value && size > 0 && (size < 2 || size > 5)) {
        logger.warn(`[Md1Fab] a speed dial holds two to five actions, three to six options including the FAB (floating action button page); ${size} rendered`)
      }
    }, { flush: 'post' })
  }
</script>

<template>
  <Button.Root
    v-if="!dial"
    v-bind="attrs"
    :aria-label
    class="md1-fab"
    :data-mini="mini || undefined"
    :data-position="position"
    :disabled
    :namespace
  >
    <Md1Ripple />

    <Button.Icon :namespace renderless>
      <Md1Icon :name="icon" />
    </Button.Icon>
  </Button.Root>

  <Menu.Root
    v-else
    :disabled
    :model-value="open ? layer : null"
    :namespace
    :value="layer"
    @update:model-value="onOpen"
  >
    <div
      class="md1-fab__dial"
      :data-disabled="disabled || undefined"
      :data-mini="mini || undefined"
      :data-open="open || undefined"
      :data-position="position"
    >
      <Menu.Activator
        v-bind="attrs"
        :aria-label
        class="md1-fab"
        :data-mini="mini || undefined"
        :namespace
      >
        <Md1Ripple />

        <Md1Icon :name="icon" />
      </Menu.Activator>

      <Menu.Content
        class="md1-fab__actions"
        eager
        :namespace
        :position-area="area"
        :position-try="TRY"
      >
        <slot />
      </Menu.Content>
    </div>
  </Menu.Root>
</template>

<!-- Unscoped: Button.Root and the Menu parts are multi-root; a scoped data-v never lands on the <button>. -->
<style>
  /*
   * The 56 dp circle resting at 6 dp in the accent colour with a white glyph
   * (floating action button and colour pages). position: relative hosts the ink
   * layer; the fixed and absolute placements below override it.
   */
  .md1-fab {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 56px;
    height: 56px;
    margin: 0;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background-color: var(--md1-accent, #FF4081);
    color: var(--md1-on-accent, #FFFFFF);
    box-shadow: var(--md1-elevation-6, 0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12));
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    animation: md1-fab-in var(--md1-duration-enter, 225ms) var(--md1-easing-decelerate, cubic-bezier(0, 0, 0.2, 1)) backwards;
    transition:
      background-color var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      box-shadow 280ms var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      inset-block-end var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  /* Entrance: an expanding piece of material, scaled from the centre on the deceleration curve. */
  @keyframes md1-fab-in {
    from {
      scale: 0;
    }

    to {
      scale: 1;
    }
  }

  /* Positioned so the glyph paints above the ink layer, which is absolutely positioned and would otherwise cover it. */
  .md1-fab > .md1-icon {
    position: relative;
  }

  /* Mini: the 40 dp circle with the same 24 dp glyph; the hit area extends to the 48 dp touch target. */
  .md1-fab[data-mini] {
    width: 40px;
    height: 40px;
  }

  .md1-fab[data-mini]::after {
    content: '';
    position: absolute;
    inset: calc((40px - var(--md1-touch-target, 48px)) / 2);
    border-radius: 50%;
  }

  /* The page's rule: at screen widths of 460 dp or less the mini size is required. */
  @media (max-width: 460px) {
    .md1-fab {
      width: 40px;
      height: 40px;
    }

    .md1-fab::after {
      content: '';
      position: absolute;
      inset: calc((40px - var(--md1-touch-target, 48px)) / 2);
      border-radius: 50%;
    }
  }

  /*
   * Placement: 16 dp from the bottom and end edges (24 dp from the tablet
   * width). The bottom inset adds the height a visible snackbar publishes, so
   * the FAB moves up with it on the standard curve (elevation page).
   */
  .md1-fab[data-position='end'],
  .md1-fab[data-position='start'],
  .md1-fab__dial[data-position='end'],
  .md1-fab__dial[data-position='start'] {
    position: fixed;
    inset-block-end: calc(var(--md1-keyline-margin, 16px) + var(--md1-snackbar-height, 0px));
  }

  .md1-fab[data-position='end'],
  .md1-fab__dial[data-position='end'] {
    inset-inline-end: var(--md1-keyline-margin, 16px);
  }

  .md1-fab[data-position='start'],
  .md1-fab__dial[data-position='start'] {
    inset-inline-start: var(--md1-keyline-margin, 16px);
  }

  /*
   * Seam: attached to the bottom edge of an extended app bar, a toolbar inside
   * a sheet or the edge of a sheet, straddling it by half its height. The host
   * supplies the positioned box.
   */
  .md1-fab[data-position='seam'],
  .md1-fab__dial[data-position='seam'] {
    position: absolute;
    inset-block-end: 0;
    inset-inline-end: var(--md1-keyline-margin, 16px);
    translate: 0 50%;
  }

  @media (min-width: 600px) {
    .md1-fab[data-position='end'],
    .md1-fab[data-position='start'],
    .md1-fab__dial[data-position='end'],
    .md1-fab__dial[data-position='start'] {
      inset-block-end: calc(var(--md1-keyline-margin, 24px) + var(--md1-snackbar-height, 0px));
    }

    .md1-fab[data-position='end'],
    .md1-fab[data-position='seam'],
    .md1-fab__dial[data-position='end'],
    .md1-fab__dial[data-position='seam'] {
      inset-inline-end: var(--md1-keyline-margin, 24px);
    }

    .md1-fab[data-position='start'],
    .md1-fab__dial[data-position='start'] {
      inset-inline-start: var(--md1-keyline-margin, 24px);
    }
  }

  /*
   * Focus "changes colour" (the page): the 12% focus overlay over the accent,
   * keyboard only. The outline is transparent so nothing paints beside the
   * overlay, and solid so forced colours mode still draws a ring.
   */
  .md1-fab:focus-visible {
    outline: 2px solid transparent;
    background-image: linear-gradient(var(--md1-focus, rgba(0, 0, 0, 0.12)), var(--md1-focus, rgba(0, 0, 0, 0.12)));
  }

  /* Pressed: lifts to 12 dp (elevation page); the ink itself is Md1Ripple's. */
  .md1-fab:active {
    box-shadow: var(--md1-elevation-12, 0px 7px 8px -4px rgba(0, 0, 0, 0.2), 0px 12px 17px 2px rgba(0, 0, 0, 0.14), 0px 5px 22px 4px rgba(0, 0, 0, 0.12));
  }

  /* Desktop (mouse and keyboard): every resting elevation drops 2 dp, so the FAB rests at 4 dp and regains 6 dp on hover. */
  @media (pointer: fine) {
    .md1-fab {
      box-shadow: var(--md1-elevation-4, 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12));
    }

    .md1-fab:hover {
      box-shadow: var(--md1-elevation-6, 0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12));
    }

    .md1-fab:active {
      box-shadow: var(--md1-elevation-12, 0px 7px 8px -4px rgba(0, 0, 0, 0.2), 0px 12px 17px 2px rgba(0, 0, 0, 0.14), 0px 5px 22px 4px rgba(0, 0, 0, 0.12));
    }
  }

  /*
   * Disabled: the page states nothing, so the raised button's treatment
   * applies (buttons page): a 12% container, 26% ink (30% white in the dark
   * theme) and no shadow, so it reads as part of the sheet beneath it.
   */
  .md1-fab[data-disabled] {
    background-color: var(--md1-button-disabled, rgba(0, 0, 0, 0.12));
    color: var(--md1-button-disabled-text, rgba(0, 0, 0, 0.26));
    box-shadow: none;
    pointer-events: none;
  }

  /* Speed dial: the positioned box is the dial; the FAB inside stays in the flow of it. */
  .md1-fab__dial {
    display: inline-flex;
    vertical-align: middle;
    transition: inset-block-end var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  /*
   * The flung-out actions: a native popover anchored above the FAB, with no
   * sheet of its own (each action and label is its own surface). Two columns,
   * labels then 40 dp circles; each action precedes its label in the DOM
   * (SPEC.md anatomy) and the dense flow pairs them on one row. The page states
   * no speed dial metrics: 12 px between rows, Vuetify 1.5's 6 px button
   * margins on each side (var:169-171); 16 dp between a label and its button
   * (a decision, Vuetify has no labels); the side padding is the half difference of the two
   * circles, so the 40 dp actions centre on the 56 dp FAB. Layout lives under
   * :popover-open so the UA's display: none still hides a closed dial.
   */
  .md1-fab__actions {
    padding: 0 calc((56px - 40px) / 2) 12px;
    border: 0;
    background: transparent;
    color: inherit;
    overflow: visible;
    grid-template-columns: auto 40px;
    grid-auto-flow: row dense;
    align-items: center;
    justify-items: end;
    row-gap: 12px;
    column-gap: var(--md1-spacing-2, 16px);
    transition:
      display var(--md1-duration-leave, 195ms) allow-discrete,
      overlay var(--md1-duration-leave, 195ms) allow-discrete;
  }

  .md1-fab__actions:popover-open {
    display: grid;
  }

  /* A start-edge FAB puts its labels on the end side. */
  .md1-fab__dial[data-position='start'] .md1-fab__actions {
    grid-template-columns: 40px auto;
    justify-items: start;
  }

  /* A mini FAB is as wide as its actions, so the side padding goes. */
  .md1-fab__dial[data-mini] .md1-fab__actions {
    padding-inline: 0;
  }

  @media (max-width: 460px) {
    .md1-fab__actions {
      padding-inline: 0;
    }
  }

  /*
   * An action: a 40 dp mini FAB at the FAB's 6 dp with the active icon ink,
   * the page's "mini FABs" reading of a speed dial. The page states no item
   * colour, so it fills like Vuetify 1.5's uncoloured floating button, the app
   * bar colour (Grey 100, Grey 900 on dark; _buttons.styl:18-19). Closed it
   * waits at scale 0 and leaves on the acceleration curve; open it grows on
   * the deceleration curve.
   */
  .md1-fab__action {
    position: relative;
    display: inline-flex;
    grid-column: 2;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 40px;
    height: 40px;
    margin: 0;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background-color: var(--md1-app-bar, #F5F5F5);
    color: var(--md1-icon-active, rgba(0, 0, 0, 0.54));
    box-shadow: var(--md1-elevation-6, 0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12));
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    scale: 0;
    transition:
      scale var(--md1-duration-leave, 195ms) var(--md1-easing-accelerate, cubic-bezier(0.4, 0, 1, 1)),
      box-shadow 280ms var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .md1-fab__dial[data-position='start'] .md1-fab__action {
    grid-column: 1;
  }

  .md1-fab__action > .md1-icon {
    position: relative;
  }

  .md1-fab__action::after {
    content: '';
    position: absolute;
    inset: calc((40px - var(--md1-touch-target, 48px)) / 2);
    border-radius: 50%;
  }

  .md1-fab__action:focus-visible {
    outline: 2px solid transparent;
    background-image: linear-gradient(var(--md1-focus, rgba(0, 0, 0, 0.12)), var(--md1-focus, rgba(0, 0, 0, 0.12)));
  }

  .md1-fab__action:active {
    box-shadow: var(--md1-elevation-12, 0px 7px 8px -4px rgba(0, 0, 0, 0.2), 0px 12px 17px 2px rgba(0, 0, 0, 0.14), 0px 5px 22px 4px rgba(0, 0, 0, 0.12));
  }

  .md1-fab__action[data-disabled] {
    background-color: var(--md1-button-disabled, rgba(0, 0, 0, 0.12));
    color: var(--md1-button-disabled-text, rgba(0, 0, 0, 0.26));
    box-shadow: none;
    pointer-events: none;
  }

  /* Desktop: the dial's mini FABs drop 2 dp at rest like the FAB, regain 6 dp on hover and lift to 12 dp on press. */
  @media (pointer: fine) {
    .md1-fab__action {
      box-shadow: var(--md1-elevation-4, 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12));
    }

    .md1-fab__action:hover {
      box-shadow: var(--md1-elevation-6, 0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12));
    }

    .md1-fab__action:active {
      box-shadow: var(--md1-elevation-12, 0px 7px 8px -4px rgba(0, 0, 0, 0.2), 0px 12px 17px 2px rgba(0, 0, 0, 0.14), 0px 5px 22px 4px rgba(0, 0, 0, 0.12));
    }
  }

  /*
   * A label: a small 2 dp sheet in Body 1 on the surface colour (a decision;
   * the page states no type style for speed dial labels), fading with its
   * action.
   */
  .md1-fab__label {
    grid-column: 1;
    box-sizing: border-box;
    padding: 6px var(--md1-spacing-1, 8px);
    border-radius: var(--md1-radius, 2px);
    background-color: var(--md1-surface, #FFFFFF);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
    box-shadow: var(--md1-elevation-2, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-1-size, 14px);
    font-weight: var(--md1-type-body-1-weight, 400);
    line-height: var(--md1-type-body-1-leading, 20px);
    letter-spacing: var(--md1-type-body-1-tracking, 0.01em);
    white-space: nowrap;
    opacity: 0;
    transition: opacity var(--md1-duration-leave, 195ms) var(--md1-easing-accelerate, cubic-bezier(0.4, 0, 1, 1));
  }

  .md1-fab__dial[data-position='start'] .md1-fab__label {
    grid-column: 2;
  }

  .md1-fab__actions:popover-open .md1-fab__action {
    scale: 1;
    transition:
      scale var(--md1-duration-enter, 225ms) var(--md1-easing-decelerate, cubic-bezier(0, 0, 0.2, 1)),
      box-shadow 280ms var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .md1-fab__actions:popover-open .md1-fab__label {
    opacity: 1;
    transition: opacity var(--md1-duration-enter, 225ms) var(--md1-easing-decelerate, cubic-bezier(0, 0, 0.2, 1));
  }

  @starting-style {
    .md1-fab__actions:popover-open .md1-fab__action {
      scale: 0;
    }

    .md1-fab__actions:popover-open .md1-fab__label {
      opacity: 0;
    }
  }

  /*
   * Stagger (choreography page): reactions near the point of touch come
   * first, so the action nearest the FAB, the last one, leads and each one
   * above it follows 20 ms later. Labels follow their buttons.
   */
  .md1-fab__actions:popover-open .md1-fab__action:nth-last-of-type(2),
  .md1-fab__actions:popover-open .md1-fab__label:nth-last-of-type(2) {
    transition-delay: var(--md1-stagger, 20ms);
  }

  .md1-fab__actions:popover-open .md1-fab__action:nth-last-of-type(3),
  .md1-fab__actions:popover-open .md1-fab__label:nth-last-of-type(3) {
    transition-delay: calc(var(--md1-stagger, 20ms) * 2);
  }

  .md1-fab__actions:popover-open .md1-fab__action:nth-last-of-type(4),
  .md1-fab__actions:popover-open .md1-fab__label:nth-last-of-type(4) {
    transition-delay: calc(var(--md1-stagger, 20ms) * 3);
  }

  .md1-fab__actions:popover-open .md1-fab__action:nth-last-of-type(5),
  .md1-fab__actions:popover-open .md1-fab__label:nth-last-of-type(5) {
    transition-delay: calc(var(--md1-stagger, 20ms) * 4);
  }

  /*
   * Reduced motion: no entrance, no fly-out. The plugin's body attribute wins
   * over the OS query, so `mode: 'never'` keeps the motion. The action and
   * label selectors outrank the :popover-open rules that set their transitions.
   */
  body[data-reduced-motion='reduce'] .md1-fab {
    animation: none;
  }

  body[data-reduced-motion='reduce'] .md1-fab__actions,
  body[data-reduced-motion='reduce'] .md1-fab__actions .md1-fab__action,
  body[data-reduced-motion='reduce'] .md1-fab__actions .md1-fab__label {
    transition: none;
  }

  @media (prefers-reduced-motion: reduce) {
    body:not([data-reduced-motion='no-preference']) .md1-fab {
      animation: none;
    }

    body:not([data-reduced-motion='no-preference']) .md1-fab__actions,
    body:not([data-reduced-motion='no-preference']) .md1-fab__actions .md1-fab__action,
    body:not([data-reduced-motion='no-preference']) .md1-fab__actions .md1-fab__label {
      transition: none;
    }
  }
</style>
