<script setup lang="ts">
  // Components
  import AppIcon from '@/components/app/AppIcon.vue'

  // Composables
  import { useAsk } from '@/composables/useAsk'

  // Utilities
  import { computed } from 'vue'

  export interface DocsAlertProps {
    type: 'tip' | 'info' | 'warning' | 'error' | 'suggestion'
    suggestion?: string
  }

  const props = defineProps<DocsAlertProps>()

  const { ask } = useAsk()

  const config = computed(() => {
    switch (props.type) {
      case 'tip': {
        return {
          icon: 'lightbulb',
          title: 'Tip',
          classes: 'bg-success/10 border-success/50 text-success',
        }
      }
      case 'info': {
        return {
          icon: 'info',
          title: 'Info',
          classes: 'bg-info/10 border-info/50 text-info',
        }
      }
      case 'warning': {
        return {
          icon: 'alert',
          title: 'Warning',
          classes: 'bg-warning/10 border-warning/50 text-warning',
        }
      }
      case 'error': {
        return {
          icon: 'error',
          title: 'Error',
          classes: 'bg-error/10 border-error/50 text-error',
        }
      }
      case 'suggestion': {
        return {
          icon: 'create',
          title: 'Ask AI',
          classes: 'bg-primary/10 border-primary/50 text-primary cursor-pointer hover:bg-primary/20 transition-colors',
        }
      }
      default: {
        return {
          icon: 'alert',
          title: 'Note',
          classes: 'bg-surface-variant/10 border-divider text-on-surface',
        }
      }
    }
  })

  function decodeSuggestion (encoded: string): string {
    return decodeURIComponent(escape(atob(encoded)))
  }

  function onClick () {
    if (props.type === 'suggestion' && props.suggestion) {
      ask(decodeSuggestion(props.suggestion))
    }
  }
</script>

<template>
  <div
    class="my-4 rounded-lg border-l-4 px-4 py-3"
    :class="config.classes"
    :role="props.type === 'suggestion' ? 'button' : undefined"
    :tabindex="props.type === 'suggestion' ? 0 : undefined"
    @click="onClick"
    @keydown.enter="onClick"
    @keydown.space.prevent="onClick"
  >
    <template v-if="props.type === 'suggestion'">
      <div class="flex items-center gap-2 font-semibold mb-1">
        <AppIcon :icon="config.icon" :size="18" />

        <span>{{ config.title }}</span>
      </div>

      <div class="text-on-surface">
        {{ props.suggestion ? decodeSuggestion(props.suggestion) : '' }}
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
</style>
