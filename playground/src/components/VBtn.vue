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
    <VButtonContent :class="contentClasses" :hide-on-loading="false">
      <slot name="prepend" />
      <span class="v-btn__text">
        <slot />
      </span>
      <slot name="append" />
    </VButtonContent>
    <VButtonLoading :class="loadingClasses">
      <slot name="loading">
        <div class="v-btn__loader">
          <Icon class="animate-spin" icon="lucide:loader-circle" />
        </div>
      </slot>
    </VButtonLoading>
  </VButtonRoot>
</template>

<script setup lang="ts">
  import { Icon } from '@iconify/vue'
  import { computed } from 'vue'
  import { type ButtonState, VButtonContent, VButtonLoading, VButtonRoot } from 'vuetify0'

  export interface VBtnProps {
    variant?: 'filled' | 'outlined' | 'text' | 'tonal'
    color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
    size?: 'small' | 'default' | 'large'
    state?: ButtonState
    disabled?: boolean
    loading?: boolean
    active?: boolean
    block?: boolean
    rounded?: boolean
  }

  const props = withDefaults(defineProps<VBtnProps>(), {
    variant: 'filled',
    color: 'primary',
    size: 'default',
    state: 'default',
    disabled: false,
    loading: false,
    active: false,
    block: false,
    rounded: false,
  })

  defineEmits<{
    'click': [event: MouseEvent]
    'update:state': [state: ButtonState]
  }>()

  const buttonClasses = computed(() => {
    return [
      'v-btn',
      `v-btn--${props.variant}`,
      `v-btn--${props.color}`,
      `v-btn--${props.size}`,
      {
        'v-btn--block': props.block,
        'v-btn--rounded': props.rounded,
        'v-btn--loading': props.loading,
        'v-btn--active': props.active,
        'v-btn--disabled': props.disabled,
      },
    ]
  })

  const contentClasses = computed(() => {
    return ['v-btn__content']
  })

  const loadingClasses = computed(() => {
    return ['v-btn__loading']
  })
</script>

<style scoped>
.v-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: inherit;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
  vertical-align: middle;
  white-space: nowrap;
  outline: none;
  overflow: hidden;
}

.v-btn:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

/* Sizes */
.v-btn--small {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  min-height: 2rem;
}

.v-btn--default {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  min-height: 2.5rem;
}

.v-btn--large {
  padding: 0.75rem 1.5rem;
  font-size: 1.125rem;
  min-height: 3rem;
}

/* Block */
.v-btn--block {
  display: flex;
  width: 100%;
}

/* Rounded */
.v-btn--rounded {
  border-radius: 9999px;
}

/* Variants - Filled */
.v-btn--filled.v-btn--primary {
  background-color: #1976d2;
  color: white;
}

.v-btn--filled.v-btn--primary:hover:not(.v-btn--disabled) {
  background-color: #1565c0;
}

.v-btn--filled.v-btn--secondary {
  background-color: #424242;
  color: white;
}

.v-btn--filled.v-btn--secondary:hover:not(.v-btn--disabled) {
  background-color: #303030;
}

.v-btn--filled.v-btn--success {
  background-color: #4caf50;
  color: white;
}

.v-btn--filled.v-btn--success:hover:not(.v-btn--disabled) {
  background-color: #43a047;
}

.v-btn--filled.v-btn--warning {
  background-color: #ff9800;
  color: white;
}

.v-btn--filled.v-btn--warning:hover:not(.v-btn--disabled) {
  background-color: #f57c00;
}

.v-btn--filled.v-btn--error {
  background-color: #f44336;
  color: white;
}

.v-btn--filled.v-btn--error:hover:not(.v-btn--disabled) {
  background-color: #d32f2f;
}

.v-btn--filled.v-btn--info {
  background-color: #2196f3;
  color: white;
}

.v-btn--filled.v-btn--info:hover:not(.v-btn--disabled) {
  background-color: #1976d2;
}

/* Variants - Outlined */
.v-btn--outlined {
  background-color: transparent;
  border: 1px solid currentColor;
}

.v-btn--outlined.v-btn--primary {
  color: #1976d2;
}

.v-btn--outlined.v-btn--primary:hover:not(.v-btn--disabled) {
  background-color: rgba(25, 118, 210, 0.08);
}

.v-btn--outlined.v-btn--secondary {
  color: #424242;
}

.v-btn--outlined.v-btn--secondary:hover:not(.v-btn--disabled) {
  background-color: rgba(66, 66, 66, 0.08);
}

.v-btn--outlined.v-btn--success {
  color: #4caf50;
}

.v-btn--outlined.v-btn--success:hover:not(.v-btn--disabled) {
  background-color: rgba(76, 175, 80, 0.08);
}

