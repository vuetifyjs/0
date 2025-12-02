---
meta:
  title: Pagination
  description: A headless component for creating page navigation with proper ARIA support.
  keywords: pagination, navigation, component, Vue, headless, accessibility
features:
  category: Component
  label: 'P: Pagination'
  github: /components/Pagination/
---

<script setup>
import BasicExample from '@/examples/components/pagination/basic.vue'
import BasicExampleRaw from '@/examples/components/pagination/basic.vue?raw'
</script>

# Pagination

A headless component for creating page navigation with proper ARIA support.

<DocsPageFeatures :frontmatter />

## Usage

The Pagination component provides a compound component pattern for building page navigation interfaces. It uses the [usePagination](/composables/utilities/use-pagination) and [useOverflow](/composables/utilities/use-overflow) composable internally.

<DocsExample file="basic.vue" title="Basic Pagination" :code="BasicExampleRaw">
  <BasicExample />
</DocsExample>

## API

| Composable | Description |
|---|---|
| [usePagination](/composables/utilities/use-pagination) | The underlying composable used by Pagination |
| [useOverflow](/composables/utilities/use-overflow) | Used for responsive auto-sizing of visible page buttons |

### PaginationRoot

The root component that manages pagination state and provides context to child components. Supports responsive auto-sizing based on container width.

- **Props**

  ```ts
  interface PaginationRootProps extends AtomProps {
    namespace?: string
    size?: number
    totalVisible?: number
    itemsPerPage?: number
    ellipsis?: string | false
  }
  ```

  - `as`: Element type to render (default: `'nav'`)
  - `renderless`: If true, renders no wrapper element
  - `namespace`: Namespace for dependency injection (default: `'v0:pagination'`)
  - `size`: Total number of items to paginate
  - `totalVisible`: Maximum number of visible page buttons. If undefined, auto-calculates based on container width
  - `itemsPerPage`: Number of items per page (default: `10`)
  - `ellipsis`: Character used for ellipsis, or `false` to disable ellipsis (default: `'...'`)

- **v-model**

  ```ts
  v-model: number
  ```

  Binds to the current page number (1-indexed).

- **Events**

  | Event | Payload | Description |
  |---|---|---|
  | `update:model-value` | `number` | Emitted when the current page changes |

  **Example:**

  ```vue
  <template>
    <Pagination.Root
      v-model="page"
      :size="200"
      @update:model-value="onPageChange"
    >
      <!-- pagination controls -->
    </Pagination.Root>
  </template>
  ```

- **Slots**

  ```ts
  interface PaginationRootSlots {
    default: (props: {
      ariaLabel: string
      page: number
      size: number
      pages: number
      itemsPerPage: number
      items: PaginationItem[]
      pageStart: number
      pageStop: number
      isFirst: boolean
      isLast: boolean
      first: () => void
      last: () => void
      next: () => void
      prev: () => void
      select: (page: number) => void
    }) => any
  }
  ```

  - `ariaLabel`: Localized label for the navigation region
  - `page`: Current page number (1-indexed)
  - `size`: Total number of items
  - `pages`: Total number of pages (computed from size / itemsPerPage)
  - `itemsPerPage`: Items per page
  - `items`: Array of page items for rendering (includes ellipsis)
  - `pageStart`: Start index of items on current page (0-indexed)
  - `pageStop`: End index of items on current page (exclusive)
  - `isFirst`: Whether on the first page
  - `isLast`: Whether on the last page
  - `first`, `last`, `next`, `prev`, `select`: Navigation methods

### PaginationItem

Individual page number button.

- **Props**

  ```ts
  interface PaginationItemProps extends AtomProps {
    namespace?: string
    value: number
    disabled?: boolean
    id?: string
  }
  ```

  - `as`: Element type to render (default: `'button'`)
  - `renderless`: If true, renders no wrapper element
  - `namespace`: Namespace for retrieving pagination context (default: `'v0:pagination'`)
  - `value`: Page number this item represents (required)
  - `disabled`: Override disabled state
  - `id`: Unique identifier for registration (auto-generated if not provided)

