<script setup lang="ts">
  import {
    BuMenu,
    BuMenuItem,
    BuMenuLabel,
    BuMenuLink,
    BuMenuList,
  } from '@paper/bulma'

  import { shallowRef } from 'vue'

  const active = shallowRef('Dashboard')
</script>

<template>
  <BuMenu v-model="active">
    <BuMenuLabel>General</BuMenuLabel>

    <BuMenuList>
      <BuMenuItem>
        <BuMenuLink value="Dashboard">Dashboard</BuMenuLink>
      </BuMenuItem>

      <BuMenuItem>
        <BuMenuLink value="Customers">Customers</BuMenuLink>
      </BuMenuItem>
    </BuMenuList>

    <BuMenuLabel>Transactions</BuMenuLabel>

    <BuMenuList>
      <BuMenuItem>
        <BuMenuLink value="Payments">Payments</BuMenuLink>
      </BuMenuItem>

      <BuMenuItem>
        <BuMenuLink value="Transfers">Transfers</BuMenuLink>
      </BuMenuItem>

      <BuMenuItem>
        <BuMenuLink value="Balance">Balance</BuMenuLink>
      </BuMenuItem>
    </BuMenuList>
  </BuMenu>
</template>
