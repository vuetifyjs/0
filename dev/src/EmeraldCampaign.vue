<!--
  The opens area chart, funnel connectors and segment bars render as static
  CSS/SVG fills (real data, no charting library) — same GAP_CONTRACT precedent
  as EmeraldSales.
-->
<script setup lang="ts">
  import {
    EmAvatar,
    EmAvatarFallback,
    EmButton,
    EmCard,
    EmCardBody,
    EmCardHeader,
    EmCardTitle,
    EmCheckbox,
    EmTag,
  } from '@paper/emerald'

  // Context
  import EmeraldShell from './EmeraldShell.vue'

  // Utilities
  import { ref, toRef } from 'vue'

  const summary = [
    { label: 'Delivered', value: '41,280', delta: '+6.1%', up: true },
    { label: 'Open rate', value: '44.0%', delta: '+3.2pt', up: true },
    { label: 'Click rate', value: '13.9%', delta: '+1.8pt', up: true },
    { label: 'Unsubscribes', value: '132', delta: '-0.4pt', up: false },
    { label: 'Seats upgraded', value: '412', delta: '+18.6%', up: true },
  ]

  const opens = [1240, 4830, 3610, 2980, 2140, 1820, 1544]
  const opensMax = Math.max(...opens)
  const days = ['Send day', '+1', '+2', '+3', '+4', '+5', '+6']

  const shape = opens.map((v, index) => `${index * (100 / (opens.length - 1))},${40 - (v / opensMax) * 34}`).join(' ')

  const funnel = [
    { label: 'Delivered', count: '41,280', rate: '100%' },
    { label: 'Opened', count: '18,164', rate: '44.0%' },
    { label: 'Clicked through', count: '5,724', rate: '13.9%' },
    { label: 'Reached docs', count: '3,110', rate: '7.5%' },
    { label: 'Upgraded a seat', count: '412', rate: '1.0%' },
  ]

  const segments = [
    { label: 'Free tier users', size: 28_400 },
    { label: 'Emerald Pro seats', size: 9610 },
    { label: 'Nuxt module users', size: 6240 },
    { label: 'Enterprise contacts', size: 1180 },
  ]

  const picked = ref<string[]>(['Emerald Pro seats'])

  const reach = toRef(() => segments
    .filter(segment => picked.value.includes(segment.label))
    .reduce((sum, segment) => sum + segment.size, 0),
  )

  function onPick (label: string) {
    picked.value = picked.value.includes(label)
      ? picked.value.filter(item => item !== label)
      : [...picked.value, label]
  }

  const sends = [
    { name: 'Emerald 1.0 launch', owner: 'Camille Fontaine', channel: 'Newsletter', audience: '41,280', sent: '02 Jul', open: '44.0%', state: 'Sent' as const },
    { name: 'v1.2 release notes', owner: 'Kenji Morrow', channel: 'In-app', audience: '9,610', sent: '19 Jul', open: '61.4%', state: 'Sent' as const },
    { name: 'Nuxt module beta call', owner: 'Nadia Haddad', channel: 'Newsletter', audience: '6,240', sent: '24 Jul', open: '38.7%', state: 'Sent' as const },
    { name: 'Vue Fes booth invite', owner: 'Theo Vasquez', channel: 'Email', audience: '1,180', sent: '29 Jul', open: '—', state: 'Scheduled' as const },
    { name: 'Composables digest — August', owner: 'Sofia Delgado', channel: 'Newsletter', audience: '41,280', sent: '05 Aug', open: '—', state: 'Draft' as const },
    { name: 'Sponsor renewal reminder', owner: 'Felix Amundsen', channel: 'Email', audience: '284', sent: '11 Aug', open: '—', state: 'Draft' as const },
  ]

  function initials (name: string) {
    return name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase()
  }
</script>

