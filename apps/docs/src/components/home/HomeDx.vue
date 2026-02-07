<script setup lang="ts">
  // Framework
  import { Atom } from '@vuetify/v0'

  // Composables
  import { useSettings } from '@/composables/useSettings'

  // Utilities
  import { useRouter } from 'vue-router'

  // Data
  import { themes } from '@/themes/index'

  const settings = useSettings()
  const router = useRouter()

  const themeSwatches = Object.values(themes).slice(0, 6).map(t => ({
    id: t.id,
    label: t.label,
    color: t.colors.primary,
  }))

  const features = [
    {
      icon: 'vuetify-play',
      title: 'Vuetify Play',
      description: 'Every example opens in a live playground. No setup, no CLI.',
      to: 'https://play.vuetifyjs.com',
    },
    {
      icon: 'shield',
      title: 'Skill-Level Filtering',
      description: 'Beginner, intermediate, advanced. Docs that match your experience.',
      to: '/guide/essentials/using-the-docs#skill-levels-learning-tracks',
      showLevels: true,
    },
    {
      icon: 'medal',
      title: 'Interactive Tours',
      description: 'Step-by-step guided learning with spotlight highlights and progress tracking.',
      to: '/skillz',
      badge: 'Beta',
    },
    {
      icon: 'vuetify-cli',
      title: 'CLI Analyze',
      description: 'Scans your project imports. Generates docs for only what you use.',
      to: '/guide/tooling/vuetify-cli',
    },
    {
      icon: 'vuetify-mcp',
      title: 'Vuetify MCP',
      description: 'AI-powered API lookup, component guidance, and code generation for your editor.',
      to: '/guide/tooling/vuetify-mcp',
    },
    {
      icon: 'tune',
      title: 'Personalized Docs',
      description: 'Themes, skill levels, and layout preferences. Configure your documentation experience.',
      action: 'settings',
      swatches: themeSwatches,
    },
  ]

  function getCardProps (feature: typeof features[number]) {
    if (feature.action) return { as: 'button' as const, type: 'button' }
    if (feature.to?.startsWith('/')) return { as: 'router-link' as const, to: feature.to }
    return { as: 'a' as const, href: feature.to, target: '_blank', rel: 'noopener' }
  }

  function handleClick (feature: typeof features[number], e: Event) {
    if (feature.action === 'settings') {
      e.preventDefault()
      router.push('/introduction/why-vuetify0').then(() => {
        settings.open()
      })
    }
  }
</script>

<template>
  <section class="home-dx py-20 md:py-28">
    <div class="text-center mb-12">
      <p class="section-overline mb-3">DEVELOPER EXPERIENCE</p>

      <h2 class="text-2xl md:text-4xl font-bold tracking-tight mb-4">
        Every tool you need, built in
      </h2>

      <p class="opacity-60 max-w-[640px] mx-auto leading-relaxed">
        We obsessed over every detail so you don't have to.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Atom
        v-for="feature in features"
        :key="feature.title"
        v-bind="getCardProps(feature)"
        class="p-6 rounded-xl border bg-surface hover:border-primary hover:bg-surface-tint hover:shadow-md transition-all duration-150 group text-left"
        @click="handleClick(feature, $event)"
      >
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 shrink-0 rounded-lg bg-primary flex items-center justify-center text-on-primary">
            <AppIcon class="!opacity-100" :icon="feature.icon" :size="20" />
          </div>

          <h3 class="text-lg font-semibold group-hover:text-primary transition-colors">{{ feature.title }}</h3>

          <span
            v-if="feature.badge"
            class="badge-base bg-warning/20 text-warning border border-warning/50"
          >
            {{ feature.badge }}
          </span>
        </div>

        <p class="opacity-60 text-sm leading-relaxed mb-4">{{ feature.description }}</p>

        <!-- Theme swatches -->
        <div v-if="feature.swatches" class="flex items-center gap-2">
          <div
            v-for="swatch in feature.swatches"
            :key="swatch.id"
            class="w-5 h-5 rounded-full border border-divider"
            :style="{ background: swatch.color }"
            :title="swatch.label"
          />
          <span class="text-xs opacity-40 ml-1">+{{ Object.keys(themes).length - 6 }} more</span>
        </div>

        <!-- Skill levels -->
        <div v-if="feature.showLevels" class="flex flex-wrap items-center gap-2">
          <AppLevelChip :active="true" :level="1" />
          <AppLevelChip :active="true" :level="2" />
          <AppLevelChip :active="true" :level="3" />
        </div>
      </Atom>
    </div>
  </section>
</template>
