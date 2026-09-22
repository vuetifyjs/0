<script setup lang="ts">
  import {
    EmButton,
    EmCard,
    EmCardBody,
    EmSelect,
    EmSelectActivator,
    EmSelectContent,
    EmSelectItem,
    EmSelectPlaceholder,
    EmSelectValue,
    EmTextField,
    EmTextarea,
  } from '@paper/emerald'

  // Context
  import EmeraldShell from './EmeraldShell.vue'

  // Utilities
  import { shallowRef } from 'vue'

  const name = shallowRef('')
  const email = shallowRef('')
  const size = shallowRef<string | undefined>()
  const message = shallowRef('')
  const submitted = shallowRef(false)

  function onSubmit () {
    submitted.value = true
  }
</script>

<template>
  <EmeraldShell bare>
    <div class="ec">
      <section class="ec-copy">
        <p class="ec-kicker">For agencies</p>
        <h1 class="ec-title">Supercharge your client campaigns</h1>

        <p class="ec-body">
          Get a personalized walkthrough of our platform. Learn how top agencies use our tools
          to automate reporting, manage ad spend, and drive ROI at scale.
        </p>
      </section>

      <section aria-label="Contact form" class="ec-hero">
        <EmCard class="ec-card" variant="complete">
          <EmCardBody class="ec-form">
            <EmTextField
              v-model="name"
              label="Full name *"
              placeholder="Type your name"
              required
            />

            <EmTextField
              v-model="email"
              label="Work email *"
              placeholder="you@company.com"
              required
              type="email"
            />

            <EmSelect v-model="size" label="Company size *">
              <EmSelectActivator>
                <EmSelectValue />
                <EmSelectPlaceholder>Please select</EmSelectPlaceholder>
              </EmSelectActivator>

              <EmSelectContent>
                <EmSelectItem value="1-10">1–10</EmSelectItem>
                <EmSelectItem value="11-50">11–50</EmSelectItem>
                <EmSelectItem value="51-200">51–200</EmSelectItem>
                <EmSelectItem value="201+">201+</EmSelectItem>
              </EmSelectContent>
            </EmSelect>

            <EmTextarea
              v-model="message"
              label="How can we help? *"
              placeholder="I have a question about..."
              required
              :rows="4"
            />

            <p class="ec-note">
              Applying for our community plan? Click
              <a href="#">here</a>
              for more info
            </p>

            <EmButton class="ec-submit" @click="onSubmit">
              Submit
            </EmButton>

            <p v-if="submitted" class="ec-thanks" role="status">
              Thanks — we'll be in touch (demo only).
            </p>
          </EmCardBody>
        </EmCard>
      </section>
    </div>
  </EmeraldShell>
</template>

<style>
  .ec {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
    min-height: 100vh;
    min-height: 100dvh;
    background: var(--ed-bg, var(--emerald-neutral-200, #f6f8fa));
  }

  .ec-copy {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: var(--emerald-spacing-m, 16px);
    padding: clamp(2rem, 6vw, 5rem) clamp(1.5rem, 5vw, 4.5rem);
    max-width: 34rem;
  }

  .ec-kicker {
    margin: 0;
    color: var(--emerald-primary-600, #1fae60);
    font-size: var(--emerald-text-b2-size, 14px);
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .ec-title {
    margin: 0;
    font-size: clamp(1.75rem, 3vw, 2.5rem);
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.02em;
    color: var(--ed-text, var(--emerald-on-surface, #2b2d2e));
  }

  .ec-body {
    margin: 0;
    color: var(--ed-muted, var(--emerald-on-surface-variant, #757e85));
    font-size: var(--emerald-text-b1-size, 16px);
    line-height: 1.55;
  }

  .ec-hero {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: clamp(1.5rem, 4vw, 3rem);
    background:
      linear-gradient(120deg, rgba(15, 23, 32, 0.35), rgba(15, 23, 32, 0.15)),
      url('/emerald/contact-hero.jpg') center / cover no-repeat;
    border-radius: 0;
  }

  .ec-card.emerald-card {
    width: min(100%, 501px);
    background: var(--emerald-background, #fefefe);
    border: 0;
    border-radius: var(--emerald-radius-m, 8px);
    box-shadow: var(--emerald-shadow-l, 0 5px 12px -1px rgba(51, 51, 51, 0.2));
  }

  .ec-form {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-m, 16px);
    width: 100%;
  }

  .ec-note {
    margin: 0;
    font-size: var(--emerald-text-b1-size, 16px);
    line-height: 1.5;
    color: var(--emerald-on-surface, #2b2d2e);
  }

  .ec-note a {
    color: var(--emerald-secondary-600, #00b4dc);
    font-weight: 600;
    text-decoration: none;
  }

  .ec-note a:hover {
    text-decoration: underline;
  }

  .ec-submit {
    width: 100%;
  }

  .ec-thanks {
    margin: 0;
    color: var(--emerald-primary-700, #027d4c);
    font-size: var(--emerald-text-b2-size, 14px);
    font-weight: 600;
  }

  @media (max-width: 960px) {
    .ec {
      grid-template-columns: 1fr;
    }

    .ec-copy {
      max-width: none;
      /* Clear fixed mobile menu FAB */
      padding-top: calc(3.5rem + env(safe-area-inset-top, 0px));
      padding-bottom: 1rem;
    }

    .ec-hero {
      min-height: 70vh;
    }
  }
</style>
