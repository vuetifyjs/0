<script setup lang="ts">
  import {
    SPECIAL_SPONSOR,
    SPECIAL_SPONSOR_PRICE,
    SPECIAL_SPONSOR_TIER_URL,
  } from '@/constants/sponsor'

  const sponsor = SPECIAL_SPONSOR
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

    <p class="relative text-sm text-on-surface-variant mt-4 mb-6">Thank you for funding v0</p>

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

  <section v-else class="relative my-10 px-6 py-12 rounded-2xl border border-divider bg-surface overflow-hidden text-center">
    <AppDotGrid :coverage="40" />

    <p class="relative section-overline mb-4">THE SPOT IS OPEN</p>

    <p class="relative text-2xl md:text-3xl font-bold tracking-tight mb-3">
      Become the Special Sponsor
    </p>

    <p class="relative text-sm text-on-surface-variant mb-1">
      <span class="text-base font-semibold text-on-surface">${{ SPECIAL_SPONSOR_PRICE.toLocaleString() }}/mo</span> · One slot
    </p>

    <p class="relative text-xs uppercase tracking-wide text-on-surface-variant mb-6">
      No ads. No tracking. Ever.
    </p>

    <a
      class="relative inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-primary text-on-primary font-semibold hover:opacity-90 transition-opacity"
      :href="SPECIAL_SPONSOR_TIER_URL"
      rel="noopener"
      target="_blank"
    >
      Become the sponsor
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
</template>
