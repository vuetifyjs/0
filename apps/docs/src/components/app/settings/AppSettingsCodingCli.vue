<script setup lang="ts">
  // Composables
  import { useSettings, type CodingCli } from '@/composables/useSettings'

  import { CODING_CLI_IDS, CODING_CLIS } from '@/constants/codingCli'

  // Types
  import type { SingleSelectOption } from './AppSettingsSingleSelect.vue'

  const settings = useSettings()

  const options: SingleSelectOption<CodingCli>[] = CODING_CLI_IDS.map(id => ({
    id,
    value: id,
    label: CODING_CLIS[id].name,
  }))
</script>

<template>
  <section>
    <AppSettingsHeader icon="code" title="Coding CLI" />

    <AppSettingsSingleSelect
      v-model="settings.codingCli.value"
      aria-label="Coding CLI"
      :columns="2"
      :options
    />

    <p class="text-xs text-on-surface-variant/60 mt-2">
      Default for MCP commands
    </p>
  </section>
</template>
