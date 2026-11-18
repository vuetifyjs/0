<script setup lang="ts">
  import { BAvatar } from '@paper/bootstrap'
</script>

<template>
  <div class="d-flex flex-column gap-3">
    <div class="d-flex align-items-center gap-3">
      <BAvatar alt="mdo" size="xs" src="https://github.com/mdo.png" />
      <BAvatar alt="mdo" size="sm" src="https://github.com/mdo.png" />
      <BAvatar alt="mdo" src="https://github.com/mdo.png" />
      <BAvatar alt="mdo" size="lg" src="https://github.com/mdo.png" />
      <BAvatar alt="mdo" size="xl" src="https://github.com/mdo.png" />
    </div>

    <div class="d-flex align-items-center gap-3">
      <BAvatar alt="mdo" src="https://github.com/mdo.png" status="online" />
      <BAvatar alt="mdo" src="https://github.com/mdo.png" status="away" />
      <BAvatar alt="mdo" src="https://github.com/mdo.png" status="busy" />
      <BAvatar alt="mdo" src="https://github.com/mdo.png" status="offline" />
    </div>
  </div>
</template>
