<script setup lang="ts">
  // Framework
  import { useBreakpoints } from '@vuetify/v0'

  // Components
  import AppIcon from '@/components/app/AppIcon.vue'

  // Composables
  import { useAsk } from '@/composables/useAsk'
  import { useDiscovery } from '@/composables/useDiscovery'
  import { useNavigation } from '@/composables/useNavigation'
  import { useSearch } from '@/composables/useSearch'
  import { useSettings } from '@/composables/useSettings'

  // Utilities
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'

  // Stores
  import { useSkillzStore } from '@/stores/skillz'

  // Config
  import { type CalloutType, getCalloutConfig } from './calloutConfig'

  /**
   * Callout props - certain props are required based on type:
   * - type: 'askai' requires `question`
   * - type: 'tour' requires `tourId`
   * - type: 'tip' | 'info' | 'warning' | 'error' | 'discord' have no additional required props
   */
  export interface DocsCalloutProps {
    type: CalloutType
    /** Base64-encoded question for askai callouts */
    question?: string
    /** Tour ID from discovery registry for tour callouts */
    tourId?: string
  }

  const props = defineProps<DocsCalloutProps>()

  const ask = useAsk()
  const breakpoints = useBreakpoints()
  const discovery = useDiscovery()
  const navigation = useNavigation()
  const router = useRouter()
  const search = useSearch()
  const settings = useSettings()
  const skillz = useSkillzStore()

  const tour = computed(() => {
    if (!props.tourId) return undefined
    const found = discovery.tours.get(props.tourId)
    if (!found) {
      console.warn(`[DocsCallout] Tour not found: "${props.tourId}"`)
    }
    return found
  })

  const config = computed(() => getCalloutConfig(props.type))

  function decodeQuestion (encoded: string): string {
    return decodeURIComponent(escape(atob(encoded)))
  }

  function onClick () {
    if (props.type === 'askai' && props.question) {
      ask.ask(decodeQuestion(props.question))
    } else if (props.type === 'discord') {
      window.open('https://discord.gg/vK6T89eNP7', '_blank', 'noopener,noreferrer')
    } else if (props.type === 'tour' && props.tourId) {
      skillz.start(props.tourId, {
        context: {
          ask,
          breakpoints,
          navigation,
          router,
          search,
          settings,
        },
      })
    }
  }
</script>

<template>
  <div
    class="my-4 rounded-lg border-l-4 px-4 py-3"
    :class="config.classes"
    :role="props.type === 'askai' || props.type === 'discord' || props.type === 'tour' ? 'button' : undefined"
    :tabindex="props.type === 'askai' || props.type === 'discord' || props.type === 'tour' ? 0 : undefined"
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

    <template v-else-if="props.type === 'discord'">
      <div class="flex items-center gap-2 font-semibold mb-1">
        <AppIcon :icon="config.icon" :size="18" />

        <span>{{ config.title }}</span>
      </div>

      <div class="text-on-surface">
        Need help? Join our community for support and discussions ↗
      </div>
    </template>

    <template v-else-if="props.type === 'tour'">
      <div class="flex items-center gap-2 mb-1">
        <AppIcon :icon="config.icon" :size="18" />

        <span>
          <span class="font-semibold">Take a tour on:</span>
          {{ tour?.name ?? 'this feature' }}
        </span>
      </div>

      <div class="text-on-surface">
        {{ tour?.description ?? 'Click to start this interactive tour' }}
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
