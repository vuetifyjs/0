<script setup lang="ts">
  import {
    EmAvatar,
    EmAvatarFallback,
    EmButton,
    EmSwitch,
    EmTooltip,
    EmTooltipActivator,
    EmTooltipContent,
  } from '@paper/emerald'

  // Framework
  // Globals
  import { IN_BROWSER, Toggle } from '@vuetify/v0'

  // Utilities
  import { computed, onMounted, onBeforeUnmount, shallowRef, toRef } from 'vue'
  import { RouterLink, useRoute } from 'vue-router'

  // Types
  import type { TooltipActivatorSlotProps } from '@vuetify/v0'

  const {
    bare = false,
  } = defineProps<{
    /** Skip default main padding (full-bleed pages like Contact hero) */
    bare?: boolean
  }>()

  const route = useRoute()
  const dark = shallowRef(false)
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

  onMounted(() => {
    if (!IN_BROWSER) return
    mq = window.matchMedia('(max-width: 720px)')
    syncViewport()
    mq.addEventListener('change', syncViewport)
  })

  onBeforeUnmount(() => {
    mq?.removeEventListener('change', syncViewport)
  })

  const active = computed(() => {
    const p = route.path
    if (p.startsWith('/emerald/contact')) return 'contact'
    if (p.startsWith('/emerald/faqs')) return 'faqs'
    if (p.startsWith('/emerald/features')) return 'features'
    if (p.startsWith('/emerald/settings')) return 'settings'
    if (p.startsWith('/emerald/pricing')) return 'pricing'
    if (p.startsWith('/emerald/modals')) return 'modals'
    if (p.startsWith('/emerald/about')) return 'about'
    if (p.startsWith('/emerald/sign-in')) return 'signin'
    if (p.startsWith('/emerald/sink')) return 'sink'
    if (p === '/emerald' || p === '/emerald/') return 'dashboard'
    return ''
  })

  /** Stroke paths on a 24x24 grid — one entry per glyph, drawn with currentColor. */
  const icons = {
    dashboard: ['M4 4h7v9H4V4Zm9 0h7v5h-7V4ZM4 15h7v5H4v-5Zm9-4h7v9h-7v-9Z'],
    features: ['M12 3l2.3 6.7L21 12l-6.7 2.3L12 21l-2.3-6.7L3 12l6.7-2.3L12 3Z'],
    pricing: [
      'M12.6 3.6A2 2 0 0 0 11.2 3H5a2 2 0 0 0-2 2v6.2a2 2 0 0 0 .6 1.4l7.8 7.8a2 2 0 0 0 2.8 0l5.8-5.8a2 2 0 0 0 0-2.8l-7.4-7.2Z',
      'M7.5 7.5h.01',
    ],
    faqs: [
      'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z',
      'M9.7 9.3a2.4 2.4 0 0 1 4.6.8c0 1.6-2.3 2.4-2.3 2.4',
      'M12 17h.01',
    ],
    settings: [
      'M20 7h-9',
      'M14 17H5',
      'M17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z',
      'M7 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z',
    ],
    modals: [
      'M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z',
      'M3 9.5h18',
      'M6.5 7.2h.01M9 7.2h.01',
    ],
    contact: ['M20 15a2 2 0 0 1-2 2H8l-4 3.5V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9Z'],
    about: [
      'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z',
      'M12 11v5',
      'M12 8h.01',
    ],
    signin: [
      'M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3',
      'M14 12l-4-4M14 12l-4 4',
      'M14 12H4',
    ],
    components: [
      'M12 3l8 4.5-8 4.5-8-4.5L12 3Z',
      'M4 12l8 4.5 8-4.5',
      'M4 16.5 12 21l8-4.5',
    ],
    moon: ['M21 14.5A8.5 8.5 0 1 1 9.5 3 7 7 0 0 0 21 14.5Z'],
    sun: [
      'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z',
      'M12 2v2M12 20v2M2 12h2M20 12h2',
      'M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
    ],
  }

  type Item = {
    id: keyof typeof icons
    label: string
    to: string
  }

  const nav: Item[] = [
    { id: 'dashboard', label: 'Dashboard', to: '/emerald' },
    { id: 'features', label: 'Features', to: '/emerald/features' },
    { id: 'pricing', label: 'Pricing', to: '/emerald/pricing' },
    { id: 'faqs', label: 'FAQs', to: '/emerald/faqs' },
    { id: 'settings', label: 'Settings', to: '/emerald/settings' },
    { id: 'modals', label: 'Modals', to: '/emerald/modals' },
    { id: 'contact', label: 'Contact', to: '/emerald/contact' },
    { id: 'about', label: 'About', to: '/emerald/about' },
    { id: 'signin', label: 'Sign in', to: '/emerald/sign-in' },
  ]
</script>

