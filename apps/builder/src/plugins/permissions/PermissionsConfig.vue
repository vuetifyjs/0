<script setup lang="ts">
  import { mdiClose, mdiPlus } from '@mdi/js'

  // Framework
  import { Button, Input } from '@vuetify/v0'

  import { defaultConfig } from './defaults'

  // Stores
  import { useBuilderStore } from '@/stores/builder'

  // Utilities
  import { onBeforeUnmount, reactive, watch } from 'vue'

  // Types
  import type { PermissionRule, PermissionsConfig } from './defaults'

  interface RoleRow {
    name: string
    rules: Array<{ actions: string, subjects: string }>
  }

  const store = useBuilderStore()

  const stored = store.pluginConfig.usePermissions as PermissionsConfig | undefined
  const initial: PermissionsConfig = JSON.parse(JSON.stringify(stored ?? defaultConfig))

  const state = reactive({
    roles: Object.entries(initial.permissions).map<RoleRow>(([name, rules]) => ({
      name,
      rules: rules.map(([actions, subjects]) => ({
        actions: actions.join(', '),
        subjects: subjects.join(', '),
      })),
    })),
  })

  function parseList (value: string): string[] {
    return value.split(',').map(token => token.trim()).filter(Boolean)
  }

  function addRole () {
    state.roles.push({ name: '', rules: [{ actions: '', subjects: '' }] })
  }

  function removeRole (index: number) {
    state.roles.splice(index, 1)
  }

  function addRule (roleIndex: number) {
    state.roles[roleIndex].rules.push({ actions: '', subjects: '' })
  }

  function removeRule (roleIndex: number, ruleIndex: number) {
    state.roles[roleIndex].rules.splice(ruleIndex, 1)
  }

  function snapshot (): PermissionsConfig {
    const permissions: Record<string, PermissionRule[]> = {}

    for (const row of state.roles) {
      const name = row.name.trim()
      if (!name) continue

      permissions[name] = row.rules
        .map<PermissionRule>(rule => [parseList(rule.actions), parseList(rule.subjects)])
        .filter(([actions, subjects]) => actions.length > 0 && subjects.length > 0)
    }

    return { permissions }
  }

  function onSave () {
    store.savePluginConfig('usePermissions', snapshot())
  }

  watch(state, () => {
    store.setDraft('usePermissions', JSON.parse(JSON.stringify(snapshot())))
  }, { deep: true, immediate: true })

  onBeforeUnmount(() => {
    store.clearDraft('usePermissions')
  })
</script>

<template>
  <PluginConfigShell plugin-id="usePermissions" @save="onSave">
    <template #description>
      <p class="text-on-surface-variant mb-8">
        Define role-based access with flat lists of <code class="text-xs px-1.5 py-0.5 rounded bg-surface-variant">[actions, subjects]</code>
        tuples per role, matching the shape <code class="text-xs px-1.5 py-0.5 rounded bg-surface-variant">createPermissions()</code>
        expects. No role inheritance — every role is independent.
      </p>
    </template>

    <div class="space-y-6">
      <div class="space-y-4">
        <div
          v-for="(role, roleIndex) in state.roles"
          :key="roleIndex"
          class="border border-divider rounded-lg p-4 bg-surface"
        >
          <div class="flex items-center gap-2 mb-3">
            <label class="flex-1 block">
              <span class="text-xs uppercase tracking-wide text-on-surface-variant">Role</span>

              <Input.Root v-model="role.name">
                <Input.Control
                  class="mt-1 w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm font-mono"
                  placeholder="admin"
                />
              </Input.Root>
            </label>

            <Button.Root
              :aria-label="`Remove role ${role.name || roleIndex + 1}`"
              class="self-end text-on-surface-variant hover:text-error p-2"
              :title="`Remove ${role.name || 'role'}`"
              @click="removeRole(roleIndex)"
            >
              <Button.Icon>
                <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiClose" fill="currentColor" /></svg>
              </Button.Icon>
            </Button.Root>
          </div>

          <div class="text-xs uppercase tracking-wide text-on-surface-variant mb-2">Rules</div>

          <div class="space-y-2">
            <div
              v-for="(rule, ruleIndex) in role.rules"
              :key="ruleIndex"
              class="grid grid-cols-[1fr_1fr_auto] gap-2 items-center"
            >
              <Input.Root v-model="rule.actions">
                <Input.Control
                  class="px-3 py-1.5 rounded-lg border border-divider bg-surface text-on-surface text-sm font-mono"
                  placeholder="read, write"
                />
              </Input.Root>

              <Input.Root v-model="rule.subjects">
                <Input.Control
                  class="px-3 py-1.5 rounded-lg border border-divider bg-surface text-on-surface text-sm font-mono"
                  placeholder="Post, Comment"
                />
              </Input.Root>

              <Button.Root
                :aria-label="`Remove rule ${ruleIndex + 1} from ${role.name || 'role'}`"
                class="text-on-surface-variant hover:text-error p-1"
                title="Remove rule"
                @click="removeRule(roleIndex, ruleIndex)"
              >
                <Button.Icon>
                  <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiClose" fill="currentColor" /></svg>
                </Button.Icon>
              </Button.Root>
            </div>
          </div>

          <Button.Root
            class="mt-3 text-sm text-primary hover:opacity-80 inline-flex items-center gap-1"
            @click="addRule(roleIndex)"
          >
            <Button.Icon>
              <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiPlus" fill="currentColor" /></svg>
            </Button.Icon>

            <Button.Content>Add rule</Button.Content>
          </Button.Root>

          <p class="mt-2 text-xs text-on-surface-variant">
            Comma-separated. Use <code class="text-xs px-1 py-0.5 rounded bg-surface-variant">*</code> as a wildcard.
          </p>
        </div>
      </div>

      <Button.Root
        class="text-sm text-primary hover:opacity-80 inline-flex items-center gap-1"
        @click="addRole"
      >
        <Button.Icon>
          <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiPlus" fill="currentColor" /></svg>
        </Button.Icon>

        <Button.Content>Add role</Button.Content>
      </Button.Root>

      <div class="border border-divider rounded-lg p-4 bg-surface-variant/50">
        <div class="text-xs uppercase tracking-wide text-on-surface-variant mb-2">Conditional rules</div>

        <p class="text-sm text-on-surface-variant">
          Conditional rules (function-based ABAC) are code-only — pass
          <code class="text-xs px-1.5 py-0.5 rounded bg-surface">condition</code>
          in the rule tuple when calling
          <code class="text-xs px-1.5 py-0.5 rounded bg-surface">createPermissionsPlugin()</code>.
        </p>
      </div>
    </div>
  </PluginConfigShell>
</template>
