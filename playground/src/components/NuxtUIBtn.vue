<template>
  <VButtonRoot
    :active="active"
    :class="buttonClasses"
    :disabled="disabled"
    :loading="loading"
    :state="state"
    @click="$emit('click', $event)"
    @update:state="$emit('update:state', $event)"
  >
    <VButtonLoading v-if="isLeading">
      <Icon
        :class="['nuxt-ui-btn__icon', 'nuxt-ui-btn__icon--leading', 'animate-spin']"
        :icon="loadingIcon"
      />
    </VButtonLoading>

    <VButtonContent v-if="icon && isLeading" :hide-on-loading="isLeading">
      <Icon
        :class="['nuxt-ui-btn__icon', 'nuxt-ui-btn__icon--leading']"
        :icon="icon"
      />
    </VButtonContent>

    <VButtonContent v-if="label ||hasSlotContent" :hide-on-loading="false">
      <span class="nuxt-ui-btn__text">
        <slot>{{ label }}</slot>
      </span>
    </VButtonContent>

    <VButtonContent v-if="icon && !isLeading" :hide-on-loading="!isLeading">
      <Icon
        :class="['nuxt-ui-btn__icon', 'nuxt-ui-btn__icon--trailing']"
        :icon="icon"
      />
    </VButtonContent>

    <VButtonLoading v-if="!isLeading">
      <Icon
        :class="['nuxt-ui-btn__icon', 'nuxt-ui-btn__icon--trailing', 'animate-spin']"
        :icon="loadingIcon"
      />
    </VButtonLoading>

  </VButtonRoot>
</template>

<script setup lang="ts">
  import { Icon } from '@iconify/vue'
  import { computed, useSlots } from 'vue'
  import { type ButtonState, VButtonContent, VButtonLoading, VButtonRoot } from 'vuetify0'

  export interface NuxtUIBtnProps {
    variant?: 'solid' | 'outline' | 'soft' | 'ghost' | 'link'
    color?: 'primary' | 'gray' | 'red' | 'orange' | 'amber' | 'yellow' | 'lime' | 'green' | 'emerald' | 'teal' | 'cyan' | 'sky' | 'blue' | 'indigo' | 'violet' | 'purple' | 'fuchsia' | 'pink' | 'rose'
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    icon?: string
    loadingIcon?: string
    label?: string
    disabled?: boolean
    loading?: boolean
    leading?: boolean
    trailing?: boolean
    square?: boolean
    block?: boolean
    state?: ButtonState
    active?: boolean
  }

  const props = withDefaults(defineProps<NuxtUIBtnProps>(), {
    variant: 'solid',
    color: 'primary',
    size: 'md',
    loadingIcon: 'lucide:loader-circle',
    disabled: false,
    loading: false,
    square: false,
    block: false,
    state: 'default',
    active: false,
  })

  defineEmits<{
    'click': [event: MouseEvent]
    'update:state': [state: ButtonState]
  }>()

  const slots = useSlots()

  const hasSlotContent = computed(() => {
    return (slots.default?.().length ?? 0) > 0
  })

  const buttonClasses = computed(() => {
    return [
      'nuxt-ui-btn',
      `nuxt-ui-btn--variant-${props.variant}`,
      `nuxt-ui-btn--color-${props.color}`,
      `nuxt-ui-btn--size-${props.size}`,
      {
        'nuxt-ui-btn--block': props.block,
        'nuxt-ui-btn--square': props.square,
        'nuxt-ui-btn--loading': props.loading,
        'nuxt-ui-btn--active': props.active,
        'nuxt-ui-btn--disabled': props.disabled,
        'nuxt-ui-btn--icon-only': props.icon && !props.label && !hasSlotContent.value,
      },
    ]
  })

  const isLeading = computed(() => {
    if (props.leading === undefined && props.trailing === undefined) {
      return true
    }
    return props.leading || !props.trailing
  })
</script>

<style>
.nuxt-ui-btn {
  --at-apply: relative inline-flex items-center justify-center border border-transparent cursor-pointer font-medium text-decoration-none transition-all ease-in-out duration-150 select-none whitespace-nowrap outline-none;
}

/* Sizes */
.nuxt-ui-btn--size-xs {
  --at-apply: px-3 py-1.5 text-xs leading-4 rounded-md gap-1;
}

.nuxt-ui-btn--size-sm {
  --at-apply: px-4 py-2 text-sm leading-5 rounded-md gap-1.5;
}

.nuxt-ui-btn--size-md {
  --at-apply: px-5 py-2.5 text-sm leading-5 rounded-lg gap-1.5;
}

