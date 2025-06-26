<template>
  <div>
    <Atom v-slot="slotProps" :props="{ value: 'Atom' }">
      {{ slotProps.value }}
    </Atom>
    <br>
    <Group.Root v-slot="{ model, reset, select }">
      <Group.Item v-slot="{ isActive, toggle, index }">
        <button @click="toggle">
          {{ isActive ? 'Active' : 'Inactive' }} {{ index }}
        </button>
      </Group.Item>

      <br>

      <Group.Item v-slot="{ isActive, toggle, index }" disabled>
        <button @click="toggle">
          {{ isActive ? 'Active' : 'Inactive' }} {{ index }}
        </button>
      </Group.Item>

      <br>

      <Group.Item v-if="yes" id="1" v-slot="{ isActive, index }">
        <button @click="select('2')">
          {{ isActive ? 'Active' : 'Inactive' }} {{ index }}
        </button>
      </Group.Item>
      <br>

      <Group.Item id="2" v-slot="{ isActive, toggle, index }" value="foobar">
        <button @click="toggle">
          {{ isActive ? 'Active' : 'Inactive' }} {{ index }}
        </button>
      </Group.Item>

      <br>
      <br>

      <button @click="reset">
        Reset
      </button>

      <button @click="yes = !yes">
        {{ yes ? 'Hide' : 'Show' }} second item
      </button>

      <pre>{{ model || 'No model' }}</pre>
    </Group.Root>
  </div>
</template>

<script lang="ts" setup>
  import { Atom, Group } from './lib'
  const yes = ref(true)
</script>
