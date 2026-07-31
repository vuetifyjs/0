<script setup lang="ts">
  import { usePermissions } from '@vuetify/v0'
  import { toRef } from 'vue'
  import { NAMESPACE, sections } from './context'
  import type { Role } from './context'

  const { role } = defineProps<{ role: Role }>()

  const permissions = usePermissions(NAMESPACE)

  const visible = toRef(() =>
    sections.filter(section => permissions.can(role, 'view', section.id)),
  )
</script>

<template>
  <nav class="rounded-xl border border-divider bg-surface p-2">
    <p class="px-2 py-1.5 text-[10px] uppercase tracking-wider text-on-surface-variant/60">
      Navigation
    </p>

    <ul class="space-y-1">
      <li v-for="section in visible" :key="section.id">
        <div class="rounded-lg px-3 py-2 hover:bg-surface-variant/40">
          <p class="text-sm font-medium text-on-surface">{{ section.label }}</p>
          <p class="text-xs text-on-surface-variant">{{ section.description }}</p>
        </div>
      </li>
    </ul>
  </nav>
</template>
