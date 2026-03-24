<script setup lang="ts">
  import { Button, useTimer } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const loading = shallowRef(false)
  const loaded = shallowRef(false)

  const reset = useTimer(
    () => {
      loaded.value = false
    },
    { duration: 2000 },
  )

  function onLoad () {
    if (loaded.value || loading.value) return

    loading.value = true
    const delay = Math.random() > 0.5 ? 100 : 3000
    setTimeout(() => {
      loading.value = false
      loaded.value = true
      reset.start()
    }, delay)
  }
</script>

<template>
  <div class="flex flex-wrap gap-4 items-center justify-center">
    <div class="flex flex-col items-center gap-1">
      <Button.Root
        class="px-4 py-2 rounded-md text-sm font-medium bg-primary text-on-primary opacity-50 cursor-not-allowed"
        disabled
      >
        Disabled
      </Button.Root>
      <span class="text-xs text-on-surface-variant">native disabled</span>
    </div>

    <div class="flex flex-col items-center gap-1">
      <Button.Root
        class="px-4 py-2 rounded-md text-sm font-medium bg-primary text-on-primary data-[readonly]:ring-2 data-[readonly]:ring-primary/50"
        readonly
      >
        Readonly
      </Button.Root>
      <span class="text-xs text-on-surface-variant">focusable, no click</span>
    </div>

    <div class="flex flex-col items-center gap-1">
      <Button.Root
        class="px-4 py-2 rounded-md text-sm font-medium bg-primary text-on-primary data-[passive]:opacity-50 data-[passive]:cursor-not-allowed"
        passive
        title="This action is temporarily unavailable"
      >
        Passive
      </Button.Root>
      <span class="text-xs text-on-surface-variant">aria-disabled</span>
    </div>

    <div class="flex flex-col items-center gap-1">
      <Button.Root
        class="px-4 py-2 rounded-md text-sm font-medium bg-primary text-on-primary min-w-24 relative inline-flex items-center justify-center data-[loading]:cursor-default"
        :grace="1000"
        :loading
        @click="onLoad"
      >
        <Button.Loading v-slot="{ isSelected }">
          <span class="absolute inset-0 flex items-center justify-center transition-opacity" :class="isSelected ? 'opacity-100' : 'opacity-0'">
            <span class="inline-block w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
          </span>
        </Button.Loading>

        <Button.Content v-slot="{ isSelected }">
          <span :class="isSelected ? 'visible' : 'invisible'">{{ loaded ? 'Loaded' : 'Load' }}</span>
        </Button.Content>
      </Button.Root>
      <span class="text-xs text-on-surface-variant">1s grace period</span>
    </div>
  </div>
</template>