<template>
  <div
    class="ed"
    :data-bare="bare || undefined"
    :data-collapsed="collapsed || undefined"
    :data-mobile="mobile || undefined"
    :data-mode="dark ? 'dark' : 'light'"
    data-theme="emerald"
  >
    <EmButton
      v-if="mobile && collapsed"
      aria-label="Open navigation"
      class="ed-menu-fab"
      variant="tertiary"
      @click="onToggleNav"
    >
      <svg
        aria-hidden="true"
        fill="none"
        height="20"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-width="2"
        viewBox="0 0 24 24"
        width="20"
      >
        <path d="M4 6h16M4 12h16M4 18h16" />
      </svg>
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
              <svg
                aria-hidden="true"
                fill="none"
                height="18"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-width="1.75"
                viewBox="0 0 24 24"
                width="18"
              >
                <path d="M4 6h16M4 12h10M4 18h16" />
              </svg>
            </EmButton>
          </EmTooltipActivator>

          <EmTooltipContent class="ed-tip">Expand sidebar</EmTooltipContent>
        </EmTooltip>
      </div>

      <nav class="ed-nav__list">
        <EmTooltip
          v-for="item in nav"
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
                <svg
                  fill="none"
                  height="18"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.75"
                  viewBox="0 0 24 24"
                  width="18"
                >
                  <path v-for="d in icons[item.id]" :key="d" :d />
                </svg>
              </span>

              <span class="ed-nav__label">{{ item.label }}</span>
            </RouterLink>
          </EmTooltipActivator>

          <EmTooltipContent class="ed-tip">{{ item.label }}</EmTooltipContent>
        </EmTooltip>
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
                <svg
                  fill="none"
                  height="18"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.75"
                  viewBox="0 0 24 24"
                  width="18"
                >
                  <path v-for="d in icons[dark ? 'sun' : 'moon']" :key="d" :d />
                </svg>
              </span>
            </Toggle.Root>
          </EmTooltipActivator>

          <EmTooltipContent class="ed-tip">{{ dark ? 'Light mode' : 'Dark mode' }}</EmTooltipContent>
        </EmTooltip>

        <div v-else class="ed-nav__item ed-nav__dark">
          <span aria-hidden="true" class="ed-nav__glyph">
            <svg
              fill="none"
              height="18"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.75"
              viewBox="0 0 24 24"
              width="18"
            >
              <path v-for="d in icons.moon" :key="d" :d />
            </svg>
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
                <svg
                  fill="none"
                  height="18"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.75"
                  viewBox="0 0 24 24"
                  width="18"
                >
                  <path v-for="d in icons.components" :key="d" :d />
                </svg>
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

              <span aria-hidden="true" class="ed-user__chevron">›</span>
            </EmButton>
          </EmTooltipActivator>

          <EmTooltipContent class="ed-tip">John Doe</EmTooltipContent>
        </EmTooltip>
      </div>
    </aside>

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
    --ed-active: rgba(31, 174, 96, 0.18);
    --ed-active-text: var(--emerald-primary-300, #baedd0);
    --ed-delta-up-bg: rgba(31, 174, 96, 0.16);
    --ed-delta-up: var(--emerald-primary-300, #baedd0);
    --ed-delta-down-bg: rgba(223, 53, 67, 0.16);
    --ed-delta-down: var(--emerald-danger-300, #f49898);
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
    gap: 2px;
    flex: 1;
    min-height: 0;
    overflow: auto;
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
    color: var(--ed-muted);
  }

  /*
   * The anchor is the centered rail square, not the rail itself, and anchor
   * positioning hardcodes `margin: unset` — so clearing the rail edge means
   * translating by the gutter the centering left behind, plus a gap. Emerald's
   * chip is a fixed dark neutral, which sinks into this shell's hand-rolled
   * dark palette, so the surface is restated here too.
   */
  .ed .ed-tip {
    translate: calc((var(--ed-nav-w) - var(--ed-rail-size)) / 2 + var(--emerald-spacing-xs, 8px)) 0;
    background: var(--ed-tip);
  }

  .ed[data-mode='dark'] .ed-tip {
    box-shadow:
      0 0 0 var(--emerald-stroke-s, 1px) var(--ed-border),
      var(--emerald-shadow-m, 0 2px 4px 0 rgba(0, 0, 0, 0.4));
  }

  /* EmButton's tertiary paint is token-driven; this shell's dark mode is a
     hand-rolled --ed-* palette, so the nav's icon buttons need it re-stated. */
  .ed[data-mode='dark'] .ed-nav .emerald-button[data-variant='tertiary'] {
    color: var(--ed-text);
  }

  .ed[data-mode='dark'] .ed-nav .emerald-button[data-variant='tertiary']:hover:not([data-disabled]):not(:active) {
    background: var(--ed-bg);
  }

  .ed-main {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-xl, 24px);
    width: 100%;
    min-width: 0;
    min-height: 100vh;
    min-height: 100dvh;
    padding: var(--emerald-spacing-2xl, 32px) clamp(1.5rem, 4vw, 5.5rem) 3rem;
  }

  .ed-main--bare {
    padding: 0;
    gap: 0;
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

    .ed-main:not(.ed-main--bare) {
      padding: 3.5rem 1rem 1.5rem;
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
