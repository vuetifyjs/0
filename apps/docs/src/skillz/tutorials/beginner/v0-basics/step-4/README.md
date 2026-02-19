---
hideFiles: true
hideTabs: true
hideBreadcrumbs: true
---
# Radio groups

`Radio` provides single-selection radio button controls. Unlike `Single`, radio groups are specifically designed for form inputs — they render proper ARIA radio roles and support form submission.

## Group and Root

```vue
<template>
  <Radio.Group v-model="visibility" mandatory>
    <Radio.Root value="public">
      <Radio.Indicator>●</Radio.Indicator>
      Public
    </Radio.Root>

    <Radio.Root value="private">
      <Radio.Indicator>●</Radio.Indicator>
      Private
    </Radio.Root>
  </Radio.Group>
</template>
```

- **`Radio.Group`** — manages which radio is selected, supports `mandatory` prop
- **`Radio.Root`** — individual radio button with `value`, renders as a button
- **`Radio.Indicator`** — only renders its content when this radio is selected

## Card-style radios

Since v0 is headless, you can style radios as full cards instead of tiny circles:

```vue
<template>
  <Radio.Root value="public" #default="{ isSelected }">
    <div :class="isSelected ? 'border-primary bg-surface-tint' : 'border-divider'">
      <Radio.Indicator>●</Radio.Indicator>
      <strong>Public</strong>
      <p>Visible to everyone</p>
    </div>
  </Radio.Root>
</template>
```

## Try it

The Privacy tab now has radio cards for visibility settings. Try adding the `mandatory` prop to `Radio.Group` to prevent deselection, or add a `watch` on `visibility` to show a toast message when it changes.
