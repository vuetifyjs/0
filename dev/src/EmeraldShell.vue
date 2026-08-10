<script setup lang="ts">
  import {
    EmAvatar,
    EmAvatarFallback,
    EmBadge,
    EmButton,
    EmIcon,
    EmPopover,
    EmPopoverActivator,
    EmSwitch,
    EmTextField,
    EmTooltip,
    EmTooltipActivator,
    EmTooltipContent,
  } from '@paper/emerald'

  // Framework
  // Globals
  import { IN_BROWSER, Toggle } from '@vuetify/v0'

  // Context
  // `dark` is module state in the customizer, not a local ref: every Emerald
  // page mounts its own shell, so a ref declared here resets on navigation.
  import EmeraldCustomizer, { dark } from './EmeraldCustomizer.vue'

  // Utilities
  import { computed, mergeProps, onMounted, onBeforeUnmount, shallowRef, toRef } from 'vue'
  import { RouterLink, useRoute } from 'vue-router'

  // Types
  import type { EmIconName } from '@paper/emerald'
  import type { PopoverActivatorSlotProps, TooltipActivatorSlotProps } from '@vuetify/v0'

  const {
    bare = false,
  } = defineProps<{
    /** Skip default main padding (full-bleed pages like Contact hero) */
    bare?: boolean
  }>()

  const route = useRoute()
  /** Theme customizer panel. */
  const open = shallowRef(false)
  const search = shallowRef('')
  /** Demo count for the topbar bell — the panel itself is a follow-up. */
  const unread = shallowRef(5)
  function isMobileMq () {
    return IN_BROWSER && window.matchMedia('(max-width: 720px)').matches
  }

  const mobile = shallowRef(isMobileMq())
  /** Desktop: false = expanded. Mobile: true = drawer closed. */
  const collapsed = shallowRef(mobile.value)
  /** Icon rail — desktop only; the mobile drawer always shows labels. */
  const rail = toRef(() => collapsed.value && !mobile.value)

  let mq: MediaQueryList | undefined

  function syncViewport () {
    if (!mq) return
    const next = mq.matches
    mobile.value = next
    // Entering mobile closes drawer; leaving mobile expands rail
    collapsed.value = next
  }

  function onToggleNav () {
    collapsed.value = !collapsed.value
  }

  function onCloseNav () {
    if (mobile.value) collapsed.value = true
  }

  /**
   * Tooltip wiring for a trigger, applied only in rail mode. `styles` carries
   * the CSS anchor-name and is not part of `attrs`; outside the rail nothing is
   * bound, so a trigger never inherits the disabled tooltip's own state.
   */
  function anchor (tip: TooltipActivatorSlotProps) {
    return rail.value ? { ...tip.attrs, style: tip.styles } : {}
  }

  /**
   * Tooltip and customizer popover share one trigger, and each publishes its own
   * `anchor-name` in a separate style bag. `anchor-name` takes a list, so both
   * names are emitted — letting either overwrite the other lands its panel at
   * 0,0 with no anchor to resolve against.
   */
  function bind (tip: TooltipActivatorSlotProps, pop: PopoverActivatorSlotProps) {
    const names = [pop.attrs.style.anchorName, tip.styles.anchorName].filter(Boolean)

    return mergeProps(tip.attrs, pop.attrs, { style: { ...tip.styles, anchorName: names.join(', ') } })
  }

  onMounted(() => {
    if (!IN_BROWSER) return
    mq = window.matchMedia('(max-width: 720px)')
    syncViewport()
    mq.addEventListener('change', syncViewport)
  })

  onBeforeUnmount(() => {
    mq?.removeEventListener('change', syncViewport)
  })

  type Item = {
    /** Route key, matched against the active path. */
    id: string
    label: string
    to: string
    /**
     * Canonical icon role, kept separate from `id`: the rail draws artwork, and
     * what a route is called is not what its glyph depicts.
     */
    icon: EmIconName
  }

  type Group = {
    label: string
    items: Item[]
  }

  const groups: Group[] = [
    {
      label: 'Dashboards',
      items: [
        { id: 'dashboard', label: 'Overview', to: '/emerald', icon: 'layout' },
        { id: 'sales', label: 'Sales', to: '/emerald/sales', icon: 'chart-line' },
        { id: 'finance', label: 'Finance', to: '/emerald/finance', icon: 'card' },
        { id: 'logistics', label: 'Logistics', to: '/emerald/logistics', icon: 'truck' },
        { id: 'productivity', label: 'Productivity', to: '/emerald/productivity', icon: 'activity' },
        { id: 'campaign', label: 'Campaign', to: '/emerald/campaign', icon: 'megaphone' },
        { id: 'analytics', label: 'Analytics', to: '/emerald/analytics', icon: 'chart-bar' },
        { id: 'payments', label: 'Payments', to: '/emerald/payments', icon: 'card' },
        { id: 'ecommerce', label: 'eCommerce', to: '/emerald/ecommerce', icon: 'cart' },
        { id: 'orders', label: 'Orders', to: '/emerald/orders', icon: 'layers' },
      ],
    },
    {
      label: 'Apps',
      items: [
        { id: 'mail', label: 'Mail', to: '/emerald/mail', icon: 'envelope' },
        { id: 'chat', label: 'Chat', to: '/emerald/chat', icon: 'speech-bubble' },
        { id: 'kanban', label: 'Kanban', to: '/emerald/kanban', icon: 'kanban' },
        { id: 'calendar', label: 'Calendar', to: '/emerald/calendar', icon: 'calendar' },
        { id: 'contacts', label: 'Contacts', to: '/emerald/contacts', icon: 'user' },
        { id: 'settings', label: 'Settings', to: '/emerald/settings', icon: 'sliders' },
      ],
    },
    {
      label: 'Pages',
      items: [
        { id: 'features', label: 'Features', to: '/emerald/features', icon: 'sparkle' },
        { id: 'pricing', label: 'Pricing', to: '/emerald/pricing', icon: 'tag' },
        { id: 'faqs', label: 'FAQs', to: '/emerald/faqs', icon: 'help' },
        { id: 'about', label: 'About', to: '/emerald/about', icon: 'info' },
        { id: 'contact', label: 'Contact', to: '/emerald/contact', icon: 'speech-bubble' },
        { id: 'signin', label: 'Sign in', to: '/emerald/sign-in', icon: 'login' },
        { id: 'modals', label: 'Modals', to: '/emerald/modals', icon: 'window' },
        { id: 'datatable', label: 'Datatable', to: '/emerald/datatable', icon: 'table' },
        { id: 'forms', label: 'Form validation', to: '/emerald/forms', icon: 'document' },
      ],
    },
  ]

  const active = computed(() => {
    const p = route.path.length > 1 ? route.path.replace(/\/+$/, '') : route.path
    if (p === '/emerald') return 'dashboard'
    if (p === '/emerald/sink') return 'sink'
    for (const group of groups) {
      const hit = group.items.find(item => item.to === p)
      if (hit) return hit.id
    }
    return ''
  })
