<script setup lang="ts">
  // Framework
  import { Button, Popover } from '@vuetify/v0'

  // Composables
  import { useThemeToggleController } from '@/composables/useThemeToggle'

  // Utilities
  import { shallowRef, toRef, useId } from 'vue'

  const { modesOnly = false } = defineProps<{
    /** Light / dark only — no palettes, a11y themes, or custom themes. */
    modesOnly?: boolean
  }>()

  const toggle = useThemeToggleController()
  const icon = toRef(() => (
    modesOnly
      ? (toggle.isDark.value ? 'theme-dark' : 'theme-light')
      : toggle.icon.value
  ))
  const title = toRef(() => (
    modesOnly
      ? (toggle.isDark.value ? 'Switch to light' : 'Switch to dark')
      : toggle.title.value
  ))

  const uid = useId()
  const open = shallowRef(false)

  const chip = 'bg-surface-tint text-on-surface-tint hover:bg-surface-tint pa-1 inline-flex rounded-none rounded-bl-[0.375rem] rounded-tr-[0.375rem] cursor-pointer'

  function onFlip () {
    toggle.setMode(toggle.isDark.value ? 'light' : 'dark')
  }
</script>

<template>
  <AppTooltip
    v-if="modesOnly"
    as="span"
    class="mt-[8px] me-[8px] inline-flex"
    position-area="bottom"
    :text="title"
  >
    <Button.Root
      :aria-label="title"
      :class="chip"
      @click="onFlip"
    >
      <AppIcon :icon />
    </Button.Root>
  </AppTooltip>

  <Popover.Root v-else :id="uid" v-model="open">
    <AppTooltip
      as="span"
      class="mt-[8px] me-[8px] inline-flex"
      position-area="bottom"
      :text="title"
    >
      <Popover.Activator
        aria-label="Example theme"
        :class="[chip, 'data-[state=open]:bg-surface-tint']"
        :data-state="open ? 'open' : undefined"
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
