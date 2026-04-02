<script setup lang="ts">
  import { Collapsible } from '@vuetify/v0'

  const {
    disabled = false,
  } = defineProps<{
    question: string
    disabled?: boolean
  }>()
</script>

<template>
  <Collapsible.Root
    class="border-b border-divider last:border-b-0 data-[disabled]:opacity-50"
    :disabled
  >
    <Collapsible.Activator
      class="w-full px-4 py-3 border-none flex items-center gap-3 text-left cursor-pointer hover:bg-surface-tint data-[disabled]:cursor-not-allowed"
    >
      <span class="flex-1 font-medium text-on-surface text-sm">
        {{ question }}
      </span>

      <Collapsible.Cue class="size-4 text-on-surface-variant shrink-0 transition-transform duration-200 data-[state=open]:rotate-180">
        <svg
          class="size-full"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path d="m6 9 6 6 6-6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </Collapsible.Cue>
    </Collapsible.Activator>

    <Collapsible.Content class="px-4 pb-3">
      <div class="text-on-surface-variant text-sm leading-relaxed">
        <slot />
      </div>
    </Collapsible.Content>
  </Collapsible.Root>
</template>
