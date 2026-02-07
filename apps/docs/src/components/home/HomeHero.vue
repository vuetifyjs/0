<script setup lang="ts">
  // Framework
  import { useLogger } from '@vuetify/v0'

  // Composables
  import { useAsk } from '@/composables/useAsk'

  // Utilities
  import { onMounted, shallowRef } from 'vue'

  const ask = useAsk()

  const logger = useLogger()
  const stats = shallowRef({
    stars: '—',
    downloads: '—',
  })

  onMounted(async () => {
    try {
      const newStats = { stars: '—', downloads: '—' }

      const [ghRes, npmRes] = await Promise.all([
        fetch('https://api.github.com/repos/vuetifyjs/0'),
        fetch('https://api.npmjs.org/downloads/point/last-month/@vuetify/v0'),
      ])

      if (ghRes.ok) {
        const gh = await ghRes.json()
        newStats.stars = formatNumber(gh.stargazers_count)
      }

      if (npmRes.ok) {
        const npm = await npmRes.json()
        newStats.downloads = formatNumber(npm.downloads)
      }

      stats.value = newStats
    } catch (error) {
      logger.warn('Failed to fetch stats', error)
    }
  })

  function formatNumber (num: number): string {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }
</script>

<template>
  <section class="home-hero relative text-center py-24 md:py-32 lg:py-40">

    <img
      alt="Vuetify0 Logo"
      class="relative mx-auto h-[120px] md:h-[164px] w-auto mb-10"
      decoding="async"
      fetchpriority="high"
      height="164"
      src="https://cdn.vuetifyjs.com/docs/images/one/logos/vzero.svg"
      width="189"
    >

    <h1 class="relative text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none mb-6">
      The AI-native headless framework
      <br>
      <span class="text-gradient">for Vue</span>
    </h1>

    <p class="relative text-lg md:text-xl opacity-60 max-w-[640px] mx-auto mb-10 leading-relaxed">
      Accessible composable-first primitives with AI-integrated docs, published benchmarks, and the backing of Vuetify.
    </p>

    <div class="relative flex flex-col items-center gap-6 mb-16">
      <div class="grid grid-cols-2 md:flex gap-4 justify-center">
        <router-link
          class="home-hero-cta-primary px-8 py-3.5 bg-primary text-on-primary rounded-xl font-semibold text-lg text-center whitespace-nowrap transition-all duration-150"
          to="/introduction/getting-started"
        >
          Get Started
        </router-link>

        <button
          aria-haspopup="dialog"
          class="px-8 py-3.5 bg-surface text-on-surface rounded-xl font-semibold text-lg border text-center whitespace-nowrap hover:bg-surface-tint hover:border-primary transition-all duration-150 inline-flex items-center justify-center gap-2"
          type="button"
          @click="ask.open(); ask.focus()"
        >
          <AppIcon icon="create" :size="18" />
          Try Ask AI
        </button>
      </div>

      <HomeCopyCommand command="pnpm add @vuetify/v0" />
    </div>

    <div class="relative grid grid-cols-2 md:flex gap-4 md:gap-12 justify-center text-center">
      <div>
        <div class="stat-number min-w-[4ch]">{{ stats.stars }}</div>
        <div class="stat-label">GitHub Stars</div>
      </div>

      <div class="hidden md:block w-px bg-divider" />

      <div>
        <div class="stat-number min-w-[4ch]">{{ stats.downloads }}</div>
        <div class="stat-label">Monthly Downloads</div>
      </div>

      <div class="hidden md:block w-px bg-divider" />

      <div>
        <div class="stat-number">100%</div>
        <div class="stat-label">TypeScript</div>
      </div>

      <div class="hidden md:block w-px bg-divider" />

      <div>
        <div class="stat-number">0</div>
        <div class="stat-label">Style Opinions</div>
      </div>
    </div>
  </section>
</template>

<style scoped>

  .home-hero-cta-primary {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--v0-primary) 15%, transparent);
  }

  .home-hero-cta-primary:hover {
    box-shadow: 0 0 20px 4px color-mix(in srgb, var(--v0-primary) 15%, transparent);
  }
</style>
