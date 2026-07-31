<script setup lang="ts">
  import {
    EmAvatar,
    EmAvatarFallback,
    EmCard,
    EmCardBody,
    EmCardHeader,
    EmCardSubtitle,
    EmCardTitle,
    EmTag,
  } from '@paper/emerald'

  // Context
  import EmeraldShell from './EmeraldShell.vue'

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
  <EmeraldShell>
    <header class="ed-header">
      <div>
        <h1 class="ed-title">Welcome back, Jordan</h1>
        <p class="ed-subtitle">Here's what's happening with your business today.</p>
      </div>
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
  </EmeraldShell>
</template>

<style>
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
    color: var(--ed-muted, var(--emerald-on-surface-variant, #757e85));
    font-size: var(--emerald-text-b1-size, 16px);
  }

  .ed-kpis {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: var(--emerald-spacing-m, 16px);
  }

  .ed-kpi.emerald-card,
  .ed-panel.emerald-card {
    background: var(--ed-surface, var(--emerald-background, #fefefe));
    border: var(--emerald-stroke-s, 1px) solid var(--ed-border, var(--emerald-neutral-300, #ccd6e7));
    border-radius: var(--emerald-radius-xl, 12px);
    box-shadow: var(--emerald-shadow-s, 0 0 2px 0 rgba(51, 51, 51, 0.08));
    color: var(--ed-text, var(--emerald-on-surface, #2b2d2e));
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
    color: var(--ed-muted, var(--emerald-on-surface-variant, #757e85));
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
    background: var(--ed-delta-down-bg, var(--emerald-danger-100, #ffebee));
    color: var(--ed-delta-down, var(--emerald-danger-500, #c61424));
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 600;
  }

  .ed-kpi__delta[data-up] {
    background: var(--ed-delta-up-bg, var(--emerald-primary-100, #e7fff2));
    color: var(--ed-delta-up, var(--emerald-primary-700, #027d4c));
  }

  .ed-kpi__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: var(--emerald-radius-m, 8px);
    background: var(--ed-bg, var(--emerald-neutral-200, #f6f8fa));
    color: var(--ed-muted, var(--emerald-on-surface-variant, #757e85));
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
    border: var(--emerald-stroke-s, 1px) solid var(--ed-border, var(--emerald-neutral-300, #ccd6e7));
    border-radius: var(--emerald-radius-full, 999px);
    color: var(--ed-muted, var(--emerald-on-surface-variant, #757e85));
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
    border: 1px dashed var(--ed-border, var(--emerald-neutral-300, #ccd6e7));
    background:
      repeating-linear-gradient(
        -12deg,
        transparent,
        transparent 10px,
        color-mix(in srgb, var(--emerald-primary-600, #1fae60) 6%, transparent) 10px,
        color-mix(in srgb, var(--emerald-primary-600, #1fae60) 6%, transparent) 11px
      ),
      var(--ed-bg, var(--emerald-neutral-200, #f6f8fa));
    color: var(--ed-muted, var(--emerald-on-surface-variant, #757e85));
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
    background: var(--ed-surface, var(--emerald-background, #fefefe));
    border: var(--emerald-stroke-s, 1px) solid var(--ed-border, var(--emerald-neutral-300, #ccd6e7));
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
    color: var(--ed-muted, var(--emerald-on-surface-variant, #757e85));
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
    color: var(--ed-text, var(--emerald-on-surface, #2b2d2e));
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
    border-bottom: var(--emerald-stroke-s, 1px) solid var(--ed-border, var(--emerald-neutral-300, #ccd6e7));
  }

  .ed-activity__row:last-child {
    border-bottom: 0;
  }

  .ed-activity__copy p {
    margin: 0;
    font-size: var(--emerald-text-b2-size, 14px);
    color: var(--ed-muted, var(--emerald-on-surface-variant, #757e85));
  }

  .ed-activity__copy strong {
    color: var(--ed-text, var(--emerald-on-surface, #2b2d2e));
    font-weight: 600;
  }

  .ed-activity__time {
    font-size: var(--emerald-text-b3-size, 12px);
    color: var(--ed-muted, var(--emerald-on-surface-variant, #757e85));
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
    .ed-kpis {
      grid-template-columns: 1fr;
    }
  }
</style>
