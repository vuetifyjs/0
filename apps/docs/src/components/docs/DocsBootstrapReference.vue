<script setup lang="ts">
  const { href, title } = defineProps<{
    /** Bootstrap 6 docs page for this feature. */
    href: string
    /** Feature name, such as Dialog. */
    title: string
  }>()
</script>

<template>
  <div class="flex items-center gap-3 my-4 px-3 py-2 rounded-lg border border-divider bg-surface-tint text-sm leading-5">
    <AppIcon class="shrink-0 text-primary" icon="theme-bootstrap" size="20" />

    <span class="min-w-0 flex-1">
      <span class="font-semibold">{{ title }}</span><span class="text-on-surface-variant"> - Bootstrap design specification</span>
    </span>

    <a
      :aria-label="`Bootstrap spec for ${title}`"
      class="shrink-0 px-3 py-1 rounded-lg border text-xs font-medium no-underline transition-colors border-divider text-on-surface hover:border-primary/50"
      :href
      rel="noopener noreferrer"
      target="_blank"
    >
      Spec
    </a>
  </div>
</template>
