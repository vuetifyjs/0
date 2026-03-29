<script lang="ts">
  // Framework
  import { Tabs } from '@vuetify/v0'

  // Types
  import type { PackageManager } from '#helix/composables/useSettings'

  export interface HxPackageManagerTabsProps {
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
  import { useClipboard } from '#helix/composables/useClipboard'
  import { useSettings } from '#helix/composables/useSettings'

  // Utilities
  import { toRef } from 'vue'

  defineOptions({ name: 'HxPackageManagerTabs' })

  const props = defineProps<HxPackageManagerTabsProps>()

  const { packageManager } = useSettings()
  const { copied, copy } = useClipboard()

  const command = toRef(() => managers[packageManager.value].command(props.package, props.dev ?? false))
</script>

<template>
  <div class="helix-package-manager-tabs">
    <Tabs.Root v-model="packageManager" mandatory="force">
      <Tabs.List
        class="helix-package-manager-tabs__list"
        label="Package manager"
      >
        <Tabs.Item
          v-for="manager in order"
          :key="manager"
          class="helix-package-manager-tabs__tab"
          :value="manager"
        >
          {{ managers[manager].label }}
        </Tabs.Item>
      </Tabs.List>

      <div class="helix-package-manager-tabs__panel">
        <pre class="helix-package-manager-tabs__code"><code>{{ command }}</code></pre>

        <button
          :aria-label="copied ? 'Copied!' : 'Copy command'"
          class="helix-package-manager-tabs__copy"
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
  .helix-package-manager-tabs {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--v0-divider);
    border-radius: 0.5rem;
    overflow: hidden;
  }

  .helix-package-manager-tabs__list {
    display: flex;
    gap: 0;
    background-color: var(--v0-surface-tint);
    border-bottom: 1px solid var(--v0-divider);
  }

  .helix-package-manager-tabs__tab {
    cursor: pointer;
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    font: inherit;
    font-size: 0.8125rem;
    padding: 0.375rem 0.75rem;
    color: var(--v0-on-surface-variant);
    transition: color 0.15s, border-color 0.15s;
  }

  .helix-package-manager-tabs__tab[data-selected],
  .helix-package-manager-tabs__tab[aria-selected='true'] {
    color: var(--v0-primary);
    border-bottom-color: var(--v0-primary);
  }

  .helix-package-manager-tabs__panel {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background-color: var(--v0-surface);
  }

  .helix-package-manager-tabs__code {
    margin: 0;
    font-family: monospace;
    font-size: 0.875rem;
    overflow-x: auto;
    flex: 1;
    min-width: 0;
    color: var(--v0-on-surface);
  }

  .helix-package-manager-tabs__copy {
    flex-shrink: 0;
    cursor: pointer;
    background: transparent;
    border: 1px solid var(--v0-divider);
    border-radius: 0.25rem;
    padding: 0.25rem 0.5rem;
    font: inherit;
    font-size: 0.75rem;
    color: var(--v0-on-surface-variant);
    transition: color 0.15s, background-color 0.15s;
  }

  .helix-package-manager-tabs__copy:hover {
    color: var(--v0-on-surface);
    background-color: var(--v0-surface-tint);
  }
</style>
