<template>
  <VAvatarRoot
    :class="avatarClasses"
    :style="avatarStyles"
  >
    <VAvatarImage
      v-if="image || src"
      :src="image || src"
    />
    <VAvatarFallback
      v-if="hasSlotContent || text || icon"
      :class="fallbackClasses"
    >
      <Icon
        v-if="icon && !hasSlotContent && !text"
        :height="iconSize"
        :icon="icon"
        :width="iconSize"
      />
      <span v-else-if="text && !hasSlotContent">{{ text }}</span>
      <slot v-else />
    </VAvatarFallback>
  </VAvatarRoot>
</template>

<script setup lang="ts">
  import { Icon } from '@iconify/vue'
  import { computed, useSlots } from 'vue'
  import { VAvatarFallback, VAvatarImage, VAvatarRoot } from 'vuetify0'

  export interface VAvatarProps {
    // Core props
    image?: string
    src?: string
    text?: string
    icon?: string

    // Size variants
    size?: 'x-small' | 'small' | 'default' | 'large' | 'x-large' | string | number

    // Shape variants
    rounded?: boolean | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'none'
    tile?: boolean

    // Color variants
    color?: string

    // Styling variants
    variant?: 'flat' | 'elevated' | 'outlined' | 'text' | 'tonal' | 'plain'

    // Border
    border?: boolean | string | number

    // Density
    density?: 'default' | 'comfortable' | 'compact'
  }

  const props = withDefaults(defineProps<VAvatarProps>(), {
    size: 'default',
    rounded: true,
    tile: false,
    variant: 'flat',
    border: false,
    density: 'default',
    start: false,
    end: false,
  })

  const slots = useSlots()

  const hasSlotContent = computed(() => {
    return slots.default && slots.default().length > 0
  })

  // Size calculations
  const sizeClasses = computed(() => {
    if (typeof props.size === 'number') {
      return ''
    }

    const sizeMap = {
      'x-small': 'w-6 h-6',
      'small': 'w-8 h-8',
      'default': 'w-10 h-10',
      'large': 'w-12 h-12',
      'x-large': 'w-16 h-16',
    }

    return sizeMap[props.size as keyof typeof sizeMap] || 'w-10 h-10'
  })

  const avatarStyles = computed(() => {
    const styles: Record<string, string> = {}

    if (typeof props.size === 'number') {
      styles.width = `${props.size}px`
      styles.height = `${props.size}px`
    } else if (typeof props.size === 'string' && !['x-small', 'small', 'default', 'large', 'x-large'].includes(props.size)) {
      styles.width = props.size
      styles.height = props.size
    }

    return styles
  })

  // Rounded calculations
  const roundedClasses = computed(() => {
    if (props.tile) return ''

    if (typeof props.rounded === 'boolean') {
      return props.rounded ? 'rounded-full' : ''
    }

    const roundedMap = {
      none: '',
      xs: 'rounded-sm',
      sm: 'rounded',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      full: 'rounded-full',
    }

    return roundedMap[props.rounded as keyof typeof roundedMap] || 'rounded-full'
  })

  // Color and variant calculations
  const colorClasses = computed(() => {
    if (!props.color) {
      return props.variant === 'flat' ? 'bg-gray-100' : 'bg-transparent'
    }

    // Handle utility colors
    const utilityColors = {
      primary: 'bg-primary text-white',
      secondary: 'bg-secondary text-white',
      success: 'bg-success text-white',
      warning: 'bg-warning text-white',
      error: 'bg-error text-white',
      info: 'bg-info text-white',
    }

    if (utilityColors[props.color as keyof typeof utilityColors]) {
      return utilityColors[props.color as keyof typeof utilityColors]
    }

    // Handle CSS colors
    return ''
  })

  const variantClasses = computed(() => {
    const variantMap = {
      flat: 'bg-opacity-100',
      elevated: 'shadow-md',
      outlined: 'border border-gray-300 bg-transparent',
      text: 'bg-transparent',
      tonal: 'bg-opacity-20',
      plain: 'bg-transparent opacity-60',
    }

    return variantMap[props.variant] || ''
  })

  // Border calculations
  const borderClasses = computed(() => {
    if (!props.border) return ''

    if (typeof props.border === 'boolean') {
      return 'border border-gray-300'
    }

    if (typeof props.border === 'string') {
      const borderMap = {
        sm: 'border',
        md: 'border-2',
        lg: 'border-4',
        xl: 'border-8',
      }
      return borderMap[props.border as keyof typeof borderMap] || 'border'
    }

    return `border-${props.border}`
  })

  // Density calculations
  const densityClasses = computed(() => {
    // Density affects padding/spacing, not size
    const densityMap = {
      default: '',
      comfortable: 'p-1',
      compact: 'p-0.5',
    }

    return densityMap[props.density] || ''
  })

  // Icon size based on avatar size
  const iconSize = computed(() => {
    if (typeof props.size === 'number') {
      return Math.round(props.size * 0.5)
    }

    const iconSizeMap = {
      'x-small': 12,
      'small': 16,
      'default': 20,
      'large': 24,
      'x-large': 32,
    }

    return iconSizeMap[props.size as keyof typeof iconSizeMap] || 20
  })

  // Combined avatar classes
  const avatarClasses = computed(() => {
    return [
      'inline-flex items-center justify-center overflow-hidden',
      sizeClasses.value,
      roundedClasses.value,
      colorClasses.value,
      variantClasses.value,
      borderClasses.value,
      densityClasses.value,
    ].filter(Boolean).join(' ')
  })

  // Fallback text classes
  const fallbackClasses = computed(() => {
    const textSizeMap = {
      'x-small': 'text-xs',
      'small': 'text-sm',
      'default': 'text-sm',
      'large': 'text-base',
      'x-large': 'text-lg',
    }

    const textSize = typeof props.size === 'string' && textSizeMap[props.size as keyof typeof textSizeMap]
      ? textSizeMap[props.size as keyof typeof textSizeMap]
      : 'text-sm'

    return `font-medium ${textSize}`
  })
</script>
