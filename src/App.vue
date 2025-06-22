<template>
  <main>
    <div>
      <strong>Radio</strong>
      <p>Can select one, cannot deselect all</p>
      <Radio id="radio 1" value="radio 1" />
      <Radio id="radio 2" value="radio 2" />
      <Radio id="radio 3" disabled value="radio 3" />
      <Radio id="radio 4" value="radio 4" />

      The current value is: <strong>{{ model }}</strong>
      <br>
      <br>

      <button @click="model = undefined">Reset</button>
    </div>
  </main>
</template>

<script setup lang="ts">
  import { useGroup } from './composables/group'

  const [useGroupContext, provideGroupContext] = useGroup('radio-group', {
    mandatory: true,
    multiple: false,
  })

  const model = ref()

  provideGroupContext(model)

  const Radio = defineComponent({
    name: 'Radio',

    props: {
      id: String,
      disabled: Boolean,
      value: null,
    },

    setup (props) {
      const group = useGroupContext()

      const { isActive, toggle } = group.register({
        id: props.id ?? 'foo',
        disabled: props.disabled,
        value: props.value,
      })

      return { isActive, toggle }
    },

    render (setup: any) {
      return h('div', {
        onClick () {
          setup.toggle()
        },
        style: {
          userSelect: 'none',
        },
      }, `${this.id}${setup.isActive ? '*' : ''}`)
    },
  })
</script>
