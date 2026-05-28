<script setup lang="ts">
  import { SPECIAL_SPONSOR_PRICE } from '@/constants/sponsor'
</script>

<template>
  <section class="relative my-10 px-5 py-4 sm:px-6 sm:py-5 rounded-xl border border-divider bg-surface overflow-hidden">
    <AppDotGrid :coverage="40" origin="bottom right" />

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

        <h3 class="text-xl font-bold mb-2">Fund v0, get your logo on the docs</h3>

        <p class="text-sm text-on-surface-variant max-w-prose">
          For companies whose product is built on v0. Logo across the docs, every page, and the README. One sponsor at a time.
        </p>
      </div>

      <div class="flex flex-col items-center gap-3 sm:items-end">
        <div class="flex items-baseline gap-1">
          <span class="text-3xl font-bold">${{ SPECIAL_SPONSOR_PRICE.toLocaleString() }}</span>
          <span class="text-sm text-on-surface-variant">/mo</span>
        </div>

        <router-link
          class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-primary text-on-primary font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
          to="/sponsor"
        >
          Learn more
          <svg
            aria-hidden="true"
            fill="currentColor"
            height="14"
            viewBox="0 0 24 24"
            width="14"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M5 13h11.17l-4.88 4.88c-.39.39-.39 1.03 0 1.42.39.39 1.02.39 1.41 0l6.59-6.59a.996.996 0 0 0 0-1.41l-6.58-6.6a.996.996 0 1 0-1.41 1.41L16.17 11H5c-.55 0-1 .45-1 1s.45 1 1 1z" />
          </svg>
        </router-link>
      </div>
    </div>
  </section>
</template>
