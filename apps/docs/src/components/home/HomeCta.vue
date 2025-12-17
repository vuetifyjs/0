<script lang="ts" setup>
  import { RouterLink } from 'vue-router'

  const features = [
    {
      title: 'Documentation',
      description: 'Comprehensive guides, API references, and real-world examples.',
      to: '/introduction/getting-started',
      icon: 'book',
      internal: true,
      cta: 'Get Started',
    },
    {
      title: 'Vuetify Play',
      description: 'Prototype instantly in your browser. No setup—just code and share.',
      to: 'https://play.vuetifyjs.com',
      icon: 'vuetify-play',
      internal: false,
      cta: 'Open Playground',
    },
    {
      title: 'Vuetify MCP',
      description: 'AI-powered assistance with intelligent suggestions and instant API answers.',
      to: 'https://github.com/vuetifyjs/mcp',
      icon: 'vuetify-mcp',
      internal: false,
      cta: 'Learn More',
    },
    {
      title: 'Open Source',
      description: 'Built in the open. Contribute, report issues, or star the repo.',
      to: 'https://github.com/vuetifyjs/0',
      icon: 'github',
      internal: false,
      cta: 'View on GitHub',
    },
    {
      title: 'Community',
      description: 'Join thousands of developers. Get help, share ideas, showcase your work.',
      to: 'https://community.vuetifyjs.com',
      icon: 'discord',
      internal: false,
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
      <template v-for="feature in features" :key="feature.title">
        <RouterLink
          v-if="feature.internal"
          class="group flex items-center gap-5 p-4 rounded-xl border bg-surface/30 hover:bg-surface/50 hover:border-primary/50 transition-all cursor-pointer"
          :to="feature.to"
        >
          <div class="w-12 h-12 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center text-on-primary group-hover:bg-primary/20 transition-colors">
            <AppIcon :icon="feature.icon" :size="22" />
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-3">
              <h3 class="font-semibold group-hover:text-primary transition-colors">
                {{ feature.title }}
              </h3>
              <span class="text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                {{ feature.cta }}
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                </svg>
              </span>
            </div>
            <p class="opacity-60 text-sm">
              {{ feature.description }}
            </p>
          </div>
        </RouterLink>

        <a
          v-else
          class="group flex items-center gap-5 p-4 rounded-xl border bg-surface/30 hover:bg-surface/50 hover:border-primary/50 transition-all cursor-pointer"
          :href="feature.to"
          rel="noopener noreferrer"
          target="_blank"
        >
          <div class="w-12 h-12 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center text-on-primary group-hover:bg-primary/20 transition-colors">
            <AppIcon :icon="feature.icon" :size="22" />
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-3">
              <h3 class="font-semibold group-hover:text-primary transition-colors">
                {{ feature.title }}
              </h3>
              <span class="text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                {{ feature.cta }}
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                </svg>
              </span>
            </div>
            <p class="opacity-60 text-sm">
              {{ feature.description }}
            </p>
          </div>
        </a>
      </template>
    </div>
  </section>
</template>
