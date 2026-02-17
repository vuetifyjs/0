---
hideFiles: true
hideTabs: true
hideBreadcrumbs: true
---
# What is headless?

v0 components are **headless** — they manage behavior, accessibility, and state, but ship zero CSS. You provide every pixel of the visuals using regular HTML and utility classes.

## Compound components

Headless components use a **compound pattern**: a parent `Root` manages state, and child components participate in it. They communicate through Vue's provide/inject — no prop drilling needed.

```vue
<template>
  <Single.Root v-model="selected">
    <Single.Item value="apple">Apple</Single.Item>
    <Single.Item value="banana">Banana</Single.Item>
  </Single.Root>
</template>
```

`Single.Root` tracks which item is selected. Each `Single.Item` registers itself and handles clicks. But neither renders any styling — that part is yours.

## Slot props

Child components expose **slot props** like `isSelected` so you can style them conditionally:

```vue
<template>
  <Single.Item value="apple" #default="{ isSelected }">
    <div :class="isSelected ? 'bg-primary text-on-primary' : 'bg-surface'">
      Apple
    </div>
  </Single.Item>
</template>
```

## Try it

The editor shows a `Single` component with three fruit options. Click them and watch the selection state change. Try adding a fourth option or changing the styling classes.

> [!TIP] This is the core mental model of v0: components provide behavior through slot props, you provide the visuals. Zero CSS ships with v0 — every pixel is yours.
