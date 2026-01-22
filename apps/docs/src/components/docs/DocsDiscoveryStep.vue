<script lang="ts">
  // Types
  import type { NextOnCallback } from '@/components/discovery/DiscoveryRoot.vue'
  import type { DiscoveryStepConfig } from '@/composables/useDiscovery'
  import type { MaybeRefOrGetter } from 'vue'

  type ID = string | number

  export interface DocsDiscoveryStepProps {
    /** Unique step identifier */
    step: ID
    /** Callback to set up auto-advance behavior */
    nextOn?: NextOnCallback
    /** Whether this step is disabled (will be skipped) */
    disabled?: boolean
    /** Step title */
    title: string
    /** Hint text shown in a muted box below description */
    hint?: string
    /** Called when step becomes active */
    enter?: DiscoveryStepConfig['enter']
    /** Called when step becomes inactive */
    leave?: DiscoveryStepConfig['leave']
    /** Called when navigating back to this step */
    back?: DiscoveryStepConfig['back']
    /** When truthy, automatically advance to next step */
    nextWhen?: MaybeRefOrGetter<boolean>
    /** When truthy, automatically go back to previous step */
    prevWhen?: MaybeRefOrGetter<boolean>
    /** Position offset as [x, y] tuple */
    offset?: [number, number]
    /** Plain text description (alternative to default slot) */
    text?: string
  }
</script>

<script setup lang="ts">
  // Components
  import { Discovery } from '@/components/discovery'

  // Composables
  import { useDiscovery } from '@/composables/useDiscovery'

  // Utilities
  import { computed, onBeforeUnmount, toValue, useAttrs, watch } from 'vue'

  defineOptions({ name: 'DocsDiscoveryStep', inheritAttrs: false })

  const props = defineProps<DocsDiscoveryStepProps>()

  defineSlots<{
    /** Main description content */
    default?: () => any
    /** Override footer buttons */
    footer?: () => any
  }>()

  const attrs = useAttrs()
  const discovery = useDiscovery()

  const offsetStyle = computed(() => {
    if (!props.offset) return undefined
    const [x, y] = props.offset
    return { transform: `translate(${x}px, ${y}px)` }
  })

  // Register step config if any lifecycle props are provided
  const hasConfig = props.enter || props.leave || props.back || props.nextWhen
  const cleanup = hasConfig
    ? discovery.on(props.step, {
      enter: props.enter,
      leave: props.leave,
      back: props.back,
      advanceWhen: props.nextWhen,
    })
    : undefined

  // Watch prevWhen and go back when condition becomes true while on this step
  const stopPrevWatcher = props.prevWhen
    ? watch(
      () => toValue(props.prevWhen),
      shouldGoBack => {
        if (shouldGoBack && discovery.selectedId.value === props.step) {
          discovery.prev()
        }
      },
    )
    : undefined

  onBeforeUnmount(() => {
    cleanup?.()
    stopPrevWatcher?.()
  })
</script>

<template>
  <Discovery.Root
    v-slot="{ isFirst, isLast }"
    :disabled="disabled"
    :next-on="nextOn"
    :step="step"
  >
    <Discovery.Content
      class="p-4 bg-surface border border-divider rounded-xl shadow-xl max-w-xs"
      :style="offsetStyle"
      v-bind="attrs"
    >
      <!-- Header -->
      <div class="flex justify-between items-center mb-4">
        <span class="text-xs font-bold uppercase tracking-wide px-2 py-1 bg-primary text-on-primary rounded">
          SKILLZ
        </span>

        <Discovery.Progress class="text-xs text-on-surface-variant" />
      </div>

      <!-- Title -->
      <Discovery.Title class="text-lg font-semibold text-on-surface mb-1">
        {{ title }}
      </Discovery.Title>

      <!-- Description -->
      <Discovery.Description class="text-sm text-on-surface-variant mb-4">
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
