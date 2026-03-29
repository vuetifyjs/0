<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface HxApiCardProps extends V0PaperProps {
    /** Property name */
    name: string
    /** Type signature */
    type?: string
    /** Description text */
    description?: string
    /** Default value */
    default?: string
    /** Whether the property is required */
    required?: boolean
    /** Heading tag for the name */
    headingTag?: 'h3' | 'h4'
    /** Kind of API item */
    kind?: 'option' | 'property' | 'method' | 'prop' | 'event' | 'slot' | 'function'
    /** Whether a code example exists */
    hasExample?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'HxApiCard' })

  const {
    name,
    type,
    description,
    default: defaultValue,
    required: isRequired,
    headingTag = 'h4',
    kind,
    hasExample,
    ...paperProps
  } = defineProps<HxApiCardProps>()
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="div"
    class="helix-api-card"
  >
    <!-- Header -->
    <div class="helix-api-card__header">
      <component
        :is="headingTag"
        :id="name"
        class="helix-api-card__heading"
      >
        <slot name="heading">
          <HxApiCardName>{{ name }}</HxApiCardName>

          <HxApiCardBadge v-if="(kind === 'option' || kind === 'prop') && isRequired" class="helix-api-card__required">
            required
          </HxApiCardBadge>
        </slot>
      </component>

      <HxApiCardType v-if="type">
        <slot name="type" :type>{{ type }}</slot>
      </HxApiCardType>

      <HxApiCardDescription v-if="description">
        <slot :description name="description">{{ description }}</slot>
      </HxApiCardDescription>

      <HxApiCardDefault v-if="(kind === 'option' || kind === 'prop') && defaultValue">
        <slot :default="defaultValue" name="default">{{ defaultValue }}</slot>
      </HxApiCardDefault>
    </div>

    <!-- Code example -->
    <template v-if="hasExample">
      <slot name="code" />
    </template>
  </V0Paper>
</template>

<style scoped>
  .helix-api-card {
    overflow: hidden;
    background-color: var(--v0-surface);
    border: 1px solid var(--v0-divider);
    border-radius: 0.5rem;
  }

  .helix-api-card__header {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.75rem 1rem;
    background-color: var(--v0-surface-tint);
  }

  .helix-api-card__heading {
    margin: 0;
    font-size: 0.875rem;
    line-height: 1.25;
    color: var(--v0-on-surface);
  }

  .helix-api-card__required {
    color: var(--v0-error);
  }
</style>
