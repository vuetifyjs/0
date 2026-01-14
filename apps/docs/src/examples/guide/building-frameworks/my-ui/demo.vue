<script setup lang="ts">
  /**
   * This demo shows how an end-user would consume @example/my-ui
   *
   * In a real app, they would:
   * 1. Install: pnpm add @example/my-ui @vuetify/v0
   * 2. Register plugin in main.ts
   * 3. Use components
   */

  // Utilities
  import { shallowRef } from 'vue'

  // In a real app: import { MyButton, MyTabs, MyAccordion } from '@example/my-ui'
  import MyAccordion from './src/components/MyAccordion.vue'
  import MyButton from './src/components/MyButton.vue'
  import MyTabs from './src/components/MyTabs.vue'

  const activeTab = shallowRef('overview')
  const expandedItems = shallowRef<string[]>(['getting-started'])

  const tabs = [
    { value: 'overview', label: 'Overview' },
    { value: 'features', label: 'Features' },
    { value: 'api', label: 'API' },
  ]

  const accordionItems = [
    { value: 'getting-started', title: 'Getting Started' },
    { value: 'installation', title: 'Installation' },
    { value: 'configuration', title: 'Configuration' },
  ]
</script>

<template>
  <div class="space-y-8">
    <p class="text-sm text-on-surface-variant">
      Example library built on v0 — see <code>my-ui/</code> source
    </p>

    <!-- Buttons -->
    <section>
      <h3 class="text-sm font-semibold mb-3">MyButton</h3>
      <div class="flex flex-wrap gap-2">
        <MyButton>Default</MyButton>
        <MyButton variant="outlined">Outlined</MyButton>
        <MyButton variant="text">Text</MyButton>
        <MyButton color="neutral">Neutral</MyButton>
        <MyButton size="sm">Small</MyButton>
        <MyButton size="lg">Large</MyButton>
        <MyButton disabled>Disabled</MyButton>
        <MyButton as="a" href="#">Link</MyButton>
      </div>
    </section>

    <!-- Tabs -->
    <section>
      <h3 class="text-sm font-semibold mb-3">MyTabs</h3>
      <MyTabs v-model="activeTab" :items="tabs">
        <template #overview>
          <p>Overview panel content. The tabs handle keyboard navigation automatically.</p>
        </template>
        <template #features>
          <p>Features panel content. Arrow keys, Home, and End all work.</p>
        </template>
        <template #api>
          <p>API panel content. ARIA attributes are managed by v0.</p>
        </template>
      </MyTabs>
    </section>

    <!-- Accordion -->
    <section>
      <h3 class="text-sm font-semibold mb-3">MyAccordion</h3>
      <MyAccordion v-model="expandedItems" :items="accordionItems" multiple>
        <template #getting-started>
          Install the package and register the plugin in your Vue app.
        </template>
        <template #installation>
          <code>pnpm add @example/my-ui @vuetify/v0</code>
        </template>
        <template #configuration>
          Pass theme options to MyUIPlugin() for custom colors.
        </template>
      </MyAccordion>
    </section>
  </div>
</template>
