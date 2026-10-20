<script setup lang="ts">
  import { BuFile } from '@paper/bulma'
</script>

<template>
  <BuFile filename name="resume">
    <BuFile.Cta>
      <BuFile.Icon>
        <i class="fas fa-upload" />
      </BuFile.Icon>

      <span class="file-label">Choose a file…</span>
    </BuFile.Cta>

    <BuFile.Name />
  </BuFile>
</template>