<template>
  <EmeraldShell>
    <div class="adm-campaign">
      <header class="adm-campaign__header">
        <h1 class="adm-campaign__title">Release campaigns</h1>
        <p class="adm-campaign__subtitle">How announcement sends convert readers into seats</p>
      </header>

      <div class="adm-campaign__layout">
        <aside class="adm-campaign__rail">
          <EmCard variant="simple">
            <EmCardHeader>
              <EmCardTitle class="adm-campaign__panel-title">Send funnel</EmCardTitle>
              <p class="adm-campaign__panel-sub">Emerald 1.0 launch, seven days after send</p>
            </EmCardHeader>

            <EmCardBody>
              <ol aria-label="Send funnel stages" class="adm-campaign__funnel" role="img">
                <li v-for="stage in funnel" :key="stage.label">
                  <span aria-hidden="true" class="adm-campaign__funnel-node" />

                  <span class="adm-campaign__funnel-text">
                    <strong>{{ stage.count }}</strong>
                    <span>{{ stage.label }}</span>
                  </span>

                  <EmTag>{{ stage.rate }}</EmTag>
                </li>
              </ol>
            </EmCardBody>
          </EmCard>

          <EmCard variant="simple">
            <EmCardHeader>
              <EmCardTitle class="adm-campaign__panel-title">Audience builder</EmCardTitle>
              <p class="adm-campaign__panel-sub">Pick the lists this send goes out to</p>
            </EmCardHeader>

            <EmCardBody class="adm-campaign__builder">
              <ul class="adm-campaign__segments">
                <li v-for="segment in segments" :key="segment.label" :data-selected="picked.includes(segment.label) || undefined">
                  <EmCheckbox
                    :aria-label="segment.label"
                    :model-value="picked.includes(segment.label)"
                    @update:model-value="onPick(segment.label)"
                  />

                  <span class="adm-campaign__segment-label">{{ segment.label }}</span>
                  <EmTag>{{ segment.size.toLocaleString('en-US') }}</EmTag>
                </li>
              </ul>

              <p class="adm-campaign__reach">
                Estimated reach
                <strong>{{ reach.toLocaleString('en-US') }}</strong>
              </p>

              <EmButton class="adm-campaign__cta" variant="primary">Schedule send</EmButton>
            </EmCardBody>
          </EmCard>
        </aside>

        <div class="adm-campaign__main">
          <EmCard variant="simple">
            <EmCardHeader>
              <EmCardTitle class="adm-campaign__panel-title">Campaign performance</EmCardTitle>
              <p class="adm-campaign__panel-sub">Rolling 30 days across every announcement channel</p>
            </EmCardHeader>

            <EmCardBody>
              <div class="adm-campaign__summary">
                <div v-for="item in summary" :key="item.label">
                  <span class="adm-campaign__summary-value">{{ item.value }}</span>
                  <span class="adm-campaign__summary-label">{{ item.label }}</span>
                  <em class="adm-campaign__delta" :data-up="item.up || undefined">{{ item.delta }}</em>
                </div>
              </div>

              <p class="adm-campaign__chart-title">Opens after send</p>

              <svg
                aria-label="Opens per day after send"
                class="adm-campaign__area"
                preserveAspectRatio="none"
                role="img"
                viewBox="0 0 100 40"
              >
                <polygon fill="var(--emerald-primary-100, #e7fff2)" :points="`0,40 ${shape} 100,40`" />

                <polyline
                  fill="none"
                  :points="shape"
                  stroke="var(--emerald-primary-600, #1fae60)"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2.5"
                />
              </svg>

              <div class="adm-campaign__axis">
                <span v-for="(day, index) in days" :key="day">{{ day }}<small>{{ opens[index]!.toLocaleString('en-US') }}</small></span>
              </div>
            </EmCardBody>
          </EmCard>
        </div>
      </div>

      <section aria-label="Send log">
        <EmCard variant="simple">
          <EmCardHeader>
            <EmCardTitle class="adm-campaign__panel-title">Send log</EmCardTitle>
            <p class="adm-campaign__panel-sub">Everything shipped or queued this cycle</p>
          </EmCardHeader>

          <EmCardBody class="adm-campaign__table-wrap">
            <table class="adm-campaign__table">
              <thead>
                <tr>
                  <th>Campaign</th>
                  <th>Channel</th>
                  <th>Audience</th>
                  <th>Send date</th>
                  <th>Open rate</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="send in sends" :key="send.name">
                  <td>
                    <div class="adm-campaign__client">
                      <EmAvatar size="sm"><EmAvatarFallback>{{ initials(send.owner) }}</EmAvatarFallback></EmAvatar>
                      <span><strong>{{ send.name }}</strong><span class="adm-campaign__client-sub">{{ send.owner }}</span></span>
                    </div>
                  </td>

                  <td>{{ send.channel }}</td>
                  <td>{{ send.audience }}</td>
                  <td>{{ send.sent }}</td>
                  <td>{{ send.open }}</td>

                  <td>
                    <EmTag :variant="send.state === 'Sent' ? 'success' : send.state === 'Scheduled' ? 'info' : 'neutral'">
                      {{ send.state }}
                    </EmTag>
                  </td>
                </tr>
              </tbody>
            </table>
          </EmCardBody>
        </EmCard>
      </section>
    </div>
  </EmeraldShell>
