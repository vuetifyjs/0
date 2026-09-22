<script setup lang="ts">
  // Utilities
  import { ref } from 'vue'

  import { Tabs } from '../Tabs/index'

  const selected = ref('profile')
</script>

<template>
  <Tabs.Root v-model="selected">
    <Tabs.List label="Account settings">
      <Tabs.Item value="profile">Profile</Tabs.Item>
      <Tabs.Item value="password">Password</Tabs.Item>
      <Tabs.Item disabled value="billing">Billing</Tabs.Item>
    </Tabs.List>

    <Tabs.Panel value="profile">Profile content</Tabs.Panel>
    <Tabs.Panel value="password">Password content</Tabs.Panel>
    <Tabs.Panel value="billing">Billing content</Tabs.Panel>
  </Tabs.Root>
</template>