</script>

<template>
  <div
    class="ed"
    :data-bare="bare || undefined"
    :data-collapsed="collapsed || undefined"
    :data-mobile="mobile || undefined"
    :data-mode="dark ? 'dark' : 'light'"
    :data-theme="dark ? 'emerald-dark' : 'emerald'"
  >
    <EmButton
      v-if="mobile && collapsed"
      aria-label="Open navigation"
      class="ed-menu-fab"
      variant="tertiary"
      @click="onToggleNav"
    >
      <EmIcon name="menu" />
    </EmButton>

    <div
      v-if="mobile && !collapsed"
      aria-hidden="true"
      class="ed-scrim"
      @click="onCloseNav"
    />

    <aside aria-label="Primary" class="ed-nav">
      <div class="ed-nav__top">
        <EmTooltip
          :disabled="!rail"
          position-area="right"
          position-try="flip-inline"
        >
          <EmTooltipActivator v-slot="tip" as="a" renderless>
            <RouterLink
              v-bind="anchor(tip)"
              class="ed-brand"
              to="/emerald"
              @click="onCloseNav"
            >
              <span aria-hidden="true" class="ed-brand__mark" />
              <span class="ed-brand__name">Emerald</span>
            </RouterLink>
          </EmTooltipActivator>

          <EmTooltipContent class="ed-tip">Emerald home</EmTooltipContent>
        </EmTooltip>

        <EmTooltip
          :disabled="!rail"
          position-area="right"
          position-try="flip-inline"
        >
          <EmTooltipActivator v-slot="tip" renderless>
            <EmButton
              v-bind="anchor(tip)"
              :aria-label="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
              class="ed-icon-btn"
              size="sm"
              variant="tertiary"
              @click="onToggleNav"
            >
              <EmIcon name="sidebar" size="s" />
            </EmButton>
          </EmTooltipActivator>

          <EmTooltipContent class="ed-tip">Expand sidebar</EmTooltipContent>
        </EmTooltip>
      </div>

      <nav class="ed-nav__list">
        <div v-for="group in groups" :key="group.label" class="ed-nav__group">
          <span class="ed-nav__group-label">{{ group.label }}</span>

          <EmTooltip
            v-for="item in group.items"
            :key="item.id"
            :disabled="!rail"
            position-area="right"
            position-try="flip-inline"
          >
            <EmTooltipActivator v-slot="tip" as="a" renderless>
              <RouterLink
                v-bind="anchor(tip)"
                class="ed-nav__item"
                :data-active="active === item.id || undefined"
                :to="item.to"
                @click="onCloseNav"
              >
                <span aria-hidden="true" class="ed-nav__glyph">
                  <EmIcon :name="item.icon" />
                </span>

                <span class="ed-nav__label">{{ item.label }}</span>
              </RouterLink>
            </EmTooltipActivator>

            <EmTooltipContent class="ed-tip">{{ item.label }}</EmTooltipContent>
          </EmTooltip>
        </div>
      </nav>

      <div class="ed-nav__bottom">
        <EmTooltip v-if="rail" position-area="right" position-try="flip-inline">
          <EmTooltipActivator v-slot="tip" renderless>
            <!-- Toggle.Root, not EmButton: a standalone Button.Root pins
                 aria-pressed to undefined, and pressed state is the whole
                 point of the rail's mode switch. -->
            <Toggle.Root
              v-bind="anchor(tip)"
              v-model="dark"
              :aria-label="dark ? 'Switch to light mode' : 'Switch to dark mode'"
              class="ed-nav__item"
            >
              <span aria-hidden="true" class="ed-nav__glyph">
                <EmIcon :name="dark ? 'sun' : 'moon'" />
              </span>
            </Toggle.Root>
          </EmTooltipActivator>

          <EmTooltipContent class="ed-tip">{{ dark ? 'Light mode' : 'Dark mode' }}</EmTooltipContent>
        </EmTooltip>

        <div v-else class="ed-nav__item ed-nav__dark">
          <span aria-hidden="true" class="ed-nav__glyph">
            <EmIcon name="moon" />
          </span>

          <span class="ed-nav__label">Dark mode</span>
          <EmSwitch v-model="dark" class="ed-nav__switch" label="Dark mode" size="sm" />
        </div>

        <EmTooltip
          :disabled="!rail"
          position-area="right"
          position-try="flip-inline"
        >
          <EmTooltipActivator v-slot="tip" as="a" renderless>
            <RouterLink
              v-bind="anchor(tip)"
              class="ed-nav__item"
              :data-active="active === 'sink' || undefined"
              to="/emerald/sink"
              @click="onCloseNav"
            >
              <span aria-hidden="true" class="ed-nav__glyph">
                <EmIcon name="layers" />
              </span>

              <span class="ed-nav__label">Components</span>
            </RouterLink>
          </EmTooltipActivator>

          <EmTooltipContent class="ed-tip">Components</EmTooltipContent>
        </EmTooltip>

        <EmTooltip
          :disabled="!rail"
          position-area="right"
          position-try="flip-inline"
        >
          <EmTooltipActivator v-slot="tip" renderless>
            <EmButton
              v-bind="anchor(tip)"
              aria-label="Account menu"
              class="ed-user"
              size="sm"
              variant="tertiary"
            >
              <EmAvatar size="sm">
                <EmAvatarFallback>JD</EmAvatarFallback>
              </EmAvatar>

              <span class="ed-user__meta">
                <span class="ed-user__name">John Doe</span>
              </span>

              <EmIcon class="ed-user__chevron" name="chevron-right" />
            </EmButton>
          </EmTooltipActivator>

          <EmTooltipContent class="ed-tip">John Doe</EmTooltipContent>
        </EmTooltip>
      </div>
    </aside>

    <header v-if="!bare" class="ed-topbar">
      <div class="ed-topbar__search">
        <EmTextField v-model="search" aria-label="Search" placeholder="Type to search..." />
        <kbd aria-hidden="true" class="ed-topbar__kbd">⌘K</kbd>
      </div>

      <div class="ed-topbar__actions">
        <EmTooltip position-area="bottom" position-try="flip-block">
          <EmTooltipActivator v-slot="tip" renderless>
            <!-- Toggle.Root, not EmButton: a standalone Button.Root pins
                 aria-pressed to undefined, and pressed state is the whole point
                 of a theme switch. Emerald's own button classes carry the paint
                 so it stays identical to its neighbours in both modes. -->
            <Toggle.Root
              v-bind="tip.attrs"
              v-model="dark"
              :aria-label="dark ? 'Switch to light theme' : 'Switch to dark theme'"
              class="emerald-button ed-topbar__icon"
              data-size="sm"
              data-variant="tertiary"
              :style="tip.styles"
            >
              <EmIcon :name="dark ? 'sun' : 'moon'" size="s" />
            </Toggle.Root>
          </EmTooltipActivator>

          <EmTooltipContent class="ed-tip">
            {{ dark ? 'Switch to light theme' : 'Switch to dark theme' }}
          </EmTooltipContent>
        </EmTooltip>

        <EmPopover v-model="open">
          <!-- The tooltip stands down while the panel is open: both anchor to
               the same edge of the same button and would otherwise stack. -->
          <EmTooltip :disabled="open" position-area="bottom" position-try="flip-block">
            <EmTooltipActivator v-slot="tip" renderless>
              <EmPopoverActivator v-slot="pop" renderless>
                <EmButton
                  v-bind="bind(tip, pop)"
                  aria-label="Customize theme"
                  class="ed-topbar__icon ed-topbar__icon--wide"
                  data-customizer-trigger
                  size="sm"
                  variant="tertiary"
                >
                  <EmIcon name="palette" size="s" />
                </EmButton>
              </EmPopoverActivator>
            </EmTooltipActivator>

            <EmTooltipContent class="ed-tip">Customize theme</EmTooltipContent>
          </EmTooltip>

          <EmeraldCustomizer />
        </EmPopover>

        <EmTooltip position-area="bottom" position-try="flip-block">
          <EmTooltipActivator v-slot="tip" renderless>
            <EmButton
              v-bind="tip.attrs"
              aria-label="Activity"
              class="ed-topbar__icon ed-topbar__icon--wide"
              size="sm"
              :style="tip.styles"
              variant="tertiary"
            >
              <EmIcon name="activity" size="s" />
            </EmButton>
          </EmTooltipActivator>

          <EmTooltipContent class="ed-tip">Activity</EmTooltipContent>
        </EmTooltip>

        <EmTooltip position-area="bottom" position-try="flip-block">
          <EmTooltipActivator v-slot="tip" renderless>
            <EmButton
              v-bind="tip.attrs"
              :aria-label="`Notifications, ${unread} unread`"
              class="ed-topbar__icon"
              size="sm"
              :style="tip.styles"
              variant="tertiary"
            >
              <EmIcon name="bell" size="s" />

              <!-- The count already reads out of the button's own label, so the
                   pill is decoration and stays out of the accessibility tree. -->
              <EmBadge
                aria-hidden="true"
                class="ed-topbar__badge"
                :content="unread"
                :max="9"
                variant="primary"
              />
            </EmButton>
          </EmTooltipActivator>

          <EmTooltipContent class="ed-tip">Notifications</EmTooltipContent>
        </EmTooltip>

        <span aria-hidden="true" class="ed-topbar__rule" />

        <!-- Inert: the account menu is a follow-up, so this stays a plain
             graphic rather than a button that does nothing. -->
        <span aria-label="John Doe, online" class="ed-topbar__user" role="img">
          <EmAvatar size="sm">
            <EmAvatarFallback>JD</EmAvatarFallback>
          </EmAvatar>

          <EmBadge aria-hidden="true" class="ed-topbar__status" dot variant="primary" />
        </span>
      </div>
    </header>

    <main class="ed-main" :class="{ 'ed-main--bare': bare }">
      <slot />
    </main>
  </div>
