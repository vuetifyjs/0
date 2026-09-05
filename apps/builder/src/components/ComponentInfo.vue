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
  import type { ComponentEntry } from '@/data/components'
  import type { DependencyGraph } from '@/data/types'

  const { component } = defineProps<{ component: ComponentEntry }>()

  const graph = dependencyGraph as DependencyGraph

  // How many chips fit before the list stops being scannable and turns into a wall.
  const CAP = 8

  // What the component is assembled from, not everything that reaches the bundle: the
  // direct list averages 5 entries and names things a person recognises, where the full
  // resolved set averages 12 and is mostly plumbing (createContext, createTrinity, Atom).
  // The resolved total is reported as a number underneath so the cost is still honest.
  const direct = toRef(() => graph.components[component.id] ?? [])

  const shown = toRef(() => direct.value.slice(0, CAP))
  const overflow = toRef(() => Math.max(direct.value.length - CAP, 0))

  const total = toRef(() => resolve([component.id], graph).autoIncluded.length)

  // maturity.json blurbs are authored as markdown, so 5 of them fence an identifier in
  // backticks. Split on the fence and set those runs as code rather than leaking the
  // punctuation into prose.
  const parts = toRef(() => component.description
    .split('`')
    .map((text, index) => ({ text, code: index % 2 === 1 })),
  )

  // Positioning falls back to Root's default (below the trigger) unless Content gets its
  // own id matching Root's — see AppThemeSelector.vue in apps/docs for the same recipe.
  // A card grid means the trigger can sit anywhere, top row included, so `flip-block` is
  // load-bearing: it flips back down when there's no room above rather than clipping.
  const popoverId = toRef(() => `component-info-${component.id}`)

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
  <Popover.Root :id="popoverId" v-model="open">
    <Popover.Activator
      :aria-label="`About ${component.id}`"
      class="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 w-7 inline-flex items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-colors duration-150 cursor-pointer opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 data-[open]:opacity-100"
      @focus="onFocus"
      @pointerenter="onPointerenter"
      @pointerleave="onPointerleave"
    >
      <Icon :path="mdiInformationOutline" :size="15" />
    </Popover.Activator>

    <!-- Body is gated on isOpen so 40 cards cost 40 empty popover shells rather than 40
         rendered panels; the shell itself is display:none until the native API shows it. -->
    <Popover.Content
      :id="popoverId"
      v-slot="{ isOpen }"
      :aria-label="component.id"
      class="floating m-0 p-4 w-[17.5rem] rounded-xl"
      position-area="top"
      position-try="flip-block"
      @pointerenter="delay.stop"
      @pointerleave="onPointerleave"
    >
      <div v-if="isOpen" class="stack-tight text-left">
        <div class="flex items-center gap-2">
          <span class="font-mono text-[0.8125rem] font-semibold truncate">{{ component.id }}</span>

          <span class="chip-quiet flex-shrink-0 ml-auto">{{ component.level }}</span>
        </div>

        <!-- Each segment carries its own surrounding spaces, so the words stay separated
             even though Vue drops the whitespace between these tags. -->
        <p class="t-meta text-on-surface-variant">
          <template v-for="(part, index) in parts" :key="index">
            <code v-if="part.code" class="code-chip">{{ part.text }}</code>

            <span v-else>{{ part.text }}</span>
          </template>
        </p>

        <template v-if="shown.length > 0">
          <p class="t-eyebrow text-on-surface-variant pt-1">Built on</p>

          <div class="flex flex-wrap gap-1">
            <span v-for="id in shown" :key="id" class="chip-quiet">{{ id }}</span>

            <span v-if="overflow > 0" class="chip-quiet">+{{ overflow }}</span>
          </div>

          <p class="t-meta text-on-surface-variant/80">
            {{ total }} {{ total === 1 ? 'module' : 'modules' }} once resolved
          </p>
        </template>

        <a
          v-if="component.docs"
          class="inline-flex items-center gap-1.5 t-meta text-primary hover:underline pt-1"
          :href="component.docs"
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
