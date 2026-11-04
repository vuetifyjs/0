<script setup lang="ts">
  import { BTooltip } from '@paper/bootstrap'

  import { shallowRef } from 'vue'

  const placements = [
    'top-start',
    'top',
    'top-end',
    'right-start',
    'right',
    'right-end',
    'bottom-start',
    'bottom',
    'bottom-end',
    'left-start',
    'left',
    'left-end',
  ] as const

  const placement = shallowRef<(typeof placements)[number]>('top')
  const open = shallowRef(true)
</script>

<template>
  <div class="d-flex flex-column align-items-center gap-12 pt-3 pb-12">
    <div class="d-grid grid-cols-3 gap-1">
      <button
        v-for="side in placements"
        :key="side"
        :aria-pressed="placement === side"
        class="btn-sm btn-solid text-nowrap"
        :class="placement === side ? 'theme-primary' : 'theme-secondary'"
        type="button"
        @click="placement = side"
      >
        {{ side }}
      </button>
    </div>

    <BTooltip
      v-slot="{ attrs }"
      v-model="open"
      :placement
      :text="placement"
      trigger="click"
    >
      <button class="btn-solid theme-primary" type="button" v-bind="attrs">
        Tooltip
      </button>
    </BTooltip>
  </div>
</template>
