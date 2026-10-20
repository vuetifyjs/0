<script setup lang="ts">
  import { BuMenu } from '@paper/bulma'

  import { shallowRef } from 'vue'

  const active = shallowRef('Dashboard')
</script>

<template>
  <BuMenu v-model="active">
    <BuMenu.Label>General</BuMenu.Label>

    <BuMenu.List>
      <BuMenu.Item>
        <BuMenu.Link value="Dashboard">Dashboard</BuMenu.Link>
      </BuMenu.Item>

      <BuMenu.Item>
        <BuMenu.Link value="Customers">Customers</BuMenu.Link>
      </BuMenu.Item>
    </BuMenu.List>

    <BuMenu.Label>Transactions</BuMenu.Label>

    <BuMenu.List>
      <BuMenu.Item>
        <BuMenu.Link value="Payments">Payments</BuMenu.Link>
      </BuMenu.Item>

      <BuMenu.Item>
        <BuMenu.Link value="Transfers">Transfers</BuMenu.Link>
      </BuMenu.Item>

      <BuMenu.Item>
        <BuMenu.Link value="Balance">Balance</BuMenu.Link>
      </BuMenu.Item>
    </BuMenu.List>
  </BuMenu>
</template>
