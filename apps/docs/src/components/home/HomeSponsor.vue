<script setup lang="ts">
  // Composables
  import { useThemeToggle } from '@/composables/useThemeToggle'

  // Constants
  import { SPECIAL_SPONSOR, SPECIAL_SPONSOR_TIER_URL } from '@/constants/sponsor'

  // Utilities
  import { toRef } from 'vue'

  const { isDark } = useThemeToggle()

  const logo = toRef(() =>
    isDark.value ? SPECIAL_SPONSOR?.logoDark ?? SPECIAL_SPONSOR?.logo : SPECIAL_SPONSOR?.logo,
  )
</script>

<template>
  <section class="home-sponsor py-20 md:py-28">
    <div class="text-center mb-12">
      <p class="section-overline mb-3">SUPPORT V0</p>

      <h2 class="text-2xl md:text-4xl font-bold tracking-tight mb-4">
        Keep v0 moving
      </h2>

      <p class="opacity-60 max-w-[640px] mx-auto leading-relaxed">
        v0 is built and maintained in the open. Sponsorship funds the work and puts your brand in front of the entire Vuetify community.
      </p>
    </div>

    <DocsSponsor />

    <!-- Backed by logo wall -->
    <div v-if="SPECIAL_SPONSOR" class="mt-12">
      <p class="text-sm opacity-60 text-center mb-6">Backed by</p>

      <div class="flex flex-wrap justify-center gap-4">
        <a
          class="flex items-center justify-center px-6 py-4 rounded-xl border bg-surface hover:border-primary transition-all duration-150"
          :href="SPECIAL_SPONSOR.url"
          rel="noopener"
          target="_blank"
        >
          <img
            :alt="SPECIAL_SPONSOR.name"
            class="h-8 w-auto"
            :src="logo"
          >
        </a>
      </div>
    </div>

    <!-- Become a special sponsor -->
    <div class="mt-10 flex justify-center">
      <a
        class="px-6 py-2.5 bg-surface text-on-surface rounded-xl font-semibold border hover:bg-surface-tint hover:border-primary transition-all duration-150 text-sm inline-flex items-center gap-2"
        :href="SPECIAL_SPONSOR_TIER_URL"
        rel="noopener"
        target="_blank"
      >
        <AppIcon icon="heart" :size="16" />
        Become a special sponsor
      </a>
    </div>
  </section>
</template>
