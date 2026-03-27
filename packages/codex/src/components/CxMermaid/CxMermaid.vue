<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface CxMermaidProps extends V0PaperProps {
    /** Mermaid diagram source code */
    code: string
    /** Optional caption below the diagram */
    caption?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxMermaid' })

  const {
    code,
    caption,
    ...paperProps
  } = defineProps<CxMermaidProps>()
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="figure"
    class="codex-mermaid"
  >
    <div class="codex-mermaid__diagram">
      <!-- Consumer handles Mermaid rendering via default slot or future integration -->
      <slot>
        <pre class="codex-mermaid__source">{{ code }}</pre>
      </slot>
    </div>

    <figcaption v-if="caption" class="codex-mermaid__caption">
      {{ caption }}
    </figcaption>
  </V0Paper>
</template>

<style scoped>
  .codex-mermaid {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0;
  }

  .codex-mermaid__diagram {
    width: 100%;
    overflow-x: auto;
  }

  .codex-mermaid__source {
    margin: 0;
    font-family: monospace;
    font-size: 0.8125rem;
    white-space: pre-wrap;
  }

  .codex-mermaid__caption {
    font-size: 0.8125rem;
    font-style: italic;
    text-align: center;
  }
</style>
