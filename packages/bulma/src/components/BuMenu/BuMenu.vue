<script lang="ts">
  // Framework
  import { Single } from '@vuetify/v0'

  export interface BuMenuItem<T = unknown> {
    /** Selection value — defaults to `label` when omitted. */
    value?: T
    /** Anchor text. */
    label: string
    /** Optional href for the anchor. */
    href?: string
    /** One level of nesting: rendered as a bare `<ul>` sibling of the anchor, always visible. */
    children?: BuMenuItem<T>[]
  }

  export interface BuMenuSection<T = unknown> {
    /** Optional `p.menu-label` heading for the section. */
    label?: string
    /** Items rendered as `ul.menu-list > li > a`. */
    items: BuMenuItem<T>[]
  }

  export interface BuMenuProps<T = unknown> {
    /** Alternating label + list sections. */
    items?: BuMenuSection<T>[]
  }
</script>

<script lang="ts" setup generic="T = unknown">
  defineOptions({ name: 'BuMenu' })

  defineSlots<{
    default: () => any
  }>()

  defineEmits<{
    'update:model-value': [value: T]
  }>()

  const { items = [] } = defineProps<BuMenuProps<T>>()

  const model = defineModel<T>()

  function onModel (value: T | T[] | undefined) {
    model.value = value as T | undefined
  }
</script>

<template>
  <aside class="menu">
    <Single.Root
      :model-value="model"
      @update:model-value="onModel"
    >
      <template
        v-for="(section, index) in items"
        :key="index"
      >
        <p
          v-if="section.label"
          class="menu-label"
        >{{ section.label }}</p>

        <ul class="menu-list">
          <li
            v-for="item in section.items"
            :key="item.label"
          >
            <!--
              Hand-picked bindings, not the Item attrs spread: aria-selected /
              aria-disabled are invalid on role-less anchors (axe
              aria-allowed-attr, critical) — data-selected keeps the data-attr
              styling hook. Same convention as BuPanel; see CANON.
            -->
            <Single.Item
              v-slot="{ isSelected, select }"
              :value="item.value ?? item.label"
            >
              <a
                :class="{ 'is-active': isSelected }"
                :data-selected="isSelected || undefined"
                :href="item.href"
                @click="select"
              >{{ item.label }}</a>
            </Single.Item>

            <ul v-if="item.children?.length">
              <li
                v-for="child in item.children"
                :key="child.label"
              >
                <Single.Item
                  v-slot="{ isSelected, select }"
                  :value="child.value ?? child.label"
                >
                  <a
                    :class="{ 'is-active': isSelected }"
                    :data-selected="isSelected || undefined"
                    :href="child.href"
                    @click="select"
                  >{{ child.label }}</a>
                </Single.Item>
              </li>
            </ul>
          </li>
        </ul>
      </template>

      <slot />
    </Single.Root>
  </aside>
</template>
