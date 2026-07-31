<script setup lang="ts">
  import {
    EmExpansionPanel,
    EmExpansionPanelActivator,
    EmExpansionPanelContent,
    EmExpansionPanelCue,
    EmExpansionPanelGroup,
    EmExpansionPanelHeader,
  } from '@paper/emerald'

  // Context
  import EmeraldShell from './EmeraldShell.vue'

  // Utilities
  import { RouterLink } from 'vue-router'

  const items = [
    {
      q: 'What is included in the Free plan?',
      a: 'Core composables and components, community support, and unlimited personal projects. Commercial apps need a paid plan.',
    },
    {
      q: 'Can I upgrade or downgrade anytime?',
      a: 'Yes. Changes take effect on your next billing cycle. Downgrades keep access until the period ends.',
    },
    {
      q: 'Do you offer agency discounts?',
      a: 'Agencies with 5+ seats can request volume pricing from sales. Contact us for a custom quote.',
    },
    {
      q: 'Is there a free trial?',
      a: 'Pro includes a 14-day trial. No card required for Free.',
    },
    {
      q: 'How does billing work?',
      a: 'Monthly or yearly via invoice or card. Yearly saves ~20%.',
    },
    {
      q: 'Where is my data hosted?',
      a: 'Regional options available. Defaults to US-East with EU residency on Enterprise.',
    },
  ]
</script>

<template>
  <EmeraldShell bare>
    <div class="ef">
      <section class="ef-copy">
        <h1 class="ef-title">Frequently asked questions</h1>

        <p class="ef-sub">
          Still have doubts? Contact our
          <RouterLink class="ef-link" to="/emerald/contact">Support team</RouterLink>.
        </p>
      </section>

      <section aria-label="FAQ" class="ef-list">
        <EmExpansionPanelGroup class="ef-accordion">
          <EmExpansionPanel v-for="item in items" :key="item.q">
            <EmExpansionPanelHeader>
              <EmExpansionPanelActivator>
                {{ item.q }}
                <EmExpansionPanelCue />
              </EmExpansionPanelActivator>
            </EmExpansionPanelHeader>

            <EmExpansionPanelContent>
              {{ item.a }}
            </EmExpansionPanelContent>
          </EmExpansionPanel>
        </EmExpansionPanelGroup>
      </section>
    </div>
  </EmeraldShell>
</template>

<style>
  .ef {
    display: grid;
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
    gap: clamp(1.5rem, 4vw, 4rem);
    align-items: start;
    min-height: 100vh;
    min-height: 100dvh;
    padding: clamp(2rem, 6vw, 5rem) clamp(1.5rem, 5vw, 4rem);
    background: var(--ed-bg, var(--emerald-neutral-200, #f6f8fa));
  }

  .ef-copy {
    position: sticky;
    top: 2rem;
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-width: 22rem;
  }

  .ef-title {
    margin: 0;
    font-size: clamp(1.75rem, 3vw, 2.25rem);
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.02em;
    color: var(--ed-text, var(--emerald-on-surface, #2b2d2e));
  }

  .ef-sub {
    margin: 0;
    color: var(--ed-muted, var(--emerald-on-surface-variant, #757e85));
    font-size: 16px;
    line-height: 1.5;
  }

  .ef-link {
    color: var(--emerald-primary-700, #027d4c);
    font-weight: 600;
    text-decoration: none;
  }

  .ef-link:hover {
    text-decoration: underline;
  }

  .ef-list {
    max-width: 32rem;
    width: 100%;
    margin-left: auto;
  }

  .ef-accordion {
    width: 100%;
  }

  @media (max-width: 900px) {
    .ef {
      grid-template-columns: 1fr;
    }

    .ef-copy {
      position: static;
      max-width: none;
    }

    .ef-list {
      margin-left: 0;
    }
  }
</style>
