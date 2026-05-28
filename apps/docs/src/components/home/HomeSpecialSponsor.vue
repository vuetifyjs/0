<script setup lang="ts">
  import {
    SPECIAL_SPONSOR,
    SPECIAL_SPONSOR_PRICE,
  } from '@/constants/sponsor'

  const sponsor = SPECIAL_SPONSOR
</script>

<template>
  <section v-if="sponsor" class="home-special-sponsor relative py-4 overflow-hidden">
    <AppDotGrid :coverage="30" origin="bottom right" />

    <div class="relative flex flex-col sm:flex-row items-center justify-between gap-3">
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
  </section>

  <AppLink v-else class="block" no-suffix to="/sponsor">
    <section class="home-special-sponsor relative py-4 overflow-hidden hover:bg-surface-tint transition-colors">
      <AppDotGrid :coverage="30" origin="bottom right" />

      <div class="relative flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <p class="section-overline">SPECIAL SPONSOR</p>

        <p class="text-sm">
          <span class="text-on-surface-variant">This spot is available · </span>
          <span class="font-semibold">${{ SPECIAL_SPONSOR_PRICE.toLocaleString() }}/mo</span>
          <span class="ml-1">→</span>
        </p>
      </div>
    </section>
  </AppLink>
</template>
