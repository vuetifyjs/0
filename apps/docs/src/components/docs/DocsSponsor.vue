<script setup lang="ts">
  // Constants
  import { GITHUB_SPONSORS_ECOSYSTEM } from '@/constants/services'
</script>

<template>
  <section class="relative my-10 px-5 py-4 sm:px-6 sm:py-5 rounded-xl border border-divider bg-surface overflow-hidden">
    <AppDotGrid :coverage="40" :density="16" origin="bottom right" />

    <div class="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex-1 text-center sm:text-left">
        <div class="inline-flex items-center gap-1.5 text-xs uppercase tracking-wide text-on-surface-variant mb-1">
          <img
            alt=""
            class="opacity-80"
            height="14"
            src="https://cdn.vuetifyjs.com/docs/images/one/logos/vuetify.png"
            width="14"
          >
          Sponsor
        </div>

        <h3 class="text-xl font-bold mb-2">Your logo across the Vuetify ecosystem</h3>

        <p class="text-sm text-on-surface-variant max-w-prose">
          For companies that want their brand in front of the entire Vuetify community. Logo and link rendered across every site in the ecosystem — docs, playground, bin, link, snips, and beyond — and a direct contribution to every open source project I maintain.
        </p>
      </div>

      <div class="flex flex-col items-center gap-3 sm:items-end">
        <div class="flex items-baseline gap-1">
          <span class="text-3xl font-bold">$1,500</span>
          <span class="text-sm text-on-surface-variant">/mo</span>
        </div>

        <a
          class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-primary text-on-primary font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
          :href="GITHUB_SPONSORS_ECOSYSTEM"
          rel="noopener"
          target="_blank"
        >
          Become a sponsor
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
    </div>
  </section>
</template>
