<template>
  <div class="pa-10" style="height: 10000vh;">
    <!-- <button popovertarget="mypopover">Toggle the popover</button>
    <div id="mypopover" class="bg-grey-500" popover>Popover content</div> -->

    <pre>{{ yes }}</pre>
    <Popover.Root v-model="yes">
      <Popover.Anchor class="pa-2 border rounded bg-gray-200">
        Toggle the popover
      </Popover.Anchor>

      <Popover.Content class="pa-4 border bg-grey-100">
        Popover content
      </Popover.Content>
    </Popover.Root>
  </div>
</template>

<script lang="ts" setup>
  import { Atom, Group, Popover } from './lib'
  const yes = ref(false)
</script>

<style>

</style>
