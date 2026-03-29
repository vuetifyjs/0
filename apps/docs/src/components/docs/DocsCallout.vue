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
  import { computed, toRef } from 'vue'
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

  const config = toRef(() => getCalloutConfig(props.type))
  const interactive = toRef(() => props.type === 'askai' || props.type === 'discord' || props.type === 'tour')

  const title = toRef(() => {
    if (props.type === 'tour') {
      return `Take a tour on: ${tour.value?.name ?? 'this feature'}`
    }
    return undefined
  })

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
  <HxCallout
    :class="config.classes"
    :interactive
    :title
    :type="props.type"
    @click="onClick"
  >
    <template #icon>
      <AppIcon :icon="config.icon" :size="18" />
    </template>

    <template v-if="props.type === 'askai'">
      <div class="text-on-surface">
        {{ props.question ? decodeQuestion(props.question) : '' }}
      </div>
    </template>

    <template v-else-if="props.type === 'discord'">
      <div class="text-on-surface">
        Need help? Join our community for support and discussions ↗
      </div>
    </template>

    <template v-else-if="props.type === 'tour'">
      <div class="text-on-surface">
        {{ tour?.description ?? 'Click to start this interactive tour' }}
      </div>
    </template>

    <template v-else>
      <div class="docs-alert-content text-on-surface">
        <slot />
      </div>
    </template>
  </HxCallout>
</template>

<style scoped>
  .docs-alert-content :deep(> p:first-child) {
    margin-top: 0;
  }

  .docs-alert-content :deep(> p:last-child) {
    margin-bottom: 0;
  }
</style>
