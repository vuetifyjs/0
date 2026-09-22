<script setup lang="ts">
  // Utilities
  import { toRef } from 'vue'

  const props = defineProps<{
    color?: string
    href?: string
    icon: string
    text: string
    title?: string
  }>()

  const emit = defineEmits<{
    click: [event: MouseEvent]
  }>()

  const isExternal = toRef(() => props.href?.startsWith('http'))
</script>

<template>
  <AppTooltip
    v-if="href"
    as="a"
    class="docs-meta-item icon-text hover:text-on-surface transition-colors"
    :href
    :rel="isExternal ? 'noopener noreferrer' : undefined"
    :target="isExternal ? '_blank' : undefined"
    :text="title"
    @click="emit('click', $event)"
  >
    <AppIcon :class="color" :icon size="1em" />
    <span>{{ text }}</span>
  </AppTooltip>

  <AppTooltip
    v-else
    as="span"
    class="docs-meta-item icon-text"
    :text="title"
  >
    <AppIcon :class="color" :icon size="1em" />
    <span>{{ text }}</span>
  </AppTooltip>
</template>

<!-- Unscoped + general-sibling (~) selector: AppTooltip renders a multi-root
     fragment (activator + popover content), so the parent scope-id is not
     forwarded to the .docs-meta-item element, and the tooltip content node sits
     between adjacent items — an adjacent-sibling (+) selector would no longer
     match. See scoped-css-multiroot-child (#359). -->
<style>
  @media (min-width: 640px) {
    .docs-meta-item ~ .docs-meta-item::before {
      content: '·';
      margin-inline: 0.5rem;
      opacity: 0.4;
    }
  }
</style>
