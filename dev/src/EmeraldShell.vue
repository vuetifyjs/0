<script setup lang="ts">
  import { EmAvatar, EmAvatarFallback, EmButton, EmSwitch } from '@paper/emerald'

  // Framework
  // Globals
  import { IN_BROWSER } from '@vuetify/v0'

  // Utilities
  import { computed, onMounted, onBeforeUnmount, shallowRef } from 'vue'
  import { RouterLink, useRoute } from 'vue-router'

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

  const nav = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' as const, to: '/emerald' },
    { id: 'features', label: 'Features', icon: 'list' as const, to: '/emerald/features' },
    { id: 'pricing', label: 'Pricing', icon: 'list' as const, to: '/emerald/pricing' },
    { id: 'faqs', label: 'FAQs', icon: 'list' as const, to: '/emerald/faqs' },
    { id: 'settings', label: 'Settings', icon: 'list' as const, to: '/emerald/settings' },
    { id: 'modals', label: 'Modals', icon: 'list' as const, to: '/emerald/modals' },
    { id: 'contact', label: 'Contact', icon: 'list' as const, to: '/emerald/contact' },
    { id: 'about', label: 'About', icon: 'list' as const, to: '/emerald/about' },
    { id: 'signin', label: 'Sign in', icon: 'list' as const, to: '/emerald/sign-in' },
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
        <RouterLink class="ed-brand" to="/emerald" @click="onCloseNav">
          <span aria-hidden="true" class="ed-brand__mark" />
          <span v-if="!collapsed || mobile" class="ed-brand__name">Emerald</span>
        </RouterLink>

        <EmButton
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
      </div>

      <nav class="ed-nav__list">
        <RouterLink
          v-for="item in nav"
          :key="item.id"
          class="ed-nav__item"
          :data-active="active === item.id || undefined"
          :to="item.to"
          @click="onCloseNav"
        >
          <span aria-hidden="true" class="ed-nav__glyph">
            <svg
              v-if="item.icon === 'dashboard'"
              fill="none"
              height="18"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.75"
              viewBox="0 0 24 24"
              width="18"
            >
              <path d="M4 4h7v9H4V4Zm9 0h7v5h-7V4ZM4 15h7v5H4v-5Zm9-4h7v9h-7v-9Z" />
            </svg>

            <svg
              v-else
              fill="none"
              height="18"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.75"
              viewBox="0 0 24 24"
              width="18"
            >
              <path d="M5 7h14M5 12h14M5 17h10" />
            </svg>
          </span>

          <span v-if="!collapsed || mobile" class="ed-nav__label">{{ item.label }}</span>
        </RouterLink>
      </nav>

      <div class="ed-nav__bottom">
        <div class="ed-nav__item ed-nav__dark">
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
              <path d="M21 14.5A8.5 8.5 0 1 1 9.5 3 7 7 0 0 0 21 14.5Z" />
            </svg>
          </span>

          <span v-if="!collapsed || mobile" class="ed-nav__label">Dark mode</span>
          <EmSwitch v-if="!collapsed || mobile" v-model="dark" class="ed-nav__switch" size="sm" />
        </div>

        <RouterLink
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
              stroke-width="1.75"
              viewBox="0 0 24 24"
              width="18"
            >
              <path d="M4 7h16M4 12h16M4 17h10" />
            </svg>
          </span>

          <span v-if="!collapsed || mobile" class="ed-nav__label">Components</span>
        </RouterLink>

        <EmButton
          aria-label="Account menu"
          class="ed-user"
          size="sm"
          variant="tertiary"
        >
          <EmAvatar size="sm">
            <EmAvatarFallback>JD</EmAvatarFallback>
          </EmAvatar>

          <span v-if="!collapsed || mobile" class="ed-user__meta">
            <span class="ed-user__name">John Doe</span>
          </span>

          <span v-if="!collapsed || mobile" aria-hidden="true" class="ed-user__chevron">›</span>
        </EmButton>
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
      width var(--emerald-motion-duration-fast, 120ms) ease,
      transform var(--emerald-motion-duration-fast, 120ms) ease;
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
    border-radius: var(--emerald-radius-s, 6px);
    background:
      linear-gradient(135deg, var(--emerald-primary-600, #1fae60), var(--emerald-primary-400, #94caab));
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
  }
</style>
