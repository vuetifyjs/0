<script setup lang="ts">
  import { Button, Collapsible, Switch } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const open = shallowRef(false)
  const disabled = shallowRef(false)
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center gap-2 flex-wrap">
      <Button.Root
        class="px-3 py-1.5 text-sm rounded-lg border border-divider hover:bg-surface-tint"
        @click="open = true"
      >
        Open
      </Button.Root>

      <Button.Root
        class="px-3 py-1.5 text-sm rounded-lg border border-divider hover:bg-surface-tint"
        @click="open = false"
      >
        Close
      </Button.Root>

      <Button.Root
        class="px-3 py-1.5 text-sm rounded-lg border border-divider hover:bg-surface-tint"
        @click="open = !open"
      >
        Toggle
      </Button.Root>

      <label class="flex items-center gap-1.5 text-sm text-on-surface-variant ml-auto cursor-pointer">
        <Switch.Root
          v-model="disabled"
          class="inline-flex items-center border-none bg-transparent p-0 outline-none"
        >
          <Switch.Track
            class="relative inline-flex items-center w-9 h-5 rounded-full bg-surface-variant transition-colors data-[state=checked]:bg-primary"
          >
            <Switch.Thumb
              class="![visibility:visible] block size-3.5 rounded-full bg-white shadow-sm transition-transform translate-x-0.75 data-[state=checked]:translate-x-4.25"
            />
          </Switch.Track>
        </Switch.Root>

        Disabled
      </label>
    </div>

    <Collapsible.Root
      v-model="open"
      class="border border-divider rounded-lg border-solid overflow-hidden data-[disabled]:opacity-50"
      :disabled
    >
      <Collapsible.Activator
        class="w-full px-3 py-2 border-none flex items-center gap-3 text-left cursor-pointer bg-surface hover:bg-surface-tint data-[disabled]:cursor-not-allowed"
      >
        <Collapsible.Cue class="inline-flex items-center justify-center w-5 text-sm text-on-surface opacity-60 data-[state=open]:text-primary">
          <span class="data-[state=open]:hidden">+</span>
          <span class="hidden data-[state=open]:inline">&minus;</span>
        </Collapsible.Cue>

        <span class="flex-1 font-medium text-on-surface text-base">
          Controlled collapsible
        </span>
      </Collapsible.Activator>

      <Collapsible.Content class="px-3 py-2 border-t border-divider border-solid">
        <div class="text-on-surface text-sm">
          This collapsible is controlled externally via <code class="text-primary">v-model</code>. The buttons above change state from outside the component.
        </div>
      </Collapsible.Content>
    </Collapsible.Root>

    <div class="text-sm text-on-surface-variant">
      State: <code class="text-primary">{{ open ? 'open' : 'closed' }}</code>
    </div>
  </div>
</template>
