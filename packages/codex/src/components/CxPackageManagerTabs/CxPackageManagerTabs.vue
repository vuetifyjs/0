<script lang="ts">
  // Framework
  import { Tabs } from '@vuetify/v0'

  // Types
  import type { PackageManager } from '#codex/composables/useSettings'

  export interface CxPackageManagerTabsProps {
    /** Package name to install */
    package: string
    /** Add dev dependency flag (-D) */
    dev?: boolean
  }

  interface ManagerConfig {
    label: string
    command: (pkg: string, dev: boolean) => string
  }

  const managers: Record<PackageManager, ManagerConfig> = {
    pnpm: {
      label: 'pnpm',
      command: (pkg, dev) => `pnpm add${dev ? ' -D' : ''} ${pkg}`,
    },
    npm: {
      label: 'npm',
      command: (pkg, dev) => `npm install${dev ? ' -D' : ''} ${pkg}`,
    },
    yarn: {
      label: 'yarn',
      command: (pkg, dev) => `yarn add${dev ? ' -D' : ''} ${pkg}`,
    },
    bun: {
      label: 'bun',
      command: (pkg, dev) => `bun add${dev ? ' -d' : ''} ${pkg}`,
    },
  }

  const order: PackageManager[] = ['pnpm', 'npm', 'yarn', 'bun']
</script>

<script setup lang="ts">
  // Composables
  import { useClipboard } from '#codex/composables/useClipboard'
  import { useSettings } from '#codex/composables/useSettings'

  // Utilities
  import { toRef } from 'vue'

  defineOptions({ name: 'CxPackageManagerTabs' })

  const props = defineProps<CxPackageManagerTabsProps>()

  const { packageManager } = useSettings()
  const { copied, copy } = useClipboard()

  const command = toRef(() => managers[packageManager.value].command(props.package, props.dev ?? false))
</script>

<template>
  <div class="codex-package-manager-tabs">
    <Tabs.Root v-model="packageManager" mandatory="force">
      <Tabs.List
        class="codex-package-manager-tabs__list"
        label="Package manager"
      >
        <Tabs.Item
          v-for="manager in order"
          :key="manager"
          class="codex-package-manager-tabs__tab"
          :value="manager"
        >
          {{ managers[manager].label }}
        </Tabs.Item>
      </Tabs.List>

      <div class="codex-package-manager-tabs__panel">
        <pre class="codex-package-manager-tabs__code"><code>{{ command }}</code></pre>

        <button
          :aria-label="copied ? 'Copied!' : 'Copy command'"
          class="codex-package-manager-tabs__copy"
          :data-copied="copied || undefined"
          type="button"
          @click="copy(command)"
        >
          {{ copied ? '\u2713' : 'Copy' }}
        </button>
      </div>
    </Tabs.Root>
  </div>
</template>

<style scoped>
  .codex-package-manager-tabs {
    display: flex;
    flex-direction: column;
  }

  .codex-package-manager-tabs__list {
    display: flex;
    gap: 0;
  }

  .codex-package-manager-tabs__tab {
    cursor: pointer;
    background: none;
    border: none;
    font: inherit;
    font-size: 0.8125rem;
    padding: 0.375rem 0.75rem;
  }

  .codex-package-manager-tabs__panel {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  }

  .codex-package-manager-tabs__code {
    margin: 0;
    font-family: monospace;
    font-size: 0.875rem;
    overflow-x: auto;
    flex: 1;
    min-width: 0;
  }

  .codex-package-manager-tabs__copy {
    flex-shrink: 0;
    cursor: pointer;
    background: none;
    border: none;
    font: inherit;
    font-size: 0.75rem;
  }
</style>
