<script lang="ts">
  // Framework
  import { createContext, createSingle, IN_BROWSER, isElement, isNull, useEventListener, useLogger, useProxyModel } from '@vuetify/v0'

  // Utilities
  import { shallowRef, toRef, useTemplateRef, watch } from 'vue'

  // Types
  import type { SingleContext, SingleTicket } from '@vuetify/v0'
  import type { Ref } from 'vue'

  /** `surface` is the white (dark: Grey 800) bar the page draws; `primary` is the coloured bar, filled with the primary colour. */
  export type Md1BottomNavigationVariant = 'surface' | 'primary'

  /** What the bar shares with its actions. */
  export interface Md1BottomNavigationContext {
    /** The selection the actions register into: one destination at a time, never none. */
    single: SingleContext<SingleTicket>
    /** Whether the bar is the shifting form. */
    shifting: Readonly<Ref<boolean>>
  }

  export interface Md1BottomNavigationProps {
    /**
     * The shifting bar: the active action widens and shows its label, the
     * inactive ones narrow to their icon. Meant for four or five destinations.
     */
    shifting?: boolean
    /** `surface` (default) or the coloured `primary` bar, whose ink is black or white by contrast. */
    variant?: Md1BottomNavigationVariant
    /** Scrolling down slides the bar off the bottom edge; scrolling up, or focus inside it, brings it back. */
    hideOnScroll?: boolean
    /** The context key the actions read. Change it only to nest two bars. */
    namespace?: string
  }

  export const MD1_BOTTOM_NAVIGATION_NAMESPACE = 'md1:bottom-navigation'

  const [useMd1BottomNavigation, provideMd1BottomNavigation] = createContext<Md1BottomNavigationContext | null>()

  export { useMd1BottomNavigation }

  /** Dev-time guard for an action rendered without a bar: it renders, but selects nothing. */
  export function orphan (part: string, context: Md1BottomNavigationContext | null): void {
    if (__DEV__ && isNull(context)) useLogger().warn(`[${part}] rendered outside <Md1BottomNavigation>; its state is inert`)
  }

  function offset (target: EventTarget): number {
    return isElement(target) ? target.scrollTop : (document.scrollingElement?.scrollTop ?? 0)
  }
</script>

<script lang="ts" setup generic="T = unknown">
  defineOptions({ name: 'Md1BottomNavigation' })

  defineSlots<{
    /** The `Md1BottomNavigation.Action` children: three to five. */
    default?: () => any
  }>()

  const {
    shifting = false,
    variant = 'surface',
    hideOnScroll = false,
    namespace = MD1_BOTTOM_NAVIGATION_NAMESPACE,
  } = defineProps<Md1BottomNavigationProps>()

  const model = defineModel<T>()

  const logger = useLogger()
  const root = useTemplateRef<HTMLElement>('root')

  // A destination is always shown, so the bar always has one action selected;
  // `reactive` makes the action count observable for the three-to-five rule.
  const single = createSingle({ mandatory: 'force', events: true, reactive: true })

  useProxyModel(single, model)

  provideMd1BottomNavigation(namespace, {
    single,
    shifting: toRef(() => shifting),
  })

  const hidden = shallowRef(false)

  // Last offset per scroller, so a second scroller starting at 0 is not read as a scroll up.
  const offsets = new WeakMap<EventTarget, number>()

  function onScroll (event: Event) {
    const target = event.target

    if (isNull(target)) return

    // A scroller sharing the bar's parent (the app shell's content region), or
    // the document while the bar is pinned to the viewport. A fixed element has
    // an offsetParent only when an ancestor (a transform, `contain`) holds it,
    // and then the document scrolling moves the bar with its container rather
    // than content beneath it. Scrollers elsewhere on the page are ignored.
    if (isElement(target)) {
      if (!root.value?.parentElement?.contains(target)) return
    } else if (root.value?.offsetParent) {
      return
    }

    const top = offset(target)
    const last = offsets.get(target) ?? 0

    offsets.set(target, top)

    if (top <= 0 || top < last) hidden.value = false
    else if (top > last) hidden.value = true
  }

  function onFocusin () {
    hidden.value = false
  }

  // Scroll does not bubble, so the capture phase on the document sees every scroller.
  useEventListener(
    () => IN_BROWSER && hideOnScroll ? document : null,
    'scroll',
    onScroll,
    { capture: true, passive: true },
  )

  watch(() => hideOnScroll, enabled => {
    if (!enabled) hidden.value = false
  })

  if (__DEV__) {
    // Post flush: the actions register one by one during mount; the count that
    // matters is the one left standing after the tree settles.
    watch(() => single.size, size => {
      if (size > 0 && (size < 3 || size > 5)) logger.warn(`[Md1BottomNavigation] a bottom navigation bar holds three to five destinations (bottom navigation page); this one renders ${size}`)
    }, { flush: 'post', immediate: true })
  }
