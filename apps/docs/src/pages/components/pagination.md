---
title: Pagination Component
meta:
- name: description
  content: A headless component for creating page navigation with proper ARIA support.
- name: keywords
  content: pagination, navigation, component, Vue, headless, accessibility
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

## Anatomy

```vue
<script lang="ts" setup>
  import { Pagination } from '@vuetify/v0'
</script>

<template>
  <Pagination.Root v-slot="{ items }">
    <Pagination.First />

    <Pagination.Prev />

    <template v-for="(item, index) in items" :key="index">
      <Pagination.Ellipsis v-if="item.type === 'ellipsis'" />

      <Pagination.Item v-else :value="item.value" />
    </template>

    <Pagination.Next />

    <Pagination.Last />
  </Pagination.Root>
</template>
```

> For responsive sizing to work accurately, **all pagination buttons must have the same width**. The component measures a sample button and uses that width to calculate how many buttons fit. If buttons have variable widths (e.g., single-digit "1" vs double-digit "50"), the calculation will be inaccurate and items may overflow or leave excess space.

## API

| Composable | Description |
|---|---|
| [useOverflow](/composables/utilities/use-overflow) | Used for responsive auto-sizing of visible page buttons |
| [usePagination](/composables/utilities/use-pagination) | The underlying composable used by Pagination |

### PaginationRoot

The root component that manages pagination state and provides context to child components. Supports responsive auto-sizing based on container width.

