<script setup lang="ts">
  import {
    EmCard,
    EmCardBody,
    EmCardSubtitle,
    EmCardTitle,
  } from '@paper/emerald'

  // Context
  import EmeraldShell from './EmeraldShell.vue'

  // Utilities
  import { RouterLink } from 'vue-router'

  const features = [
    {
      title: 'Composable building blocks',
      body: 'Headless v0 primitives under every Em* control — selection, forms, disclosure, and more.',
    },
    {
      title: 'Token-first theming',
      body: 'Figma-bound color, type, spacing, and motion published as CSS variables out of the box.',
    },
    {
      title: 'Accessible by default',
      body: 'ARIA roles, keyboard paths, and focus management stay on the v0 compounds Emerald paints.',
    },
    {
      title: 'Shells and compounds',
      body: 'Fixed controls as single SFCs; variable trees as multi-file compounds — no named-slot zoo.',
    },
    {
      title: 'Kit interop',
      body: 'Publishes --v0-* aliases so Genesis chrome inherits brand without dual themes.',
    },
  ]
</script>

<template>
  <EmeraldShell bare>
    <div class="eft">
      <div class="eft-grid">
        <section class="eft-intro">
          <h1 class="eft-title">Everything to grow your store</h1>

          <p class="eft-body">
            The complete toolkit to build, manage, and scale your online business seamlessly.
          </p>

          <RouterLink class="eft-cta" to="/emerald/contact">See all features →</RouterLink>
        </section>

        <EmCard
          v-for="(f, index) in features"
          :key="f.title"
          class="eft-card"
          :class="{ 'eft-card--wide': index === 3 }"
          variant="simple"
        >
          <EmCardBody class="eft-card__body">
            <span aria-hidden="true" class="eft-card__icon" />
            <EmCardTitle class="eft-card__title">{{ f.title }}</EmCardTitle>
            <EmCardSubtitle class="eft-card__sub">{{ f.body }}</EmCardSubtitle>
          </EmCardBody>
        </EmCard>
      </div>
    </div>
  </EmeraldShell>
</template>

<style>
  .eft {
    min-height: 100vh;
    min-height: 100dvh;
    padding: clamp(2rem, 5vw, 4rem) clamp(1.25rem, 4vw, 3rem);
    background: var(--ed-bg, var(--emerald-neutral-200, #f6f8fa));
  }

  .eft-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--emerald-spacing-m, 16px);
    max-width: 1100px;
    margin: 0 auto;
  }

  .eft-intro {
    display: flex;
    flex-direction: column;
    gap: 12px;
    justify-content: center;
    padding: 8px 8px 24px;
    grid-column: 1;
  }

  .eft-title {
    margin: 0;
    font-size: clamp(1.5rem, 2.5vw, 2rem);
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.02em;
    color: var(--ed-text, var(--emerald-on-surface, #2b2d2e));
  }

  .eft-body {
    margin: 0;
    color: var(--ed-muted, var(--emerald-on-surface-variant, #757e85));
    font-size: 16px;
    line-height: 1.5;
  }

  .eft-cta {
    margin-top: 8px;
    color: var(--emerald-primary-700, #027d4c);
    font-weight: 700;
    font-size: 14px;
    text-decoration: none;
  }

  .eft-cta:hover {
    text-decoration: underline;
  }

  .eft-card.emerald-card {
    background: var(--ed-surface, var(--emerald-background, #fefefe));
    border: var(--emerald-stroke-s, 1px) solid var(--ed-border, var(--emerald-neutral-300, #ccd6e7));
    border-radius: var(--emerald-radius-xl, 12px);
    padding: var(--emerald-spacing-l, 20px);
    min-height: 200px;
  }

  .eft-card__body {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .eft-card__icon {
    width: 36px;
    height: 36px;
    border-radius: var(--emerald-radius-m, 8px);
    background: var(--emerald-primary-100, #e7fff2);
    margin-bottom: 4px;
  }

  .eft-card__title {
    font-size: 16px !important;
    font-weight: 700 !important;
    line-height: 1.35 !important;
  }

  .eft-card__sub {
    font-size: 14px !important;
    line-height: 1.45 !important;
  }

  @media (max-width: 900px) {
    .eft {
      padding-top: calc(3.5rem + env(safe-area-inset-top, 0px));
    }

    .eft-grid {
      grid-template-columns: 1fr;
    }

    .eft-intro {
      grid-column: auto;
    }
  }
</style>
