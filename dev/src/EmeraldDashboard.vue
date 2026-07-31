<script setup lang="ts">
  import {
    EmeraldStyleSheetAdapter,
    emeraldColors,
    EmAvatar,
    EmAvatarFallback,
    EmBadge,
    EmCard,
    EmCardBody,
    EmCardHeader,
    EmCardSubtitle,
    EmCardTitle,
    EmSwitch,
    EmTag,
  } from '@paper/emerald'

  // Framework
  import { IN_BROWSER } from '@vuetify/v0'

  // Utilities
  import { shallowRef } from 'vue'

  if (IN_BROWSER) {
    const adapter = new EmeraldStyleSheetAdapter()
    adapter.upsert(adapter.generate({ emerald: emeraldColors }, false))
    document.documentElement.dataset.theme = 'emerald'
  }

  const dark = shallowRef(false)
  const collapsed = shallowRef(false)
  const active = shallowRef('team')

  const kpis = [
    {
      label: 'Total Revenue',
      value: '$84,290',
      delta: '12.4 %',
      up: true,
      icon: 'currency',
    },
    {
      label: 'Active Users',
      value: '12,483',
      delta: '8.1 %',
      up: true,
      icon: 'users',
    },
    {
      label: 'Orders',
      value: '3,294',
      delta: '2.7 %',
      up: false,
      icon: 'orders',
    },
    {
      label: 'Conversion',
      value: '4.28%',
      delta: '1.3 %',
      up: true,
      icon: 'trend',
    },
  ] as const

  const nav = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'inbox', label: 'Inbox', icon: 'inbox', badge: 30 },
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'sales', label: 'Sales', icon: 'sales', indent: true },
    { id: 'website', label: 'Website', icon: 'website', indent: true },
    { id: 'invoices', label: 'Invoices', icon: 'invoices' },
    { id: 'team', label: 'Team', icon: 'team' },
  ] as const

  const activity = [
    {
      name: 'Sarah Connor',
      action: 'placed a new order',
      time: '2m ago',
      initials: 'SC',
      tag: 'New',
      variant: 'success' as const,
    },
    {
      name: 'James Holden',
      action: 'placed a new order',
      time: '12m ago',
      initials: 'JH',
      tag: 'Upgrade',
      variant: 'neutral' as const,
    },
    {
      name: 'Nora Park',
      action: 'submitted a refund request',
      time: '1h ago',
      initials: 'NP',
      tag: 'Alert',
      variant: 'danger' as const,
    },
    {
      name: 'Marcus Rome',
      action: 'completed onboarding',
      time: '3h ago',
      initials: 'MR',
      tag: 'ok',
      variant: 'neutral' as const,
    },
    {
      name: 'Michell Hills',
      action: 'placed a new order',
      time: '6h ago',
      initials: 'MH',
      tag: 'New',
      variant: 'success' as const,
    },
  ]
</script>

