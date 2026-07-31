<script setup lang="ts">
  import { EmAvatar, EmAvatarFallback, EmBadge, EmSwitch } from '@paper/emerald'

  import { installEmeraldTheme } from './emerald-theme'

  // Utilities
  import { computed, shallowRef } from 'vue'
  import { RouterLink, useRoute } from 'vue-router'

  installEmeraldTheme()

  const {
    bare = false,
  } = defineProps<{
    /** Skip default main padding (full-bleed pages like Contact hero) */
    bare?: boolean
  }>()

  const route = useRoute()
  const dark = shallowRef(false)
  const collapsed = shallowRef(false)

  const active = computed(() => {
    if (route.path.startsWith('/emerald/contact')) return 'contact'
    if (route.path.startsWith('/emerald/sink')) return 'sink'
    if (route.path === '/emerald' || route.path === '/emerald/') return 'dashboard'
    return ''
  })

  const nav = [
    { id: 'home', label: 'Home', icon: 'home' as const },
    { id: 'inbox', label: 'Inbox', icon: 'inbox' as const, badge: 30 },
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' as const, to: '/emerald' },
    { id: 'sales', label: 'Sales', icon: 'list' as const, indent: true },
    { id: 'website', label: 'Website', icon: 'list' as const, indent: true },
    { id: 'invoices', label: 'Invoices', icon: 'list' as const },
    { id: 'team', label: 'Team', icon: 'team' as const },
    { id: 'contact', label: 'Contact', icon: 'list' as const, to: '/emerald/contact' },
  ]
</script>

<template>
  <div
    class="ed"
    :data-bare="bare || undefined"
    :data-collapsed="collapsed || undefined"
    :data-mode="dark ? 'dark' : 'light'"
    data-theme="emerald"
  >
    <aside aria-label="Primary" class="ed-nav">
      <div class="ed-nav__top">
        <RouterLink class="ed-brand" to="/emerald">
          <span aria-hidden="true" class="ed-brand__mark" />
          <span v-if="!collapsed" class="ed-brand__name">Emerald</span>
        </RouterLink>

        <button
          aria-label="Toggle sidebar"
          class="ed-icon-btn"
          type="button"
          @click="collapsed = !collapsed"
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
        </button>
      </div>

      <nav class="ed-nav__list">
        <component
          :is="item.to ? RouterLink : 'button'"
          v-for="item in nav"
          :key="item.id"
          class="ed-nav__item"
          :class="{ 'ed-nav__item--indent': item.indent }"
          :data-active="active === item.id || undefined"
          :to="item.to"
          :type="item.to ? undefined : 'button'"
        >
          <span aria-hidden="true" class="ed-nav__glyph">
            <svg
              v-if="item.icon === 'home'"
              fill="none"
              height="18"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.75"
              viewBox="0 0 24 24"
              width="18"
            >
              <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" />
            </svg>

            <svg
              v-else-if="item.icon === 'inbox'"
              fill="none"
              height="18"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.75"
              viewBox="0 0 24 24"
              width="18"
            >
              <path d="M4 6h16v12H4V6Z" /><path d="M4 12h4l2 3h4l2-3h4" />
            </svg>

            <svg
              v-else-if="item.icon === 'dashboard'"
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
              v-else-if="item.icon === 'team'"
              fill="none"
              height="18"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.75"
              viewBox="0 0 24 24"
              width="18"
            >
              <circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.5" /><path d="M3 19c0-3 2.5-5 6-5s6 2 6 5" /><path d="M14 19c.4-1.8 1.8-3 4-3 2 0 3.5 1 4 3" />
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

          <span v-if="!collapsed" class="ed-nav__label">{{ item.label }}</span>

          <EmBadge
            v-if="!collapsed && item.badge"
            class="ed-nav__badge"
            :content="item.badge"
            variant="primary"
          />
        </component>
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

          <span v-if="!collapsed" class="ed-nav__label">Dark mode</span>
          <EmSwitch v-if="!collapsed" v-model="dark" class="ed-nav__switch" size="sm" />
        </div>

        <RouterLink class="ed-nav__item" :data-active="active === 'sink' || undefined" to="/emerald/sink">
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

          <span v-if="!collapsed" class="ed-nav__label">Components</span>
        </RouterLink>

        <button class="ed-nav__item" type="button">
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
              <circle cx="12" cy="12" r="3" /><path d="M4 12h4M16 12h4M12 4v4M12 16v4" />
            </svg>
          </span>

          <span v-if="!collapsed" class="ed-nav__label">Settings</span>
        </button>

        <button class="ed-user" type="button">
          <EmAvatar size="sm">
            <EmAvatarFallback>JD</EmAvatarFallback>
          </EmAvatar>

          <span v-if="!collapsed" class="ed-user__meta">
            <span class="ed-user__name">John Doe</span>
          </span>

          <span v-if="!collapsed" aria-hidden="true" class="ed-user__chevron">›</span>
        </button>
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
    padding-left: var(--ed-nav-w);
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

  .ed-nav {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 20;
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

  .ed-icon-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: 0;
    border-radius: var(--emerald-radius-s, 6px);
    background: transparent;
    color: var(--ed-muted);
    cursor: pointer;
  }

  .ed-icon-btn:hover {
    background: var(--ed-bg);
    color: var(--ed-text);
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

  .ed-nav__item--indent {
    padding-left: calc(var(--emerald-spacing-xs, 8px) + 10px);
    color: var(--ed-muted);
    font-size: var(--emerald-text-b3-size, 12px);
    min-height: 28px;
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

  .ed-nav__badge {
    margin-left: auto;
  }

  .ed-nav__dark {
    cursor: default;
  }

  .ed-nav__switch {
    margin-left: auto;
  }

  .ed-user {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-xs, 8px);
    width: 100%;
    margin-top: var(--emerald-spacing-xs, 8px);
    padding: var(--emerald-spacing-2xs, 4px) var(--emerald-spacing-xs, 8px);
    border: 0;
    border-radius: var(--emerald-radius-m, 8px);
    background: transparent;
    color: var(--ed-text);
    font: inherit;
    cursor: pointer;
  }

  .ed-user:hover {
    background: var(--ed-bg);
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

  @media (max-width: 720px) {
    .ed {
      padding-left: 0;
    }

    .ed-nav {
      box-shadow: var(--emerald-shadow-l, 0 5px 12px -1px rgba(51, 51, 51, 0.2));
    }

    .ed[data-collapsed] {
      --ed-nav-w: 0px;
    }

    .ed[data-collapsed] .ed-nav {
      transform: translateX(-100%);
      pointer-events: none;
    }

    .ed-main:not(.ed-main--bare) {
      padding: 1.25rem;
    }
  }
</style>
