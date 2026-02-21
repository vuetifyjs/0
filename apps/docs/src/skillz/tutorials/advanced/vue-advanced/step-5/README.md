---
hideFiles: false
hideTabs: false
hideBreadcrumbs: false
---
# defineModel

`defineModel` is a compiler macro that simplifies **two-way binding** on custom components. Instead of declaring a prop and emit separately, `defineModel` does both in one line.

## Before defineModel

```vue
<script setup>
  const props = defineProps(['modelValue'])
  const emit = defineEmits(['update:modelValue'])

  function update (value) {
    emit('update:modelValue', value)
  }
</script>
```

## With defineModel

```vue
<script setup>
  const model = defineModel()
</script>
```

`model` is a ref you can read and write directly. Vue handles the prop/emit plumbing automatically.

## Debounced input

`defineModel` is perfect for input wrappers. The editor shows a `SearchInput` component that debounces its model value — the parent only sees updates after the user stops typing:

```vue
<script setup>
  const model = defineModel()
  // Debounce logic updates model after a delay
</script>
```

## Try it

The `SelectableList` now uses `defineModel` instead of manual prop/emit. Try adding `defineModel`'s `.lazy` modifier support or a default value.
