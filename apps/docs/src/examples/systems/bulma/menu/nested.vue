<script setup lang="ts">
  import { BuMenu } from '@paper/bulma'

  import { shallowRef } from 'vue'

  const active = shallowRef('Manage Your Team')

  const items = [
    {
      label: 'Administration',
      items: [
        { label: 'Team Settings' },
        {
          label: 'Manage Your Team',
          children: [
            { label: 'Members' },
            { label: 'Plugins' },
            { label: 'Add a member' },
          ],
        },
        { label: 'Invitations' },
        { label: 'Authentication' },
      ],
    },
  ]
</script>

<template>
  <BuMenu v-model="active" :items />
</template>
