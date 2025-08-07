<script lang="ts" setup>
  // Composables
  import { useIconContext } from '@/plugins/icons'

  // Utilities
  import { toRef } from 'vue'

  export interface AppIconProps {
    icon: string
    size?: string | number
  }

  const {
    size = 18,
    ...props
  } = defineProps<AppIconProps>()

  const icons = useIconContext()

  const icon = toRef(() => icons.resolve(props.icon))
</script>

<template>
  <i class="inline-flex align-center justify-center">
    <svg
      class="inline-block align-middle"
      fill="none"
      :height="size"
      viewBox="0 0 16 16"
      :width="size"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        :d="icon"
        fill="currentColor"
        stroke="none"
        stroke-width="0"
      />
    </svg>
  </i>
</template>