- **Slots**

  ```ts
  interface PaginationItemSlots {
    default: (props: {
      ariaLabel: string
      ariaCurrent: 'page' | undefined
      page: number
      isSelected: boolean
      dataSelected: boolean
      disabled: boolean
      select: () => void
    }) => any
  }
  ```

  - `ariaLabel`: Localized label (changes based on selection state)
  - `ariaCurrent`: `'page'` when selected, `undefined` otherwise
  - `page`: Page number
  - `isSelected`: Whether this page is currently selected
  - `dataSelected`: Same as isSelected (for data attribute binding)
  - `disabled`: Whether this item is disabled
  - `select`: Go to this page

- **Data Attributes**

  | Attribute | Description |
  |---|---|
  | `data-selected` | Present when this page is currently selected |

- **Accessibility**

  - `aria-current="page"` when selected
  - `aria-label` with localized text (e.g., "Go to page 5" or "Page 5, current page")

### PaginationEllipsis

Displays ellipsis to indicate hidden page numbers.

- **Props**

  ```ts
  interface PaginationEllipsisProps extends AtomProps {
    namespace?: string
    ellipsis?: string
    id?: string
  }
  ```

  - `as`: Element type to render (default: `'span'`)
  - `renderless`: If true, renders no wrapper element
  - `namespace`: Namespace for retrieving pagination context (default: `'v0:pagination'`)
  - `ellipsis`: Override the ellipsis character from context
  - `id`: Unique identifier for registration (auto-generated if not provided)

- **Slots**

  ```ts
  interface PaginationEllipsisSlots {
    default: (props: {
      ariaLabel: string
      ariaHidden: string
      ellipsis: string | false
    }) => any
  }
  ```

  - `ariaLabel`: Localized label describing the ellipsis
  - `ariaHidden`: Always `'true'` to hide from screen readers
  - `ellipsis`: The ellipsis character, or `false` if disabled

  Note: When `ellipsis: false` is set on PaginationRoot, no ellipsis items are generated, so this component won't render.

- **Accessibility**

  - `aria-hidden="true"` to hide from screen readers
  - `aria-label` with localized description

### PaginationFirst

Button to navigate to the first page.

- **Props**

  ```ts
  interface PaginationFirstProps extends AtomProps {
    namespace?: string
    disabled?: boolean
    id?: string
  }
  ```

  - `as`: Element type to render (default: `'button'`)
  - `renderless`: If true, renders no wrapper element
  - `namespace`: Namespace for retrieving pagination context (default: `'v0:pagination'`)
  - `disabled`: Override disabled state (defaults to `isFirst`)
  - `id`: Unique identifier for registration (auto-generated if not provided)

- **Slots**

  ```ts
  interface PaginationFirstSlots {
    default: (props: {
      ariaLabel: string
      disabled: boolean
      onClick: () => void
    }) => any
  }
  ```

  - `ariaLabel`: Localized label for the button
  - `disabled`: Whether the button is disabled
  - `onClick`: Go to first page

- **Data Attributes**

  | Attribute | Description |
  |---|---|
  | `data-disabled` | Present when the button is disabled |

- **Accessibility**

  - `aria-label` with localized text (e.g., "Go to first page")
  - `aria-disabled` when disabled

### PaginationPrev

Button to navigate to the previous page.

- **Props**

  ```ts
  interface PaginationPrevProps extends AtomProps {
    namespace?: string
    disabled?: boolean
    id?: string
  }
  ```

  - `as`: Element type to render (default: `'button'`)
  - `renderless`: If true, renders no wrapper element
  - `namespace`: Namespace for retrieving pagination context (default: `'v0:pagination'`)
  - `disabled`: Override disabled state (defaults to `isFirst`)
  - `id`: Unique identifier for registration (auto-generated if not provided)

- **Slots**

  ```ts
  interface PaginationPrevSlots {
    default: (props: {
      ariaLabel: string
      disabled: boolean
      onClick: () => void
    }) => any
  }
  ```

  - `ariaLabel`: Localized label for the button
  - `disabled`: Whether the button is disabled
  - `onClick`: Go to previous page

- **Data Attributes**

  | Attribute | Description |
  |---|---|
  | `data-disabled` | Present when the button is disabled |

- **Accessibility**

  - `aria-label` with localized text (e.g., "Go to previous page")
  - `aria-disabled` when disabled

### PaginationNext

