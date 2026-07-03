<script setup lang="ts">
  import { SPECIAL_SPONSOR } from '@/constants/sponsor'

  const sponsor = SPECIAL_SPONSOR
</script>

<template>
  <aside aria-label="Sponsorship" class="home-special-sponsor relative w-screen ml-[calc(50%-50vw)] border-y border-divider overflow-hidden">
    <AppDotGrid :coverage="0" origin="top right" />

    <div v-if="sponsor" class="relative mx-auto max-w-[900px] px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
      <p class="section-overline">PROUDLY SPONSORED BY</p>

      <a
        class="transition-opacity hover:opacity-85"
        :href="sponsor.url"
        rel="noopener"
        target="_blank"
      >
        <img
          :alt="sponsor.name"
          class="h-8"
          :src="sponsor.logo"
        >
      </a>
    </div>

    <AppLink v-else class="relative block hover:bg-surface-tint transition-colors" no-suffix to="/sponsor">
      <div class="mx-auto max-w-[900px] px-4 py-4 text-center">
        <p>
          <span class="section-overline">PRIMARY SPONSOR</span>
          <span class="ml-2 text-on-surface-variant">·</span>
          <span class="ml-2 text-sm">This spot is available</span>
        </p>
      </div>
    </AppLink>
  </aside>
</template>