.v-btn--outlined.v-btn--warning {
  color: #ff9800;
}

.v-btn--outlined.v-btn--warning:hover:not(.v-btn--disabled) {
  background-color: rgba(255, 152, 0, 0.08);
}

.v-btn--outlined.v-btn--error {
  color: #f44336;
}

.v-btn--outlined.v-btn--error:hover:not(.v-btn--disabled) {
  background-color: rgba(244, 67, 54, 0.08);
}

.v-btn--outlined.v-btn--info {
  color: #2196f3;
}

.v-btn--outlined.v-btn--info:hover:not(.v-btn--disabled) {
  background-color: rgba(33, 150, 243, 0.08);
}

/* Variants - Text */
.v-btn--text {
  background-color: transparent;
}

.v-btn--text.v-btn--primary {
  color: #1976d2;
}

.v-btn--text.v-btn--primary:hover:not(.v-btn--disabled) {
  background-color: rgba(25, 118, 210, 0.08);
}

.v-btn--text.v-btn--secondary {
  color: #424242;
}

.v-btn--text.v-btn--secondary:hover:not(.v-btn--disabled) {
  background-color: rgba(66, 66, 66, 0.08);
}

.v-btn--text.v-btn--success {
  color: #4caf50;
}

.v-btn--text.v-btn--success:hover:not(.v-btn--disabled) {
  background-color: rgba(76, 175, 80, 0.08);
}

.v-btn--text.v-btn--warning {
  color: #ff9800;
}

.v-btn--text.v-btn--warning:hover:not(.v-btn--disabled) {
  background-color: rgba(255, 152, 0, 0.08);
}

.v-btn--text.v-btn--error {
  color: #f44336;
}

.v-btn--text.v-btn--error:hover:not(.v-btn--disabled) {
  background-color: rgba(244, 67, 54, 0.08);
}

.v-btn--text.v-btn--info {
  color: #2196f3;
}

.v-btn--text.v-btn--info:hover:not(.v-btn--disabled) {
  background-color: rgba(33, 150, 243, 0.08);
}

/* Variants - Tonal */
.v-btn--tonal.v-btn--primary {
  background-color: rgba(25, 118, 210, 0.12);
  color: #1976d2;
}

.v-btn--tonal.v-btn--primary:hover:not(.v-btn--disabled) {
  background-color: rgba(25, 118, 210, 0.16);
}

.v-btn--tonal.v-btn--secondary {
  background-color: rgba(66, 66, 66, 0.12);
  color: #424242;
}

.v-btn--tonal.v-btn--secondary:hover:not(.v-btn--disabled) {
  background-color: rgba(66, 66, 66, 0.16);
}

.v-btn--tonal.v-btn--success {
  background-color: rgba(76, 175, 80, 0.12);
  color: #4caf50;
}

.v-btn--tonal.v-btn--success:hover:not(.v-btn--disabled) {
  background-color: rgba(76, 175, 80, 0.16);
}

.v-btn--tonal.v-btn--warning {
  background-color: rgba(255, 152, 0, 0.12);
  color: #ff9800;
}

.v-btn--tonal.v-btn--warning:hover:not(.v-btn--disabled) {
  background-color: rgba(255, 152, 0, 0.16);
}

.v-btn--tonal.v-btn--error {
  background-color: rgba(244, 67, 54, 0.12);
  color: #f44336;
}

.v-btn--tonal.v-btn--error:hover:not(.v-btn--disabled) {
  background-color: rgba(244, 67, 54, 0.16);
}

.v-btn--tonal.v-btn--info {
  background-color: rgba(33, 150, 243, 0.12);
  color: #2196f3;
}

.v-btn--tonal.v-btn--info:hover:not(.v-btn--disabled) {
  background-color: rgba(33, 150, 243, 0.16);
}

/* States */
.v-btn--disabled {
  opacity: 0.38;
  cursor: not-allowed;
  pointer-events: none;
}

.v-btn--active {
  transform: scale(0.98);
}

.v-btn--loading {
  pointer-events: none;
}

/* Content */
.v-btn__content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: opacity 0.2s ease;
}

.v-btn__text {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Loading */
.v-btn__loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: inherit;
  z-index: 1;
}

.v-btn__loader {
  display: flex;
  align-items: center;
  justify-content: center;
}

.v-btn__spinner {
  width: 1.25rem;
  height: 1.25rem;
  animation: v-btn-spin 1s linear infinite;
}

.v-btn--small .v-btn__spinner {
  width: 1rem;
  height: 1rem;
}

.v-btn--large .v-btn__spinner {
  width: 1.5rem;
  height: 1.5rem;
}

@keyframes v-btn-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
