<!--
  Pricing — no primitive gap (see GAPS.md: "EmCard + EmTag + EmButton are
  sufficient... placeholder only because unbuilt"). The billing toggle uses
  v0's real Tabs component (EmTabs) rather than a bare EmSwitch, to visually
  match the reference design's pill toggle — see dev/src/EmeraldPricing.vue for the
  existing showcase pricing page (EmSwitch-driven, different card layout);
  this page intentionally does not copy it.

  the reference design's scraped numbers ($29 Essential > $14 Pro > $7 "Trending" Advanced)
  are non-monotonic and read as a scrape artifact, not an intentional price
  ladder — this page uses a coherent ascending 3-tier price ladder instead
  while keeping the same layout shape (promo banner, "Trending" badge,
  section-grouped comparison tables).
-->
<script setup lang="ts">
  import {
    EmButton,
    EmCard,
    EmCardBody,
    EmCardHeader,
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
    { id: 'essential', name: 'Essential Plan', monthly: 19, trending: false, cta: 'Basic Access', variant: 'secondary' as const },
    { id: 'advanced', name: 'Advanced Plan', monthly: 39, trending: true, cta: 'Premium Access', variant: 'primary' as const },
    { id: 'pro', name: 'Pro Plan', monthly: 79, trending: false, cta: 'Elite Access', variant: 'secondary' as const },
  ]

  const prices = toRef(() => tiers.map(tier => ({
    ...tier,
    price: billing.value === 'yearly' ? Math.round(tier.monthly * 12 * 0.8) : tier.monthly,
    period: billing.value === 'yearly' ? '/year' : '/month',
  })))

  interface FeatureRow {
    label: string
    values: [Cell, Cell, Cell]
  }

  interface FeatureSection {
    title: string
    icon: string[]
    rows: FeatureRow[]
  }

  const sections: FeatureSection[] = [
    {
      title: 'Core Analytics',
      icon: ['M4 20h16', 'M8 20v-6M13 20V9M18 20v-11'],
      rows: [
        { label: 'Real-time dashboard', values: [true, true, true] },
        { label: 'Key metrics', values: [true, true, true] },
        { label: 'Custom date range & filters', values: [true, true, true] },
        { label: 'Product performance insights', values: [true, true, true] },
        { label: 'Growth trends', values: [false, true, true] },
        { label: 'Goal & target tracking', values: ['Basic', 'Advanced', 'Advanced'] },
        { label: 'Data export (CSV / PDF)', values: ['CSV', 'CSV + PDF', 'CSV + PDF'] },
      ],
    },
    {
      title: 'Growth Insights',
      icon: ['M5 19V5l14 7-14 7Z'],
      rows: [
        { label: 'User engagement insights', values: ['Basic', 'Advanced', 'Advanced'] },
        { label: 'Conversion funnels', values: [false, true, true] },
        { label: 'Audience segmentation', values: [false, 'Limited', 'Unlimited'] },
        { label: 'Performance comparisons', values: [false, false, true] },
        { label: 'Retention & cohort analysis', values: [false, true, true] },
      ],
    },
    {
      title: 'Team & Support',
      icon: ['M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z', 'M23 21v-2a4 4 0 0 0-3-3.87', 'M16 3.13a4 4 0 0 1 0 7.75'],
      rows: [
        { label: 'Team members', values: ['1', 'Up to 3', '10+'] },
        { label: 'Integrations & API', values: ['Limited', 'Standard', 'Unlimited'] },
        { label: 'Support level', values: ['Email', 'Priority', 'Dedicated'] },
      ],
    },
  ]
</script>

<template>
  <EmeraldShell>
    <div class="adm-pricing" data-theme="emerald">
      <header class="adm-pricing__head">
        <span class="adm-pricing__eyebrow">Pricing</span>
        <h1 class="adm-pricing__title">Pricing Details</h1>
        <p class="adm-pricing__sub">A comprehensive breakdown of our pricing plans to help you make the best choice.</p>

        <EmTabs v-model="billing" class="adm-pricing__toggle">
          <EmTabsList label="Billing period">
            <EmTabsItem value="monthly">Monthly</EmTabsItem>
            <EmTabsItem value="yearly">Yearly</EmTabsItem>
          </EmTabsList>
        </EmTabs>
      </header>

      <div class="adm-pricing__promo">
        <EmCard class="adm-pricing__promo-card" variant="simple">
          <EmCardBody>
            <span class="adm-pricing__promo-label">Flat</span>
            <strong class="adm-pricing__promo-amount">20<small>% off</small></strong>
            <span class="adm-pricing__promo-copy">For the first 250 teams — hurry up and lock it in now.</span>
          </EmCardBody>
        </EmCard>

        <EmCard
          v-for="tier in prices"
          :key="tier.id"
          class="adm-pricing__tier"
          :class="{ 'adm-pricing__tier--trending': tier.trending }"
          variant="simple"
        >
          <EmCardBody class="adm-pricing__tier-body">
            <EmTag v-if="tier.trending" class="adm-pricing__trending" variant="danger">Trending</EmTag>

            <span class="adm-pricing__tier-name">{{ tier.name }}</span>

            <p class="adm-pricing__tier-price">
              <span class="adm-pricing__tier-amount">${{ tier.price }}</span>
              <span class="adm-pricing__tier-period">{{ tier.period }}</span>
            </p>

            <EmButton class="adm-pricing__tier-cta" :variant="tier.variant">{{ tier.cta }}</EmButton>
          </EmCardBody>
        </EmCard>
      </div>

      <EmCard v-for="section in sections" :key="section.title" variant="simple">
        <EmCardHeader class="adm-pricing__section-head">
          <span aria-hidden="true" class="adm-pricing__section-icon"><svg
            fill="none"
            height="18"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.75"
            viewBox="0 0 24 24"
            width="18"
          ><path v-for="(d, index) in section.icon" :key="index" :d /></svg></span>

          <h2 class="adm-pricing__section-title">{{ section.title }}</h2>
        </EmCardHeader>

        <EmCardBody class="adm-pricing__table-wrap">
          <table class="adm-pricing__table">
            <thead>
              <tr>
                <th scope="col"><span class="adm-pricing__sr-only">Feature</span></th>
                <th v-for="tier in prices" :key="tier.id" scope="col">{{ tier.name.replace(' Plan', '') }}</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="row in section.rows" :key="row.label">
                <th scope="row">{{ row.label }}</th>

                <td v-for="(value, index) in row.values" :key="index">
                  <span v-if="value === true" aria-label="Included" class="adm-pricing__check">
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

                  <span v-else-if="value === false" aria-label="Not included" class="adm-pricing__dash">&ndash;</span>

                  <span v-else>{{ value }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </EmCardBody>
      </EmCard>

      <div class="adm-pricing__foot">
        <EmButton v-for="tier in prices" :key="tier.id" :variant="tier.variant">{{ tier.cta }}</EmButton>
      </div>
    </div>
  </EmeraldShell>
</template>

<style>
  .adm-pricing {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-l, 20px);
  }

  .adm-pricing .emerald-card {
    background: var(--emerald-background, #fefefe);
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
    border-radius: var(--emerald-radius-xl, 12px);
    box-shadow: var(--emerald-shadow-s, 0 0 2px 0 rgba(51, 51, 51, 0.08));
  }

  .adm-pricing__head {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    text-align: center;
    padding: var(--emerald-spacing-m, 16px) 0;
  }

  .adm-pricing__eyebrow {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .adm-pricing__title {
    margin: 0;
    font-size: clamp(1.5rem, 3vw, 2rem);
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--emerald-on-surface, #2b2d2e);
  }

  .adm-pricing__sub {
    max-width: 34rem;
    margin: 0;
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .adm-pricing__toggle {
    margin-top: var(--emerald-spacing-s, 12px);
  }

  .adm-pricing__promo {
    display: grid;
    grid-template-columns: minmax(0, 0.8fr) repeat(3, minmax(0, 1fr));
    gap: var(--emerald-spacing-m, 16px);
  }

  .adm-pricing__promo-card {
    display: flex;
    border-style: dashed;
  }

  .adm-pricing__promo-card .emerald-card-body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 4px;
  }

  .adm-pricing__promo-label {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 700;
    text-transform: uppercase;
  }

  .adm-pricing__promo-amount {
    font-size: 2.25rem;
    font-weight: 800;
    color: var(--emerald-danger-500, #c61424);
  }

  .adm-pricing__promo-amount small {
    font-size: 1rem;
    font-weight: 700;
  }

  .adm-pricing__promo-copy {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-pricing__tier-body {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-pricing__tier--trending .emerald-card-body,
  .adm-pricing__tier--trending {
    border-color: var(--emerald-primary-600, #1fae60);
  }

  .adm-pricing__trending {
    position: absolute;
    top: 0;
    right: 0;
  }

  .adm-pricing__tier-name {
    font-weight: 700;
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-pricing__tier-price {
    display: flex;
    align-items: baseline;
    gap: 4px;
    margin: 0;
  }

  .adm-pricing__tier-amount {
    font-size: 2rem;
    font-weight: 800;
    letter-spacing: -0.02em;
  }

  .adm-pricing__tier-period {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-pricing__tier-cta {
    width: 100%;
  }

  .adm-pricing__section-head {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--emerald-spacing-xs, 8px);
    margin-bottom: 0;
    padding-bottom: 0;
  }

  .adm-pricing__section-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: var(--emerald-radius-m, 8px);
    background: var(--emerald-neutral-200, #f6f8fa);
    color: var(--emerald-on-surface, #2b2d2e);
  }

  .adm-pricing__section-title {
    margin: 0;
    font-size: var(--emerald-text-b1-size, 16px);
    font-weight: 700;
  }

  .adm-pricing__table-wrap {
    overflow-x: auto;
    padding-top: var(--emerald-spacing-s, 12px);
  }

  .adm-pricing__table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-pricing__table th,
  .adm-pricing__table td {
    padding: var(--emerald-spacing-s, 12px);
    text-align: center;
    border-bottom: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-200, #f6f8fa);
  }

  .adm-pricing__table thead th {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 700;
  }

  .adm-pricing__table tbody th {
    font-weight: 400;
    text-align: left;
  }

  .adm-pricing__sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }

  .adm-pricing__check {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: var(--emerald-primary-100, #e7fff2);
    color: var(--emerald-primary-700, #027d4c);
  }

  .adm-pricing__dash {
    color: var(--emerald-neutral-400, #aeb6be);
  }

  .adm-pricing__foot {
    display: flex;
    justify-content: center;
    gap: var(--emerald-spacing-s, 12px);
  }

  @media (max-width: 1100px) {
    .adm-pricing__promo {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 640px) {
    .adm-pricing__promo {
      grid-template-columns: 1fr;
    }

    .adm-pricing__foot {
      flex-direction: column;
    }
  }
</style>
