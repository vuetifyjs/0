---
meta:
  title: Group
  description: A component for managing a collection of selectable items, such as radio buttons or checkboxes.
  keywords: group, vuetify0, component, selection, radio, checkbox
category: Component
performance: 0
---

# Group Component

## Description

The `Group` component in Vuetify0 is designed to manage the selection state of a collection of child items. It provides a flexible way to implement various selection behaviors, such as single selection (like radio buttons) or multiple selection (like checkboxes), by leveraging the `useGroup` composable.

## API

### Props

- **`namespace`**: `string`
  - A unique identifier for the group, used for context and state management.
- **`modelValue`**: `any`
  - The current value of the selected item(s) in the group. This prop is used with `v-model` for two-way data binding.
- **`multiple`**: `boolean`
  - If `true`, allows multiple items to be selected within the group. Defaults to `false` (single selection).
- **`mandatory`**: `boolean`
  - If `true`, at least one item must always be selected. Cannot be `true` if `multiple` is `true`.
- **`max`**: `number`
  - The maximum number of items that can be selected when `multiple` is `true`.

### Slots

- **`default`**: `(scope: GroupContext) => any`
  - The default slot provides access to the `GroupContext` object, which contains properties and methods related to the group's selection state. This allows for dynamic rendering and interaction with group items.

### Events

- **`update:modelValue`**: `(value: any) => void`
  - Emitted when the selected value(s) of the group change.

## Examples

### Single Selection Group (Radio-like)

```vue
<template>
  <Group v-model="selectedOption">
    <GroupItem value="option1">Option 1</GroupItem>
    <GroupItem value="option2">Option 2</GroupItem>
    <GroupItem value="option3">Option 3</GroupItem>
  </Group>
  <p>Selected: {{ selectedOption }}</p>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Group, GroupItem } from '@vuetify/0/components/Group';

const selectedOption = ref("option1");
</script>
```

### Multiple Selection Group (Checkbox-like)

```vue
<template>
  <Group v-model="selectedItems" multiple :max="2">
    <GroupItem value="itemA">Item A</GroupItem>
    <GroupItem value="itemB">Item B</GroupItem>
    <GroupItem value="itemC">Item C</GroupItem>
  </Group>
  <p>Selected: {{ selectedItems }}</p>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Group, GroupItem } from '@vuetify/0/components/Group';

const selectedItems = ref(["itemA"]);
</script>
```

### Group with Custom Content in GroupItem

```vue
<template>
  <Group v-model="selectedColor">
    <GroupItem value="red">
      <div style="background-color: red; width: 50px; height: 50px;"></div>
    </GroupItem>
    <GroupItem value="blue">
      <div style="background-color: blue; width: 50px; height: 50px;"></div>
    </GroupItem>
  </Group>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Group, GroupItem } from '@vuetify/0/components/Group';

const selectedColor = ref("red");
</script>
```

