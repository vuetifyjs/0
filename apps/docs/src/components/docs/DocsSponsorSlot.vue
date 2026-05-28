<script setup lang="ts">
  import {
    SPECIAL_SPONSOR,
    SPECIAL_SPONSOR_PRICE,
  } from '@/constants/sponsor'

  const sponsor = SPECIAL_SPONSOR
</script>

<template>
  <div v-if="sponsor" class="mt-6 p-3 rounded-lg border border-divider bg-surface">
    <p class="text-xs uppercase tracking-wide text-on-surface-variant mb-2">SPONSORED BY</p>

    <a
      class="block transition-opacity hover:opacity-85"
      :href="sponsor.url"
      rel="noopener"
      target="_blank"
    >
      <img
        :alt="sponsor.name"
        class="max-h-12 w-full object-contain"
        :src="sponsor.logo"
      >
    </a>

    <a
      class="block mt-2 text-xs text-on-surface-variant hover:text-primary hover:underline transition-colors truncate"
      :href="sponsor.url"
      rel="noopener"
      target="_blank"
    >
      {{ sponsor.name }} →
    </a>
  </div>

  <router-link
    v-else
    class="block mt-6 p-3 rounded-lg border-2 border-dashed border-divider text-on-surface-variant hover:border-primary hover:text-primary transition-colors"
    to="/sponsor"
  >
    <p class="text-xs font-semibold">Your logo here</p>
    <p class="text-xs">${{ SPECIAL_SPONSOR_PRICE.toLocaleString() }}/mo</p>
    <p class="text-xs mt-1">Become the sponsor →</p>
  </router-link>
</template>
