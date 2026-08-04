<!--
  Pricing — no primitive gap (see GAPS.md: "EmCard + EmTag + EmButton are
  sufficient... placeholder only because unbuilt"). The billing period uses
  v0's real Tabs component (EmTabs) rather than a bare EmSwitch, so the choice
  is a two-option selection with proper roving focus rather than a boolean.

  Tiers are priced as an ascending ladder against what each one unlocks, and
  the yearly column is the same ladder with two months taken off — the toggle
  recomputes from a single monthly figure per tier so the two views can never
  drift apart.
-->
<script setup lang="ts">
  import {
    EmButton,
    EmCard,
    EmCardBody,
    EmTabs,
    EmTabsItem,
    EmTabsList,
    EmTag,
  } from '@paper/emerald'

  // Context
  import EmeraldShell from './EmeraldShell.vue'

  // Utilities
  import { shallowRef, toRef } from 'vue'

  type Billing = 'monthly' | 'yearly'
  type Cell = true | false | string

  const billing = shallowRef<Billing>('monthly')

  const tiers = [
    {
      id: 'community',
      name: 'Community',
      pitch: 'The headless layer on its own — every composable, no styling, no licence to track.',
      monthly: 0,
      featured: false,
      cta: 'Start building',
      variant: 'secondary' as const,
      highlights: ['Every headless composable', 'MIT licensed, no attribution', 'Community support on Discord'],
    },
    {
      id: 'studio',
      name: 'Studio',
      pitch: 'Emerald in full, with the token sources and the design files that generate it.',
      monthly: 24,
      featured: true,
      cta: 'Buy studio seats',
      variant: 'primary' as const,
      highlights: ['The complete Emerald component set', 'Token sources and the Figma library', 'Two-business-day support response'],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      pitch: 'White-label builds, private components, and the right to ship them onward.',
      monthly: 96,
      featured: false,
      cta: 'Talk to us',
      variant: 'secondary' as const,
      highlights: ['White-label builds and private components', 'Four-hour response, weekly office hours', 'Redistribution rights included'],
    },
  ]

  const yearly = toRef(() => billing.value === 'yearly')

  const plans = toRef(() => tiers.map(tier => {
    const free = tier.monthly === 0
    const price = yearly.value ? Math.round(tier.monthly * 12 * 0.8) : tier.monthly

    return {
      ...tier,
      price,
      period: free ? 'forever' : (yearly.value ? '/year' : '/month'),
      note: free || !yearly.value ? '' : `≈ $${Math.round(price / 12)} a month, billed annually`,
    }
  }))

  interface FeatureRow {
    label: string
    values: [Cell, Cell, Cell]
  }

  interface FeatureGroup {
    title: string
    rows: FeatureRow[]
  }

  const groups: FeatureGroup[] = [
    {
      title: 'Components & primitives',
      rows: [
        { label: 'Headless composables', values: ['All 71', 'All 71', 'All 71'] },
        { label: 'Emerald component set', values: [false, 'All 40', 'All 40'] },
        { label: 'Compound ARIA patterns', values: [true, true, true] },
        { label: 'Data table & data grid', values: [false, true, true] },
        { label: 'Virtual scrolling & large lists', values: [false, true, true] },
        { label: 'Components built to request', values: [false, false, true] },
      ],
    },
    {
      title: 'Tokens & theming',
      rows: [
        { label: 'Dark theme with APCA contrast', values: [true, true, true] },
        { label: 'Token source files', values: [false, true, true] },
        { label: 'Custom palettes', values: ['1', 'Unlimited', 'Unlimited'] },
        { label: 'Figma library access', values: [false, true, true] },
        { label: 'White-label build (no Emerald marks)', values: [false, false, true] },
      ],
    },
    {
      title: 'Seats, support & licensing',
      rows: [
        { label: 'Developer seats', values: ['Unlimited', 'Up to 8', 'Unlimited'] },
        { label: 'Support response', values: ['Community', '2 business days', '4 hours'] },
        { label: 'Office hours', values: [false, 'Monthly', 'Weekly'] },
        { label: 'Release channels', values: ['Public', 'Public + beta', 'Public + beta + private'] },
        { label: 'Redistribution rights', values: [false, false, true] },
      ],
    },
  ]
</script>

<template>
  <EmeraldShell>
    <div class="adm-plans" data-theme="emerald">
      <header class="adm-plans__head">
        <div>
          <span class="adm-plans__eyebrow">Plans</span>
          <h1 class="adm-plans__title">Pay for the design system, not the logic</h1>
          <p class="adm-plans__sub">The headless layer is free forever. Everything above it is priced per developer seat.</p>
        </div>

        <div class="adm-plans__billing">
          <EmTabs v-model="billing">
            <EmTabsList label="Billing period">
              <EmTabsItem value="monthly">Monthly</EmTabsItem>
              <EmTabsItem value="yearly">Yearly</EmTabsItem>
            </EmTabsList>
          </EmTabs>

          <EmTag :variant="yearly ? 'success' : 'neutral'">{{ yearly ? 'Two months free' : 'Save 20% yearly' }}</EmTag>
        </div>
      </header>

      <ul class="adm-plans__list">
        <li v-for="plan in plans" :key="plan.id">
          <EmCard
            class="adm-plans__tier"
            :class="{ 'adm-plans__tier--featured': plan.featured }"
            variant="simple"
          >
            <EmCardBody class="adm-plans__tier-body">
              <div class="adm-plans__tier-lede">
                <span class="adm-plans__tier-name">
                  {{ plan.name }}
                  <EmTag v-if="plan.featured" variant="success">Most teams start here</EmTag>
                </span>

                <p class="adm-plans__tier-pitch">{{ plan.pitch }}</p>
              </div>

              <ul class="adm-plans__highlights">
                <li v-for="point in plan.highlights" :key="point">
                  <svg
                    aria-hidden="true"
                    fill="none"
                    height="14"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2.5"
                    viewBox="0 0 16 16"
                    width="14"
                  ><path d="M3 8.5 6.5 12 13 4.5" /></svg>
                  {{ point }}
                </li>
              </ul>

              <div class="adm-plans__buy">
                <p class="adm-plans__price">
                  <span class="adm-plans__amount">${{ plan.price }}</span>
                  <span class="adm-plans__period">{{ plan.period }}</span>
                </p>

                <span class="adm-plans__note">{{ plan.note || '\xa0' }}</span>

                <EmButton class="adm-plans__cta" :variant="plan.variant">{{ plan.cta }}</EmButton>
              </div>
            </EmCardBody>
          </EmCard>
        </li>
      </ul>

      <EmCard variant="simple">
        <EmCardBody class="adm-plans__table-wrap">
          <table class="adm-plans__table">
            <thead>
              <tr>
                <th scope="col">What you get</th>

                <th
                  v-for="plan in plans"
                  :key="plan.id"
                  :data-featured="plan.featured || undefined"
                  scope="col"
                >{{ plan.name }}</th>
              </tr>
            </thead>

            <tbody v-for="group in groups" :key="group.title">
              <tr class="adm-plans__group">
                <th :colspan="plans.length + 1" scope="colgroup">{{ group.title }}</th>
              </tr>

              <tr v-for="row in group.rows" :key="row.label">
                <th scope="row">{{ row.label }}</th>

                <td
                  v-for="(value, index) in row.values"
                  :key="index"
                  :data-featured="tiers[index]?.featured || undefined"
                >
                  <span v-if="value === true" aria-label="Included" class="adm-plans__check">
                    <svg
                      fill="none"
                      height="14"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2.5"
                      viewBox="0 0 16 16"
                      width="14"
                    ><path d="M3 8.5 6.5 12 13 4.5" /></svg>
                  </span>

                  <span v-else-if="value === false" aria-label="Not included" class="adm-plans__dash">&ndash;</span>

                  <span v-else>{{ value }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </EmCardBody>
      </EmCard>

      <p class="adm-plans__terms">
        Seats are counted per developer who touches the source, never per deployment. Anything you have already shipped keeps working if a licence lapses.
      </p>
    </div>
  </EmeraldShell>
</template>

<style>
  .adm-plans {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-l, 20px);
  }

  .adm-plans .emerald-card {
    background: var(--emerald-background, #fefefe);
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
    border-radius: var(--emerald-radius-xl, 12px);
    box-shadow: var(--emerald-shadow-s, 0 0 2px 0 rgba(51, 51, 51, 0.08));
  }

  /* Left-aligned header with the billing control on the far end, rather than a
     centred stack with the toggle underneath it. */
  .adm-plans__head {
    display: flex;
    align-items: flex-end;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: var(--emerald-spacing-m, 16px);
    padding-bottom: var(--emerald-spacing-xs, 8px);
  }

  .adm-plans__eyebrow {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .adm-plans__title {
    margin: 4px 0 0;
    max-width: 26ch;
    font-size: clamp(1.5rem, 3vw, 2.125rem);
    font-weight: 700;
    letter-spacing: -0.03em;
    line-height: 1.15;
    color: var(--emerald-on-surface, #2b2d2e);
  }

  .adm-plans__sub {
    max-width: 40rem;
    margin: var(--emerald-spacing-xs, 8px) 0 0;
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .adm-plans__billing {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-s, 12px);
  }

  /* Wide rows instead of three portrait cards — the price sits at the end of a
     sentence about the tier rather than on top of a feature list. */
  .adm-plans__list {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-m, 16px);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .adm-plans__tier-body {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 15rem);
    align-items: center;
    gap: var(--emerald-spacing-l, 20px);
    padding: var(--emerald-spacing-l, 20px);
  }

  .adm-plans .adm-plans__tier--featured {
    border-color: var(--emerald-primary-600, #1fae60);
    box-shadow: var(--emerald-shadow-m, 0 2px 8px 0 rgba(51, 51, 51, 0.12));
  }

  .adm-plans__tier--featured .adm-plans__tier-body {
    border-inline-start: 4px solid var(--emerald-primary-600, #1fae60);
    border-start-start-radius: var(--emerald-radius-xl, 12px);
    border-end-start-radius: var(--emerald-radius-xl, 12px);
  }

  .adm-plans__tier-name {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--emerald-spacing-xs, 8px);
    font-size: 1.25rem;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .adm-plans__tier-pitch {
    margin: 6px 0 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-plans__highlights {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin: 0;
    padding: 0;
    list-style: none;
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-plans__highlights li {
    display: flex;
    align-items: flex-start;
    gap: var(--emerald-spacing-xs, 8px);
  }

  .adm-plans__highlights svg {
    flex: none;
    margin-top: 4px;
    color: var(--emerald-primary-700, #027d4c);
  }

  .adm-plans__buy {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
  }

  .adm-plans__price {
    display: flex;
    align-items: baseline;
    gap: 6px;
    margin: 0;
  }

  .adm-plans__amount {
    font-size: 2.25rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    font-variant-numeric: tabular-nums;
  }

  .adm-plans__period {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  /* Always occupies a line so switching billing period never shifts the CTA. */
  .adm-plans__note {
    min-height: var(--emerald-text-b3-height, 18px);
    margin-bottom: var(--emerald-spacing-xs, 8px);
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-plans__cta {
    width: 100%;
  }

  .adm-plans__table-wrap {
    overflow-x: auto;
    padding: 0;
  }

  .adm-plans__table {
    width: 100%;
    min-width: 640px;
    border-collapse: collapse;
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-plans__table th,
  .adm-plans__table td {
    padding: var(--emerald-spacing-s, 12px) var(--emerald-spacing-l, 20px);
    text-align: center;
    border-bottom: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-200, #f6f8fa);
  }

  .adm-plans__table thead th {
    position: sticky;
    top: 0;
    background: var(--emerald-background, #fefefe);
    color: var(--emerald-on-surface, #2b2d2e);
    font-size: var(--emerald-text-b2-size, 14px);
    font-weight: 700;
    border-bottom: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
  }

  .adm-plans__table tbody th[scope='row'] {
    min-width: 240px;
    font-weight: 400;
    text-align: left;
  }

  .adm-plans__table td {
    white-space: nowrap;
  }

  /* One card, grouped bodies — each section announces itself in a banner row
     instead of getting its own card and icon. */
  .adm-plans__group th {
    padding-top: var(--emerald-spacing-m, 16px);
    background: var(--emerald-neutral-200, #f6f8fa);
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    text-align: left;
  }

  .adm-plans__table [data-featured] {
    background: var(--emerald-primary-100, #e7fff2);
  }

  .adm-plans__check {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: var(--emerald-primary-100, #e7fff2);
    color: var(--emerald-primary-700, #027d4c);
  }

  .adm-plans__table [data-featured] .adm-plans__check {
    background: var(--emerald-background, #fefefe);
  }

  .adm-plans__dash {
    color: var(--emerald-neutral-400, #aeb6be);
  }

  .adm-plans__terms {
    max-width: 52rem;
    margin: 0;
    padding: var(--emerald-spacing-m, 16px);
    border-inline-start: 3px solid var(--emerald-neutral-300, #ccd6e7);
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  @media (max-width: 1000px) {
    .adm-plans__tier-body {
      grid-template-columns: minmax(0, 1fr) minmax(0, 14rem);
    }

    .adm-plans__highlights {
      grid-column: 1;
    }
  }

  @media (max-width: 700px) {
    .adm-plans__head {
      align-items: flex-start;
    }

    .adm-plans__tier-body {
      grid-template-columns: 1fr;
    }

    .adm-plans__buy {
      align-items: stretch;
    }
  }
</style>
