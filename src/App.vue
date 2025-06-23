<template>
  <div>
    <V0GroupRoot v-slot="{ model, reset }" multiple>
      <V0GroupItem v-slot="{ isActive, toggle, index }">
        <button @click="toggle">
          {{ isActive ? 'Active' : 'Inactive' }} {{ index }}
        </button>
      </V0GroupItem>

      <V0GroupItem v-slot="{ isActive, toggle, index }">
        <button @click="toggle">
          {{ isActive ? 'Active' : 'Inactive' }} {{ index }}
        </button>
      </V0GroupItem>

      <!-- <br>

      <V0GroupItem v-if="yes" id="1" v-slot="{ isActive, toggle, index }" :value="null">
        <button @click="toggle">
          {{ isActive ? 'Active' : 'Inactive' }} {{ index }}
        </button>
      </V0GroupItem>
      <br>

      <V0GroupItem id="2" v-slot="{ isActive, toggle, index }" value="2">
        <button @click="toggle">
          {{ isActive ? 'Active' : 'Inactive' }} {{ index }}
        </button>
      </V0GroupItem>
      <br>
      <br>

      <button @click="reset">
        Reset
      </button>

      <button @click="yes = !yes">
        {{ yes ? 'Hide' : 'Show' }} second item
      </button> -->

      <pre>{{ model || 'No model' }}</pre>
    </V0GroupRoot>
  </div>
</template>

<script lang="ts" setup>
  // const model = ref()
  const yes = ref(true)
</script>
