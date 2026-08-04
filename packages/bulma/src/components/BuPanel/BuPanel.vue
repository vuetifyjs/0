<script lang="ts">
  // Framework
  import { Selection } from '@vuetify/v0'

  export interface BuPanelProps {
    /** Allow multiple selected `a.panel-block` rows. */
    multiple?: boolean
    /** Bulma color modifier on the panel root. */
    color?: 'primary' | 'link' | 'info' | 'success' | 'warning' | 'danger'
  }
</script>

<script lang="ts" setup generic="T = unknown">
  defineOptions({ name: 'BuPanel' })

  defineSlots<{
    /**
     * `nav.panel` children — BuPanelHeading, BuPanelTabs, BuPanelBlock, and any
     * passthrough `.panel-block` markup, flat, exactly as Bulma nests them.
     */
    default: () => any
  }>()

  defineEmits<{
    'update:model-value': [value: T | T[]]
  }>()

  const {
    multiple = false,
    color,
  } = defineProps<BuPanelProps>()

  const model = defineModel<T | T[]>()
</script>

<template>
  <nav
    class="panel"
    :class="color ? `is-${color}` : undefined"
  >
    <!--
      The block selection scope spans the whole panel; BuPanelTabs opens its
      own nested single-selection scope for the `.panel-tabs` anchors.
    -->
    <Selection.Root
      v-model="model"
      :multiple
    >
      <slot />
    </Selection.Root>
  </nav>
</template>
