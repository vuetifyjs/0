<script setup lang="ts">
  import { PRIMARY_SPONSOR } from '@/constants/sponsor'

  // Utilities
  import { toRef } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()
  const sponsor = PRIMARY_SPONSOR
  const onSponsorPage = toRef(() => route.path === '/sponsor')
</script>

<template>
  <div v-if="sponsor" class="mt-3 p-3 rounded-lg border border-divider bg-surface">
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
    class="block mt-3 p-3 rounded-lg border border-dashed hover:border-primary hover:text-primary transition-colors"
    :class="onSponsorPage ? 'border-primary text-primary' : 'border-divider text-on-surface-variant'"
    to="/sponsor"
  >
    <p class="text-xs font-semibold flex items-center gap-1">
      <AppIcon icon="vuetify-0" size=".75rem" />
      Your logo here
    </p>

    <p class="text-xs mt-1">Become the Primary Sponsor&nbsp;→</p>
  </router-link>
</template>
