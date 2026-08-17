<script setup lang="ts">
  // Framework
  import { Button, Popover } from '@vuetify/v0'

  // Composables
  import { useThemeToggleController } from '@/composables/useThemeToggle'

  // Utilities
  import { shallowRef, useId } from 'vue'

  const toggle = useThemeToggleController()

  const uid = useId()
  const open = shallowRef(false)
</script>

<template>
  <Popover.Root :id="uid" v-model="open">
    <AppTooltip
      as="span"
      class="mt-[8px] me-[8px] inline-flex"
      position-area="bottom"
      :text="toggle.title.value"
    >
      <Popover.Activator
        aria-label="Example theme"
        class="bg-surface-tint text-on-surface-tint pa-1 inline-flex rounded-none rounded-bl-[0.375rem] rounded-tr-[0.375rem] hover:bg-surface-variant transition-all cursor-pointer"
        :data-state="open ? 'open' : undefined"
      >
        <AppIcon :icon="toggle.icon.value" />
      </Popover.Activator>
    </AppTooltip>

    <Popover.Content
      :id="uid"
      class="p-3 rounded-lg bg-surface border border-divider shadow-xl min-w-56 justify-self-end self-start"
      position-area="bottom span-left"
      position-try="bottom span-left, top span-left, bottom span-right, top span-right"
    >
      <div class="flex items-center justify-between mb-3 ps-1">
        <span class="text-xs font-semibold text-on-surface">Theme</span>

        <Button.Root
          v-if="toggle.isOverridden.value"
          class="text-xs font-medium text-primary cursor-pointer"
          @click="toggle.reset()"
        >
          Follow page
        </Button.Root>
      </div>

      <AppThemeMenu />
    </Popover.Content>
  </Popover.Root>
</template>