</template>

<style>
  .ed {
    --ed-bg: var(--emerald-neutral-200, #f6f8fa);
    --ed-surface: var(--emerald-background, #fefefe);
    --ed-text: var(--emerald-on-surface, #2b2d2e);
    --ed-muted: var(--emerald-on-surface-variant, #757e85);
    --ed-border: var(--emerald-neutral-300, #ccd6e7);
    --ed-nav: var(--emerald-background, #fefefe);
    --ed-active: var(--emerald-primary-100, #e7fff2);
    --ed-active-text: var(--emerald-primary-800, #01603a);
    --ed-delta-up-bg: var(--emerald-primary-100, #e7fff2);
    --ed-delta-up: var(--emerald-primary-700, #027d4c);
    --ed-delta-down-bg: var(--emerald-danger-100, #ffebee);
    --ed-delta-down: var(--emerald-danger-500, #c61424);
    --ed-nav-w: 180px;
    --ed-rail-size: 40px;
    --ed-topbar-h: 56px;
    --ed-tip: var(--emerald-neutral-1000, #2b2d2e);
    --ed-motion: var(--emerald-motion-duration-base, 180ms);
    --ed-ease: var(--emerald-motion-ease-standard, cubic-bezier(0.4, 0, 0.2, 1));

    box-sizing: border-box;
    display: block;
    min-height: 100vh;
    min-height: 100dvh;
    max-width: 100%;
    min-width: 0;
    padding-left: var(--ed-nav-w);
    overflow-x: clip;
    background: var(--ed-bg);
    color: var(--ed-text);
    font-family: var(--emerald-font-sans, Manrope, system-ui, sans-serif);
    transition: padding-left var(--ed-motion) var(--ed-ease);
  }

  .ed[data-collapsed] {
    --ed-nav-w: 72px;
  }

  .ed[data-mode='dark'] {
    --ed-bg: #14161a;
    --ed-surface: #1e2128;
    --ed-text: #f0f2f5;
    --ed-muted: #9aa3af;
    --ed-border: #2c313a;
    --ed-nav: #1a1d23;
    /* emerald-dark inverts each ramp — its `300` is the darkest usable step, not
       the lightest — so the light theme's tints read as dark-on-dark here. The
       high steps are the dark theme's tints; keep them for anything painted on
       one of the translucent fills below. */
    /* The brand alpha token, not a literal rgba: the customizer repoints the
       primary family, and a hardcoded green pill would stay green under a
       recoloured theme while its own text followed the new accent. */
    --ed-active: var(--emerald-primary-alpha-20, rgba(46, 204, 119, 0.2));
    --ed-active-text: var(--emerald-primary-800, #8ce7b6);
    --ed-delta-up-bg: rgba(31, 174, 96, 0.16);
    --ed-delta-up: var(--emerald-primary-800, #8ce7b6);
    --ed-delta-down-bg: rgba(223, 53, 67, 0.16);
    --ed-delta-down: var(--emerald-danger-600, #f7a9b0);
    --ed-tip: #2f343d;
  }

  /* The theme adapter emits `[data-theme='emerald'] { color: … }` at the same
     specificity as `.ed` but later in the cascade, so the light-mode token wins
     and everything inheriting `color` (the brand, headings) stays dark on dark.
     Restating the shell's own text color at a higher specificity settles it. */
  .ed[data-theme] {
    color: var(--ed-text);
  }

  .ed *,
  .ed *::before,
  .ed *::after {
    box-sizing: border-box;
  }

  .ed-scrim {
    display: none;
  }

  .ed-nav {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 30;
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-m, 16px);
    width: var(--ed-nav-w);
    height: 100vh;
    height: 100dvh;
    margin: 0;
    padding: var(--emerald-spacing-s, 12px) var(--emerald-spacing-xs, 8px);
    background: var(--ed-nav);
    border-right: var(--emerald-stroke-s, 1px) solid var(--ed-border);
    overflow: hidden;
    transition:
      width var(--ed-motion) var(--ed-ease),
      transform var(--ed-motion) var(--ed-ease);
  }

  .ed-nav__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--emerald-spacing-xs, 8px);
    padding: 0 var(--emerald-spacing-2xs, 4px);
    min-height: 40px;
  }

  .ed-brand {
    display: inline-flex;
    align-items: center;
    gap: var(--emerald-spacing-xs, 8px);
    min-width: 0;
    color: inherit;
    text-decoration: none;
  }

  .ed-brand__mark {
    width: 22px;
    height: 22px;
    background: url('/emerald/logo.png') center / contain no-repeat;
    flex: none;
  }

  .ed-brand__name {
    font-weight: var(--emerald-text-b2-bold-weight, 600);
    font-size: var(--emerald-text-b2-size, 14px);
    white-space: nowrap;
  }

  /*
   * EmButton owns paint (tertiary) and the reset; box-sizing: border-box above
   * plus a fixed square means its size padding never expands the hit target,
   * so these need no specificity fight with `.emerald-button[data-size]`.
   */
  .ed-icon-btn {
    width: 32px;
    height: 32px;
    flex: none;
  }

  .ed-nav__list {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-s, 12px);
    flex: 1;
    min-height: 0;
    overflow: auto;
    scrollbar-width: none;
    /* Scroller spans to the nav's edges so the scrollbar sits flush; the
       nav's horizontal inset moves onto the list content instead. */
    margin-inline: calc(var(--emerald-spacing-xs, 8px) * -1);
    padding-inline: var(--emerald-spacing-xs, 8px);
    /* Edge fades appear only when content remains in that direction: the
       fade sizes ride the list's own scroll timeline, and when nothing
       overflows the timeline is inactive so both stay at 0. */
    mask-image: linear-gradient(
      to bottom,
      transparent 0,
      #000 var(--ed-nav-fade-top),
      #000 calc(100% - var(--ed-nav-fade-bottom)),
      transparent 100%
    );
    animation: ed-nav-fade linear both;
    animation-timeline: scroll(self y);
  }

  @property --ed-nav-fade-top {
    syntax: '<length>';
    inherits: false;
    initial-value: 0px;
  }

  @property --ed-nav-fade-bottom {
    syntax: '<length>';
    inherits: false;
    initial-value: 0px;
  }

  @keyframes ed-nav-fade {
    0% {
      --ed-nav-fade-top: 0px;
      --ed-nav-fade-bottom: 28px;
    }
    10% {
      --ed-nav-fade-top: 28px;
    }
    90% {
      --ed-nav-fade-bottom: 28px;
    }
    100% {
      --ed-nav-fade-top: 28px;
      --ed-nav-fade-bottom: 0px;
    }
  }

  .ed-nav__list::-webkit-scrollbar {
    display: none;
  }

  .ed-nav__group {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .ed-nav__group-label {
    padding: var(--emerald-spacing-xs, 8px) var(--emerald-spacing-xs, 8px) var(--emerald-spacing-2xs, 4px);
    color: var(--ed-muted);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .ed-nav__bottom {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin-top: auto;
    padding-top: var(--emerald-spacing-s, 12px);
    border-top: var(--emerald-stroke-s, 1px) solid var(--ed-border);
  }

  a.ed-nav__item {
    text-decoration: none;
  }

  .ed-nav__item {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-xs, 8px);
    width: 100%;
    min-height: 36px;
    margin: 0;
    padding: 0 var(--emerald-spacing-xs, 8px);
    border: 0;
    border-radius: var(--emerald-radius-m, 8px);
    background: transparent;
    color: var(--ed-text);
    font: inherit;
    font-size: var(--emerald-text-b2-size, 14px);
    text-align: start;
    cursor: pointer;
  }

  .ed-nav__item:hover {
    background: var(--ed-bg);
  }

  .ed-nav__item[data-active] {
    background: var(--ed-active);
    color: var(--ed-active-text);
    font-weight: var(--emerald-text-b2-bold-weight, 600);
  }

  .ed-nav__glyph {
    display: inline-flex;
    width: 20px;
    justify-content: center;
    flex: none;
    color: inherit;
    opacity: 0.9;
  }

  .ed-nav__label {
    flex: 1;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: opacity var(--ed-motion) var(--ed-ease);
  }

  .ed-nav__dark {
    cursor: default;
  }

  .ed-nav__switch {
    margin-left: auto;
  }

  .ed-user {
    width: 100%;
    margin-top: var(--emerald-spacing-xs, 8px);
  }

  /* EmButton wraps the slot in an inline-flex Content shell — stretch it so the
     avatar / name / chevron still lay out as a full-width row. */
  .ed-user .emerald-button__content {
    flex: 1;
    min-width: 0;
    gap: var(--emerald-spacing-xs, 8px);
  }

  .ed-user__meta {
    flex: 1;
    min-width: 0;
    text-align: start;
  }

  .ed-user__name {
    display: block;
    font-size: var(--emerald-text-b2-size, 14px);
    font-weight: var(--emerald-text-b2-bold-weight, 600);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ed-user__chevron {
    --emerald-icon-size: 16px;
    color: var(--ed-muted);
  }

  /* Emerald's chip is a fixed dark neutral, which sinks into this shell's
     hand-rolled dark palette, so the surface is restated. */
  .ed .ed-tip {
    background: var(--ed-tip);
  }

  /*
   * Rail tooltips only: the anchor is the centered rail square, not the rail
   * itself, and anchor positioning hardcodes `margin: unset` — so clearing the
   * rail edge means translating by the gutter the centering left behind, plus
   * a gap. The topbar's tooltips sit below their triggers and need no shift.
   */
  .ed .ed-nav .ed-tip {
    translate: calc((var(--ed-nav-w) - var(--ed-rail-size)) / 2 + var(--emerald-spacing-xs, 8px)) 0;
  }

  .ed[data-mode='dark'] .ed-tip {
    box-shadow:
      0 0 0 var(--emerald-stroke-s, 1px) var(--ed-border),
      var(--emerald-shadow-m, 0 2px 4px 0 rgba(0, 0, 0, 0.4));
  }

  /* EmButton's tertiary paint is token-driven; this shell's dark mode is a
     hand-rolled --ed-* palette, so the chrome's icon buttons need it re-stated. */
  .ed[data-mode='dark'] .ed-nav .emerald-button[data-variant='tertiary'],
  .ed[data-mode='dark'] .ed-topbar .emerald-button[data-variant='tertiary'] {
    color: var(--ed-text);
  }

  .ed[data-mode='dark'] .ed-nav .emerald-button[data-variant='tertiary']:hover:not([data-disabled]):not(:active),
  .ed[data-mode='dark'] .ed-topbar .emerald-button[data-variant='tertiary']:hover:not([data-disabled]):not(:active) {
    background: var(--ed-bg);
  }

  .ed-topbar {
    position: sticky;
    top: 0;
    z-index: 20;
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-m, 16px);
    height: var(--ed-topbar-h);
    padding: 0 var(--emerald-spacing-l, 20px);
    background: var(--ed-surface);
    border-bottom: var(--emerald-stroke-s, 1px) solid var(--ed-border);
  }

  .ed-topbar__search {
    position: relative;
    flex: 1;
    max-width: 360px;
    min-width: 0;
  }

  .ed-topbar__search .emerald-text-field__control {
    padding-inline-start: 2.25rem;
    padding-inline-end: 3rem;
  }

  /*
   * The one icon that stays inline. It paints a pseudo-element, and CSS cannot
   * read the `search` role out of the icon module — keep this copy in step with
   * `search` in packages/emerald/src/icons.ts by hand.
   */
  .ed-topbar__search::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0.7rem;
    width: 16px;
    height: 16px;
    translate: 0 -50%;
    background: currentColor;
    color: var(--ed-muted);
    -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round'%3E%3Ccircle cx='11' cy='11' r='7'/%3E%3Cpath d='m21 21-4.35-4.35'/%3E%3C/svg%3E") center / contain no-repeat;
    mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round'%3E%3Ccircle cx='11' cy='11' r='7'/%3E%3Cpath d='m21 21-4.35-4.35'/%3E%3C/svg%3E") center / contain no-repeat;
    pointer-events: none;
  }

  .ed-topbar__kbd {
    position: absolute;
    top: 50%;
    right: 0.6rem;
    translate: 0 -50%;
    padding: 1px 6px;
    border: var(--emerald-stroke-s, 1px) solid var(--ed-border);
    border-radius: var(--emerald-radius-xs, 4px);
    background: var(--ed-bg);
    color: var(--ed-muted);
    font-size: 11px;
    font-family: inherit;
    pointer-events: none;
  }

  .ed-topbar__actions {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-2xs, 4px);
    margin-left: auto;
    flex: none;
  }

  .ed-topbar__icon {
    width: 34px;
    height: 34px;
    flex: none;
  }

  /* EmButton is already position: relative, and its Content shell is static —
     so the badge anchors to the button box, not to the icon row. */
  .ed-topbar__badge {
    position: absolute;
    top: 3px;
    right: 3px;
    min-width: 14px;
    min-height: 14px;
    padding: 0 3px;
    font-size: 10px;
    line-height: 14px;
    box-shadow: 0 0 0 var(--emerald-stroke-m, 2px) var(--ed-surface);
  }

  .ed-topbar__rule {
    width: var(--emerald-stroke-s, 1px);
    height: 20px;
    margin-inline: var(--emerald-spacing-2xs, 4px);
    background: var(--ed-border);
    flex: none;
  }

  .ed-topbar__user {
    position: relative;
    display: inline-flex;
    flex: none;
  }

  /* The avatar is a circle, so a corner-pinned dot lands outside it entirely —
     inset both axes until the dot's centre sits inside the radius and only its
     ring breaks the rim. */
  .ed-topbar__status {
    position: absolute;
    right: 2px;
    bottom: 2px;
    box-shadow: 0 0 0 var(--emerald-stroke-m, 2px) var(--ed-surface);
  }

  /* EmTextField paints from Emerald's light tokens; the shell's dark mode is a
     hand-rolled --ed-* palette, so the search control is re-stated. */
  .ed[data-mode='dark'] .ed-topbar .emerald-text-field__control {
    background: var(--ed-bg);
    border-color: var(--ed-border);
    color: var(--ed-text);
  }

  .ed[data-mode='dark'] .ed-topbar .emerald-text-field__control::placeholder {
    color: var(--ed-muted);
  }

  .ed-main {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-xl, 24px);
    width: 100%;
    min-width: 0;
    min-height: 100vh;
    min-height: 100dvh;
    padding: var(--emerald-spacing-2xl, 32px) clamp(1rem, 2vw, 2.5rem) 3rem;
  }

  .ed-main--bare {
    padding: 0;
    gap: 0;
  }

  /* Non-bare pages carry the sticky topbar above main — keep the pair filling
     one viewport instead of guaranteeing a topbar's worth of scroll. */
  .ed:not([data-bare]) .ed-main {
    min-height: calc(100vh - var(--ed-topbar-h));
    min-height: calc(100dvh - var(--ed-topbar-h));
  }

  /* Mobile: drawer overlays content; default closed via data-collapsed */
  @media (max-width: 720px) {
    .ed,
    .ed[data-mobile] {
      --ed-nav-w: 0px;
      padding-left: 0;
    }

    .ed-menu-fab {
      position: fixed;
      top: 12px;
      left: 12px;
      z-index: 40;
      width: 44px;
      height: 44px;
      box-shadow: var(--emerald-shadow-m, 0 2px 4px 0 rgba(51, 51, 51, 0.15));
    }

    /* Outranks `.emerald-button[data-variant='tertiary']`: a floating button
       over page content needs an opaque surface, not tertiary's transparent. */
    .ed .ed-menu-fab.emerald-button {
      background: var(--ed-surface, var(--emerald-background, #fefefe));
    }

    .ed-scrim {
      display: block;
      position: fixed;
      inset: 0;
      z-index: 25;
      background: rgba(15, 23, 32, 0.4);
    }

    .ed-nav {
      --ed-nav-w: min(280px, 86vw);
      width: var(--ed-nav-w);
      transform: translateX(0);
      box-shadow: var(--emerald-shadow-l, 0 5px 12px -1px rgba(51, 51, 51, 0.2));
    }

    .ed[data-collapsed] .ed-nav {
      transform: translateX(-105%);
      pointer-events: none;
    }

    /* The fixed menu FAB overlays the topbar's left edge — clear it. */
    .ed-topbar {
      padding-left: 4rem;
    }

    /* 390px leaves room for the search field plus a short action row; the
       secondary ones drop rather than squeezing search to nothing. The
       customizer is exempt — it is the showcase's entry point, and dropping it
       strands the whole panel on mobile. */
    .ed-topbar__icon--wide:not([data-customizer-trigger]) {
      display: none;
    }

    /* The topbar already clears the FAB, so main needs no extra headroom. */
    .ed-main:not(.ed-main--bare) {
      padding: 1rem 1rem 1.5rem;
    }

    .ed-main--bare {
      /* Leave room for FAB over full-bleed pages */
      padding-top: 0;
    }
  }

  /* Desktop collapsed = icon rail */
  @media (min-width: 721px) {
    .ed[data-collapsed] {
      --ed-nav-w: 72px;
    }

    /* Text collapses instead of unmounting: the label keeps naming the link for
       assistive tech, and nothing reflows or wraps mid-transition. */
    .ed[data-collapsed] .ed-brand__name,
    .ed[data-collapsed] .ed-nav__label,
    .ed[data-collapsed] .ed-nav__group-label,
    .ed[data-collapsed] .ed-user__meta,
    .ed[data-collapsed] .ed-user__chevron {
      flex: 0 0 0;
      width: 0;
      padding: 0;
      opacity: 0;
      overflow: hidden;
      pointer-events: none;
    }

    .ed[data-collapsed] .ed-nav__top {
      flex-direction: column;
      gap: var(--emerald-spacing-2xs, 4px);
      padding: 0;
    }

    .ed[data-collapsed] .ed-brand {
      justify-content: center;
      width: var(--ed-rail-size);
      height: var(--ed-rail-size);
      border-radius: var(--emerald-radius-m, 8px);
      gap: 0;
    }

    .ed[data-collapsed] .ed-brand:hover {
      background: var(--ed-bg);
    }

    .ed[data-collapsed] .ed-nav__item,
    .ed[data-collapsed] .ed-user {
      width: var(--ed-rail-size);
      height: var(--ed-rail-size);
      min-height: var(--ed-rail-size);
      margin-inline: auto;
      padding: 0;
      justify-content: center;
      gap: 0;
    }

    .ed[data-collapsed] .ed-user {
      margin-top: var(--emerald-spacing-xs, 8px);
    }

    .ed[data-collapsed] .ed-user .emerald-button__content {
      flex: none;
      gap: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .ed,
    .ed-nav,
    .ed-nav__label,
    .ed-brand__name,
    .ed-user__meta,
    .ed-user__chevron {
      transition: none;
    }
  }
</style>
