---
hideFiles: false
hideTabs: false
hideBreadcrumbs: true
---
# Dialog for confirmation

`Dialog` creates accessible modal dialogs using the native `<dialog>` element. It manages focus trapping, escape-to-close, and ARIA labeling.

## Structure

```vue
<template>
  <Dialog.Root>
    <Dialog.Activator>Open</Dialog.Activator>

    <Dialog.Content>
      <Dialog.Title>Are you sure?</Dialog.Title>
      <Dialog.Description>This action cannot be undone.</Dialog.Description>

      <Dialog.Close>Cancel</Dialog.Close>
    </Dialog.Content>
  </Dialog.Root>
</template>
```

- **`Dialog.Root`** — manages open/closed state
- **`Dialog.Activator`** — button that opens the dialog
- **`Dialog.Content`** — the modal container (native `<dialog>`)
- **`Dialog.Title`** — accessible label for the dialog
- **`Dialog.Description`** — accessible description
- **`Dialog.Close`** — button that closes the dialog

## Extracting a reusable dialog

Check the `ConfirmDialog.vue` file — it wraps the dialog pattern into a reusable component that accepts a title, message, and emits a `confirm` event.

## Try it

Click "Reset settings" at the bottom of the panel to open the confirmation dialog. Try adding a second "Delete account" dialog that requires the user to type "DELETE" before the confirm button enables.
