<script setup lang="ts">
  import { BAvatar } from '@paper/bootstrap'
</script>

<template>
  <div class="d-flex align-items-center gap-3">
    <BAvatar alt="mdo" src="https://github.com/mdo.png" />
    <BAvatar>AB</BAvatar>
    <BAvatar class="theme-primary" subtle>CD</BAvatar>
    <BAvatar alt="mdo" src="https://github.com/mdo.png" status="online" />
    <BAvatar alt="mdo" size="sm" src="https://github.com/mdo.png" />
  </div>
</template>