- **Props**

  Extends `AtomProps`:

  ```ts
  interface PaginationRootProps extends AtomProps {
    as?: DOMElement | null
    renderless?: boolean
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

- **Slot Props**

  ```ts
  interface PaginationRootSlotProps {
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
    attrs: {
      'aria-label': string
    }
  }
  ```

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
  - `attrs`: Object containing attributes to bind to the root element

### PaginationItem

Individual page number button.

- **Props**

  Extends `AtomProps`:

  ```ts
  interface PaginationItemProps extends AtomProps {
    as?: DOMElement | null
    renderless?: boolean
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

- **Slot Props**

  ```ts
  interface PaginationItemSlotProps {
    page: number
    isSelected: boolean
    isDisabled: boolean
    select: () => void
    attrs: {
      'aria-label': string
      'aria-current': 'page' | undefined
      'data-selected': true | undefined
      'data-disabled': true | undefined
      'disabled': boolean | undefined
      'type': 'button' | undefined
      'onClick': () => void
    }
  }
  ```

  - `page`: Page number
  - `isSelected`: Whether this page is currently selected
  - `isDisabled`: Whether this item is disabled
  - `select`: Go to this page
  - `attrs`: Object containing all bindable attributes including ARIA attributes and event handlers

- **Data Attributes**

  | Attribute | Description |
  |---|---|
  | `data-selected` | Present when this page is currently selected |
  | `data-disabled` | Present when this item is disabled |

- **Accessibility**

  - `aria-current="page"` when selected
  - `aria-label` with localized text (e.g., "Go to page 5" or "Page 5, current page")

- **Example**

  ```vue
  <script lang="ts" setup>
    import { Pagination } from '@vuetify/v0'
  </script>

  <template>
    <!-- Simple usage -->
    <Pagination.Item :value="1">1</Pagination.Item>

    <!-- With slot props -->
    <Pagination.Item :value="2" v-slot="{ isSelected }">
      <span :class="{ 'font-bold': isSelected }">2</span>
    </Pagination.Item>

    <!-- With data attributes for styling -->
    <Pagination.Item
      :value="3"
      class="data-[selected]:bg-blue-500 data-[selected]:text-white"
    >
      3
    </Pagination.Item>

    <!-- Renderless mode with attrs spread -->
    <Pagination.Item :value="4" renderless v-slot="{ attrs }">
      <MyCustomButton v-bind="attrs">4</MyCustomButton>
    </Pagination.Item>
  </template>
  ```

### PaginationEllipsis

Displays ellipsis to indicate hidden page numbers.

- **Props**

  Extends `AtomProps`:

  ```ts
  interface PaginationEllipsisProps extends AtomProps {
    as?: DOMElement | null
    renderless?: boolean
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

- **Slot Props**

  ```ts
  interface PaginationEllipsisSlotProps {
    ellipsis: string | false
    attrs: {
      'aria-hidden': 'true'
    }
  }
  ```

  - `ellipsis`: The ellipsis character, or `false` if disabled
  - `attrs`: Object containing attributes to bind to the element

  Note: When `ellipsis: false` is set on PaginationRoot, no ellipsis items are generated, so this component won't render.

- **Accessibility**

  - `aria-hidden="true"` to hide from screen readers

- **Example**

  ```vue
  <script lang="ts" setup>
    import { Pagination } from '@vuetify/v0'
  </script>

  <template>
    <!-- Uses default "..." from Root -->
    <Pagination.Ellipsis />

    <!-- Override ellipsis character -->
    <Pagination.Ellipsis ellipsis="…" />

    <!-- Custom rendering with slot props -->
    <Pagination.Ellipsis v-slot="{ ellipsis, attrs }">
      <span v-bind="attrs" class="px-2">{{ ellipsis }}</span>
    </Pagination.Ellipsis>
  </template>
  ```

### PaginationFirst

Button to navigate to the first page.

- **Props**

  Extends `AtomProps`:

  ```ts
  interface PaginationFirstProps extends AtomProps {
    as?: DOMElement | null
    renderless?: boolean
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

- **Slot Props**

  ```ts
  interface PaginationFirstSlotProps {
    isDisabled: boolean
    first: () => void
    attrs: {
      'aria-label': string
      'aria-disabled': boolean | undefined
      'data-disabled': true | undefined
      'disabled': boolean | undefined
      'type': 'button' | undefined
      'onClick': () => void
    }
  }
  ```

  - `isDisabled`: Whether the button is disabled
  - `first`: Go to first page
  - `attrs`: Object containing all bindable attributes including ARIA attributes and event handlers

- **Data Attributes**

  | Attribute | Description |
  |---|---|
  | `data-disabled` | Present when the button is disabled |

- **Accessibility**

  - `aria-label` with localized text (e.g., "Go to first page")
  - `aria-disabled` when disabled (for non-button elements)
  - Native `disabled` attribute for button elements

- **Example**

  ```vue
  <script lang="ts" setup>
    import { Pagination } from '@vuetify/v0'
  </script>

  <template>
    <!-- Simple usage -->
    <Pagination.First>«</Pagination.First>

    <!-- With slot props -->
    <Pagination.First v-slot="{ isDisabled }">
      <span :class="{ 'opacity-50': isDisabled }">«</span>
    </Pagination.First>

    <!-- With data attributes for styling -->
    <Pagination.First class="data-[disabled]:opacity-50">
      First
    </Pagination.First>

    <!-- Renderless mode with attrs spread -->
    <Pagination.First renderless v-slot="{ attrs }">
      <MyCustomButton v-bind="attrs">«</MyCustomButton>
    </Pagination.First>
  </template>
  ```

### PaginationPrev

Button to navigate to the previous page.

- **Props**

  Extends `AtomProps`:

  ```ts
  interface PaginationPrevProps extends AtomProps {
    as?: DOMElement | null
    renderless?: boolean
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

- **Slot Props**

  ```ts
  interface PaginationPrevSlotProps {
    isDisabled: boolean
    prev: () => void
    attrs: {
      'aria-label': string
      'aria-disabled': boolean | undefined
      'data-disabled': true | undefined
      'disabled': boolean | undefined
      'type': 'button' | undefined
      'onClick': () => void
    }
  }
  ```

  - `isDisabled`: Whether the button is disabled
  - `prev`: Go to previous page
  - `attrs`: Object containing all bindable attributes including ARIA attributes and event handlers

- **Data Attributes**

  | Attribute | Description |
  |---|---|
  | `data-disabled` | Present when the button is disabled |

- **Accessibility**

  - `aria-label` with localized text (e.g., "Go to previous page")
  - `aria-disabled` when disabled (for non-button elements)
  - Native `disabled` attribute for button elements

- **Example**

  ```vue
  <script lang="ts" setup>
    import { Pagination } from '@vuetify/v0'
  </script>

  <template>
    <!-- Simple usage -->
    <Pagination.Prev>‹</Pagination.Prev>

    <!-- With slot props -->
    <Pagination.Prev v-slot="{ isDisabled }">
      <span :class="{ 'opacity-50': isDisabled }">‹</span>
    </Pagination.Prev>

    <!-- With data attributes for styling -->
    <Pagination.Prev class="data-[disabled]:opacity-50">
      Prev
    </Pagination.Prev>

    <!-- Renderless mode with attrs spread -->
    <Pagination.Prev renderless v-slot="{ attrs }">
      <MyCustomButton v-bind="attrs">‹</MyCustomButton>
    </Pagination.Prev>
  </template>
  ```

### PaginationNext

Button to navigate to the next page.

- **Props**

  Extends `AtomProps`:

  ```ts
  interface PaginationNextProps extends AtomProps {
    as?: DOMElement | null
    renderless?: boolean
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

- **Slot Props**

  ```ts
  interface PaginationNextSlotProps {
    isDisabled: boolean
    next: () => void
    attrs: {
      'aria-label': string
      'aria-disabled': boolean | undefined
      'data-disabled': true | undefined
      'disabled': boolean | undefined
      'type': 'button' | undefined
      'onClick': () => void
    }
  }
  ```

  - `isDisabled`: Whether the button is disabled
  - `next`: Go to next page
  - `attrs`: Object containing all bindable attributes including ARIA attributes and event handlers

- **Data Attributes**

  | Attribute | Description |
  |---|---|
  | `data-disabled` | Present when the button is disabled |

- **Accessibility**

  - `aria-label` with localized text (e.g., "Go to next page")
  - `aria-disabled` when disabled (for non-button elements)
  - Native `disabled` attribute for button elements

- **Example**

  ```vue
  <script lang="ts" setup>
    import { Pagination } from '@vuetify/v0'
  </script>

  <template>
    <!-- Simple usage -->
    <Pagination.Next>›</Pagination.Next>

    <!-- With slot props -->
    <Pagination.Next v-slot="{ isDisabled }">
      <span :class="{ 'opacity-50': isDisabled }">›</span>
    </Pagination.Next>

    <!-- With data attributes for styling -->
    <Pagination.Next class="data-[disabled]:opacity-50">
      Next
    </Pagination.Next>

    <!-- Renderless mode with attrs spread -->
    <Pagination.Next renderless v-slot="{ attrs }">
      <MyCustomButton v-bind="attrs">›</MyCustomButton>
    </Pagination.Next>
  </template>
  ```

### PaginationLast

Button to navigate to the last page.

- **Props**

  Extends `AtomProps`:

  ```ts
  interface PaginationLastProps extends AtomProps {
    as?: DOMElement | null
    renderless?: boolean
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

- **Slot Props**

  ```ts
  interface PaginationLastSlotProps {
    isDisabled: boolean
    last: () => void
    attrs: {
      'aria-label': string
      'aria-disabled': boolean | undefined
      'data-disabled': true | undefined
      'disabled': boolean | undefined
      'type': 'button' | undefined
      'onClick': () => void
    }
  }
  ```

  - `isDisabled`: Whether the button is disabled
  - `last`: Go to last page
  - `attrs`: Object containing all bindable attributes including ARIA attributes and event handlers

- **Data Attributes**

  | Attribute | Description |
  |---|---|
  | `data-disabled` | Present when the button is disabled |

- **Accessibility**

  - `aria-label` with localized text (e.g., "Go to last page")
  - `aria-disabled` when disabled (for non-button elements)
  - Native `disabled` attribute for button elements

- **Example**

  ```vue
  <script lang="ts" setup>
    import { Pagination } from '@vuetify/v0'
  </script>

  <template>
    <!-- Simple usage -->
    <Pagination.Last>»</Pagination.Last>

    <!-- With slot props -->
    <Pagination.Last v-slot="{ isDisabled }">
      <span :class="{ 'opacity-50': isDisabled }">»</span>
    </Pagination.Last>

    <!-- With data attributes for styling -->
    <Pagination.Last class="data-[disabled]:opacity-50">
      Last
    </Pagination.Last>

    <!-- Renderless mode with attrs spread -->
    <Pagination.Last renderless v-slot="{ attrs }">
      <MyCustomButton v-bind="attrs">»</MyCustomButton>
    </Pagination.Last>
  </template>
  ```
## Recipes

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
