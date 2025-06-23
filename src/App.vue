<template>
  <div>
    <V0GroupRoot v-slot="{ model }">
      <V0GroupItem v-slot="{ isActive, toggle }">
        <button @click="toggle">
          {{ isActive ? 'Active' : 'Inactive' }}
        </button>
      </V0GroupItem>

      <pre>{{ model || 'No model' }}</pre>
    </V0GroupRoot>
  </div>
</template>

<script lang="ts" setup>
  // const model = ref()
</script>
