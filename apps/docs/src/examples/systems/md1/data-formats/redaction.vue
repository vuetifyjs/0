<script setup lang="ts">
  import { Md1List } from '@paper/md1'

  // Two spaces, then each midline ellipsis followed by a six-per-em space: the page's Unicode string.
  function redact (last: string, dots: 3 | 4) {
    return `  ${'• '.repeat(dots)}${last}`
  }

  const methods = [
    { id: 'visa', name: 'Visa', detail: redact('1234', 4), label: 'ending in 1234' },
    { id: 'ssn', name: 'SSN', detail: redact('5678', 3), label: 'ending in 5678' },
    { id: 'paypal', name: 'PayPal', detail: 'krestovozdvizhensky@googlemail.com', label: '' },
  ]
</script>

<template>
  <div class="md1-docs-redaction">
    <Md1List aria-label="Payment methods" :lines="2">
      <Md1List.Item v-for="method in methods" :key="method.id">
        <Md1List.Content>
          <Md1List.Primary>{{ method.name }}</Md1List.Primary>

          <Md1List.Secondary class="md1-docs-redaction-detail">
            <span :aria-hidden="method.label ? 'true' : undefined">{{ method.detail }}</span>

            <span v-if="method.label" class="md1-docs-redaction-hidden">{{ method.label }}</span>
          </Md1List.Secondary>
        </Md1List.Content>
      </Md1List.Item>
    </Md1List>
  </div>
</template>

<style>
  /* A narrow list, so the long address meets the edge and truncates. */
  .md1-docs-redaction {
    width: 100%;
    max-width: 240px;
    background: var(--md1-surface, #FFFFFF);
    box-shadow: var(--md1-elevation-2);
  }

  /* Keep the leading spaces, and end a cut address in one baseline ellipsis. */
  .md1-docs-redaction-detail {
    overflow: hidden;
    white-space: pre;
    text-overflow: ellipsis;
  }

  /* What a screen reader hears in place of the bullets. */
  .md1-docs-redaction-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
</style>
