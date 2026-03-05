<script setup lang="ts">
  import { Switch, Theme } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const push = shallowRef(true)
  const email = shallowRef(false)
  const sms = shallowRef(false)
</script>

<template>
  <Theme class="rounded-lg bg-background text-on-background border border-divider overflow-hidden">
    <div class="px-4 py-3 border-b border-divider bg-surface">
      <div class="text-sm font-semibold">Notifications</div>
      <div class="text-xs text-on-surface-variant">Manage how you receive alerts</div>
    </div>

    <div class="p-4 flex flex-col gap-3">
      <label class="flex items-center justify-between cursor-pointer">
        <span class="text-sm">Push notifications</span>
        <Switch.Root v-model="push" class="inline-flex items-center border-none bg-transparent p-0">
          <Switch.Track class="relative inline-flex items-center w-9 h-5 rounded-full transition-colors bg-surface-tint data-[state=checked]:bg-primary">
            <Switch.Thumb class="![visibility:visible] block size-3.5 rounded-full bg-white shadow-sm transition-transform translate-x-0.75 data-[state=checked]:translate-x-4.25" />
          </Switch.Track>
        </Switch.Root>
      </label>

      <label class="flex items-center justify-between cursor-pointer">
        <span class="text-sm">Email digest</span>
        <Switch.Root v-model="email" class="inline-flex items-center border-none bg-transparent p-0">
          <Switch.Track class="relative inline-flex items-center w-9 h-5 rounded-full transition-colors bg-surface-tint data-[state=checked]:bg-primary">
            <Switch.Thumb class="![visibility:visible] block size-3.5 rounded-full bg-white shadow-sm transition-transform translate-x-0.75 data-[state=checked]:translate-x-4.25" />
          </Switch.Track>
        </Switch.Root>
      </label>

      <label class="flex items-center justify-between cursor-pointer">
        <span class="text-sm">SMS alerts</span>
        <Switch.Root v-model="sms" class="inline-flex items-center border-none bg-transparent p-0">
          <Switch.Track class="relative inline-flex items-center w-9 h-5 rounded-full transition-colors bg-surface-tint data-[state=checked]:bg-primary">
            <Switch.Thumb class="![visibility:visible] block size-3.5 rounded-full bg-white shadow-sm transition-transform translate-x-0.75 data-[state=checked]:translate-x-4.25" />
          </Switch.Track>
        </Switch.Root>
      </label>
    </div>

    <div class="px-4 py-3 border-t border-divider bg-surface flex justify-end gap-2">
      <button class="px-3 py-1.5 text-xs font-medium rounded border border-divider hover:bg-surface-tint">
        Cancel
      </button>

      <button class="px-3 py-1.5 text-xs font-medium rounded bg-primary text-on-primary">
        Save
      </button>
    </div>
  </Theme>
</template>
