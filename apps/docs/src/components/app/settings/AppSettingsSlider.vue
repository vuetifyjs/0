<script setup lang="ts">
  // Framework
  import { Checkbox, Collapsible, Slider } from '@vuetify/v0'

  // Utilities
  import { computed, shallowRef } from 'vue'

  const {
    label,
    description = undefined,
    min = 0,
    max = 2,
    step = 0.05,
  } = defineProps<{
    label: string
    description?: string
    min?: number
    max?: number
    step?: number
  }>()

  const model = defineModel<number>({ required: true })

  // The slider + preview stay collapsed until the user checks the box to edit.
  const expanded = shallowRef(false)

  // v0 Slider works on an array model; adapt the scalar setting to/from it.
  const value = computed({
    get: () => [model.value],
    set: ([next]) => {
      model.value = next
    },
  })
</script>

<template>
  <div class="px-3 py-2 rounded-lg bg-surface-variant">
    <label class="flex items-center justify-between gap-3 cursor-pointer">
      <div>
        <span class="text-sm">{{ label }}</span>
        <p v-if="description" class="text-xs text-on-surface-variant/60">{{ description }}</p>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-xs text-on-surface-variant tabular-nums">{{ model.toFixed(2) }}</span>

        <Checkbox.Root
          v-model="expanded"
          :aria-label="`Edit ${label.toLowerCase()}`"
          class="size-4 shrink-0 inline-flex items-center justify-center rounded-sm border border-on-surface-variant/40"
        >
          <Checkbox.Indicator class="text-primary text-[11px] leading-none">✓</Checkbox.Indicator>
        </Checkbox.Root>
      </div>
    </label>

    <Collapsible.Root v-model="expanded">
      <Collapsible.Content>
        <div class="pt-3">
          <slot name="preview" />

          <Slider.Root
            v-model="value"
            class="relative flex items-center w-full h-5 mt-3"
            :max
            :min
            :step
          >
            <Slider.Track class="relative h-1 w-full rounded-full bg-surface">
              <Slider.Range class="absolute h-full rounded-full bg-primary" />
            </Slider.Track>

            <Slider.Thumb
              :aria-label="label"
              class="absolute size-4 rounded-full bg-primary -translate-x-1/2 focus:outline-2 focus:outline-primary"
            />
          </Slider.Root>
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  </div>
</template>
