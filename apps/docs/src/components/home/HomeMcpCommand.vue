<script setup lang="ts">
  // Framework
  import { Popover } from '@vuetify/v0'

  // Composables
  import { useClipboard } from '@/composables/useClipboard'
  import { useSettings, type CodingCli } from '@/composables/useSettings'

  import { CODING_CLI_IDS, CODING_CLIS, codingCliCommand } from '@/constants/codingCli'

  // Utilities
  import { shallowRef, toRef, watch } from 'vue'

  // Types
  import type { SingleSelectOption } from '@/components/app/settings/AppSettingsSingleSelect.vue'

  const options: SingleSelectOption<CodingCli>[] = CODING_CLI_IDS.map(id => ({
    id,
    value: id,
    label: CODING_CLIS[id].bin,
  }))

  const settings = useSettings()
  const { copied, copy } = useClipboard()

  const isOpen = shallowRef(false)

  const bin = toRef(() => CODING_CLIS[settings.codingCli.value].bin)
  const args = toRef(() => CODING_CLIS[settings.codingCli.value].args)
  const command = toRef(() => codingCliCommand(settings.codingCli.value))

  watch(() => settings.codingCli.value, () => {
    isOpen.value = false
  })
</script>

<template>
  <div class="inline-flex items-center gap-1.5 px-1.5 py-1 rounded-full border bg-surface font-mono text-sm max-w-full">
    <Popover.Root v-model="isOpen">
      <AppTooltip as="span" class="inline-flex" text="Change coding CLI">
        <Popover.Activator
          aria-label="Change coding CLI"
          class="inline-flex items-center gap-1 pl-2.5 pr-2 py-1 rounded-full text-primary hover:bg-surface-tint transition-colors cursor-pointer"
        >
          <span>{{ bin }}</span>
          <AppChevron :open="isOpen" :size="12" vertical />
        </Popover.Activator>
      </AppTooltip>

      <Popover.Content
        class="p-1.5 rounded-lg bg-surface border border-divider shadow-lg min-w-[140px] !mt-[9px]"
        position-area="bottom span-right"
        position-try="bottom span-right, bottom span-left, top span-right, top span-left"
      >
        <AppSettingsSingleSelect
          v-model="settings.codingCli.value"
          aria-label="Coding CLI"
          class="font-mono"
          layout="list"
          :options
        />
      </Popover.Content>
    </Popover.Root>

    <AppTooltip
      as="code"
      class="flex-1 truncate opacity-80 !bg-transparent !p-0 !rounded-none"
      :text="command"
    >
      {{ args }}
    </AppTooltip>

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