</script>

<template>
  <nav
    ref="root"
    class="md1-bottom-navigation"
    :data-hidden="hidden || undefined"
    :data-shifting="shifting || undefined"
    :data-variant="variant"
    @focusin="onFocusin"
  >
    <slot />
  </nav>
</template>

<!-- Unscoped, like every Material Design 1 stylesheet; the actions style themselves in Md1BottomNavigationAction.vue. -->
<style>
  /*
   * The bar: 56 dp tall across the bottom of the view at 8 dp. The safe-area
   * inset is added below the 56 dp so the actions stay clear of a home
   * indicator (the page predates safe areas). z-index 4 is Vuetify 1.5's fixed
   * bottom navigation value: above content and the 6 dp snackbar, below sheets,
   * drawers and dialogs, which the page puts in front of the bar. The bar is
   * its actions' size container, so a bar narrower than the actions' minimums
   * can share itself out (see Md1BottomNavigationAction); `safe` keeps the first
   * action on screen if they still overflow.
   */
  .md1-bottom-navigation {
    position: fixed;
    inset-inline: 0;
    inset-block-end: 0;
    z-index: 4;
    display: flex;
    justify-content: safe center;
    box-sizing: content-box;
    height: 56px;
    container: md1-bottom-navigation / inline-size;
    padding-block-end: env(safe-area-inset-bottom, 0px);
    background: var(--md1-surface, #FFFFFF);
    box-shadow: var(--md1-elevation-8, 0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12));
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    transition:
      transform var(--md1-duration-standard, 300ms) var(--md1-easing-sharp, cubic-bezier(0.4, 0, 0.6, 1)),
      box-shadow var(--md1-duration-standard, 300ms) var(--md1-easing-sharp, cubic-bezier(0.4, 0, 0.6, 1));
  }

  /* The coloured bar: the primary fill; the actions switch to on-primary ink. */
  .md1-bottom-navigation[data-variant='primary'] {
    background: var(--md1-primary, #3F51B5);
  }

  /*
   * Hide on scroll: an element that leaves temporarily and may return takes the
   * sharp curve (duration and easing page). The shadow goes with it so no
   * penumbra bleeds above the bottom edge. The bar stays in the tab order;
   * focus inside it brings it back.
   */
  .md1-bottom-navigation[data-hidden] {
    transform: translateY(100%);
    box-shadow: none;
  }

  /* Desktop (mouse and keyboard): every resting elevation drops 2 dp (elevation page). */
  @media (pointer: fine) {
    .md1-bottom-navigation {
      box-shadow: var(--md1-elevation-6, 0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12));
    }

    .md1-bottom-navigation[data-hidden] {
      box-shadow: none;
    }
  }

  body[data-reduced-motion='reduce'] .md1-bottom-navigation {
    transition: none;
  }

  @media (prefers-reduced-motion: reduce) {
    body:not([data-reduced-motion='no-preference']) .md1-bottom-navigation {
      transition: none;
    }
  }
</style>
