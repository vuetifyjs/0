<script lang="ts" setup>
  import { ref, onMounted } from 'vue'

  const stats = ref({
    stars: '—',
    downloads: '—',
  })

  onMounted(async () => {
    try {
      const [ghRes, npmRes] = await Promise.all([
        fetch('https://api.github.com/repos/vuetifyjs/0'),
        fetch('https://api.npmjs.org/downloads/point/last-month/@vuetify/v0'),
      ])

      if (ghRes.ok) {
        const gh = await ghRes.json()
        stats.value.stars = formatNumber(gh.stargazers_count)
      }

      if (npmRes.ok) {
        const npm = await npmRes.json()
        stats.value.downloads = formatNumber(npm.downloads)
      }
    } catch {
      // Silently fail - stats will show placeholder
    }
  })

  function formatNumber (num: number): string {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }
</script>

<template>
  <section class="home-hero text-center py-16 md:py-24">
    <router-link class="inline-block mb-8" to="/">
      <img
        alt="Vuetify0 Logo"
        class="mx-auto"
        height="56"
        src="https://cdn.vuetifyjs.com/docs/images/one/logos/vzero.svg"
        width="200"
      >
    </router-link>

    <h1 class="text-4xl md:text-5xl font-bold mb-6 leading-tight">
      Headless UI primitives
      <br>
      <span class="text-primary">for Vue</span>
    </h1>

    <p class="text-lg md:text-xl opacity-60 max-w-[640px] mx-auto mb-10 leading-relaxed">
      Unstyled, accessible components and composables for building design systems and modern applications.
    </p>

    <div class="grid grid-cols-2 md:flex gap-4 justify-center mb-12">
      <router-link
        class="px-8 py-3 bg-primary text-on-primary rounded-lg font-semibold hover:opacity-90 transition-opacity text-lg text-center"
        to="/introduction/getting-started"
      >
        Get Started
      </router-link>

      <router-link
        class="px-8 py-3 bg-surface text-on-surface rounded-lg font-semibold hover:bg-surface-tint transition-colors text-lg border text-center"
        to="/components"
      >
        Components
      </router-link>
    </div>

    <client-only>
      <div class="grid grid-cols-3 md:flex gap-4 md:gap-12 justify-center text-center">
        <div>
          <div class="text-2xl md:text-3xl font-bold">{{ stats.stars }}</div>
          <div class="text-sm opacity-60">GitHub Stars</div>
        </div>

        <div class="hidden md:block w-px bg-divider" />

        <div>
          <div class="text-2xl md:text-3xl font-bold">{{ stats.downloads }}</div>
          <div class="text-sm opacity-60">Monthly Downloads</div>
        </div>

        <div class="hidden md:block w-px bg-divider" />

        <div>
          <div class="text-2xl md:text-3xl font-bold">40+</div>
          <div class="text-sm opacity-60">Composables</div>
        </div>
      </div>
    </client-only>
  </section>
</template>
