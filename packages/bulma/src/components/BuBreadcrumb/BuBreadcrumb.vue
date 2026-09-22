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
 *
 * Crumbs are composed as `BuBreadcrumbItem` children — set `current` on the
 * last item; the root does not infer it.
 */

<script lang="ts">
  // Utilities
  import { toRef } from 'vue'

  export interface BuBreadcrumbProps {
    /** Center the crumb list (`is-centered`) */
    centered?: boolean
    /** Accessible label for the navigation landmark */
    label?: string
    /** Right-align the crumb list (`is-right`) */
    right?: boolean
    /** Alternative separator modifier (has-{separator}-separator) */
    separator?: 'arrow' | 'bullet' | 'dot' | 'succeeds'
    /** Bulma size modifier */
    size?: 'small' | 'normal' | 'medium' | 'large'
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BuBreadcrumb' })

  defineSlots<{
    /** `BuBreadcrumbItem` crumbs rendered inside the `<ul>` */
    default?: () => any
  }>()

  const {
    centered = false,
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
</script>

<template>
  <nav
    :aria-label="label"
    class="breadcrumb"
    :class="classes"
  >
    <ul>
      <slot />
    </ul>
  </nav>
</template>
