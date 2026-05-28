<script setup lang="ts">
  type TierBase = {
    id: 'framework' | 'app' | 'monorepo'
    name: string
    price: string
    timeline: string
    blurb: string
    dotOrigin?: string
    dotCoverage?: number
  }

  type Tier = TierBase & (
    | { iconAlias: string, icon?: never }
    | { icon: string, iconAlias?: never }
  )

  const tiers: Tier[] = [
    {
      id: 'framework',
      name: 'Custom framework',
      price: '$5,000',
      timeline: '1–2 weeks',
      blurb: 'A design system on v0, themed for your brand. ~20 components, docs site.',
      iconAlias: 'vuetify-0',
    },
    {
      id: 'app',
      name: 'Custom app',
      price: '$7,500',
      timeline: '2–3 weeks',
      blurb: 'A full product or internal tool on v0 + Vuetify. Frontend, state, auth, deploy.',
      icon: 'M21 16H3V4h18m0-2H3c-1.11 0-2 .89-2 2v12a2 2 0 0 0 2 2h7v2H8v2h8v-2h-2v-2h7a2 2 0 0 0 2-2V4c0-1.11-.9-2-2-2M5 6v8h9V6zm10 0v3h4V6zm0 4v4h4v-4z',
    },
    {
      id: 'monorepo',
      name: 'Custom monorepo',
      price: '$10,000',
      timeline: '4–5 weeks',
      blurb: 'A framework plus the app that consumes it. One git history, built to scale to a second product.',
      icon: 'M21 16.5c0 .38-.21.71-.53.88l-7.9 4.44c-.16.12-.36.18-.57.18s-.41-.06-.57-.18l-7.9-4.44A.991.991 0 0 1 3 16.5v-9c0-.38.21-.71.53-.88l7.9-4.44c.16-.12.36-.18.57-.18s.41.06.57.18l7.9 4.44c.32.17.53.5.53.88zM12 4.15 5.04 8 12 11.85 18.96 8z',
      dotOrigin: 'top left',
      dotCoverage: 40,
    },
  ]
</script>

<template>
  <div class="grid gap-4 my-6 sm:grid-cols-3">
    <div
      v-for="tier in tiers"
      :key="tier.id"
      class="relative flex flex-col p-4 rounded-xl border-2 border-divider bg-surface"
      :class="tier.dotOrigin && 'overflow-hidden'"
    >
      <AppDotGrid
        v-if="tier.dotOrigin"
        :coverage="tier.dotCoverage ?? 20"
        :density="18"
        :origin="tier.dotOrigin"
      />

      <div class="relative z-10 flex items-center gap-2 mb-1">
        <AppIcon
          v-if="tier.iconAlias"
          class="text-primary !opacity-100"
          :icon="tier.iconAlias"
          :size="20"
        />

        <svg
          v-else
          aria-hidden="true"
          class="flex-shrink-0 text-primary"
          fill="currentColor"
          height="20"
          viewBox="0 0 24 24"
          width="20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path :d="tier.icon" />
        </svg>

        <div class="font-semibold text-base">{{ tier.name }}</div>
      </div>

      <div class="relative z-10 text-xs text-on-surface-variant mb-2">{{ tier.timeline }}</div>

      <div class="relative z-10 mb-2">
        <span class="text-2xl font-bold">{{ tier.price }}</span>
      </div>

      <p class="relative z-10 text-sm text-on-surface-variant">{{ tier.blurb }}</p>
    </div>
  </div>
</template>
