<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { useMarkdown } from '#v0/composables/useMarkdown'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface MarkdownRootProps extends AtomProps {
    content?: string
  }
</script>

<script lang="ts" setup>
  defineOptions({ name: 'MarkdownRoot' })

  const { content = '' } = defineProps<MarkdownRootProps>()

  const adapter = useMarkdown()

  const renderedContent = toRef(() => adapter.render(content))
</script>

<template>
  <!-- eslint-disable-next-line vue/no-v-text-v-html-on-component -->
  <Atom v-html="renderedContent" />
</template>
