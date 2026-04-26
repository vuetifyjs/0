<script lang="ts">
  export interface EmUploadItemProps {
    name?: string
    size?: number
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmUploadItem' })

  const { name, size } = defineProps<EmUploadItemProps>()
</script>

<template>
  <li class="emerald-upload__item">
    <slot :name :size>
      <span>{{ name }}</span>
      <span v-if="size != null" class="emerald-upload__item-size">{{ size }} B</span>
    </slot>
  </li>
</template>

<style>
.emerald-upload__item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 4px;
  background: rgb(var(--emerald-neutral-channels, 26 28 30) / 0.04);
}

.emerald-upload__item-size {
  margin-left: auto;
  color: rgb(var(--emerald-neutral-channels, 26 28 30) / 0.6);
  font-size: 12px;
}
</style>
