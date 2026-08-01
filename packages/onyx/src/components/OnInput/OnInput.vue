<script lang="ts">
  // Framework
  import { Button, Input } from '@vuetify/v0'

  export type OnInputSize = 'sm' | 'md' | 'lg'
  export type OnInputType = 'text' | 'password' | 'email'

  export interface OnInputProps {
    description?: string
    disabled?: boolean
    error?: string
    label?: string
    placeholder?: string
    size?: OnInputSize
    type?: OnInputType
  }
</script>

<script setup lang="ts">
  // Utilities
  import { shallowRef, toRef, useId } from 'vue'

  defineOptions({ name: 'OnInput' })

  const {
    description,
    disabled = false,
    error,
    label,
    placeholder,
    size = 'md',
    type = 'text',
  } = defineProps<OnInputProps>()

  const model = defineModel<string>({ default: '' })

  const id = useId()
  const revealed = shallowRef(false)

  // type is owned by Input.Root, not Input.Control — flipping it here swaps the
  // rendered <input>'s effective type without Hb ever touching the control itself.
  // Input.Root's `type` context field is non-reactive (v0 #757), so the :key below
  // forces a full remount on every toggle as the workaround: https://github.com/vuetifyjs/0/issues/757
  const effectiveType = toRef(() => type === 'password' && revealed.value ? 'text' : type)

  function onReveal () {
    revealed.value = !revealed.value
  }
</script>

<template>
  <Input.Root
    :id
    :key="effectiveType"
    v-model="model"
    class="onyx-input"
    :data-size="size"
    :disabled
    :error-messages="error"
    :label
    :type="effectiveType"
  >
    <label v-if="label" class="onyx-input__label" :for="String(id)">{{ label }}</label>

    <div class="onyx-input__field" :data-password="type === 'password' || undefined">
      <Input.Control class="onyx-input__control" :placeholder />

      <Button.Root
        v-if="type === 'password'"
        :aria-label="revealed ? 'Hide password' : 'Show password'"
        class="onyx-input__reveal"
        :disabled
        @click="onReveal"
      >
        <svg
          v-if="revealed"
          aria-hidden="true"
          fill="none"
          height="16"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          viewBox="0 0 24 24"
          width="16"
        >
          <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
          <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
          <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
          <path d="m2 2 20 20" />
        </svg>

        <svg
          v-else
          aria-hidden="true"
          fill="none"
          height="16"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          viewBox="0 0 24 24"
          width="16"
        >
          <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </Button.Root>
    </div>

    <Input.Description v-if="description" class="onyx-input__description">
      {{ description }}
    </Input.Description>

    <Input.Error v-slot="{ errors }" class="onyx-input__error">
      <span v-for="message in errors" :key="message">{{ message }}</span>
    </Input.Error>
  </Input.Root>
</template>

<!-- Unscoped: Input.Control/Description/Error and the reveal Button.Root are compound
     children from v0's own file scope; scoped data-v never reaches their roots
     (mirrors the OnButton/Button.Root case). -->
<style>
  .onyx-input {
    display: flex;
    flex-direction: column;
    gap: var(--onyx-spacing-2xs, 4px);
  }

  .onyx-input__label {
    color: var(--onyx-foreground, #fafafa);
    font-size: var(--onyx-text-sm-size, 13px);
    font-weight: 500;
    line-height: var(--onyx-text-sm-height, 18px);
  }

  .onyx-input__field {
    position: relative;
  }

  .onyx-input__control {
    background: transparent;
    border: var(--onyx-stroke-s, 1px) solid var(--onyx-input, #27272a);
    border-radius: var(--onyx-radius-md, 0.375rem);
    color: var(--onyx-foreground, #fafafa);
    font-family: var(--onyx-font-sans, ui-sans-serif, system-ui, sans-serif);
    font-size: var(--onyx-text-sm-size, 13px);
    height: var(--onyx-control-md, 36px);
    padding: 0 var(--onyx-spacing-sm, 12px);
    transition: border-color var(--onyx-motion-fast, 120ms), box-shadow var(--onyx-motion-fast, 120ms);
    width: 100%;
  }

  .onyx-input__control::placeholder {
    color: var(--onyx-muted-foreground, #a1a1aa);
  }

  .onyx-input__control:focus,
  .onyx-input__control[data-focused] {
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--onyx-ring, #71717a) 50%, transparent);
    outline: none;
  }

  .onyx-input__control[data-disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .onyx-input__control[data-state='invalid'] {
    border-color: var(--onyx-destructive, #ef4444);
  }

  .onyx-input__control[data-state='invalid']:focus,
  .onyx-input__control[data-state='invalid'][data-focused] {
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--onyx-destructive, #ef4444) 50%, transparent);
  }

  .onyx-input__field[data-password] .onyx-input__control {
    padding-right: 36px;
  }

  .onyx-input[data-size='sm'] .onyx-input__control {
    font-size: var(--onyx-text-xs-size, 12px);
    height: var(--onyx-control-sm, 32px);
  }

  .onyx-input[data-size='md'] .onyx-input__control {
    height: var(--onyx-control-md, 36px);
  }

  .onyx-input[data-size='lg'] .onyx-input__control {
    font-size: var(--onyx-text-base-size, 14px);
    height: var(--onyx-control-lg, 40px);
  }

  .onyx-input__reveal {
    align-items: center;
    background: transparent;
    border: none;
    border-radius: var(--onyx-radius-sm, 0.25rem);
    color: var(--onyx-muted-foreground, #a1a1aa);
    cursor: pointer;
    display: inline-flex;
    height: 24px;
    justify-content: center;
    padding: 0;
    position: absolute;
    right: 6px;
    top: 50%;
    transform: translateY(-50%);
    width: 24px;
  }

  .onyx-input__reveal:hover:not([data-disabled]) {
    color: var(--onyx-foreground, #fafafa);
  }

  .onyx-input__description {
    color: var(--onyx-muted-foreground, #a1a1aa);
    font-size: var(--onyx-text-sm-size, 13px);
    line-height: var(--onyx-text-sm-height, 18px);
  }

  .onyx-input__error {
    color: var(--onyx-destructive, #ef4444);
    font-size: var(--onyx-text-sm-size, 13px);
    line-height: var(--onyx-text-sm-height, 18px);
  }

  .onyx-input__error[data-state='hidden'] {
    display: none;
  }
</style>
