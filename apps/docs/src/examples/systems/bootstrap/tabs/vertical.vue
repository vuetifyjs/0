<script setup lang="ts">
  import { BTabs } from '@paper/bootstrap'

  import { shallowRef } from 'vue'

  const tab = shallowRef('home')
</script>

<template>
  <BTabs
    v-model="tab"
    variant="pills"
    vertical
  >
    <div class="d-flex align-items-start gap-4">
      <BTabs.List>
        <BTabs.Item value="home">Home</BTabs.Item>
        <BTabs.Item value="profile">Profile</BTabs.Item>
      </BTabs.List>

      <BTabs.Content>
        <BTabs.Panel value="home">
          <p class="mb-0">This is some placeholder content the <strong>Home tab's</strong> associated content.</p>
        </BTabs.Panel>

        <BTabs.Panel value="profile">
          <p class="mb-0">This is some placeholder content the <strong>Profile tab's</strong> associated content.</p>
        </BTabs.Panel>
      </BTabs.Content>
    </div>
  </BTabs>
</template>
