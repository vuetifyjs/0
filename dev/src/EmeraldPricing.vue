<script setup lang="ts">
  import {
    EmButton,
    EmCard,
    EmCardBody,
    EmSwitch,
    EmTag,
  } from '@paper/emerald'

  // Context
  import EmeraldShell from './EmeraldShell.vue'

  // Utilities
  import { shallowRef, toRef } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  const yearly = shallowRef(false)

  const plans = toRef(() => [
    {
      name: 'Starter',
      price: 0,
      period: yearly.value ? '/yr' : '/mo',
      blurb: 'For individuals exploring Emerald.',
      features: ['Core Em* components', 'Theme tokens', 'Community support'],
      cta: 'Get started',
      variant: 'secondary' as const,
      featured: false,
    },
    {
      name: 'Pro',
      price: yearly.value ? 228 : 24,
      period: yearly.value ? '/yr' : '/mo',
      blurb: 'For teams shipping production apps.',
      features: ['Everything in Starter', 'Priority support', 'Design tokens sync', 'Commercial license'],
      cta: 'Start free trial',
      variant: 'primary' as const,
      featured: true,
    },
    {
      name: 'Enterprise',
      price: null as number | null,
      period: '',
      blurb: 'Security, SLAs, and custom contracts.',
      features: ['Everything in Pro', 'SSO / SAML', 'Dedicated success', 'Custom SLAs'],
      cta: 'Contact sales',
      variant: 'secondary' as const,
      featured: false,
    },
  ])
</script>

<template>
  <EmeraldShell bare>
    <div class="ep">
      <header class="ep-head">
        <EmTag variant="success">Pricing</EmTag>
        <h1 class="ep-title">Simple, transparent pricing</h1>
        <p class="ep-sub">Choose a plan that fits your team. Cancel anytime.</p>

        <div class="ep-toggle">
          <span :data-on="!yearly || undefined">Monthly</span>
          <EmSwitch v-model="yearly" size="sm" />
          <span :data-on="yearly || undefined">Yearly</span>
          <EmTag v-if="yearly" variant="info">Save 20%</EmTag>
        </div>
      </header>

      <div class="ep-grid">
        <EmCard
          v-for="plan in plans"
          :key="plan.name"
          class="ep-card"
          :class="{ 'ep-card--featured': plan.featured }"
          variant="simple"
        >
          <EmCardBody class="ep-card__body">
            <div class="ep-card__top">
              <h2 class="ep-card__name">{{ plan.name }}</h2>
              <p class="ep-card__blurb">{{ plan.blurb }}</p>
            </div>

            <p class="ep-card__price">
              <template v-if="plan.price === null">Custom</template>

              <template v-else>
                <span class="ep-card__amount">${{ plan.price }}</span>
                <span class="ep-card__period">{{ plan.period }}</span>
              </template>
            </p>

            <ul class="ep-card__features">
              <li v-for="f in plan.features" :key="f">{{ f }}</li>
            </ul>

            <EmButton
              class="ep-card__cta"
              :variant="plan.variant"
              @click="plan.name === 'Enterprise' ? router.push('/emerald/contact') : undefined"
            >
              {{ plan.cta }}
            </EmButton>
          </EmCardBody>
        </EmCard>
      </div>
    </div>
  </EmeraldShell>
</template>

<style>
  .ep {
    min-height: 100vh;
    min-height: 100dvh;
    padding: clamp(2rem, 5vw, 3.5rem) clamp(1.25rem, 4vw, 3rem) 4rem;
    background: var(--ed-bg, #f6f8fa);
  }

  .ep-head {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    text-align: center;
    margin-bottom: 2rem;
  }

  .ep-title {
    margin: 0;
    font-size: clamp(1.5rem, 2.5vw, 2rem);
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .ep-sub {
    margin: 0;
    color: var(--ed-muted, #757e85);
    max-width: 32rem;
  }

  .ep-toggle {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    margin-top: 8px;
    font-size: 14px;
    color: var(--ed-muted, #757e85);
  }

  .ep-toggle [data-on] {
    color: var(--ed-text, #2b2d2e);
    font-weight: 600;
  }

  .ep-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
    max-width: 1080px;
    margin: 0 auto;
  }

  .ep-card.emerald-card {
    background: var(--ed-surface, #fefefe);
    border: 1px solid var(--ed-border, #ccd6e7);
    border-radius: 12px;
    padding: 24px;
    height: 100%;
  }

  .ep-card--featured.emerald-card {
    border-color: var(--emerald-primary-600, #1fae60);
    box-shadow: var(--emerald-shadow-m, 0 2px 4px 0 rgba(51, 51, 51, 0.12));
  }

  .ep-card__body {
    display: flex;
    flex-direction: column;
    gap: 16px;
    height: 100%;
  }

  .ep-card__name {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 700;
  }

  .ep-card__blurb {
    margin: 4px 0 0;
    color: var(--ed-muted, #757e85);
    font-size: 14px;
  }

  .ep-card__price {
    margin: 0;
    font-size: 1.75rem;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .ep-card__period {
    font-size: 14px;
    font-weight: 500;
    color: var(--ed-muted, #757e85);
  }

  .ep-card__features {
    margin: 0;
    padding: 0 0 0 1.1rem;
    flex: 1;
    color: var(--ed-text, #2b2d2e);
    font-size: 14px;
    line-height: 1.6;
  }

  .ep-card__cta {
    width: 100%;
  }

  @media (max-width: 900px) {
    .ep {
      padding-top: calc(3.5rem + env(safe-area-inset-top, 0px));
    }

    .ep-grid {
      grid-template-columns: 1fr;
      max-width: 400px;
    }
  }
</style>
