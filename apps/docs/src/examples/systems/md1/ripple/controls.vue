<script setup lang="ts">
  import { Md1Button, Md1Checkbox, Md1IconToggle } from '@paper/md1'
  import { shallowRef } from 'vue'

  const starred = shallowRef(false)
  const remember = shallowRef(true)
</script>

<template>
  <div class="md1-docs-row">
    <Md1Button variant="raised">Save</Md1Button>

    <Md1Button>Cancel</Md1Button>

    <Md1IconToggle v-model="starred" aria-label="Star" icon="star-border" icon-on="star" />

    <Md1Checkbox v-model="remember" label="Remember me" />
  </div>
</template>
