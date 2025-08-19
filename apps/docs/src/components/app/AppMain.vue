<script lang="ts" setup>
  import { useBreakpoints } from '@vuetify/v0'
  import { ref, computed } from 'vue'

  const breakpoints = useBreakpoints()

  const current = ref()
  const frontmatter = computed(() => current.value?.frontmatter)

  defineExpose({
    frontmatter,
  })
</script>

<template>
  <div
    class="pa-4 mt-[72px] transition-margin duration-200 ease-in-out"
    :class="breakpoints.isMobile ? 'ml-0' : 'ml-[220px]'"
  >
    <router-view v-slot="{ Component }">
      <component :is="Component" ref="current" />
    </router-view>
  </div>
</template>
