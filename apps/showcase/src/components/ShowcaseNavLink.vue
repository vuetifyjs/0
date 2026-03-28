<script setup lang="ts">
  // Framework
  import { Atom } from '@vuetify/v0'

  // Composables
  import { isNavLink, useShowcaseNavContext } from '../composables/useShowcaseNav'

  // Utilities
  import { toRef } from 'vue'
  import { RouterLink, useRoute } from 'vue-router'

  // Types
  import type { ID } from '@vuetify/v0/types'

  const {
    id,
    name,
    depth = 0,
    to,
  } = defineProps<{
    id: ID
    name: string
    depth?: number
    to?: string
  }>()

  const route = useRoute()
  const { nested, isRestoring } = useShowcaseNavContext()

  const transition = toRef(() => isRestoring.value ? undefined : 'expand')
  const isActive = toRef(() => to && route.path === to)
  const childIds = toRef(() => nested.children.get(id) ?? [])
  const hasChildren = toRef(() => childIds.value.length > 0)
  const isTopLevel = toRef(() => depth === 0)
  const isCollapsible = toRef(() => isTopLevel.value && hasChildren.value)
  const isOpen = toRef(() => isCollapsible.value ? nested.opened(id) : true)

  function getChildProps (childId: ID) {
    const value = nested.get(childId)?.value
    if (!value) return null
    return {
      id: childId,
      name: value.name,
      to: isNavLink(value) ? value.to : undefined,
      depth: depth + 1,
    }
  }

  function onToggle () {
    if (isCollapsible.value) nested.flip(id)
  }

  function onOpen () {
    if (isCollapsible.value && !isOpen.value) nested.open([id])
  }
</script>

<template>
  <li class="px-3">
    <div class="flex items-center gap-1">
      <!-- Chevron toggle (top-level with children) -->
      <button
        v-if="isCollapsible"
        class="size-5 flex items-center justify-center shrink-0 rounded hover:bg-surface-tint focus-visible:bg-surface-tint focus-visible:outline-none"
        type="button"
        @click.stop="onToggle"
      >
        <svg
          aria-hidden="true"
          class="size-3.5 transition-transform"
          :class="isOpen && 'rotate-90'"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path d="M9 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>

      <span v-else-if="isTopLevel" aria-hidden="true" class="size-5 shrink-0 flex items-center justify-center text-divider">–</span>

      <!-- Navigable link -->
      <Atom
        v-if="to"
        :aria-current="isActive ? 'page' : undefined"
        :as="RouterLink"
        class="font-semibold flex-1 min-w-0 truncate"
        :class="[
          'hover:underline hover:text-primary focus-visible:underline focus-visible:text-primary',
          !isTopLevel && !hasChildren && 'opacity-70 hover:opacity-100 focus-visible:opacity-100',
          isActive && 'underline text-primary opacity-100!',
        ]"
        :to
        @click="onOpen"
      >
        {{ name }}
      </Atom>

      <!-- Category header -->
      <span
        v-else
        class="font-semibold flex-1 min-w-0 truncate"
        :class="isCollapsible && 'cursor-pointer hover:text-primary'"
        :role="isCollapsible ? 'button' : undefined"
        :tabindex="isCollapsible ? 0 : undefined"
        @click="onOpen"
        @keydown.enter="onOpen"
        @keydown.space.prevent="onOpen"
      >
        {{ name }}
      </span>
    </div>

    <!-- Children -->
    <Transition :name="transition">
      <div v-if="hasChildren && isOpen" class="grid mt-2" :class="isTopLevel && 'ml-6'">
        <ul class="flex flex-col gap-2 overflow-hidden">
          <template v-for="childId in childIds" :key="childId">
            <ShowcaseNavLink
              v-if="getChildProps(childId)"
              class="text-sm"
              v-bind="getChildProps(childId)!"
            />
          </template>
        </ul>
      </div>
    </Transition>
  </li>
</template>
