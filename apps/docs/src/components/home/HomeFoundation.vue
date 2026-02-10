<script setup lang="ts">
  const frameworks = [
    { name: 'Vite', icon: 'vite', to: 'https://vite.dev' },
    { name: 'Nuxt', icon: 'nuxt', to: 'https://nuxt.com' },
    { name: 'Tailwind CSS', icon: 'tailwind', to: 'https://tailwindcss.com' },
    { name: 'UnoCSS', icon: 'unocss', to: 'https://unocss.dev' },
    { name: 'Vuetify Play', icon: 'vuetify-play', to: 'https://play.vuetifyjs.com' },
    { name: 'Vuetify Create', icon: 'vuetify-create', to: '/guide/tooling/vuetify-cli' },
    { name: 'Vuetify CLI', icon: 'vuetify-cli', to: '/guide/tooling/vuetify-cli' },
    { name: 'Vuetify MCP', icon: 'vuetify-mcp', to: '/guide/tooling/vuetify-mcp' },
  ]
</script>

<template>
  <section class="home-foundation py-20 md:py-28">
    <div class="text-center mb-12">
      <p class="section-overline mb-3">TRUSTED FOUNDATION</p>

      <h2 class="text-2xl md:text-4xl font-bold tracking-tight mb-4">
        From the creators of Vuetify
      </h2>

      <p class="opacity-60 max-w-[640px] mx-auto leading-relaxed">
        40K+ stars. 2M+ weekly downloads. A decade of Vue expertise.
      </p>
    </div>

    <!-- Vuetify Trust Story -->
    <div
      class="relative overflow-hidden p-6 md:p-8 rounded-2xl border bg-glass-surface mb-8"
    >
      <AppDotGrid :coverage="60" />

      <div class="relative flex flex-col sm:flex-row items-start gap-4">
        <div class="w-12 h-12 shrink-0 rounded-xl bg-primary flex items-center justify-center text-on-primary">
          <AppIcon class="!opacity-100" icon="vuetify" :size="24" />
        </div>

        <div>
          <h3 class="text-lg font-semibold mb-2">Built by the Vuetify team</h3>
          <p class="opacity-60 leading-relaxed">
            v0 extracts Vuetify's battle-tested patterns into a headless layer. The same team that built and maintains Vue's most popular component framework.
          </p>
        </div>
      </div>
    </div>

    <!-- Vuetify 5 quote -->
    <div class="p-5 md:p-6 rounded-xl border border-primary/30 bg-surface-tint mb-12 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
      <img
        alt="John Leider"
        class="w-10 h-10 sm:w-12 sm:h-12 rounded-full shrink-0 ring-2 ring-primary/30"
        height="48"
        src="https://avatars.githubusercontent.com/u/9064066?v=4"
        width="48"
      >

      <div>
        <p class="text-sm leading-relaxed italic opacity-80">
          "Vuetify 5 will be built on v0. Every pattern we've refined over a decade is becoming the foundation for the next generation."
        </p>
        <p class="text-xs opacity-50 mt-2">John Leider, Creator of Vuetify</p>
      </div>
    </div>

    <!-- Framework Compatibility -->
    <div>
      <p class="text-sm opacity-60 text-center mb-6">Works with</p>

      <div class="grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-center gap-3 sm:gap-4 max-w-[640px] mx-auto">
        <AppLink
          v-for="fw in frameworks"
          :key="fw.name"
          class="flex items-center justify-center sm:justify-start gap-2 px-4 sm:px-5 py-2.5 rounded-lg border bg-surface hover:border-primary transition-all duration-150"
          no-suffix
          :to="fw.to"
        >
          <AppIcon :icon="fw.icon" :size="18" />
          <span class="text-sm font-medium">{{ fw.name }}</span>
        </AppLink>
      </div>
    </div>
  </section>
</template>
