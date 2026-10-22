<script setup lang="ts">
  import { BPopover } from '@paper/bootstrap'

  import { shallowRef } from 'vue'

  const open = shallowRef(true)
</script>

<template>
  <div class="pt-12">
    <div class="pt-12">
      <div class="pt-12">
        <div class="d-flex justify-content-center gap-5">
          <BPopover
            v-slot="{ attrs }"
            v-model="open"
            text="This is the popover content—make it as long as you want."
            title="Popover title"
          >
            <button class="btn-solid theme-primary" type="button" v-bind="attrs">
              Toggle popover
            </button>
          </BPopover>
        </div>
      </div>
    </div>
  </div>
</template>
