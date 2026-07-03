<script setup lang="ts">
  import { PRIMARY_SPONSOR_TIER_URL } from '@/constants/sponsor'
</script>

<template>
  <section class="relative my-10 px-5 py-8 sm:px-8 sm:py-10 rounded-2xl border border-divider bg-surface overflow-hidden text-center">
    <AppDotGrid :coverage="60" origin="top right" />

    <p class="relative text-sm text-on-surface-variant mb-6 max-w-prose mx-auto">
      One slot. First-come, first-served. Reach out before subscribing to confirm availability.
    </p>

    <div class="relative flex flex-wrap justify-center gap-3">
      <a
        class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-primary text-on-primary font-semibold hover:opacity-90 transition-opacity"
        href="mailto:john@vuetifyjs.com?subject=Primary%20Sponsor"
      >
        Email to claim the slot
      </a>

      <a
        class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg border border-divider font-semibold hover:bg-surface-tint transition-colors"
        :href="PRIMARY_SPONSOR_TIER_URL"
        rel="noopener"
        target="_blank"
      >
        Sponsor on GitHub
        <svg
          aria-hidden="true"
          fill="currentColor"
          height="14"
          viewBox="0 0 24 24"
          width="14"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7zM14 3v2h3.59L7.76 14.83l1.41 1.41L19 6.41V10h2V3h-7z" />
        </svg>
      </a>
    </div>
  </section>
</template>
