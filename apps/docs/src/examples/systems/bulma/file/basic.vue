<script setup lang="ts">
  import { BuFile, BuFileCta, BuFileIcon } from '@paper/bulma'
</script>

<template>
  <BuFile name="resume">
    <BuFileCta>
      <BuFileIcon>
        <i class="fas fa-upload" />
      </BuFileIcon>

      <span class="file-label">Choose a file…</span>
    </BuFileCta>
  </BuFile>
</template>
