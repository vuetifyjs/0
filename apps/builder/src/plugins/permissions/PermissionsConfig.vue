<script setup lang="ts">
  import { mdiClose, mdiPlus } from '@mdi/js'

  import { defaultConfig } from './defaults'

  // Stores
  import { useBuilderStore } from '@/stores/builder'

  // Utilities
  import { reactive } from 'vue'

  // Types
  import type { PermissionRule, PermissionsConfig } from './defaults'

  interface RoleRow {
    name: string
    rules: Array<{ actions: string, subjects: string }>
  }

  const store = useBuilderStore()

  const stored = store.pluginConfig.usePermissions as PermissionsConfig | undefined
  const initial = structuredClone(stored ?? defaultConfig)

  const state = reactive({
    roles: Object.entries(initial.roles).map<RoleRow>(([name, rules]) => ({
      name,
      rules: rules.map(rule => ({
        actions: rule.actions.join(', '),
        subjects: rule.subjects.join(', '),
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

  function onSave () {
    const roles: Record<string, PermissionRule[]> = {}

    for (const row of state.roles) {
      const name = row.name.trim()
      if (!name) continue

      const rules = row.rules
        .map(rule => ({
          actions: parseList(rule.actions),
          subjects: parseList(rule.subjects),
        }))
        .filter(rule => rule.actions.length > 0 && rule.subjects.length > 0)

      roles[name] = rules
    }

    const config: PermissionsConfig = { roles }
    store.savePluginConfig('usePermissions', config)
  }
</script>

<template>
  <PluginConfigShell plugin-id="usePermissions" @save="onSave">
    <template #description>
      <p class="text-on-surface-variant mb-8">
        Define role-based access with flat lists of <code class="text-xs px-1.5 py-0.5 rounded bg-surface-variant">[actions, subjects]</code>
        tuples per role. No role inheritance — every role is independent.
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

              <input
                v-model="role.name"
                class="mt-1 w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm font-mono"
                placeholder="admin"
              >
            </label>

            <button
              class="self-end text-on-surface-variant hover:text-error p-2"
              :title="`Remove ${role.name || 'role'}`"
              type="button"
              @click="removeRole(roleIndex)"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiClose" fill="currentColor" /></svg>
            </button>
          </div>

          <div class="text-xs uppercase tracking-wide text-on-surface-variant mb-2">Rules</div>

          <div class="space-y-2">
            <div
              v-for="(rule, ruleIndex) in role.rules"
              :key="ruleIndex"
              class="grid grid-cols-[1fr_1fr_auto] gap-2 items-center"
            >
              <input
                v-model="rule.actions"
                class="px-3 py-1.5 rounded-lg border border-divider bg-surface text-on-surface text-sm font-mono"
                placeholder="read, write"
              >

              <input
                v-model="rule.subjects"
                class="px-3 py-1.5 rounded-lg border border-divider bg-surface text-on-surface text-sm font-mono"
                placeholder="Post, Comment"
              >

              <button
                class="text-on-surface-variant hover:text-error p-1"
                title="Remove rule"
                type="button"
                @click="removeRule(roleIndex, ruleIndex)"
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiClose" fill="currentColor" /></svg>
              </button>
            </div>
          </div>

          <button
            class="mt-3 text-sm text-primary hover:opacity-80 inline-flex items-center gap-1"
            type="button"
            @click="addRule(roleIndex)"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiPlus" fill="currentColor" /></svg>
            Add rule
          </button>

          <p class="mt-2 text-xs text-on-surface-variant">
            Comma-separated. Use <code class="text-xs px-1 py-0.5 rounded bg-surface-variant">*</code> as a wildcard.
          </p>
        </div>
      </div>

      <button
        class="text-sm text-primary hover:opacity-80 inline-flex items-center gap-1"
        type="button"
        @click="addRole"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiPlus" fill="currentColor" /></svg>
        Add role
      </button>

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
