<script setup lang="ts">
  // Composables
  import { usePlayground } from '@/composables/playground'

  const starterCode = `<script setup lang="ts">
import { Selection } from '@vuetify/v0'
import { ref } from 'vue'

const selected = ref([])
<\/script>

<template>
  <Selection.Root v-model="selected" multiple>
    <Selection.Item
      v-for="n in 3"
      :key="n"
      v-slot="{ isSelected, toggle }"
      :value="n"
    >
      <button @click="toggle">
        Option {{ n }} {{ isSelected ? '✓' : '' }}
      </button>
    </Selection.Item>
  </Selection.Root>

  <p>Selected: {{ selected }}</p>
</template>`

  const playgroundUrl = usePlayground(starterCode)

  const features = [
    {
      title: 'Getting Started',
      description: 'Comprehensive guides, API references, and real-world examples.',
      to: '/introduction/getting-started',
      icon: 'book',
      cta: 'Get Started',
    },
    {
      title: 'Using the Docs',
      description: 'Learn how to navigate the documentation and get the most out of it.',
      to: '/guide/essentials/using-the-docs',
      icon: 'map',
      cta: 'Learn How',
    },
    {
      title: 'Vuetify Play',
      description: 'Prototype instantly in your browser. No setup—just code and share.',
      to: playgroundUrl,
      icon: 'vuetify-play',
      cta: 'Open Playground',
    },
    {
      title: 'Vuetify MCP',
      description: 'AI-powered assistance with intelligent suggestions and instant API answers.',
      to: '/guide/tooling/vuetify-mcp',
      icon: 'vuetify-mcp',
      cta: 'Learn More',
    },
    {
      title: 'Open Source',
      description: 'Built in the open. Contribute, report issues, or star the repo.',
      to: 'https://github.com/vuetifyjs/0',
      icon: 'github',
      cta: 'View on GitHub',
    },
    {
      title: 'Community',
      description: 'Join thousands of developers. Get help, share ideas, showcase your work.',
      to: 'https://community.vuetifyjs.com',
      icon: 'discord',
      cta: 'Join Discord',
    },
  ]
</script>

<template>
  <section class="home-cta py-16 md:py-20">
    <div class="text-center mb-12">
      <h2 class="text-2xl md:text-3xl font-bold mb-4">
        Ready to build?
      </h2>
      <p class="opacity-60 max-w-[500px] mx-auto">
        Everything you need to start building with Vuetify0.
      </p>
    </div>

    <div class="space-y-4">
      <HomeFeatureLink
        v-for="feature in features"
        :key="feature.title"
        :cta="feature.cta"
        :description="feature.description"
        :icon="feature.icon"
        :title="feature.title"
        :to="feature.to"
      />
    </div>
  </section>
</template>
