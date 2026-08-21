<script setup lang="ts">
  import { BuMenu } from '@paper/bulma'

  import { shallowRef } from 'vue'

  const active = shallowRef('Dashboard')

  const items = [
    {
      label: 'General',
      items: [
        { label: 'Dashboard' },
        { label: 'Customers' },
      ],
    },
    {
      label: 'Transactions',
      items: [
        { label: 'Payments' },
        { label: 'Transfers' },
        { label: 'Balance' },
      ],
    },
  ]
</script>

<template>
  <BuMenu v-model="active" :items />
</template>
