<script setup lang="ts">
  import { createPermissionsContext, usePermissions } from '@vuetify/v0'
  import { shallowRef, toRef } from 'vue'

  const [, providePermissions] = createPermissionsContext({
    permissions: {
      admin: [
        [['read', 'write', 'delete'], ['user', 'post'], true],
      ],
      editor: [
        [['read', 'write'], 'post', true],
        ['read', 'user', true],
        ['delete', 'post', (ctx: Record<string, unknown>) => ctx.isOwner === true],
      ],
      viewer: [
        ['read', ['user', 'post'], true],
      ],
    },
  })

  providePermissions()

  const permissions = usePermissions()

  const role = shallowRef('editor')
  const roles = ['admin', 'editor', 'viewer']

  const actions = ['read', 'write', 'delete']
  const subjects = ['user', 'post']

  const grid = toRef(() =>
    subjects.map(subject => ({
      subject,
      checks: actions.map(action => ({
        action,
        allowed: permissions.can(role.value, action, subject),
        contextual: action === 'delete' && subject === 'post' && role.value === 'editor',
      })),
    })),
  )
</script>

<template>
  <div class="space-y-4">
    <div>
      <label class="block text-xs text-on-surface-variant mb-1.5">Active role</label>
      <div class="flex gap-1.5">
        <button
          v-for="r in roles"
          :key="r"
          class="px-3 py-1.5 text-sm rounded-lg border transition-all"
          :class="role === r
            ? 'border-primary bg-primary/10 text-primary font-medium'
            : 'border-divider text-on-surface-variant hover:border-primary/50'"
          @click="role = r"
        >
          {{ r }}
        </button>
      </div>
    </div>

    <div class="rounded-lg border border-divider overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-divider bg-surface-variant/30">
            <th class="text-left px-3 py-2 text-xs text-on-surface-variant font-medium">
              Subject
            </th>
            <th
              v-for="action in actions"
              :key="action"
              class="text-center px-3 py-2 text-xs text-on-surface-variant font-medium"
            >
              {{ action }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in grid"
            :key="row.subject"
            class="border-b border-divider last:border-0"
          >
            <td class="px-3 py-2 font-medium text-on-surface">
              {{ row.subject }}
            </td>
            <td
              v-for="check in row.checks"
              :key="check.action"
              class="text-center px-3 py-2"
            >
              <span
                class="inline-flex items-center justify-center size-6 rounded-full text-xs"
                :class="check.allowed
                  ? 'bg-success/10 text-success'
                  : 'bg-error/10 text-error'"
              >
                {{ check.allowed ? '&#10003;' : '&#10005;' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="rounded-lg border border-divider bg-surface-variant/30 p-3">
      <p class="text-[10px] uppercase tracking-wider text-on-surface-variant/60 mb-2">
        Context-aware check
      </p>
      <div class="text-xs space-y-1">
        <p class="text-on-surface-variant">
          editor + delete + post (owner):
          <span class="font-medium" :class="permissions.can('editor', 'delete', 'post', { isOwner: true }) ? 'text-success' : 'text-error'">
            {{ permissions.can('editor', 'delete', 'post', { isOwner: true }) }}
          </span>
        </p>
        <p class="text-on-surface-variant">
          editor + delete + post (not owner):
          <span class="font-medium" :class="permissions.can('editor', 'delete', 'post', { isOwner: false }) ? 'text-success' : 'text-error'">
            {{ permissions.can('editor', 'delete', 'post', { isOwner: false }) }}
          </span>
        </p>
      </div>
    </div>
  </div>
</template>
