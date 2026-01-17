<script setup lang="ts">
  // Components
  import AppIcon from '@/components/app/AppIcon.vue'

  // Composables
  import { useAsk } from '@/composables/useAsk'

  // Utilities
  import { computed } from 'vue'

  export interface DocsAlertProps {
    type: 'tip' | 'info' | 'warning' | 'error' | 'askai'
    question?: string
  }

  const props = defineProps<DocsAlertProps>()

  const { ask } = useAsk()

  const config = computed(() => {
    switch (props.type) {
      case 'tip': {
        return {
          icon: 'lightbulb',
          title: 'Tip',
          classes: 'docs-alert-tip border-success/50 text-success',
        }
      }
      case 'info': {
        return {
          icon: 'info',
          title: 'Info',
          classes: 'docs-alert-info border-info/50 text-info',
        }
      }
      case 'warning': {
        return {
          icon: 'alert',
          title: 'Warning',
          classes: 'docs-alert-warning border-warning/50 text-warning',
        }
      }
      case 'error': {
        return {
          icon: 'error',
          title: 'Error',
          classes: 'docs-alert-error border-error/50 text-error',
        }
      }
      case 'askai': {
        return {
          icon: 'create',
          title: 'Ask AI',
          classes: 'docs-alert-askai border-accent/50 text-accent cursor-pointer transition-colors',
        }
      }
      default: {
        return {
          icon: 'alert',
          title: 'Note',
          classes: 'docs-alert-default border-divider text-on-surface',
        }
      }
    }
  })

  function decodeQuestion (encoded: string): string {
    return decodeURIComponent(escape(atob(encoded)))
  }

  function onClick () {
    if (props.type === 'askai' && props.question) {
      ask(decodeQuestion(props.question))
    }
  }
</script>

<template>
  <div
    class="my-4 rounded-lg border-l-4 px-4 py-3"
    :class="config.classes"
    :role="props.type === 'askai' ? 'button' : undefined"
    :tabindex="props.type === 'askai' ? 0 : undefined"
    @click="onClick"
    @keydown.enter="onClick"
    @keydown.space.prevent="onClick"
  >
    <template v-if="props.type === 'askai'">
      <div class="flex items-center gap-2 font-semibold mb-1">
        <AppIcon :icon="config.icon" :size="18" />

        <span>{{ config.title }}</span>
      </div>

      <div class="text-on-surface">
        {{ props.question ? decodeQuestion(props.question) : '' }}
      </div>
    </template>

    <template v-else>
      <div class="flex items-center gap-2 font-semibold mb-1">
        <AppIcon :icon="config.icon" :size="18" />

        <span>{{ config.title }}</span>
      </div>

      <div class="docs-alert-content text-on-surface">
        <slot />
      </div>
    </template>
  </div>
</template>

<style scoped>
  .docs-alert-content :deep(> p:first-child) {
    margin-top: 0;
  }

  .docs-alert-content :deep(> p:last-child) {
    margin-bottom: 0;
  }

  /* Semi-transparent backgrounds - dots subtly show through */
  .docs-alert-tip {
    background: color-mix(in srgb, color-mix(in srgb, var(--v0-success) 10%, var(--v0-background)) 70%, transparent);
  }

  .docs-alert-info {
    background: color-mix(in srgb, color-mix(in srgb, var(--v0-info) 10%, var(--v0-background)) 70%, transparent);
  }

  .docs-alert-warning {
    background: color-mix(in srgb, color-mix(in srgb, var(--v0-warning) 10%, var(--v0-background)) 70%, transparent);
  }

  .docs-alert-error {
    background: color-mix(in srgb, color-mix(in srgb, var(--v0-error) 10%, var(--v0-background)) 70%, transparent);
  }

  .docs-alert-askai {
    background: color-mix(in srgb, color-mix(in srgb, var(--v0-accent) 10%, var(--v0-background)) 70%, transparent);

    &:hover {
      background: color-mix(in srgb, color-mix(in srgb, var(--v0-accent) 20%, var(--v0-background)) 70%, transparent);
    }
  }

  .docs-alert-default {
    background: color-mix(in srgb, color-mix(in srgb, var(--v0-surface-variant) 10%, var(--v0-background)) 70%, transparent);
  }
</style>
