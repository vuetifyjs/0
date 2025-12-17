<script lang="ts" setup>
  // Composables
  import { useIconContext } from '@/plugins/icons'

  // Utilities
  import { toArray } from '@vuetify/v0'
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

  const icon = toRef(() => {
    const array: [string, number][] = []

    for (const i of toArray(icons.resolve(props.icon))) {
      const [path, opacity = 1] = toArray(i)

      array.push([path as string, opacity as number])
    }

    return array
  })
</script>

<template>
  <i class="inline-flex align-center justify-center">
    <svg
      aria-hidden="true"
      class="inline-block align-middle"
      fill="none"
      :height="size"
      viewBox="0 0 24 24"
      :width="size"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        v-for="([d, opacity], i) in icon"
        :key="i"
        :d="d"
        fill="currentColor"
        :opacity="opacity"
        stroke="none"
        stroke-width="0"
      />
    </svg>
  </i>
</template>
