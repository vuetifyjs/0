<script setup lang="ts">
  import { BTooltip } from '@paper/bootstrap'

  import { shallowRef } from 'vue'

  const open = shallowRef(true)
</script>

<template>
  <div class="d-flex justify-content-center pt-12">
    <BTooltip v-slot="{ attrs }" v-model="open" text="Tooltip on top">
      <button class="btn-solid theme-primary" type="button" v-bind="attrs">
        Tooltip on top
      </button>
    </BTooltip>
  </div>
</template>
