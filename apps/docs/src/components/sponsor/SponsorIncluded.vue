<script setup lang="ts">
  interface Surface {
    title: string
    description: string
    icon: string
  }

  const surfaces: Surface[] = [
    {
      title: 'Home page band',
      description: 'Your logo at the top of the v0 docs home page, above the fold for every visitor.',
      icon: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z',
    },
    {
      title: 'Docs sidebar (desktop)',
      description: 'A persistent card below the table of contents on every component, composable, and guide page at desktop widths.',
      icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zm4 18H6V4h7v5h5z',
    },
    {
      title: 'Sponsor page hero',
      description: 'The biggest placement on the dedicated sponsor page — your logo as the headline.',
      icon: 'M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z',
    },
    {
      title: 'GitHub README',
      description: 'Logo on the repo README at github.com/vuetifyjs/0, seen by every developer evaluating v0.',
      icon: 'M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.57v-2.02c-3.34.72-4.04-1.61-4.04-1.61-.55-1.38-1.34-1.75-1.34-1.75-1.08-.74.09-.73.09-.73 1.2.09 1.83 1.24 1.83 1.24 1.07 1.83 2.81 1.3 3.5 1 .1-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.65 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.81 5.62-5.48 5.92.42.36.81 1.1.81 2.22v3.29c0 .31.21.69.83.57A12 12 0 0 0 12 .3',
    },
  ]
</script>

<template>
  <div class="grid gap-4 my-6 sm:grid-cols-2">
    <div
      v-for="surface in surfaces"
      :key="surface.title"
      class="relative flex flex-col p-4 rounded-xl border border-divider bg-surface"
    >
      <svg
        aria-hidden="true"
        class="flex-shrink-0 text-primary mb-3"
        fill="currentColor"
        height="20"
        viewBox="0 0 24 24"
        width="20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path :d="surface.icon" />
      </svg>

      <div class="font-semibold text-base mb-1">{{ surface.title }}</div>
      <p class="text-sm text-on-surface-variant">{{ surface.description }}</p>
    </div>
  </div>
</template>
