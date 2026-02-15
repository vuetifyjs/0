# Adding step navigation

Now let's use `createStep` — a composable for building wizards, carousels, and any step-based UI.

## What is createStep?

`createStep` extends single-selection with navigation methods:

- `first()` / `last()` — jump to boundaries
- `next()` / `prev()` — move sequentially
- Automatically **skips disabled** items
- Supports **circular** navigation

## How it works

1. Call `createStep()` to create a stepper instance
2. Register items with `onboard()` — each item gets an `id` and `value`
3. Use `first()` to select the initial step
4. Navigate with `next()`, `prev()`, etc.

## Try it

The code now imports `createStep` and sets up a 3-step wizard. Click the **Next** and **Previous** buttons in the preview to navigate between steps.

Notice how `selectedValue` reactively updates as you navigate!
