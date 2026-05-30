<script setup lang="ts">
  interface Column {
    name: string
    bestFor: string
    whatYouGet: string
    price: string
    cta: { label: string, to: string }
    featured?: boolean
  }

  const columns: Column[] = [
    {
      name: 'Services',
      bestFor: 'Most teams using Vuetify0',
      whatYouGet: 'Direct chat, code review, fixed-scope builds',
      price: '$250-$1,000/mo + one-time builds',
      cta: { label: 'See Services →', to: '/services' },
    },
    {
      name: 'Primary Sponsor',
      bestFor: 'Companies whose product is built on Vuetify0',
      whatYouGet: 'Logo across the docs, README, sponsor page',
      price: '$2,000/mo · one slot',
      cta: { label: 'Become the sponsor →', to: 'mailto:john@vuetifyjs.com?subject=Primary%20Sponsor' },
      featured: true,
    },
  ]

  function isMail (to: string) {
    return to.startsWith('mailto:')
  }
</script>

<template>
  <div class="grid gap-4 my-6 sm:grid-cols-2">
    <div
      v-for="col in columns"
      :key="col.name"
      class="relative flex flex-col p-5 rounded-xl border-2 bg-surface"
      :class="col.featured ? 'border-primary' : 'border-divider'"
    >
      <div class="font-semibold text-base mb-4">{{ col.name }}</div>

      <dl class="text-sm space-y-3">
        <div>
          <dt class="text-xs uppercase tracking-wide text-on-surface-variant mb-0.5">Best for</dt>
          <dd>{{ col.bestFor }}</dd>
        </div>

        <div>
          <dt class="text-xs uppercase tracking-wide text-on-surface-variant mb-0.5">What you get</dt>
          <dd>{{ col.whatYouGet }}</dd>
        </div>

        <div>
          <dt class="text-xs uppercase tracking-wide text-on-surface-variant mb-0.5">Price</dt>
          <dd class="font-semibold">{{ col.price }}</dd>
        </div>
      </dl>

      <a
        v-if="isMail(col.cta.to)"
        class="mt-auto pt-4 inline-flex items-center gap-1 text-primary hover:underline font-medium text-sm"
        :href="col.cta.to"
      >
        {{ col.cta.label }}
      </a>

      <AppLink
        v-else
        class="mt-auto pt-4 inline-flex items-center gap-1 text-primary hover:underline font-medium text-sm"
        no-suffix
        :to="col.cta.to"
      >
        {{ col.cta.label }}
      </AppLink>
    </div>
  </div>
</template>
