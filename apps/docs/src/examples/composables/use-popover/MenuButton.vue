<script setup lang="ts">
  import { Button } from '@vuetify/v0'
  import { useTemplateRef } from 'vue'

  import type { Menu } from './useMenu'

  const { menu } = defineProps<{ menu: Menu }>()

  const content = useTemplateRef<HTMLElement>('content')

  menu.attach(content)
</script>

<template>
  <Button.Root
    class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
    :class="menu.isOpen.value ? 'bg-primary text-on-primary' : 'bg-surface-variant text-on-surface-variant hover:bg-primary/10'"
    :style="menu.anchorStyles.value"
    @click="menu.toggle()"
  >
    Account
    <svg
      class="size-4 transition-transform duration-200"
      :class="menu.isOpen.value && 'rotate-180'"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      viewBox="0 0 24 24"
    >
      <path d="m6 9 6 6 6-6" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </Button.Root>

  <div
    ref="content"
    class="w-56 rounded-xl border border-divider bg-surface shadow-xl p-1 m-0"
    v-bind="menu.contentAttrs.value"
    :style="menu.contentStyles.value"
  >
    <Button.Root
      v-for="item in menu.items"
      :key="item.id"
      class="w-full flex items-center px-3 py-2 rounded-lg text-sm text-left transition-colors hover:bg-surface-variant"
      :class="item.danger ? 'text-error' : 'text-on-surface'"
      @click="menu.select(item)"
    >
      {{ item.label }}
    </Button.Root>
  </div>
</template>