</template>

<style>
  .adm-campaign {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-l, 20px);
  }

  /* EmCard variant="simple" ships 2px padding and its slots add none, so every
     card needs its own inset — see the EmCard padding gap row. */
  .adm-campaign .emerald-card {
    padding: var(--emerald-spacing-l, 20px);
    background: var(--emerald-background, #fefefe);
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
    border-radius: var(--emerald-radius-xl, 12px);
    box-shadow: var(--emerald-shadow-s, 0 0 2px 0 rgba(51, 51, 51, 0.08));
  }

  .adm-campaign__title {
    margin: 0;
    font-size: clamp(1.375rem, 2vw, 1.625rem);
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .adm-campaign__subtitle {
    margin: 0.25rem 0 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b1-size, 16px);
  }

  .adm-campaign__panel-title {
    font-size: var(--emerald-text-b1-size, 16px) !important;
    font-weight: 700 !important;
  }

  .adm-campaign__panel-sub {
    margin: 2px 0 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-campaign__delta {
    font-style: normal;
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 600;
    color: var(--emerald-danger-500, #c61424);
  }

  .adm-campaign__delta[data-up] {
    color: var(--emerald-primary-700, #027d4c);
  }

  .adm-campaign__layout {
    display: grid;
    grid-template-columns: minmax(0, 320px) minmax(0, 1fr);
    align-items: start;
    gap: var(--emerald-spacing-m, 16px);
  }

  .adm-campaign__rail,
  .adm-campaign__main {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-m, 16px);
    min-width: 0;
  }

  .adm-campaign__funnel {
    display: flex;
    flex-direction: column;
    gap: 0;
    margin: var(--emerald-spacing-xs, 8px) 0 0;
    padding: 0;
    list-style: none;
  }

  .adm-campaign__funnel li {
    position: relative;
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-s, 12px);
    padding: var(--emerald-spacing-s, 12px) 0;
  }

  /* Connector spine between funnel nodes; the last stage ends the line. */
  .adm-campaign__funnel li::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 6px;
    width: 2px;
    height: 100%;
    background: var(--emerald-neutral-300, #ccd6e7);
  }

  .adm-campaign__funnel li:last-child::before {
    display: none;
  }

  .adm-campaign__funnel-node {
    position: relative;
    z-index: 1;
    flex: none;
    width: 14px;
    height: 14px;
    border: 3px solid var(--emerald-primary-600, #1fae60);
    border-radius: 50%;
    background: var(--emerald-background, #fefefe);
  }

  .adm-campaign__funnel-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
    font-size: var(--emerald-text-b3-size, 12px);
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .adm-campaign__funnel-text strong {
    color: var(--emerald-on-surface, #2b2d2e);
    font-size: var(--emerald-text-b1-size, 16px);
  }

  .adm-campaign__builder {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-campaign__segments {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-xs, 8px);
    margin: var(--emerald-spacing-xs, 8px) 0 0;
    padding: 0;
    list-style: none;
  }

  .adm-campaign__segments li {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-s, 12px);
    padding: var(--emerald-spacing-xs, 8px) var(--emerald-spacing-s, 12px);
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
    border-radius: var(--emerald-radius-m, 8px);
    transition: border-color 120ms ease, background-color 120ms ease;
  }

  .adm-campaign__segments li:hover {
    border-color: var(--emerald-primary-500, #26c26d);
  }

  .adm-campaign__segments li[data-selected] {
    border-color: var(--emerald-primary-600, #1fae60);
    background: var(--emerald-primary-100, #e7fff2);
  }

  .adm-campaign__segment-label {
    flex: 1;
    font-size: var(--emerald-text-b2-size, 14px);
    font-weight: 600;
  }

  .adm-campaign__reach {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin: 0;
    padding-top: var(--emerald-spacing-s, 12px);
    border-top: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-200, #f6f8fa);
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-campaign__reach strong {
    color: var(--emerald-on-surface, #2b2d2e);
    font-size: 1.25rem;
  }

  .adm-campaign__cta {
    width: 100%;
  }

  .adm-campaign__summary {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: var(--emerald-spacing-s, 12px);
    margin-top: var(--emerald-spacing-xs, 8px);
  }

  .adm-campaign__summary > div {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding-left: var(--emerald-spacing-s, 12px);
    border-left: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
  }

  .adm-campaign__summary > div:first-child {
    padding-left: 0;
    border-left: 0;
  }

  .adm-campaign__summary-value {
    font-size: 1.375rem;
    font-weight: 700;
    letter-spacing: -0.01em;
  }

  .adm-campaign__summary-label {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-campaign__chart-title {
    margin: var(--emerald-spacing-l, 20px) 0 var(--emerald-spacing-xs, 8px);
    font-size: var(--emerald-text-b2-size, 14px);
    font-weight: 600;
  }

  .adm-campaign__area {
    width: 100%;
    height: 150px;
  }

  .adm-campaign__axis {
    display: flex;
    justify-content: space-between;
    gap: 4px;
    margin-top: var(--emerald-spacing-xs, 8px);
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-campaign__axis span {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }

  .adm-campaign__axis small {
    color: var(--emerald-on-surface, #2b2d2e);
    font-weight: 600;
  }

  .adm-campaign__table-wrap {
    overflow-x: auto;
    margin-inline: calc(-1 * var(--emerald-spacing-l, 20px));
  }

  .adm-campaign__table th:first-child,
  .adm-campaign__table td:first-child {
    padding-left: var(--emerald-spacing-l, 20px);
  }

  .adm-campaign__table th:last-child,
  .adm-campaign__table td:last-child {
    padding-right: var(--emerald-spacing-l, 20px);
  }

  .adm-campaign__table tbody tr {
    transition: background-color 120ms ease;
  }

  .adm-campaign__table tbody tr:hover {
    background: var(--emerald-neutral-200, #f6f8fa);
  }

  .adm-campaign__table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--emerald-text-b2-size, 14px);
    white-space: nowrap;
  }

  .adm-campaign__table th {
    padding: var(--emerald-spacing-xs, 8px) var(--emerald-spacing-s, 12px);
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 600;
    text-align: left;
    border-bottom: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
  }

  .adm-campaign__table td {
    padding: var(--emerald-spacing-s, 12px);
    border-bottom: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-200, #f6f8fa);
  }

  .adm-campaign__client {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-xs, 8px);
  }

  .adm-campaign__client strong {
    display: block;
  }

  .adm-campaign__client-sub {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  @media (max-width: 1200px) {
    .adm-campaign__layout {
      grid-template-columns: 1fr;
    }

    .adm-campaign__summary {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .adm-campaign__summary > div:nth-child(4) {
      padding-left: 0;
      border-left: 0;
    }
  }

  @media (max-width: 640px) {
    .adm-campaign__summary {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .adm-campaign__summary > div:nth-child(odd) {
      padding-left: 0;
      border-left: 0;
    }

    .adm-campaign__axis {
      font-size: 10px;
    }
  }
</style>
