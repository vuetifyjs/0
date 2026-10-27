<script setup lang="ts">
  import { Md1TextField } from '@paper/md1'
  import { shallowRef } from 'vue'

  // Delivery: two of five fields are required, so the two carry the asterisk.
  const name = shallowRef('')
  const company = shallowRef('')
  const street = shallowRef('')
  const city = shallowRef('')
  const zip = shallowRef('')

  // Listing: three of four fields are required, so the one optional field is marked instead.
  const title = shallowRef('')
  const price = shallowRef('')
  const condition = shallowRef('')
  const description = shallowRef('')

  // Unmarked here still means required: each field carries its own presence rule.
  function present (message: string) {
    return (value: unknown) => String(value).trim().length > 0 || message
  }
</script>

<template>
  <div class="md1-docs-required">
    <section aria-labelledby="md1-docs-required-delivery" class="md1-docs-required-form">
      <h4 id="md1-docs-required-delivery" class="md1-docs-required-title">Delivery</h4>

      <Md1TextField v-model="name" autocomplete="name" label="Name" required />

      <Md1TextField v-model="company" autocomplete="organization" label="Company" />

      <Md1TextField v-model="street" autocomplete="street-address" label="Street address" />

      <Md1TextField v-model="city" autocomplete="address-level2" label="City" />

      <Md1TextField
        v-model="zip"
        autocomplete="postal-code"
        inputmode="numeric"
        label="Zip code"
        required
      />

      <p class="md1-docs-required-legend">* Required fields</p>
    </section>

    <section aria-labelledby="md1-docs-required-listing" class="md1-docs-required-form">
      <h4 id="md1-docs-required-listing" class="md1-docs-required-title">New listing</h4>

      <Md1TextField v-model="title" label="Title" :rules="[present('Error: enter a title')]" />

      <Md1TextField
        v-model="price"
        inputmode="decimal"
        label="Price"
        prefix="$"
        :rules="[present('Error: enter a price')]"
      />

      <Md1TextField v-model="condition" label="Condition" :rules="[present('Error: describe the condition')]" />

      <Md1TextField v-model="description" label="Description" multiline optional />
    </section>
  </div>
</template>

<style>
  /* Two handset-width forms side by side, stacking when the example is narrow. */
  .md1-docs-required {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
    gap: var(--md1-spacing-5, 40px);
    width: 100%;
    max-width: 640px;
  }

  .md1-docs-required-form {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-2, 16px);
  }

  .md1-docs-required-title {
    margin: 0;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-subheading-size, 16px);
    font-weight: var(--md1-font-weight-regular, 400);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  .md1-docs-required-legend {
    margin: 0;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    letter-spacing: var(--md1-type-caption-tracking, 0.02em);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
