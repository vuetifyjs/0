<script lang="ts">
  // Composables
  import { provideMarkdownContext } from '#v0/composables/useMarkdown'

  // Types
  export interface MarkdownProviderProps {
    render: (content: string) => string
  }
</script>

<script lang="ts" setup>
  defineOptions({ name: 'MarkdownProvider' })

  const { render } = defineProps<MarkdownProviderProps>()

  provideMarkdownContext({ render })
</script>

<template>
  <slot />
</template>
