<script lang="ts" setup>
  definePage({
    meta: {
      layout: 'fullscreen',
    },
  })
</script>

<template>
  <div class="relative flex-1 flex flex-col">
    <router-link
      class="absolute top-12 right-2 z-10 size-10 flex items-center justify-center rounded-full bg-primary text-on-primary shadow-lg transition-colors "
      title="Close Storybook"
      to="/storybook"
    >
      <svg
        class="size-5"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        viewBox="0 0 24 24"
      >
        <path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </router-link>

    <iframe
      class="flex-1 w-full border-none"
      src="https://vuetifyjs.github.io/0/"
      title="Vuetify 0 Storybook"
    />
  </div>
</template>

<route lang="yaml">
meta:
  layout: fullscreen
</route>
