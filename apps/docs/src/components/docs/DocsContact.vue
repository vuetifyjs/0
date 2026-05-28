<script setup lang="ts">
  // Constants
  import {
    CALENDLY_INTRO_CALL,
    GITHUB_JOHNLEIDER,
    GITHUB_SPONSORS,
  } from '@/constants/services'

  const avatar = 'https://cdn.vuetifyjs.com/docs/images/one/avatars/john.png'
</script>

<template>
  <section class="relative my-10 px-5 py-4 sm:px-6 sm:py-5 rounded-xl border border-divider bg-surface overflow-hidden flex flex-col sm:flex-row items-center gap-6">
    <AppDotGrid :coverage="55" origin="bottom left" />

    <a
      aria-label="John Leider on GitHub"
      class="relative z-10 flex-shrink-0 rounded-full transition-opacity hover:opacity-85"
      :href="GITHUB_JOHNLEIDER"
      rel="noopener"
      target="_blank"
    >
      <img
        alt="John Leider"
        class="rounded-full w-28 h-28 border border-divider"
        height="112"
        :src="avatar"
        width="112"
      >
    </a>

    <div class="relative z-10 flex-1 text-center sm:text-left">
      <h3 class="text-xl font-bold mb-1">John Leider</h3>
      <p class="text-sm text-on-surface-variant mb-2">Creator of Vuetify</p>

      <p class="text-sm mb-5">
        Available for direct support subscriptions and fixed-scope project builds. Book a 30-minute intro call to talk through what you're building.
      </p>

      <div class="flex flex-wrap gap-3 justify-center sm:justify-start">
        <a
          class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-primary text-on-primary font-semibold hover:opacity-90 transition-opacity"
          :href="CALENDLY_INTRO_CALL"
          rel="noopener"
          target="_blank"
        >
          Book a call
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

        <a
          class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg border border-divider font-semibold hover:bg-surface-tint transition-colors"
          :href="GITHUB_SPONSORS"
          rel="noopener"
          target="_blank"
        >
          <svg
            aria-hidden="true"
            fill="#db61a2"
            height="16"
            viewBox="0 0 24 24"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          Sponsor on GitHub
        </a>
      </div>
    </div>
  </section>
</template>
