<script setup lang="ts">
  // Constants
  import {
    STRIPE_SUPPORT_COSMIC,
    STRIPE_SUPPORT_GALAXY,
    STRIPE_SUPPORT_MULTIVERSE,
  } from '@/constants/services'

  type Tier = {
    id: 'galaxy' | 'cosmic' | 'multiverse'
    name: string
    price: string
    blurb: string
    seats: string
    bullets: string[]
    avatar: string
    href: string
    featured?: boolean
    dotOrigin?: string
    dotCoverage?: number
  }

  const tiers: Tier[] = [
    {
      id: 'galaxy',
      name: 'Galaxy',
      price: '$250',
      blurb: 'For solo developers and small teams shipping with v0.',
      seats: 'For 2 developers',
      bullets: [
        'Direct chat support from the core team on Discord',
        'Same-day response, Monday through Friday',
      ],
      avatar: 'https://cdn.vuetifyjs.com/docs/images/avatars/galaxy.png',
      href: STRIPE_SUPPORT_GALAXY,
    },
    {
      id: 'cosmic',
      name: 'Cosmic',
      price: '$500',
      blurb: 'For growing teams with multiple developers using v0 in production.',
      seats: 'For up to 5 developers',
      bullets: [
        'Everything in Galaxy',
        'Priority on reported v0 and Vuetify GitHub issues',
        'Async code review on v0 integration questions',
      ],
      avatar: 'https://cdn.vuetifyjs.com/docs/images/avatars/cosmic.png',
      href: STRIPE_SUPPORT_COSMIC,
    },
    {
      id: 'multiverse',
      name: 'Multiverse',
      price: '$1,000',
      blurb: 'For organizations standardizing on v0 across products.',
      seats: 'For up to 25 developers',
      bullets: [
        'Everything in Cosmic',
        'Monthly strategy session with your team and the creator',
        'Roadmap input and feature prioritization',
      ],
      avatar: 'https://cdn.vuetifyjs.com/docs/images/avatars/multiverse.png',
      href: STRIPE_SUPPORT_MULTIVERSE,
      featured: true,
      dotCoverage: 40,
      dotOrigin: 'top left',
    },
  ]
</script>

<template>
  <div class="grid gap-4 my-6 sm:grid-cols-3">
    <div
      v-for="tier in tiers"
      :key="tier.id"
      class="relative flex flex-col p-4 rounded-xl border-2 bg-surface"
      :class="[
        tier.featured ? 'border-primary shadow-md' : 'border-divider',
      ]"
    >
      <AppDotGrid
        v-if="tier.dotOrigin"
        :coverage="tier.dotCoverage ?? 20"
        :density="16"
        :origin="tier.dotOrigin"
      />

      <span
        v-if="tier.featured"
        class="absolute -top-2 right-4 z-20 px-2 py-0.5 text-xs font-semibold rounded bg-primary text-on-primary"
      >
        Best value
      </span>

      <div class="relative z-10 flex items-center gap-3 mb-2">
        <img
          :alt="tier.name"
          class="rounded-full"
          height="40"
          :src="tier.avatar"
          width="40"
        >

        <div>
          <div class="font-semibold text-base">{{ tier.name }}</div>
          <div class="text-xs text-on-surface-variant">{{ tier.seats }}</div>
        </div>
      </div>

      <div class="relative z-10 mb-2">
        <span class="text-2xl font-bold">{{ tier.price }}</span>
        <span class="text-sm text-on-surface-variant">/mo</span>
      </div>

      <p class="relative z-10 text-sm text-on-surface-variant mb-3">{{ tier.blurb }}</p>

      <ul class="relative z-10 text-sm space-y-1 mb-4 flex-1">
        <li v-for="bullet in tier.bullets" :key="bullet" class="flex gap-2">
          <svg
            aria-hidden="true"
            class="flex-shrink-0 mt-0.5 text-primary"
            fill="currentColor"
            height="16"
            viewBox="0 0 24 24"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>

          <span>{{ bullet }}</span>
        </li>
      </ul>

      <a
        class="relative z-10 inline-flex items-center justify-center gap-1 px-4 py-2 rounded-lg font-semibold transition-colors"
        :class="tier.featured
          ? 'bg-primary text-on-primary hover:opacity-90'
          : 'border border-divider hover:bg-surface-tint'"
        :href="tier.href"
        rel="noopener"
        target="_blank"
      >
        Subscribe
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
</template>
