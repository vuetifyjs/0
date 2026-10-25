<script setup lang="ts">
  import { useHead } from '@unhead/vue'

  // Material Design 1 loads no fonts. The specimen loads all six Roboto
  // weights, upright and italic, from Google Fonts.
  useHead({
    link: [{
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap',
    }],
  })

  const WEIGHTS = [
    { weight: 100, name: 'Thin' },
    { weight: 300, name: 'Light' },
    { weight: 400, name: 'Regular' },
    { weight: 500, name: 'Medium' },
    { weight: 700, name: 'Bold' },
    { weight: 900, name: 'Black' },
  ] as const
</script>

<template>
  <div class="md1-docs-roboto">
    <div class="md1-docs-roboto-hero">
      <p class="md1-docs-roboto-name">Roboto</p>

      <p class="md1-docs-roboto-set">ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>

      <p class="md1-docs-roboto-set">abcdefghijklmnopqrstuvwxyz</p>

      <p class="md1-docs-roboto-set">0123456789 !?&amp;@%$€£</p>
    </div>

    <dl class="md1-docs-roboto-weights">
      <div v-for="item in WEIGHTS" :key="item.weight" class="md1-docs-roboto-weight">
        <dt class="md1-docs-roboto-label">{{ item.name }} {{ item.weight }}</dt>

        <dd class="md1-docs-roboto-sample" :style="{ fontWeight: item.weight }">
          Roboto {{ item.name }} <em class="md1-docs-roboto-italic">Italic</em>
        </dd>
      </div>
    </dl>
  </div>
</template>

<style>
  .md1-docs-roboto {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
    gap: var(--md1-spacing-3, 24px) var(--md1-spacing-5, 40px);
    width: 100%;
    font-family: Roboto, sans-serif;
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  .md1-docs-roboto-hero {
    min-width: 0;
  }

  .md1-docs-roboto-name {
    margin: 0 0 var(--md1-spacing-1, 8px);
    font-size: 56px;
    font-weight: 400;
    line-height: 1.2;
  }

  /* The set breaks anywhere so the alphabet wraps on a phone instead of overflowing. */
  .md1-docs-roboto-set {
    margin: 0;
    font-size: 20px;
    line-height: 32px;
    letter-spacing: 0.04em;
    overflow-wrap: anywhere;
  }

  .md1-docs-roboto-weights {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-1, 8px);
    margin: 0;
  }

  .md1-docs-roboto-weight {
    display: flex;
    flex-direction: column;
  }

  .md1-docs-roboto-label {
    font-size: 12px;
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .md1-docs-roboto-sample {
    margin: 0;
    font-size: 24px;
    line-height: 32px;
  }

  .md1-docs-roboto-italic {
    font-style: italic;
  }
</style>
