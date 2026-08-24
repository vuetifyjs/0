<script setup lang="ts">
  import { BuFile, BuFileCta, BuFileIcon, BuFileName } from '@paper/bulma'
</script>

<template>
  <BuFile filename name="resume">
    <BuFileCta>
      <BuFileIcon>
        <i class="fas fa-upload" />
      </BuFileIcon>

      <span class="file-label">Choose a file…</span>
    </BuFileCta>

    <BuFileName />
  </BuFile>
</template>