<template>
  <div
    class="ed"
    :data-collapsed="collapsed || undefined"
    :data-mode="dark ? 'dark' : 'light'"
    data-theme="emerald"
  >
    <aside aria-label="Primary" class="ed-nav">
      <div class="ed-nav__top">
        <div class="ed-brand">
          <span aria-hidden="true" class="ed-brand__mark" />
          <span v-if="!collapsed" class="ed-brand__name">Emerald</span>
        </div>

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
        <button
          v-for="item in nav"
          :key="item.id"
          class="ed-nav__item"
          :class="{ 'ed-nav__item--indent': 'indent' in item && item.indent }"
          :data-active="active === item.id || undefined"
          type="button"
          @click="active = item.id"
        >
          <span aria-hidden="true" class="ed-nav__glyph">
            <!-- simple monoline icons -->
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
            v-if="!collapsed && 'badge' in item && item.badge"
            class="ed-nav__badge"
            :content="item.badge"
            variant="primary"
          />
        </button>
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
              <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9c.3.6.9 1 1.6 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
            </svg>
          </span>

          <span v-if="!collapsed" class="ed-nav__label">Integrations</span>
        </button>

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
              <circle cx="12" cy="12" r="9" /><path d="M12 16v-1c0-1.5 1.5-2 2-3s0-3-2-3-2.5 1-2.5 2" /><circle cx="12" cy="18" fill="currentColor" r=".75" />
            </svg>
          </span>

          <span v-if="!collapsed" class="ed-nav__label">Help</span>
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

    <main class="ed-main">
      <header class="ed-header">
        <div>
          <h1 class="ed-title">Welcome back, Jordan</h1>
          <p class="ed-subtitle">Here's what's happening with your business today.</p>
        </div>

        <a class="ed-sink-link" href="/emerald/sink">Component sink →</a>
      </header>

      <section aria-label="Key metrics" class="ed-kpis">
        <EmCard
          v-for="kpi in kpis"
          :key="kpi.label"
          class="ed-kpi"
          variant="simple"
        >
          <EmCardBody class="ed-kpi__body">
            <div class="ed-kpi__text">
              <span class="ed-kpi__label">{{ kpi.label }}</span>
              <span class="ed-kpi__value">{{ kpi.value }}</span>

              <span class="ed-kpi__delta" :data-up="kpi.up || undefined">
                {{ kpi.up ? '↗' : '↘' }} {{ kpi.delta }}
              </span>
            </div>

            <span aria-hidden="true" class="ed-kpi__icon">
              <svg
                v-if="kpi.icon === 'currency'"
                fill="none"
                height="16"
                stroke="currentColor"
                stroke-width="1.75"
                viewBox="0 0 24 24"
                width="16"
              >
                <path d="M12 3v18M17 8c0-2-2-3.5-5-3.5S7 6 7 8s2 3 5 3.5 5 1.5 5 3.5-2 3.5-5 3.5S7 16 7 14" stroke-linecap="round" />
              </svg>

              <svg
                v-else-if="kpi.icon === 'users'"
                fill="none"
                height="16"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-width="1.75"
                viewBox="0 0 24 24"
                width="16"
              >
                <circle cx="9" cy="8" r="3" /><path d="M3 19c0-3 2.5-5 6-5s6 2 6 5" /><circle cx="17" cy="9" r="2.5" />
              </svg>

              <svg
                v-else-if="kpi.icon === 'orders'"
                fill="none"
                height="16"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-width="1.75"
                viewBox="0 0 24 24"
                width="16"
              >
                <path d="M5 6h14v12H5V6Z" /><path d="M9 10h6M9 14h4" />
              </svg>

              <svg
                v-else
                fill="none"
                height="16"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-width="1.75"
                viewBox="0 0 24 24"
                width="16"
              >
                <path d="M5 16 12 7l7 9" /><path d="M14 7h5v5" />
              </svg>
            </span>
          </EmCardBody>
        </EmCard>
      </section>

      <section aria-label="Charts" class="ed-charts">
        <EmCard class="ed-panel ed-panel--wide" variant="simple">
          <EmCardHeader class="ed-panel__head">
            <div>
              <EmCardTitle class="ed-panel__title">Revenue Overview</EmCardTitle>
              <EmCardSubtitle>Monthly performance vs target</EmCardSubtitle>
            </div>

            <span class="ed-chip">Last 8 months</span>
          </EmCardHeader>

          <EmCardBody>
            <div aria-label="Chart placeholder — Revenue Overview" class="ed-chart-fill ed-chart-fill--area" role="img">
              <span class="ed-chart-fill__label">Chart placeholder</span>
            </div>
          </EmCardBody>
        </EmCard>

        <EmCard class="ed-panel" variant="simple">
          <EmCardHeader class="ed-panel__head">
            <div>
              <EmCardTitle class="ed-panel__title">Traffic Sources</EmCardTitle>
              <EmCardSubtitle>Breakdown by channel</EmCardSubtitle>
            </div>
          </EmCardHeader>

          <EmCardBody>
            <div aria-label="Chart placeholder — Traffic Sources" class="ed-chart-fill ed-chart-fill--donut" role="img">
              <span class="ed-chart-fill__label">Chart placeholder</span>
            </div>

            <ul class="ed-legend">
              <li><i data-c="a" /> Direct <b>38%</b></li>
              <li><i data-c="b" /> Organic <b>27%</b></li>
              <li><i data-c="c" /> Referral <b>19%</b></li>
              <li><i data-c="d" /> Social <b>16%</b></li>
            </ul>
          </EmCardBody>
        </EmCard>
      </section>

      <section aria-label="Activity" class="ed-bottom">
        <EmCard class="ed-panel ed-panel--activity" variant="simple">
          <EmCardHeader>
            <EmCardTitle class="ed-panel__title">Recent Activity</EmCardTitle>
            <EmCardSubtitle>Latest events across your workspace</EmCardSubtitle>
          </EmCardHeader>

          <EmCardBody>
            <ul class="ed-activity">
              <li v-for="row in activity" :key="row.name + row.time" class="ed-activity__row">
                <EmAvatar size="sm">
                  <EmAvatarFallback>{{ row.initials }}</EmAvatarFallback>
                </EmAvatar>

                <div class="ed-activity__copy">
                  <p>
                    <strong>{{ row.name }}</strong>
                    {{ row.action }}
                  </p>

                  <span class="ed-activity__time">{{ row.time }}</span>
                </div>

                <EmTag :variant="row.variant">{{ row.tag }}</EmTag>
              </li>
            </ul>
          </EmCardBody>
        </EmCard>

        <EmCard class="ed-panel" variant="simple">
          <EmCardHeader>
            <EmCardTitle class="ed-panel__title">Weekly Traffic</EmCardTitle>
            <EmCardSubtitle>Visitor count this week</EmCardSubtitle>
          </EmCardHeader>

          <EmCardBody>
            <div aria-label="Chart placeholder — Weekly Traffic" class="ed-chart-fill ed-chart-fill--bars" role="img">
              <span class="ed-chart-fill__label">Chart placeholder</span>
            </div>
          </EmCardBody>
        </EmCard>
      </section>
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
    display: grid;
    grid-template-columns: var(--ed-nav-w) minmax(0, 1fr);
    min-height: 100vh;
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
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-m, 16px);
    padding: var(--emerald-spacing-s, 12px) var(--emerald-spacing-xs, 8px);
    background: var(--ed-nav);
    border-right: var(--emerald-stroke-s, 1px) solid var(--ed-border);
    min-height: 100vh;
    position: sticky;
    top: 0;
    height: 100vh;
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
    padding: var(--emerald-spacing-2xl, 32px) clamp(1.5rem, 4vw, 5.5rem) 3rem;
    min-width: 0;
  }

  .ed-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--emerald-spacing-m, 16px);
  }

  .ed-title {
    margin: 0;
    font-size: clamp(1.5rem, 2vw, 1.75rem);
    font-weight: 700;
    line-height: 1.25;
    letter-spacing: -0.02em;
  }

  .ed-subtitle {
    margin: 0.25rem 0 0;
    color: var(--ed-muted);
    font-size: var(--emerald-text-b1-size, 16px);
  }

  .ed-sink-link {
    flex: none;
    color: var(--emerald-primary-700, #027d4c);
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 600;
    text-decoration: none;
    white-space: nowrap;
  }

  .ed-sink-link:hover {
    text-decoration: underline;
  }

  .ed-kpis {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: var(--emerald-spacing-m, 16px);
  }

  .ed-kpi.emerald-card,
  .ed-panel.emerald-card {
    background: var(--ed-surface);
    border: var(--emerald-stroke-s, 1px) solid var(--ed-border);
    border-radius: var(--emerald-radius-xl, 12px);
    box-shadow: var(--emerald-shadow-s, 0 0 2px 0 rgba(51, 51, 51, 0.08));
    color: var(--ed-text);
    padding: var(--emerald-spacing-m, 16px) var(--emerald-spacing-l, 20px);
  }

  .ed-kpi__body {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--emerald-spacing-s, 12px);
  }

  .ed-kpi__text {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
  }

  .ed-kpi__label {
    color: var(--ed-muted);
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .ed-kpi__value {
    font-size: 1.375rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.2;
  }

  .ed-kpi__delta {
    display: inline-flex;
    align-items: center;
    width: fit-content;
    margin-top: 4px;
    padding: 2px 8px;
    border-radius: var(--emerald-radius-full, 999px);
    background: var(--ed-delta-down-bg);
    color: var(--ed-delta-down);
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 600;
  }

  .ed-kpi__delta[data-up] {
    background: var(--ed-delta-up-bg);
    color: var(--ed-delta-up);
  }

  .ed-kpi__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: var(--emerald-radius-m, 8px);
    background: var(--ed-bg);
    color: var(--ed-muted);
    font-size: 14px;
    flex: none;
  }

  .ed-charts {
    display: grid;
    grid-template-columns: minmax(0, 2.2fr) minmax(0, 1fr);
    gap: var(--emerald-spacing-m, 16px);
  }

  .ed-bottom {
    display: grid;
    grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr);
    gap: var(--emerald-spacing-m, 16px);
  }

  .ed-panel__head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--emerald-spacing-s, 12px);
  }

  .ed-panel__title {
    font-size: var(--emerald-text-b1-size, 16px) !important;
    font-weight: 700 !important;
    line-height: 1.35 !important;
  }

  .ed-chip {
    flex: none;
    padding: 4px 10px;
    border: var(--emerald-stroke-s, 1px) solid var(--ed-border);
    border-radius: var(--emerald-radius-full, 999px);
    color: var(--ed-muted);
    font-size: var(--emerald-text-b3-size, 12px);
    white-space: nowrap;
  }

  .ed-chart-fill {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 220px;
    border-radius: var(--emerald-radius-m, 8px);
    border: 1px dashed var(--ed-border);
    background:
      repeating-linear-gradient(
        -12deg,
        transparent,
        transparent 10px,
        color-mix(in srgb, var(--emerald-primary-600, #1fae60) 6%, transparent) 10px,
        color-mix(in srgb, var(--emerald-primary-600, #1fae60) 6%, transparent) 11px
      ),
      var(--ed-bg);
    color: var(--ed-muted);
  }

  .ed-chart-fill--area {
    min-height: 260px;
  }

  .ed-chart-fill--donut {
    min-height: 180px;
    margin-bottom: var(--emerald-spacing-m, 16px);
  }

  .ed-chart-fill--bars {
    min-height: 240px;
  }

  .ed-chart-fill__label {
    padding: 6px 10px;
    border-radius: var(--emerald-radius-full, 999px);
    background: var(--ed-surface);
    border: var(--emerald-stroke-s, 1px) solid var(--ed-border);
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 600;
  }

  .ed-legend {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px 12px;
    margin: 0;
    padding: 0;
    list-style: none;
    font-size: var(--emerald-text-b3-size, 12px);
    color: var(--ed-muted);
  }

  .ed-legend li {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .ed-legend i {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex: none;
  }

  .ed-legend i[data-c='a'] { background: #1fae60; }
  .ed-legend i[data-c='b'] { background: #df3543; }
  .ed-legend i[data-c='c'] { background: #ffcf06; }
  .ed-legend i[data-c='d'] { background: #3a70e2; }

  .ed-legend b {
    margin-left: auto;
    color: var(--ed-text);
    font-weight: 600;
  }

  .ed-activity {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .ed-activity__row {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: var(--emerald-spacing-s, 12px);
    padding: var(--emerald-spacing-xs, 8px) 0;
    border-bottom: var(--emerald-stroke-s, 1px) solid var(--ed-border);
  }

  .ed-activity__row:last-child {
    border-bottom: 0;
  }

  .ed-activity__copy p {
    margin: 0;
    font-size: var(--emerald-text-b2-size, 14px);
    color: var(--ed-muted);
  }

  .ed-activity__copy strong {
    color: var(--ed-text);
    font-weight: 600;
  }

  .ed-activity__time {
    font-size: var(--emerald-text-b3-size, 12px);
    color: var(--ed-muted);
  }

  @media (max-width: 1100px) {
    .ed-kpis {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .ed-charts,
    .ed-bottom {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 720px) {
    .ed {
      grid-template-columns: 1fr;
    }

    .ed-nav {
      position: static;
      height: auto;
      border-right: 0;
      border-bottom: var(--emerald-stroke-s, 1px) solid var(--ed-border);
    }

    .ed-kpis {
      grid-template-columns: 1fr;
    }

    .ed-main {
      padding: 1.25rem;
    }
  }
</style>
