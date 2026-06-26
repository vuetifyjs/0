<script setup lang="ts">
  import DeleteProjectDialog from './DeleteProjectDialog.vue'
  import { useDeleteProject } from './useDeleteProject'

  const { projects, remove } = useDeleteProject()
</script>

<template>
  <div class="max-w-md mx-auto">
    <ul v-if="projects.length > 0" class="divide-y divide-divider rounded-xl border border-divider bg-surface">
      <li
        v-for="project in projects"
        :key="project.id"
        class="flex items-center justify-between gap-4 px-4 py-3"
      >
        <div class="min-w-0">
          <p class="text-sm font-medium text-on-surface truncate">{{ project.name }}</p>
          <p class="text-xs text-on-surface-variant">{{ project.environment }}</p>
        </div>

        <DeleteProjectDialog :project :remove />
      </li>
    </ul>

    <p v-else class="rounded-xl border border-dashed border-divider p-6 text-center text-sm text-on-surface-variant">
      All projects deleted.
    </p>
  </div>
</template>
