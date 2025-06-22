<template>
  <div>
    <V0GroupRoot>
      <V0GroupRoot v-model="model" namespace="group1">
        <V0GroupItem v-slot="{ toggle, isActive }">
          <button
            :style="{ color: isActive ? 'red' : undefined }"
            @click="toggle"
          >
            Click me
          </button>
        </V0GroupItem>
        <V0GroupItem v-slot="{ toggle, isActive }">
          <button
            :style="{ color: isActive ? 'red' : undefined }"
            @click="toggle"
          >
            Click me
          </button>
        </V0GroupItem>
        <V0GroupItem v-slot="{ toggle, isActive }" namespace="group1">
          <button
            :style="{ color: isActive ? 'red' : undefined }"
            @click="toggle"
          >
            Click me
          </button>
        </V0GroupItem>
      </V0GroupRoot>
    </V0GroupRoot>

    <pre>{{ model || 'No model' }}</pre>
  </div>
</template>

<script lang="ts" setup>
  const model = ref()
</script>
