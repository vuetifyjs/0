/**
 * @module BuBreadcrumb
 *
 * @remarks
 * Hand-rolled `nav.breadcrumb` markup. v0's Breadcrumbs compound is
 * deliberately NOT used in Tier 1: BreadcrumbsRoot's overflow watcher hides
 * middle crumbs whenever the measured container is narrower than the crumb
 * run even when no Ellipsis is registered — silently disappearing items with
 * no indicator, where upstream Bulma flex-wraps. BuBreadcrumb uses none of
 * the compound's other behavior (no v-model, no overflow UI), so nothing else
 * is lost. v0-core follow-up: BreadcrumbsRoot should skip the truncation
 * branch when no ellipsis ticket is registered (or expose an overflow
 * opt-out); revisit once fixed.
 */

<script lang="ts">
  // Utilities
  import { toRef } from 'vue'

  export interface BuBreadcrumbItem {
    /** Display text */
    text: string
    /** Link target */
    href?: string
  }

  export interface BuBreadcrumbProps {
    /** Center the crumb list (`is-centered`) */
    centered?: boolean
    /** Breadcrumb trail — the last item is declaratively current */
    items?: BuBreadcrumbItem[]
    /** Accessible label for the navigation landmark */
    label?: string
    /** Right-align the crumb list (`is-right`) */
    right?: boolean
    /** Alternative separator modifier (has-{separator}-separator) */
    separator?: 'arrow' | 'bullet' | 'dot' | 'succeeds'
    /** Bulma size modifier */
    size?: 'small' | 'normal' | 'medium' | 'large'
  }

  export interface BuBreadcrumbSlotProps {
    /** The item being rendered */
    item: BuBreadcrumbItem
    /** Position in the trail */
    index: number
    /** Whether this is the current (last) item */
    isLast: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BuBreadcrumb' })

  defineSlots<{
    /** Anchor content per item; falls back to item text */
    item?: (props: BuBreadcrumbSlotProps) => any
  }>()

  const {
    centered = false,
    items = [],
    label = 'breadcrumbs',
    right = false,
    separator,
    size,
  } = defineProps<BuBreadcrumbProps>()

  const classes = toRef(() => [
    separator && `has-${separator}-separator`,
    centered && 'is-centered',
    right && 'is-right',
    size && `is-${size}`,
  ])

  const last = toRef(() => items.length - 1)
</script>

<template>
  <nav
    :aria-label="label"
    class="breadcrumb"
    :class="classes"
  >
    <ul>
      <li
        v-for="(item, index) in items"
        :key="index"
        :class="{ 'is-active': index === last }"
      >
        <a
          :aria-current="index === last ? 'page' : undefined"
          :href="item.href"
        >
          <slot
            :index
            :is-last="index === last"
            :item
            name="item"
          >{{ item.text }}</slot>
        </a>
      </li>
    </ul>
  </nav>
</template>
