<script setup lang="ts">
  // Types
  import type { OnColumn } from '@paper/onyx'

  defineOptions({ name: 'OnyxTables' })

  interface TableUser {
    name: string
    role: string
    status: string
    joined: string
  }

  const columns: OnColumn<TableUser>[] = [
    { key: 'name', title: 'Name', sortable: true },
    { key: 'role', title: 'Role', sortable: true },
    { key: 'status', title: 'Status', sortable: true },
    { key: 'joined', title: 'Joined', sortable: true },
  ]

  const roles = ['Engineer', 'Designer', 'Manager', 'Analyst', 'Recruiter']
  const statuses = ['Active', 'Invited', 'Suspended']

  const items: TableUser[] = Array.from({ length: 25 }, (_, i) => {
    const n = i + 1
    return {
      name: `User ${String(n).padStart(2, '0')}`,
      role: roles[n % roles.length]!,
      status: statuses[n % statuses.length]!,
      joined: `2026-${String((n % 12) + 1).padStart(2, '0')}-${String((n % 28) + 1).padStart(2, '0')}`,
    }
  })
</script>

<template>
  <p :style="{ color: 'var(--onyx-muted-foreground, #71717a)', maxWidth: '640px' }">
    <code>OnTable</code> renders every cell as plain text — it doesn't expose a per-cell
    slot, so <code>status</code> below is a string, not an <code>OnBadge</code>. Click a
    sortable column header to sort; the footer controls page size and paging.
  </p>

  <OnAlert class="mt-6" variant="info">
    <template #icon>i</template>
    <OnAlertTitle>No dense mode</OnAlertTitle>

    <OnAlertDescription>
      <code>OnTable</code> has one row density — there's no <code>dense</code> prop to
      tighten cell padding for data-heavy screens. Documented gap, not a missing example.
    </OnAlertDescription>
  </OnAlert>

  <div class="onyx-exhibit mt-6">
    <p class="onyx-hallmark onyx-exhibit__caption">Sortable · paginated</p>
    <OnTable :columns :items :page-sizes="[5, 10, 25]" />
  </div>
</template>
