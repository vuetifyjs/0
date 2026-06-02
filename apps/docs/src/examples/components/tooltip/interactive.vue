<script setup lang="ts">
  import { Button, Tooltip } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const copied = shallowRef(false)

  function onCopy () {
    copied.value = true
  }
</script>

<template>
  <div class="flex justify-center p-12">
    <Tooltip.Root :close-delay="300" interactive :open-delay="400">
      <Tooltip.Activator
        class="px-3 py-1.5 rounded-md border border-divider bg-surface text-on-surface text-sm hover:bg-surface-tint"
      >
        Share
      </Tooltip.Activator>

      <Tooltip.Content
        class="flex items-center gap-1 p-1 rounded-lg bg-on-surface text-surface shadow-lg"
        :style="{ margin: '6px 0' }"
      >
        <Button.Root
          class="px-2.5 py-1 rounded text-xs hover:bg-surface/15 data-[copied]:text-success"
          :data-copied="copied || undefined"
          @click="onCopy"
        >
          {{ copied ? 'Copied!' : 'Copy link' }}
        </Button.Root>

        <Button.Root class="px-2.5 py-1 rounded text-xs hover:bg-surface/15">
          Open
        </Button.Root>
      </Tooltip.Content>
    </Tooltip.Root>
  </div>
</template>
