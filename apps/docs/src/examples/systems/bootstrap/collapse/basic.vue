<script setup lang="ts">
  import { BCollapse } from '@paper/bootstrap'

  import { shallowRef } from 'vue'

  const open = shallowRef(true)
</script>

<template>
  <div>
    <button
      aria-controls="collapse-example"
      :aria-expanded="open"
      class="btn-solid theme-primary"
      type="button"
      @click="open = !open"
    >
      Toggle collapse
    </button>

    <BCollapse id="collapse-example" v-model="open">
      Some placeholder content for the collapse component. This panel is hidden by default but revealed when the user activates the relevant trigger.
    </BCollapse>
  </div>
</template>
