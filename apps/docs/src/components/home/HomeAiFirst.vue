<script setup lang="ts">
  const features = [
    {
      icon: 'vuetify-mcp',
      title: 'Vuetify MCP',
      description: 'One command connects Claude, Cursor, or Windsurf to every v0 API.',
      command: 'claude mcp add --transport http vuetify-mcp https://mcp.vuetifyjs.com/mcp',
      to: '/guide/tooling/vuetify-mcp',
    },
    {
      icon: 'book',
      title: 'SKILL.md',
      description: 'Comprehensive reference with decision trees and anti-patterns for AI coding tools.',
      command: 'npx skills add vuetifyjs/0',
      to: '/guide/tooling/ai-tools#usage',
    },
    {
      icon: 'create',
      title: 'Ask AI',
      description: 'Built into every docs page. Sends examples, API specs, and benchmarks as context.',
      to: '/guide/tooling/ai-tools',
    },
    {
      icon: 'vuetify-0',
      title: 'AI-Ready Scaffold',
      description: 'Scaffold a Vue or Nuxt project with Vuetify MCP pre-configured in one command.',
      command: 'pnpm create vuetify0 --name=my-app --features=mcp',
      to: '/guide/tooling/vuetify-cli',
    },
  ]
</script>

<template>
  <section class="home-ai-first py-20 md:py-28">
    <div class="text-center mb-12">
      <p class="section-overline mb-3">AI-FIRST DEVELOPMENT</p>

      <h2 class="text-2xl md:text-4xl font-bold tracking-tight mb-4">
        Your AI assistant already knows v0
      </h2>

      <p class="opacity-60 max-w-[640px] mx-auto leading-relaxed">
        First-class MCP server. Machine-readable SKILL.md. Context-aware AI search. Multiple AI doc formats.
      </p>
    </div>

    <div
      class="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      <div
        v-for="(feature, i) in features"
        :key="feature.title"
        class="relative overflow-hidden p-6 rounded-xl border bg-surface hover:border-primary hover:bg-surface-tint hover:shadow-md transition-all duration-150 flex flex-col"
        :style="{ '--reveal-index': i }"
      >
        <AppDotGrid v-if="feature.title === 'Vuetify MCP'" :coverage="60" :density="18" origin="top right" />
        <AppDotGrid v-else-if="feature.title === 'AI-Ready Scaffold'" :coverage="60" :density="18" />

        <div class="relative flex items-center gap-3 mb-3">
          <div class="w-10 h-10 shrink-0 rounded-lg bg-primary flex items-center justify-center text-on-primary">
            <AppIcon class="!opacity-100" :icon="feature.icon" :size="20" />
          </div>

          <h3 class="text-lg font-semibold">{{ feature.title }}</h3>
        </div>

        <p class="relative opacity-60 text-sm leading-relaxed mb-4">{{ feature.description }}</p>

        <div class="relative mt-auto flex flex-col gap-4">
          <HomeCopyCommand
            v-if="feature.command"
            :command="feature.command"
          />

          <AppAskInline v-else />

          <router-link
            class="self-start mt-1 text-xs text-primary/70 hover:text-primary transition-colors inline-flex items-center gap-1"
            :to="feature.to"
          >
            Learn more
            <AppIcon icon="right" :size="12" />
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>
