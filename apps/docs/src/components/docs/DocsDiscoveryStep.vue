<script lang="ts">
  // Types
  import type { ID } from '@vuetify/v0/types'

  export interface DocsDiscoveryStepProps {
    /** Unique step identifier */
    step: ID
    /** Whether this step is disabled (will be skipped) */
    disabled?: boolean
    /** Step title */
    title: string
    /** Hint text shown in a muted box below description */
    hint?: string
    offset?: [number, number]
    /** Plain text description (alternative to default slot) */
    text?: string
    /** Popover placement */
    placement?: string
    /** Popover placement on mobile */
    placementMobile?: string
  }
</script>

<script setup lang="ts">
  // Components
  import AppBurst from '@/components/app/AppBurst.vue'
  import { Discovery } from '@/components/discovery'

  // Composables
  import { useDiscovery } from '@/composables/useDiscovery'

  // Utilities
  import { computed, onBeforeUnmount, useAttrs, useTemplateRef, watch } from 'vue'

  // Types
  import { SKILL_LEVEL_META } from '@/types/skill'

  defineOptions({ name: 'DocsDiscoveryStep', inheritAttrs: false })

  const props = defineProps<DocsDiscoveryStepProps>()

  const burstRef = useTemplateRef<InstanceType<typeof AppBurst>>('burst')

  defineSlots<{
    /** Main description content */
    default?: () => any
    /** Override footer buttons */
    footer?: () => any
  }>()

  const attrs = useAttrs()
  const discovery = useDiscovery()

  const levelMeta = computed(() => {
    // const tour = discovery.tours.selected.value
    // if (!tour) return null
    return SKILL_LEVEL_META[discovery.tours.selectedItem.value?.level || '']
  })

  const isLastStep = computed(() => {
    const index = discovery.steps.selectedIndex.value
    const total = discovery.steps.values().length
    return index === total - 1 && discovery.selectedId.value === props.step
  })

  let burstTimeout: ReturnType<typeof setTimeout>

  watch(isLastStep, val => {
    if (val) burstTimeout = setTimeout(() => burstRef.value?.trigger(), 500)
  })

  onBeforeUnmount(() => {
    clearTimeout(burstTimeout)
  })

  const offsetStyle = computed(() => {
    if (!props.offset) return undefined
    const [x, y] = props.offset
    return { transform: `translate(${x}px, ${y}px)` }
  })
</script>

<template>
  <Discovery.Root
    v-slot="{ isFirst, isLast }"
    :disabled="disabled"
    :step="step"
  >
    <Discovery.Content
      class="p-4 bg-surface border border-divider rounded-xl shadow-xl max-w-xs"
      :no-overflow="isLastStep"
      :placement="props.placement"
      :placement-mobile="props.placementMobile"
      :style="offsetStyle"
      v-bind="attrs"
    >
      <!-- Header -->
      <div v-if="!isLastStep" class="flex justify-between items-center mb-4">
        <span
          class="skillz-badge inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide px-2 py-1 rounded"
          :style="levelMeta ? { '--level-color': levelMeta.color } : undefined"
          :title="levelMeta ? `${levelMeta.label} level` : undefined"
        >
          SKILLZ
          <AppIcon v-if="levelMeta" :icon="levelMeta.icon" :size="14" />
        </span>

        <Discovery.Progress class="text-xs text-on-surface-variant" />
      </div>

      <!-- Celebration burst on last step -->
      <div v-if="isLastStep" class="flex justify-center mb-2">
        <AppBurst ref="burst" disabled emoji="🎉" :size="64" />
      </div>

      <!-- Title -->
      <Discovery.Title class="text-lg font-semibold text-on-surface mb-1" :class="{ 'text-center': isLastStep }">
        {{ title }}
      </Discovery.Title>

      <!-- Description -->
      <Discovery.Description class="text-sm text-on-surface-variant" :class="isLastStep ? 'text-center mb-8' : 'mb-4'">
        <slot>{{ text }}</slot>

        <p
          v-if="hint"
          class="mt-4 px-3 py-2 text-xs italic bg-surface-variant text-on-surface-variant rounded-md"
        >
          {{ hint }}
        </p>
      </Discovery.Description>

      <!-- Footer -->
      <div v-if="$slots.footer" class="flex justify-end gap-2">
        <slot name="footer" />
      </div>
      <div v-else class="flex gap-2">
        <Discovery.Skip
          v-if="!isLast"
          class="px-3 py-1.5 text-sm rounded-lg text-error hover:bg-error/10 transition-colors"
        >
          Exit
        </Discovery.Skip>

        <div class="ml-auto flex gap-2">
          <Discovery.Prev v-if="!isFirst" class="px-3 py-1.5 text-sm text-on-surface-variant hover:text-on-surface">
            Back
          </Discovery.Prev>

          <Discovery.Next v-if="!isLast" class="px-3 py-1.5 text-sm rounded-lg bg-primary text-on-primary hover:bg-primary/90 transition-colors">
            Next
          </Discovery.Next>

          <Discovery.Skip
            v-else
            class="px-3 py-1.5 text-sm rounded-lg bg-primary text-on-primary hover:bg-primary/90 transition-colors"
          >
            Complete
          </Discovery.Skip>
        </div>
      </div>
    </Discovery.Content>
  </Discovery.Root>
</template>

<style scoped>
.skillz-badge {
  background: color-mix(in srgb, var(--level-color, var(--v0-primary)) 15%, transparent);
  color: var(--level-color, var(--v0-primary));
}
</style>
