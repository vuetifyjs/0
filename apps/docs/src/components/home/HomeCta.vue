<script setup lang="ts">
  const actions = [
    {
      title: 'Read Docs',
      description: 'Installation, guides, and API reference.',
      to: '/introduction/getting-started',
      icon: 'book',
    },
    {
      title: 'Open Playground',
      description: 'Try v0 in your browser. No setup required.',
      to: 'https://play.vuetifyjs.com',
      icon: 'vuetify-play',
    },
    {
      title: 'Join Discord',
      description: 'Get help, share ideas, showcase your work.',
      to: 'https://community.vuetifyjs.com',
      icon: 'discord',
    },
  ]
</script>

<template>
  <section class="home-cta py-20 md:py-28">
    <div class="text-center mb-12">
      <p class="section-overline mb-3">GET STARTED</p>

      <h2 class="text-2xl md:text-4xl font-bold tracking-tight mb-4">
        Build something real in 5 minutes
      </h2>
    </div>

    <!-- Install command -->
    <div class="flex justify-center mb-12">
      <HomeCopyCommand command="pnpm add @vuetify/v0" />
    </div>

    <!-- Action cards -->
    <div
      class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
    >
      <component
        :is="action.to.startsWith('/') ? 'router-link' : 'a'"
        v-for="(action, i) in actions"
        :key="action.title"
        class="p-6 rounded-xl border bg-surface hover:border-primary hover:bg-surface-tint hover:shadow-md transition-all duration-150 flex flex-col sm:flex-row items-start sm:items-center gap-4 group"
        :href="action.to.startsWith('/') ? undefined : action.to"
        :rel="action.to.startsWith('/') ? undefined : 'noopener'"
        :style="{ '--reveal-index': i }"
        :target="action.to.startsWith('/') ? undefined : '_blank'"
        :to="action.to.startsWith('/') ? action.to : undefined"
      >
        <div class="w-10 h-10 shrink-0 rounded-lg bg-primary flex items-center justify-center text-on-primary">
          <AppIcon class="!opacity-100" :icon="action.icon" :size="20" />
        </div>

        <div>
          <h3 class="font-semibold group-hover:text-primary transition-colors">{{ action.title }}</h3>
          <p class="text-sm opacity-60">{{ action.description }}</p>
        </div>
      </component>
    </div>

    <!-- Connect your AI -->
    <div class="text-center mb-8">
      <p class="text-sm font-semibold uppercase tracking-wider opacity-50 mb-6">Connect your AI</p>

      <router-link class="inline-block" to="/guide/tooling/vuetify-mcp">
        <img
          alt="Vuetify MCP"
          class="mx-auto mb-9 h-[64px]"
          src="https://cdn.vuetifyjs.com/docs/images/one/logos/vmcp.svg"
          title="Vuetify MCP"
        >
      </router-link>

      <div class="flex flex-col items-center gap-3">
        <HomeCopyCommand command="claude mcp add vuetify-mcp https://mcp.vuetifyjs.com/mcp" />
        <HomeCopyCommand command="npx skills add vuetifyjs/0" />
      </div>
    </div>

    <!-- Star on GitHub -->
    <div class="flex justify-center">
      <a
        class="px-6 py-2.5 bg-surface text-on-surface rounded-xl font-semibold border hover:bg-surface-tint hover:border-primary transition-all duration-150 text-sm inline-flex items-center gap-2"
        href="https://github.com/vuetifyjs/0"
        rel="noopener"
        target="_blank"
      >
        <AppIcon icon="github" :size="16" />
        Star on GitHub
      </a>
    </div>
  </section>
</template>
