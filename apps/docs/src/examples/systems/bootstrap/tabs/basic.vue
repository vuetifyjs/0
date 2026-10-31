<script setup lang="ts">
  import { BTabs } from '@paper/bootstrap'

  import { shallowRef } from 'vue'

  const tab = shallowRef('home')
</script>

<template>
  <BTabs v-model="tab">
    <BTabs.List>
      <BTabs.Item value="home">Home</BTabs.Item>
      <BTabs.Item value="profile">Profile</BTabs.Item>
      <BTabs.Item value="contact">Contact</BTabs.Item>
      <BTabs.Item disabled value="disabled">Disabled</BTabs.Item>
    </BTabs.List>

    <BTabs.Content>
      <BTabs.Panel value="home">
        <p>This is some placeholder content the <strong>Home tab's</strong> associated content.</p>
      </BTabs.Panel>

      <BTabs.Panel value="profile">
        <p>This is some placeholder content the <strong>Profile tab's</strong> associated content.</p>
      </BTabs.Panel>

      <BTabs.Panel value="contact">
        <p>This is some placeholder content the <strong>Contact tab's</strong> associated content.</p>
      </BTabs.Panel>

      <BTabs.Panel value="disabled">
        <p>This is some placeholder content the <strong>Disabled tab's</strong> associated content.</p>
      </BTabs.Panel>
    </BTabs.Content>
  </BTabs>
</template>
