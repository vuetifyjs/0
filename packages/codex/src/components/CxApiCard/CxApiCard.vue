<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface CxApiCardProps extends V0PaperProps {
    /** Property/event/slot name */
    name: string
    /** Type signature */
    type?: string
    /** Default value */
    default?: string
    /** Description text */
    description?: string
    /** Whether this item is required */
    required?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxApiCard' })

  const {
    name,
    type,
    default: defaultValue,
    description,
    required = false,
    ...paperProps
  } = defineProps<CxApiCardProps>()
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="div"
    class="codex-api-card"
    :data-required="required || undefined"
  >
    <div class="codex-api-card__header">
      <code class="codex-api-card__name">{{ name }}</code>
      <span v-if="required" class="codex-api-card__badge">required</span>
    </div>

    <div v-if="type" class="codex-api-card__type">
      <code>{{ type }}</code>
    </div>

    <div v-if="defaultValue" class="codex-api-card__default">
      Default: <code>{{ defaultValue }}</code>
    </div>

    <p v-if="description" class="codex-api-card__description">
      {{ description }}
    </p>

    <slot />
  </V0Paper>
</template>

<style scoped>
  .codex-api-card {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .codex-api-card__header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .codex-api-card__name {
    font-family: monospace;
    font-weight: 600;
  }

  .codex-api-card__badge {
    font-size: 0.6875rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .codex-api-card__type code,
  .codex-api-card__default code {
    font-family: monospace;
    font-size: 0.8125rem;
  }

  .codex-api-card__description {
    margin: 0;
    font-size: 0.875rem;
  }
</style>
