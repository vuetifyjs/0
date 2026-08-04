<script setup lang="ts">
  import { mdiInformationOutline, mdiOpenInNew } from '@mdi/js'

  // Framework
  import { Popover, useDelay } from '@vuetify/v0'

  // Components
  import Icon from '@/components/app/Icon.vue'

  import dependencyGraph from '@/data/dependencies.json'
  import { resolve } from '@/engine/resolve'

  // Utilities
  import { shallowRef, toRef } from 'vue'

  // Types
  import type { DependencyGraph } from '@/data/types'

  const { id, title, description, docs } = defineProps<{
    id: string
    title: string
    description: string
    docs?: string
  }>()

  const graph = dependencyGraph as DependencyGraph

  const resolved = toRef(() => resolve([id], graph))
  const modules = toRef(() => resolved.value.autoIncluded.length)

  const open = shallowRef(false)

  // A card-grid mouse sweep shouldn't strobe every info popover open, so hover
  // is intent-delayed; keyboard focus and the existing click/tap path stay instant.
  const delay = useDelay(direction => {
    open.value = direction
  }, { openDelay: 200, closeDelay: 100 })

  function onPointerenter (e: PointerEvent) {
    if (e.pointerType === 'touch') return
    delay.start(true)
  }

  function onPointerleave (e: PointerEvent) {
    if (e.pointerType === 'touch') return
    delay.start(false)
  }

  function onFocus (e: FocusEvent) {
    if (!(e.target as HTMLElement).matches(':focus-visible')) return
    delay.stop()
    open.value = true
  }
</script>

<template>
  <Popover.Root v-model="open">
    <Popover.Activator
      :aria-label="`About ${title}`"
      class="absolute right-1.5 top-1.5 h-7 w-7 inline-flex items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-colors duration-150 cursor-pointer opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 data-[open]:opacity-100"
      @focus="onFocus"
      @pointerenter="onPointerenter"
      @pointerleave="onPointerleave"
    >
      <Icon :path="mdiInformationOutline" :size="15" />
    </Popover.Activator>

    <!-- Body is gated on isOpen so 15 rows cost 15 empty popover shells rather than 15
         rendered panels; the shell itself is display:none until the native API shows it. -->
    <Popover.Content
      v-slot="{ isOpen }"
      :aria-label="id"
      class="floating m-0 p-4 w-[17.5rem] rounded-xl"
      @pointerenter="delay.stop"
      @pointerleave="onPointerleave"
    >
      <div v-if="isOpen" class="stack-tight text-left">
        <div class="flex items-baseline gap-2">
          <span class="font-mono text-[0.8125rem] font-semibold truncate">{{ id }}</span>

          <span class="t-meta text-on-surface-variant truncate">{{ title }}</span>
        </div>

        <p class="t-meta text-on-surface-variant">{{ description }}</p>

        <p class="t-eyebrow text-on-surface-variant pt-1">Brings in</p>

        <p class="t-meta text-on-surface-variant/80">
          {{ modules }} {{ modules === 1 ? 'module' : 'modules' }} once resolved
        </p>

        <a
          v-if="docs"
          class="inline-flex items-center gap-1.5 t-meta text-primary hover:underline pt-1"
          :href="docs"
          rel="noopener"
          target="_blank"
        >
          View docs
          <Icon :path="mdiOpenInNew" :size="12" />
        </a>
      </div>
    </Popover.Content>
  </Popover.Root>
</template>
