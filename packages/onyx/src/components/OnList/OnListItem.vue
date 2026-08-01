<script lang="ts">
  // Framework
  import { Atom } from '@vuetify/v0'

  export interface OnListItemProps {
    active?: boolean
    two?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'OnListItem' })

  const { active = false, two = false } = defineProps<OnListItemProps>()
</script>

<template>
  <Atom as="li" class="onyx-list__item" :data-active="active || undefined" :data-two-line="two || undefined">
    <span v-if="$slots.leading" class="onyx-list__leading">
      <slot name="leading" />
    </span>

    <span class="onyx-list__content">
      <slot />
    </span>

    <span v-if="$slots.trailing" class="onyx-list__trailing">
      <slot name="trailing" />
    </span>
  </Atom>
</template>
