---
hideFiles: true
hideTabs: true
hideBreadcrumbs: true
---
# Welcome to Vue Basics

Every v0 composable is built on Vue 3. This tutorial walks you through the fundamentals by building a contact card from scratch — adding one new concept per step until you have a fully interactive component.

You'll learn **refs**, **events**, **computed properties**, **conditionals**, **lists**, and **two-way binding** — the same building blocks behind every v0 composable.

## Single-file components

In Vue, you write [single-file components](https://vuejs.org/guide/scaling-up/sfc.html) (SFCs) — `.vue` files that keep template, logic, and styles together in one place:

```vue
<template>
  <h1>Hello!</h1>
</template>
```

That's a complete component. The `<template>` section contains HTML that Vue renders to the page. No JavaScript needed — at least not yet.

Look at the editor on the right. It contains a static contact card built entirely with a `<template>`. The name, role, and email are all hardcoded directly in the markup. It works, but if anything needs to change, you'd have to edit the HTML by hand every time.

In the next step, we'll fix that by making the data **reactive**.

> [!TRY] Edit the card in the editor — change "Alex Chen" to your name, or swap the role to something else. The preview updates instantly as you type.
