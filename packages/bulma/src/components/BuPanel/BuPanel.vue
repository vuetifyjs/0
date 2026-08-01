<script lang="ts">
  // Framework
  import { isString, Selection, Single } from '@vuetify/v0'

  // Utilities
  import { shallowRef } from 'vue'

  export interface BuPanelItem<T = unknown> {
    /** Selection value — defaults to `label` when omitted. */
    value?: T
    /** Block text. */
    label: string
    /** Icon classes for the `span.panel-icon > i` (e.g. `fas fa-book`). */
    icon?: string
  }

  export interface BuPanelProps<T = unknown> {
    /** `p.panel-heading` text. */
    heading?: string
    /** `p.panel-tabs` anchor labels — its own single-selection scope, first tab auto-selects. */
    tabs?: string[]
    /** Selectable `a.panel-block` rows — the v-model selection scope. */
    items?: BuPanelItem<T>[]
    /** Allow multiple selected `a.panel-block` rows. */
    multiple?: boolean
    /** Bulma color modifier on the panel root. */
    color?: 'primary' | 'link' | 'info' | 'success' | 'warning' | 'danger'
  }
</script>

<script lang="ts" setup generic="T = unknown">
  defineOptions({ name: 'BuPanel' })

  defineSlots<{
    /** Passthrough blocks between the heading and the tabs (e.g. a search `div.panel-block`). */
    start: () => any
    /** Passthrough blocks after the selectable rows (e.g. checkbox and button `panel-block`s). */
    default: () => any
  }>()

  const emit = defineEmits<{
    'update:model-value': [value: T | T[]]
    'tab': [value: string]
  }>()

  const {
    heading,
    tabs = [],
    items = [],
    multiple = false,
    color,
  } = defineProps<BuPanelProps<T>>()

  const model = defineModel<T | T[]>()

  const tab = shallowRef<string>()

  function onTab (value: string | string[] | undefined) {
    if (!isString(value)) return
    tab.value = value
    emit('tab', value)
  }
</script>

<template>
  <nav
    class="panel"
    :class="color ? `is-${color}` : undefined"
  >
    <p
      v-if="heading"
      class="panel-heading"
    >{{ heading }}</p>

    <slot name="start" />

    <Single.Root
      v-if="tabs.length > 0"
      mandatory="force"
      :model-value="tab"
      @update:model-value="onTab"
    >
      <!--
        Hand-picked bindings, not the Item attrs spread: aria-selected /
        aria-disabled are invalid on role-less anchors (axe aria-allowed-attr,
        critical) — data-selected keeps the data-attr styling hook. Same
        convention as BuMenu; see CANON.
      -->
      <p class="panel-tabs">
        <Single.Item
          v-for="label in tabs"
          :key="label"
          v-slot="{ isSelected, select }"
          :value="label"
        >
          <a
            :class="{ 'is-active': isSelected }"
            :data-selected="isSelected || undefined"
            @click="select"
          >{{ label }}</a>
        </Single.Item>
      </p>
    </Single.Root>

    <Selection.Root
      v-model="model"
      :multiple
    >
      <Selection.Item
        v-for="item in items"
        :key="item.label"
        v-slot="{ isSelected, select }"
        :value="item.value ?? item.label"
      >
        <a
          class="panel-block"
          :class="{ 'is-active': isSelected }"
          :data-selected="isSelected || undefined"
          @click="select"
        >
          <span
            v-if="item.icon"
            class="panel-icon"
          ><i
            aria-hidden="true"
            :class="item.icon"
          /></span>
          {{ item.label }}
        </a>
      </Selection.Item>
    </Selection.Root>

    <slot />
  </nav>
</template>
