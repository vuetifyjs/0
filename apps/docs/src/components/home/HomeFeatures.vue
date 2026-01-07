<script setup lang="ts">
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
      icon: 'vapor',
      title: 'Vapor Ready',
      description: '100% compatible with Vue Vapor mode. Built for the future of Vue performance without the virtual DOM.',
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
      <HomeFeatureCard
        v-for="feature in features"
        :key="feature.title"
        :description="feature.description"
        :icon="feature.icon"
        :title="feature.title"
      />
    </div>
  </section>
</template>
