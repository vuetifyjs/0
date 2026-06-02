<script setup lang="ts">
  import { Button, Tooltip } from '@vuetify/v0'
  import { shallowRef } from 'vue'
  import TooltipButton from './TooltipButton.vue'

  const copied = shallowRef(false)

  function onCopy () {
    copied.value = true
  }
</script>

<template>
  <div class="flex flex-col items-center gap-3 p-12">
    <p class="max-w-sm text-center text-sm text-on-surface-variant">
      Hover a button and wait, then glide to its neighbors — they open instantly. One tooltip plugin keeps the whole toolbar's region warm, so only the first hover waits the open delay.
    </p>

    <div class="flex items-center gap-1 rounded-lg border border-divider bg-surface p-1">
      <TooltipButton label="Bold">
        <span class="font-bold">B</span>
      </TooltipButton>

      <TooltipButton label="Italic">
        <span class="italic">I</span>
      </TooltipButton>

      <TooltipButton label="Underline">
        <span class="underline">U</span>
      </TooltipButton>

      <div class="mx-1 h-5 w-px bg-divider" />

      <Tooltip.Root :close-delay="300" interactive>
        <Tooltip.Activator
          class="h-8 inline-flex items-center rounded-md border border-divider bg-surface px-2 text-sm text-on-surface hover:bg-surface-tint"
        >
          Link
        </Tooltip.Activator>

        <Tooltip.Content
          class="rounded-lg bg-on-surface text-surface shadow-lg"
          :style="{ margin: '6px 0' }"
        >
          <div class="flex items-center gap-2 p-2">
            <code class="text-xs">vuetifyjs.com/0</code>

            <Button.Root
              class="rounded bg-surface/15 px-2 py-1 text-xs hover:bg-surface/25 data-[copied]:bg-success data-[copied]:text-on-success"
              :data-copied="copied || undefined"
              @click="onCopy"
            >
              {{ copied ? 'Copied!' : 'Copy' }}
            </Button.Root>
          </div>
        </Tooltip.Content>
      </Tooltip.Root>
    </div>
  </div>
</template>
