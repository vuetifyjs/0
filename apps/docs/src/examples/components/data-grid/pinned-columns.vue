<script setup lang="ts">
  import ProjectGrid from './ProjectGrid.vue'
  import { useProjects } from './useProjects'

  const { projects } = useProjects()
</script>

<template>
  <div class="flex flex-col gap-2">
    <p class="text-sm text-on-surface-variant">
      Name is pinned left, status right. Press L / R / · on a header to cycle pin. Scroll sideways.
    </p>

    <ProjectGrid :projects />
  </div>
</template>
