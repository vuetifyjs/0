# Welcome to Vuetify0!

[@vuetify/v0](https://www.npmjs.com/package/@vuetify/v0) gives you headless composables — selection, registration, forms, theming — without any markup opinions. You bring the HTML and CSS; v0 handles the logic. This editor is where you build with them: a Monaco-powered workspace with live preview, type checking, and every v0 export ready to import.

## The environment

The editor ships a complete single-file component setup. Your `App.vue` runs inside a Vue 3 app with these already wired in:

- **Monaco editor** with full TypeScript IntelliSense — autocomplete, hover docs, and error checking for every `@vuetify/v0` export
- **Live preview** that re-renders as you type
- **UnoCSS runtime** with `presetWind4` (Tailwind v4 syntax) loaded automatically — no config needed
- **`createThemePlugin`** installed with `light` and `dark` themes; every theme color is defined and reactive to theme switches

> [!TIP] Theme colors work two ways: CSS custom properties (`var(--v0-primary)`) and UnoCSS utilities (`text-primary`, `bg-surface`, `border-divider`). Use the utilities — they're shorter and theme-aware by default.

## Composables

| Category | Composables |
|---|---|
| Selection & State | [createSingle](/composables/selection/create-single), [createGroup](/composables/selection/create-group), [createStep](/composables/selection/create-step), [createNested](/composables/selection/create-nested), [useProxyModel](/composables/reactivity/use-proxy-model) |
| Forms | [createForm](/composables/forms/create-form) |
| Browser & Events | [useHotkey](/composables/system/use-hotkey), [useEventListener](/composables/system/use-event-listener), [useClickOutside](/composables/system/use-click-outside), [useBreakpoints](/composables/plugins/use-breakpoints), [useStorage](/composables/plugins/use-storage) |
| Theming | [useTheme](/composables/plugins/use-theme) |
| Foundation | [createContext](/composables/foundation/create-context), [createRegistry](/composables/registration/create-registry), [createTokens](/composables/registration/create-tokens) |

## Getting started

Open the **examples** menu in the toolbar and load any demo — you'll get a complete, working project with files, imports, and a live preview that updates as you type. Or skip that entirely: open `App.vue` in the editor and start writing a component from scratch. The preview hot-reloads on every keystroke, so you'll see the result before you finish the thought. Either way, you're writing real Vue 3 code against the full v0 API — no stubs, no simulations.

<!-- > [!TOUR] using-the-playground -->

## Tips

- `Ctrl+B` toggles the file tree sidebar on and off
- **Double-click** any resize handle to snap it back to its default width
- Switch between **horizontal** and **vertical** layout using the toggle in the toolbar
- Add new files in the file tree and import them normally — multi-file projects work out of the box
- The URL updates as you edit — copy it to share exactly what you built

<!-- > [!TRY] Build something in the editor, then copy the URL and open it in a new tab — it opens exactly what you built. -->
