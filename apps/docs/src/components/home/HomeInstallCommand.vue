<script setup lang="ts">
  // Framework
  import { Popover } from '@vuetify/v0'

  // Composables
  import { useClipboard } from '@/composables/useClipboard'
  import { useSettings, type PackageManager } from '@/composables/useSettings'

  // Utilities
  import { shallowRef, toRef, watch } from 'vue'

  // Types
  import type { SingleSelectOption } from '@/components/app/settings/AppSettingsSingleSelect.vue'

  const PACKAGE = '@vuetify/v0'

  const VERBS: Record<PackageManager, string> = {
    pnpm: 'add',
    npm: 'install',
    yarn: 'add',
    bun: 'add',
  }

  const options: SingleSelectOption<PackageManager>[] = [
    { id: 'pnpm', value: 'pnpm', label: 'pnpm' },
    { id: 'npm', value: 'npm', label: 'npm' },
    { id: 'yarn', value: 'yarn', label: 'yarn' },
    { id: 'bun', value: 'bun', label: 'bun' },
  ]

  const settings = useSettings()
  const { copied, copy } = useClipboard()

  const isOpen = shallowRef(false)

  const command = toRef(() => `${settings.packageManager.value} ${VERBS[settings.packageManager.value]} ${PACKAGE}`)

  // Close the menu once a manager is chosen
  watch(() => settings.packageManager.value, () => {
    isOpen.value = false
  })
</script>

<template>
  <div
    class="inline-flex items-center gap-1.5 px-1.5 py-1 rounded-full border bg-surface font-mono text-sm max-w-full"
    :title="command"
  >
    <Popover.Root v-model="isOpen">
      <Popover.Activator
        aria-label="Change package manager"
        class="inline-flex items-center gap-1 pl-2.5 pr-2 py-1 rounded-full text-primary hover:bg-surface-tint transition-colors cursor-pointer"
        title="Change package manager"
      >
        <span>{{ settings.packageManager.value }}</span>
        <AppChevron :open="isOpen" :size="12" vertical />
      </Popover.Activator>

      <Popover.Content
        class="p-1.5 rounded-lg bg-surface border border-divider shadow-lg min-w-[140px] !mt-[9px]"
        position-area="bottom span-right"
        position-try="bottom span-right, bottom span-left, top span-right, top span-left"
      >
        <AppSettingsSingleSelect
          v-model="settings.packageManager.value"
          aria-label="Package manager"
          class="font-mono"
          layout="list"
          :options
        />
      </Popover.Content>
    </Popover.Root>

    <code class="flex-1 truncate opacity-80 !bg-transparent !p-0 !rounded-none">{{ VERBS[settings.packageManager.value] }} {{ PACKAGE }}</code>

    <button
      :aria-label="copied ? 'Copied!' : 'Copy command'"
      class="shrink-0 size-7 rounded-full flex items-center justify-center hover:bg-surface-tint transition-colors"
      :class="copied && 'text-success'"
      type="button"
      @click="copy(command)"
    >
      <AppIcon :icon="copied ? 'check' : 'copy'" :size="14" />
    </button>
  </div>
</template>
