<script setup lang="ts">
  import {
    PRIMARY_SPONSOR,
    PRIMARY_SPONSOR_TIER_URL,
  } from '@/constants/sponsor'

  const sponsor = PRIMARY_SPONSOR
  const domain = sponsor ? new URL(sponsor.url).hostname.replace(/^www\./, '') : ''
</script>

<template>
  <section v-if="sponsor" class="relative my-10 px-6 py-12 rounded-2xl border border-divider bg-surface overflow-hidden text-center">
    <AppDotGrid :coverage="40" />

    <p class="relative section-overline mb-4">PROUDLY SPONSORED BY</p>

    <a
      class="relative inline-block transition-opacity hover:opacity-85"
      :href="sponsor.url"
      rel="noopener"
      target="_blank"
    >
      <img
        :alt="sponsor.name"
        class="max-h-20 mx-auto"
        :src="sponsor.logo"
      >
    </a>

    <p class="relative text-sm text-on-surface-variant mt-4 mb-6">Thank you for funding Vuetify0</p>

    <a
      class="relative inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg border border-divider font-semibold hover:bg-surface-tint transition-colors"
      :href="sponsor.url"
      rel="noopener"
      target="_blank"
    >
      Visit {{ domain }}
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
  </section>

  <section v-else class="relative my-10 px-6 py-10 rounded-2xl border border-divider bg-surface overflow-hidden text-center">
    <AppDotGrid :coverage="40" />

    <p class="relative text-xl md:text-2xl tracking-tight mb-3">
      The Primary Sponsor spot is currently open.
    </p>

    <p class="relative text-sm text-on-surface-variant max-w-prose mx-auto mb-6">
      One company at a time. Whether your team is building on Vuetify0 or building toward it, this is how you fund its development and put your brand alongside the framework.
    </p>

    <div class="relative flex flex-wrap justify-center gap-3">
      <a
        class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-primary text-on-primary font-medium hover:opacity-90 transition-opacity"
        href="mailto:john@vuetifyjs.com?subject=Primary%20Sponsor"
      >
        Email to claim the slot
      </a>

      <a
        class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg border border-divider font-medium hover:bg-surface-tint transition-colors"
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
