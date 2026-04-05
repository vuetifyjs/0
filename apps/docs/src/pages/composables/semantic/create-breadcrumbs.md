---
title: createBreadcrumbs - Breadcrumb Navigation for Vue 3
meta:
- name: description
  content: Breadcrumb navigation composable extending createSingle. Path truncation, depth tracking, and navigation methods for hierarchical trails.
- name: keywords
  content: createBreadcrumbs, breadcrumbs, navigation, composable, Vue 3, createSingle, path truncation
features:
  category: Composable
  label: 'E: createBreadcrumbs'
  github: /composables/createBreadcrumbs/
  level: 2
related:
  - /composables/selection/create-single
  - /composables/data/create-pagination
  - /components/semantic/breadcrumbs
---

# createBreadcrumbs

A composable that extends `createSingle` for breadcrumb navigation with automatic path truncation.

<DocsPageFeatures :frontmatter />

## Usage

The `createBreadcrumbs` composable manages an ordered path of items. When you select an earlier item, everything after it is removed. Use `values()` to iterate the current trail for rendering.

::: example
/composables/create-breadcrumbs/basic
:::

## Architecture

`createBreadcrumbs` extends `createSingle` with path truncation and derived navigation state:

```mermaid "Breadcrumbs Hierarchy"
flowchart TD
  createRegistry --> createSelection
  createSelection --> createSingle
  createSingle --> createBreadcrumbs:::primary
```

The [Breadcrumbs component](/components/semantic/breadcrumbs) consumes `createBreadcrumbs` as its backing model, similar to how `Tabs.Root` uses `createStep`.

## Reactivity

Breadcrumb state is **always reactive**. All derived properties update automatically when items are registered, unregistered, or navigated.

| Property/Method | Reactive | Notes |
| - | :-: | - |
| `depth` | <AppSuccessIcon /> | Ref — count of registered items |
| `isRoot` | <AppSuccessIcon /> | Ref — `depth <= 1` |
| `isEmpty` | <AppSuccessIcon /> | Ref — `depth === 0` |
| `selectedId` | <AppSuccessIcon /> | Computed — current (last) item ID |
| `selectedItem` | <AppSuccessIcon /> | Computed — current item ticket |
| `selectedValue` | <AppSuccessIcon /> | Computed — current item value |
| `selectedIndex` | <AppSuccessIcon /> | Computed — current item position |

> [!TIP] Depth tracking
> Use `depth`, `isRoot`, and `isEmpty` to conditionally render navigation controls like a "Back" button or hide the breadcrumb trail when at the root level.

## Examples

::: example
/composables/create-breadcrumbs/file-explorer/FileExplorer.vue
/composables/create-breadcrumbs/file-explorer/tree.ts

### File Explorer

A file explorer that uses `createBreadcrumbs` to track the user's position in a folder tree. Clicking a folder calls `register()` to push it onto the trail, while clicking a breadcrumb calls `select()` to navigate back — automatically truncating everything after the selected crumb.

**File breakdown:**

| File | Role |
|------|------|
| `file-explorer.vue` | Interactive file browser with breadcrumb navigation and back button |
| `tree.ts` | Typed folder tree data and `FolderNode` interface |

**Key patterns:**

- `FileBreadcrumbTicketInput` extends `BreadcrumbTicketInput<FolderNode>` so `selectedValue` is properly typed — no casting needed
- Each folder node is stored as the ticket's `value`, keeping the breadcrumb trail and folder listing in sync through the registry itself
- `isRoot` controls whether the back button is visible

Drill into **Home > Documents > Projects > v0-app > src** to see the trail grow, then click an earlier crumb to truncate back.

:::

<DocsApi />
