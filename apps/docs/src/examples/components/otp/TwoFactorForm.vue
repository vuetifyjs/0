<script setup lang="ts">
  import { Form, Otp } from '@vuetify/v0'
  import { useTemplateRef } from 'vue'

  const { submit } = defineProps<{
    submit: (form: HTMLFormElement) => void
  }>()

  const code = defineModel<string>({ default: '' })

  const form = useTemplateRef('form')

  function onComplete () {
    form.value?.requestSubmit()
  }

  function onSubmit () {
    if (form.value) submit(form.value)
  }
</script>

<template>
  <Form v-slot="{ attrs }" renderless @submit="onSubmit">
    <form ref="form" v-bind="attrs">
      <Otp.Root
        v-slot="{ items }"
        v-model="code"
        class="flex gap-2"
        :length="6"
        name="code"
        @complete="onComplete"
      >
        <Otp.Item
          v-for="item in items"
          :key="item.index"
          class="w-10 h-12 text-center border border-divider rounded bg-surface text-on-surface text-lg tabular-nums outline-none focus:border-primary [&[data-state=filled]]:border-primary"
          :index="item.index"
        />
      </Otp.Root>
    </form>
  </Form>
</template>
