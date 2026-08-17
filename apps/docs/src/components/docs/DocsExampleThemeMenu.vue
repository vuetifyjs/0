<script setup lang="ts">
  // Framework
  import { Popover } from '@vuetify/v0'

  // Composables
  import { provideThemeToggle } from '@/composables/useThemeToggle'

  // Utilities
  import { shallowRef, toRef, useId } from 'vue'

  // Types
  import type { UseLocalThemeToggleReturn } from '@/composables/useLocalThemeToggle'

  export interface DocsExampleThemeMenuProps {
    controller: UseLocalThemeToggleReturn
  }

  const props = defineProps<DocsExampleThemeMenuProps>()

  provideThemeToggle(props.controller)

  const uid = useId()
  const open = shallowRef(false)
  const icon = toRef(() => props.controller.icon.value)
  const title = toRef(() => props.controller.title.value)
  const overridden = toRef(() => props.controller.isOverridden.value)
</script>

<template>
  <Popover.Root :id="uid" v-model="open">
    <AppTooltip
      as="span"
      class="mt-[8px] me-[8px] inline-flex"
      position-area="bottom"
      :text="title"
    >
      <Popover.Activator
        aria-label="Example theme"
        class="bg-surface-tint text-on-surface-tint pa-1 inline-flex rounded-none rounded-bl-[0.375rem] rounded-tr-[0.375rem] hover:bg-surface-variant transition-all cursor-pointer"
      >
        <AppIcon :icon />
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

        <button
          v-if="overridden"
          class="text-xs font-medium text-primary cursor-pointer"
          type="button"
          @click="props.controller.reset()"
        >
          Follow page
        </button>
      </div>

      <AppThemeMenu />
    </Popover.Content>
  </Popover.Root>
</template>
