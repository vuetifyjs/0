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
    color: var(--onyx-foreground, #f0ece5);
    font-size: var(--onyx-text-sm-size, 13.5px);
    font-weight: 550;
    line-height: var(--onyx-text-sm-height, 22px);
  }

  .onyx-input__field {
    position: relative;
  }

  /* Inputs are cut into the stone, not built on top of it — the intaglio recipe. */
  .onyx-input__control {
    background: var(--onyx-band-recess), var(--onyx-intaglio, #090605);
    border: var(--onyx-stroke-s, 1px) solid var(--onyx-input, #2f2925);
    border-radius: var(--onyx-radius-md, 0.375rem);
    box-shadow: var(--onyx-girdle-recess);
    color: var(--onyx-foreground, #f0ece5);
    font-family: var(--onyx-font-sans, ui-sans-serif, system-ui, sans-serif);
    font-size: var(--onyx-text-base-size, 15px);
    height: var(--onyx-control-md, 36px);
    padding: 0 var(--onyx-spacing-sm, 12px);
    transition: border-color var(--onyx-motion-fast, 120ms) var(--onyx-motion-lamp, cubic-bezier(0.4, 0, 0.2, 1)),
                box-shadow var(--onyx-motion-fast, 120ms) var(--onyx-motion-lamp, cubic-bezier(0.4, 0, 0.2, 1));
    width: 100%;
  }

  .onyx-input__control::placeholder {
    color: color-mix(in oklab, var(--onyx-muted-foreground, #bab3ab) 62%, transparent);
  }

  .onyx-input__control:hover:not([data-disabled]) {
    border-color: var(--onyx-hairline-strong, #423c37);
  }

  /* Focus fills the cut with light rather than ringing the outside of it — but per the Direction
     B focus graft, that glow is decoration ON TOP of a real outline, never a substitute for one:
     "never replaced by a box-shadow, never removed." */
  .onyx-input__control:focus,
  .onyx-input__control[data-focused] {
    border-color: color-mix(in oklab, var(--onyx-champagne, #dac593) 45%, var(--onyx-input, #2f2925));
    box-shadow: var(--onyx-girdle-recess), 0 0 0 3px color-mix(in oklab, var(--onyx-champagne, #dac593) 20%, transparent);
    outline: 2px solid color-mix(in oklab, var(--onyx-ring, #dac593) 85%, transparent);
    outline-offset: 2px;
  }

  /* Explicit disabled colors, never opacity (graft — see OnButton's [data-disabled] comment). */
  .onyx-input__control[data-disabled] {
    background: var(--onyx-card, #181411);
    border-color: var(--onyx-border, #2f2925);
    box-shadow: none;
    color: var(--onyx-muted-foreground, #bab3ab);
    cursor: not-allowed;
  }

  .onyx-input__control[data-state='invalid'] {
    border-color: color-mix(in oklab, var(--onyx-destructive, #cf4b3b) 60%, var(--onyx-input, #2f2925));
  }

  .onyx-input__control[data-state='invalid']:focus,
  .onyx-input__control[data-state='invalid'][data-focused] {
    box-shadow: var(--onyx-girdle-recess), 0 0 0 3px color-mix(in oklab, var(--onyx-destructive, #cf4b3b) 22%, transparent);
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
    font-size: var(--onyx-text-md-size, 16.5px);
    height: var(--onyx-control-lg, 40px);
  }

  .onyx-input__reveal {
    align-items: center;
    background: transparent;
    border: none;
    border-radius: var(--onyx-radius-sm, 0.25rem);
    color: var(--onyx-muted-foreground, #bab3ab);
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
    color: var(--onyx-foreground, #f0ece5);
  }

  .onyx-input__reveal:focus-visible {
    outline: 2px solid color-mix(in oklab, var(--onyx-ring, #dac593) 85%, transparent);
    outline-offset: 2px;
  }

  .onyx-input__description {
    color: var(--onyx-muted-foreground, #bab3ab);
    font-size: var(--onyx-text-xs-size, 12px);
    line-height: var(--onyx-text-xs-height, 18px);
  }

  /* Error text uses destructive-fg, not destructive — the fill color reaches only Lc -37.9 on
     stone (direction-a.md §5.5 note); destructive-fg was raised specifically to carry this text. */
  .onyx-input__error {
    color: var(--onyx-destructive-fg, #f18a76);
    font-size: var(--onyx-text-xs-size, 12px);
    line-height: var(--onyx-text-xs-height, 18px);
  }

  .onyx-input__error[data-state='hidden'] {
    display: none;
  }
</style>
