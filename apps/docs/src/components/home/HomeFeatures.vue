<script lang="ts" setup>
  const features = [
    {
      icon: 'layers',
      title: 'Unstyled & Headless',
      description: 'Zero CSS opinions. Complete control over markup, classes, and design tokens. Build any visual identity without fighting defaults.',
    },
    {
      icon: 'puzzle',
      title: 'Composable Architecture',
      description: 'Tree-shakable utilities with consistent patterns. Mix and match components with composables. Use only what you need.',
    },
    {
      icon: 'shield',
      title: 'Accessibility First',
      description: 'WAI-ARIA patterns, keyboard navigation, focus management, and screen reader support baked into every component.',
    },
    {
      icon: 'typescript',
      title: 'TypeScript Native',
      description: 'Full type inference, strict mode, and IntelliSense support. Designed from the ground up with TypeScript.',
    },
    {
      icon: 'tailwind',
      title: 'CSS Framework Ready',
      description: 'Works seamlessly with Tailwind CSS, UnoCSS, or any utility-first framework. Style components your way.',
    },
    {
      icon: 'vuetify-play',
      title: 'Vuetify Play Support',
      description: 'Prototype and share components instantly in Vuetify Play. Test ideas without local setup.',
    },
  ]
</script>

<template>
  <section class="home-features py-16 md:py-20">
    <h2 class="text-2xl md:text-3xl font-bold text-center mb-4">
      Why Vuetify0?
    </h2>

    <p class="opacity-60 text-center mb-12 max-w-[600px] mx-auto">
      Built for developers who want complete control without sacrificing developer experience.
    </p>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="feature in features"
        :key="feature.title"
        class="feature-card p-6 rounded-xl border bg-surface/30 hover:bg-surface/50 transition-colors"
      >
        <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-on-primary">
          <AppIcon :icon="feature.icon" :size="20" />
        </div>

        <h3 class="text-lg font-semibold mb-2">{{ feature.title }}</h3>
        <p class="opacity-60 text-sm leading-relaxed">{{ feature.description }}</p>
      </div>
    </div>
  </section>
</template>
