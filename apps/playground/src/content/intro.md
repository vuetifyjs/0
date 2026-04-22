# Welcome to <span style="color: var(--v0-primary)">Vuetify0</span>!

*Want to skip this for now? Close the panel and reopen it anytime from the ☰ menu in the top left.*

---

[@vuetify/v0](https://www.npmjs.com/package/@vuetify/v0) gives you headless composables — selection, registration, forms, theming — without any markup opinions. You bring the HTML and CSS; v0 handles the logic. This editor is where you build with them: a Monaco-powered workspace with live preview, type checking, and every v0 export ready to import.

## The environment

The editor ships a complete single-file component setup. Your `App.vue` runs inside a Vue 3 app with these already wired in:

- **Monaco editor** with full TypeScript IntelliSense — autocomplete, hover docs, and error checking for every `@vuetify/v0` export
- **Live preview** that re-renders as you type
- **UnoCSS runtime** with `presetWind4` (Tailwind v4 syntax) loaded automatically — no config needed
- **`createThemePlugin`** installed with `light` and `dark` themes; every theme color is defined and reactive to theme switches

Theme colors work two ways: CSS custom properties (`var(--v0-primary)`) and UnoCSS utilities (`text-primary`, `bg-surface`, `border-divider`). Use the utilities — they're shorter and theme-aware by default.

## Composables

| Category | Composables |
|---|---|
| Selection & State | [createSingle](https://0.vuetifyjs.com/composables/selection/create-single), [createGroup](https://0.vuetifyjs.com/composables/selection/create-group), [createStep](https://0.vuetifyjs.com/composables/selection/create-step), [createNested](https://0.vuetifyjs.com/composables/selection/create-nested), [useProxyModel](https://0.vuetifyjs.com/composables/reactivity/use-proxy-model) |
| Forms | [createForm](https://0.vuetifyjs.com/composables/forms/create-form) |
| Browser & Events | [useHotkey](https://0.vuetifyjs.com/composables/system/use-hotkey), [useEventListener](https://0.vuetifyjs.com/composables/system/use-event-listener), [useClickOutside](https://0.vuetifyjs.com/composables/system/use-click-outside), [useBreakpoints](https://0.vuetifyjs.com/composables/plugins/use-breakpoints), [useStorage](https://0.vuetifyjs.com/composables/plugins/use-storage) |
| Theming | [useTheme](https://0.vuetifyjs.com/composables/plugins/use-theme) |
| Foundation | [createContext](https://0.vuetifyjs.com/composables/foundation/create-context), [createRegistry](https://0.vuetifyjs.com/composables/registration/create-registry), [createTokens](https://0.vuetifyjs.com/composables/registration/create-tokens) |

## Getting started

Open the **examples** menu in the toolbar and load any demo — you'll get a complete, working project with files, imports, and a live preview that updates as you type. Or skip that entirely: open `App.vue` in the editor and start writing a component from scratch. The preview hot-reloads on every keystroke, so you'll see the result before you finish the thought. Either way, you're writing real Vue 3 code against the full v0 API — no stubs, no simulations.

## Tips

- `Ctrl+B` toggles the file tree sidebar — or drag the panel edge to close it
- **Double-click** any resize handle to snap it back to its default width
- Switch between **Preview Right** and **Preview Bottom** via ☰ → View
- Add new files in the file tree and import them normally — multi-file projects work out of the box
- The URL updates as you edit — copy it to share exactly what you built
