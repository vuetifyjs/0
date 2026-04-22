<script setup lang="ts">
  import { Collapsible } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const open = shallowRef(false)
  const disabled = shallowRef(false)
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center gap-2 flex-wrap">
      <button
        class="px-3 py-1.5 text-sm rounded-lg border border-divider hover:bg-surface-tint"
        @click="open = true"
      >
        Open
      </button>

      <button
        class="px-3 py-1.5 text-sm rounded-lg border border-divider hover:bg-surface-tint"
        @click="open = false"
      >
        Close
      </button>

      <button
        class="px-3 py-1.5 text-sm rounded-lg border border-divider hover:bg-surface-tint"
        @click="open = !open"
      >
        Toggle
      </button>

      <label class="flex items-center gap-1.5 text-sm text-on-surface-variant ml-auto">
        <input v-model="disabled" type="checkbox">
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
