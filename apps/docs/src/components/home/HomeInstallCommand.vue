<script setup lang="ts">
  // Framework
  import { Popover } from '@vuetify/v0'

  // Composables
  import { useClipboard } from '@/composables/useClipboard'
  import { useSettings, type PackageManager } from '@/composables/useSettings'

  // Utilities
  import { shallowRef, toRef } from 'vue'

  const PACKAGE = '@vuetify/v0'

  const MANAGERS: { id: PackageManager, verb: string }[] = [
    { id: 'pnpm', verb: 'add' },
    { id: 'npm', verb: 'install' },
    { id: 'yarn', verb: 'add' },
    { id: 'bun', verb: 'add' },
  ]

  const settings = useSettings()
  const { copied, copy } = useClipboard()

  const isOpen = shallowRef(false)

  const verb = toRef(() => MANAGERS.find(manager => manager.id === settings.packageManager.value)?.verb ?? 'add')
  const command = toRef(() => `${settings.packageManager.value} ${verb.value} ${PACKAGE}`)

  function select (id: PackageManager) {
    settings.packageManager.value = id
    isOpen.value = false
  }
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
        aria-label="Package manager"
        class="p-1 rounded-lg bg-surface border border-divider shadow-lg min-w-[140px] !mt-1"
        position-area="bottom span-right"
        position-try="bottom span-right, bottom span-left, top span-right, top span-left"
        role="menu"
      >
        <button
          v-for="manager in MANAGERS"
          :key="manager.id"
          :aria-checked="settings.packageManager.value === manager.id"
          class="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm rounded-lg transition-colors text-left font-mono"
          :class="settings.packageManager.value === manager.id
            ? 'bg-primary/10 text-primary'
            : 'hover:bg-surface-tint text-on-surface'"
          role="menuitemradio"
          type="button"
          @click="select(manager.id)"
        >
          <span>{{ manager.id }}</span>
          <AppIcon v-if="settings.packageManager.value === manager.id" icon="check" :size="14" />
        </button>
      </Popover.Content>
    </Popover.Root>

    <code class="flex-1 truncate opacity-80 !bg-transparent !p-0 !rounded-none">{{ verb }} {{ PACKAGE }}</code>

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