Button to navigate to the next page.

- **Props**

  ```ts
  interface PaginationNextProps extends AtomProps {
    namespace?: string
    disabled?: boolean
    id?: string
  }
  ```

  - `as`: Element type to render (default: `'button'`)
  - `renderless`: If true, renders no wrapper element
  - `namespace`: Namespace for retrieving pagination context (default: `'v0:pagination'`)
  - `disabled`: Override disabled state (defaults to `isLast`)
  - `id`: Unique identifier for registration (auto-generated if not provided)

- **Slots**

  ```ts
  interface PaginationNextSlots {
    default: (props: {
      ariaLabel: string
      disabled: boolean
      onClick: () => void
    }) => any
  }
  ```

  - `ariaLabel`: Localized label for the button
  - `disabled`: Whether the button is disabled
  - `onClick`: Go to next page

- **Data Attributes**

  | Attribute | Description |
  |---|---|
  | `data-disabled` | Present when the button is disabled |

- **Accessibility**

  - `aria-label` with localized text (e.g., "Go to next page")
  - `aria-disabled` when disabled

### PaginationLast

Button to navigate to the last page.

- **Props**

  ```ts
  interface PaginationLastProps extends AtomProps {
    namespace?: string
    disabled?: boolean
    id?: string
  }
  ```

  - `as`: Element type to render (default: `'button'`)
  - `renderless`: If true, renders no wrapper element
  - `namespace`: Namespace for retrieving pagination context (default: `'v0:pagination'`)
  - `disabled`: Override disabled state (defaults to `isLast`)
  - `id`: Unique identifier for registration (auto-generated if not provided)

- **Slots**

  ```ts
  interface PaginationLastSlots {
    default: (props: {
      ariaLabel: string
      disabled: boolean
      onClick: () => void
    }) => any
  }
  ```

  - `ariaLabel`: Localized label for the button
  - `disabled`: Whether the button is disabled
  - `onClick`: Go to last page

- **Data Attributes**

  | Attribute | Description |
  |---|---|
  | `data-disabled` | Present when the button is disabled |

- **Accessibility**

  - `aria-label` with localized text (e.g., "Go to last page")
  - `aria-disabled` when disabled

## Cookbook

Examples of common Pagination structures:

### RouterLink

Use the **as** prop to render pagination items as `RouterLink` components.

```vue
<script lang="ts" setup>
  import { Pagination } from '@vuetify/v0'
  import { RouterLink } from 'vue-router'
</script>

<template>
  <Pagination.Root :size="200" v-slot="{ items }">
    <Pagination.First :as="RouterLink" to="...">«</Pagination.First>

    <Pagination.Prev :as="RouterLink" to="...">‹</Pagination.Prev>

    <template v-for="(item, index) in items" :key="index">
      <Pagination.Ellipsis v-if="item.type === 'ellipsis'" />

      <Pagination.Item
        v-else
        :as="RouterLink"
        :value="item.value"
        to="..."
      >
        {{ item.value }}
      </Pagination.Item>
    </template>

    <Pagination.Next :as="RouterLink" to="...">›</Pagination.Next>

    <Pagination.Last :as="RouterLink" to="...">»</Pagination.Last>
  </Pagination.Root>
</template>
```

### Unordered list

Pagination example with nav, ul, and li elements.

```vue
<script lang="ts" setup>
  import { Pagination } from '@vuetify/v0'
</script>

<template>
  <Pagination.Root :size="200" v-slot="{ items }">
    <ul>
      <li>
        <Pagination.First as="a" href="...">«</Pagination.First>
      </li>

      <li>
        <Pagination.Prev as="a" href="...">‹</Pagination.Prev>
      </li>

      <li v-for="(item, index) in items" :key="index">
        <Pagination.Ellipsis v-if="item.type === 'ellipsis'" />

        <Pagination.Item
          v-else
          as="a"
          :value="item.value"
          href="..."
        >
          {{ item.value }}
        </Pagination.Item>
      </li>

      <li>
        <Pagination.Next as="a" href="...">›</Pagination.Next>
      </li>

      <li>
        <Pagination.Last as="a" href="...">»</Pagination.Last>
      </li>
    </ul>
  </Pagination.Root>
</template>
```