.nuxt-ui-btn--size-lg {
  --at-apply: px-6 py-3 text-base leading-6 rounded-lg gap-2;
}

.nuxt-ui-btn--size-xl {
  --at-apply: px-7 py-3.5 text-base leading-6 rounded-lg gap-2;
}

/* Square variants */
.nuxt-ui-btn--square.nuxt-ui-btn--size-xs { --at-apply: p-1.5; }
.nuxt-ui-btn--square.nuxt-ui-btn--size-sm { --at-apply: p-2; }
.nuxt-ui-btn--square.nuxt-ui-btn--size-md { --at-apply: p-2.5; }
.nuxt-ui-btn--square.nuxt-ui-btn--size-lg { --at-apply: p-3; }
.nuxt-ui-btn--square.nuxt-ui-btn--size-xl { --at-apply: p-3.5; }

/* Icon styles */
.nuxt-ui-btn__icon {
  --at-apply: flex-shrink-0;
}

.nuxt-ui-btn--size-xs .nuxt-ui-btn__icon {
  --at-apply: h-4 w-4;
}
.nuxt-ui-btn--size-sm .nuxt-ui-btn__icon {
  --at-apply: h-5 w-5;
}
.nuxt-ui-btn--size-md .nuxt-ui-btn__icon {
  --at-apply: h-5 w-5;
}
.nuxt-ui-btn--size-lg .nuxt-ui-btn__icon {
  --at-apply: h-6 w-6;
}
.nuxt-ui-btn--size-xl .nuxt-ui-btn__icon {
  --at-apply: h-6 w-6;
}

.nuxt-ui-btn__loading-icon {
   --at-apply: flex-shrink-0;
}

.nuxt-ui-btn--size-xs .nuxt-ui-btn__loading-icon {
  --at-apply: h-4 w-4;
}
.nuxt-ui-btn--size-sm .nuxt-ui-btn__loading-icon {
  --at-apply: h-5 w-5;
}
.nuxt-ui-btn--size-md .nuxt-ui-btn__loading-icon {
  --at-apply: h-5 w-5;
}
.nuxt-ui-btn--size-lg .nuxt-ui-btn__loading-icon {
  --at-apply: h-6 w-6;
}
.nuxt-ui-btn--size-xl .nuxt-ui-btn__loading-icon {
  --at-apply: h-6 w-6;
}

/* Variants and Colors */
/* Solid */
.nuxt-ui-btn--variant-solid.nuxt-ui-btn--color-primary {
  --at-apply: bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-300;
}
.nuxt-ui-btn--variant-solid.nuxt-ui-btn--color-gray {
  --at-apply: bg-gray-500 text-white hover:bg-gray-600 disabled:bg-gray-300;
}
/* Add other solid colors as needed */

/* Outline */
.nuxt-ui-btn--variant-outline.nuxt-ui-btn--color-primary {
  --at-apply: border-blue-500 text-blue-500 hover:bg-blue-50 disabled:border-blue-300 disabled:text-blue-300;
}
.nuxt-ui-btn--variant-outline.nuxt-ui-btn--color-gray {
  --at-apply: border-gray-500 text-gray-500 hover:bg-gray-50 disabled:border-gray-300 disabled:text-gray-300;
}
/* Add other outline colors as needed */

/* Soft */
.nuxt-ui-btn--variant-soft.nuxt-ui-btn--color-primary {
  --at-apply: bg-blue-100 text-blue-700 hover:bg-blue-200 disabled:bg-blue-50 disabled:text-blue-400;
}
.nuxt-ui-btn--variant-soft.nuxt-ui-btn--color-gray {
  --at-apply: bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400;
}
/* Add other soft colors as needed */

/* Ghost */
.nuxt-ui-btn--variant-ghost.nuxt-ui-btn--color-primary {
  --at-apply: text-blue-500 hover:bg-blue-50 disabled:text-blue-300;
}
.nuxt-ui-btn--variant-ghost.nuxt-ui-btn--color-gray {
  --at-apply: text-gray-500 hover:bg-gray-50 disabled:text-gray-300;
}
/* Add other ghost colors as needed */

/* Link */
.nuxt-ui-btn--variant-link.nuxt-ui-btn--color-primary {
  --at-apply: text-blue-500 hover:underline disabled:text-blue-300;
}
.nuxt-ui-btn--variant-link.nuxt-ui-btn--color-gray {
  --at-apply: text-gray-500 hover:underline disabled:text-gray-300;
}
/* Add other link colors as needed */

.nuxt-ui-btn--block {
  --at-apply: w-full;
}

.nuxt-ui-btn--disabled {
  --at-apply: cursor-not-allowed opacity-75;
}
</style>
