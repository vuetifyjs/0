<script setup lang="ts">
  import { mdiCheck, mdiClose } from '@mdi/js'

  // Framework
  import { Button } from '@vuetify/v0'

  import { defaultConfig } from '@/plugins/permissions/defaults'

  // Stores
  import { useBuilderStore } from '@/stores/builder'

  // Utilities
  import { shallowRef, toRef, watch } from 'vue'

  // Types
  import type { PermissionsConfig } from '@/plugins/permissions/defaults'

  const ACTIONS = [
    { label: 'Read posts', action: 'read', subject: 'post' },
    { label: 'Edit post', action: 'update', subject: 'post' },
    { label: 'Delete user', action: 'delete', subject: 'user' },
    { label: 'Invite member', action: 'create', subject: 'member' },
  ]

  const store = useBuilderStore()

  const config = toRef(() => {
    if (store.draft?.id === 'usePermissions') return store.draft.config as PermissionsConfig

    return (store.pluginConfig.usePermissions as PermissionsConfig | undefined) ?? defaultConfig
  })

  const roles = toRef(() => Object.keys(config.value.permissions ?? {}).filter(Boolean))

  const picked = shallowRef(roles.value[0] ?? '')

  watch(roles, list => {
    if (list.includes(picked.value)) return

    picked.value = list[0] ?? ''
  })

  function matches (tokens: string[], value: string) {
    return tokens.includes('*') || tokens.includes(value)
  }

  const grid = toRef(() => {
    const rules = config.value.permissions?.[picked.value] ?? []

    return ACTIONS.map(entry => ({
      ...entry,
      allowed: rules.some(([actions, subjects]) => matches(actions, entry.action) && matches(subjects, entry.subject)),
    }))
  })

  const rules = toRef(() => config.value.permissions?.[picked.value] ?? [])

  function onRole (role: string) {
    picked.value = role
  }
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-wrap gap-2">
      <Button.Root
        v-for="role in roles"
        :key="role"
        class="px-3 py-1 rounded-full border text-xs font-mono transition-colors"
        :class="role === picked
          ? 'bg-primary text-on-primary border-primary'
          : 'border-divider text-on-surface-variant hover:bg-surface-variant'"
        @click="onRole(role)"
      >
        <Button.Content>{{ role }}</Button.Content>
      </Button.Root>

      <p v-if="roles.length === 0" class="text-xs italic text-on-surface-variant">
        No roles defined yet.
      </p>
    </div>

    <MiniFrame :title="picked ? `signed in as ${picked}` : 'permissions'">
      <div class="space-y-2">
        <div
          v-for="entry in grid"
          :key="entry.label"
          class="flex items-center justify-between gap-3 rounded-lg border px-3 py-2 transition-colors"
          :class="entry.allowed ? 'border-divider bg-surface' : 'border-divider/60 bg-surface-variant/30'"
        >
          <div class="min-w-0">
            <p class="text-xs truncate" :class="entry.allowed ? 'text-on-surface' : 'text-on-surface-variant/60'">
              {{ entry.label }}
            </p>

            <p class="font-mono text-[10px] text-on-surface-variant truncate">
              {{ entry.action }} · {{ entry.subject }}
            </p>
          </div>

          <span
            class="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium"
            :class="entry.allowed ? 'bg-primary text-on-primary' : 'border border-divider text-on-surface-variant/60'"
          >
            <Icon :path="entry.allowed ? mdiCheck : mdiClose" :size="12" />
            {{ entry.allowed ? 'allowed' : 'blocked' }}
          </span>
        </div>
      </div>
    </MiniFrame>

    <div v-if="rules.length > 0" class="rounded-lg border border-divider bg-surface px-3 py-2">
      <p class="text-[10px] uppercase tracking-wide text-on-surface-variant mb-1.5">Rules for {{ picked }}</p>

      <p
        v-for="(rule, index) in rules"
        :key="index"
        class="font-mono text-[10px] text-on-surface truncate"
      >
        [{{ rule[0].join(', ') }}] on [{{ rule[1].join(', ') }}]
      </p>
    </div>
  </div>
</template>
