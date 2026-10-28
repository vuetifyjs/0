<script lang="ts">
  // Framework
  import { isString, useLocale } from '@vuetify/v0'

  // Utilities
  import { toRef } from 'vue'

  export interface BBreadcrumbProps {
    /** `aria-label` on the nav. Falls back to `breadcrumb`. */
    label?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BBreadcrumb' })

  defineSlots<{
    default?: () => any
  }>()

  const { label } = defineProps<BBreadcrumbProps>()

  const locale = useLocale()

  const name = toRef(() => {
    if (isString(label) && label.length > 0) return label
    return locale.ti('Breadcrumb.label') ?? 'breadcrumb'
  })
</script>

<template>
  <nav :aria-label="name">
    <ol class="breadcrumb">
      <slot />
    </ol>
  </nav>
</template>
