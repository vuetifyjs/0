<script setup lang="ts">
  // Utilities
  import { ref } from 'vue'

  import { Kanban } from '../Kanban/index'

  const todo = ref(['Write spec', 'Review PR'])
  const done = ref(['Ship docs'])
</script>

<template>
  <Kanban.Root label="Sprint">
    <Kanban.Column v-slot="{ items }" v-model="todo" label="Todo">
      <Kanban.List>
        <Kanban.Item v-for="item in items" :key="item" :value="item">
          {{ item }}
        </Kanban.Item>
      </Kanban.List>
    </Kanban.Column>

    <Kanban.Column v-slot="{ items }" v-model="done" label="Done">
      <Kanban.List>
        <Kanban.Item v-for="item in items" :key="item" :value="item">
          {{ item }}
        </Kanban.Item>
      </Kanban.List>
    </Kanban.Column>

    <Kanban.Instructions />
    <Kanban.LiveRegion />
  </Kanban.Root>
</template>
