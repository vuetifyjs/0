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

The Pagination component provides a compound component pattern for building page navigation interfaces. It uses the `usePagination` composable internally and provides full v-model support with automatic state synchronization.

<DocsExample file="basic.vue" title="Basic Pagination" :code="BasicExampleRaw">
  <BasicExample />
</DocsExample>

## API

| Composable | Description |
|---|---|
| [usePagination](/composables/utilities/use-pagination) | The underlying composable used by Pagination |

### PaginationRoot

The root component that manages pagination state and provides context to child components.

- **Props**

  ```ts
  interface PaginationRootProps {
    namespace?: string
    size?: MaybeRefOrGetter<number>
    visible?: MaybeRefOrGetter<number>
    itemsPerPage?: MaybeRefOrGetter<number>
    ellipsis?: string
  }
  ```

  - `namespace`: Namespace for dependency injection (default: `'v0:pagination'`)
  - `size`: Total number of items to paginate
  - `visible`: Maximum number of visible page buttons (default: `5`)
  - `itemsPerPage`: Number of items per page (default: `10`)
  - `ellipsis`: Character used for ellipsis (default: `'…'`)

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
      :size="totalItems"
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
      goto: (page: number) => void
    }) => any
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
  - `first`, `last`, `next`, `prev`, `goto`: Navigation methods

### PaginationContent

Container for rendering page items. Provides access to the `items` array for custom rendering.

- **Props**

  ```ts
  interface PaginationContentProps extends AtomProps {
    namespace?: string
  }
  ```

  - `as`: Element type to render (default: `'div'`)
  - `renderless`: If true, renders no wrapper element
  - `namespace`: Namespace for retrieving pagination context (default: `'v0:pagination'`)

- **Slots**

  ```ts
  interface PaginationContentSlots {
    default: (props: {
      items: PaginationItem[]
    }) => any
  }
  ```

  The `items` array contains objects with `type` (`'page'` or `'ellipsis'`) and `value` properties.

- **Example**

  ```vue
  <Pagination.Content v-slot="{ items }">
    <template v-for="(item, index) in items" :key="index">
      <Pagination.Ellipsis v-if="item.type === 'ellipsis'" />
      <Pagination.Item v-else :value="item.value">
        {{ item.value }}
      </Pagination.Item>
    </template>
  </Pagination.Content>
  ```

### PaginationItem

Individual page number button.

- **Props**

  ```ts
  interface PaginationItemProps extends AtomProps {
    namespace?: string
    value: number
    disabled?: boolean
  }
  ```

  - `as`: Element type to render (default: `'button'`)
  - `renderless`: If true, renders no wrapper element
  - `namespace`: Namespace for retrieving pagination context (default: `'v0:pagination'`)
  - `value`: Page number this item represents (required)
  - `disabled`: Override disabled state

- **Slots**

  ```ts
  interface PaginationItemSlots {
    default: (props: {
      page: number
      isSelected: boolean
      disabled: boolean
      goto: () => void
    }) => any
  }
  ```

- **Data Attributes**

  | Attribute | Description |
  |---|---|
  | `data-selected` | Present when this page is currently selected |

- **Accessibility**

  - `aria-current="page"` when selected
  - `aria-disabled` when disabled

### PaginationEllipsis

Displays ellipsis to indicate hidden page numbers.

- **Props**

  ```ts
  interface PaginationEllipsisProps extends AtomProps {
    namespace?: string
    ellipsis?: string
  }
  ```

  - `as`: Element type to render (default: `'span'`)
  - `renderless`: If true, renders no wrapper element
  - `namespace`: Namespace for retrieving pagination context (default: `'v0:pagination'`)
  - `ellipsis`: Override the ellipsis character from context

- **Slots**

  ```ts
  interface PaginationEllipsisSlots {
    default: (props: {
      ellipsis: string
    }) => any
  }
  ```

- **Accessibility**

  - `aria-hidden="true"` to hide from screen readers

### PaginationFirst

Button to navigate to the first page.

- **Props**

  ```ts
  interface PaginationFirstProps extends AtomProps {
    namespace?: string
    disabled?: boolean
  }
  ```

  - `as`: Element type to render (default: `'button'`)
  - `renderless`: If true, renders no wrapper element
  - `namespace`: Namespace for retrieving pagination context (default: `'v0:pagination'`)
  - `disabled`: Override disabled state (defaults to `isFirst`)

- **Slots**

  ```ts
  interface PaginationFirstSlots {
    default: (props: {
      disabled: boolean
      goto: () => void
    }) => any
  }
  ```

- **Data Attributes**

  | Attribute | Description |
  |---|---|
  | `data-disabled` | Present when the button is disabled |

- **Accessibility**

  - `aria-label="Go to first page"`
  - `aria-disabled` when disabled

### PaginationPrev

Button to navigate to the previous page.

- **Props**

  ```ts
  interface PaginationPrevProps extends AtomProps {
    namespace?: string
    disabled?: boolean
  }
  ```

  - `as`: Element type to render (default: `'button'`)
  - `renderless`: If true, renders no wrapper element
  - `namespace`: Namespace for retrieving pagination context (default: `'v0:pagination'`)
  - `disabled`: Override disabled state (defaults to `isFirst`)

- **Slots**

  ```ts
  interface PaginationPrevSlots {
    default: (props: {
      disabled: boolean
      goto: () => void
    }) => any
  }
  ```

- **Data Attributes**

  | Attribute | Description |
  |---|---|
  | `data-disabled` | Present when the button is disabled |

- **Accessibility**

  - `aria-label="Go to previous page"`
  - `aria-disabled` when disabled

### PaginationNext

Button to navigate to the next page.

- **Props**

  ```ts
  interface PaginationNextProps extends AtomProps {
    namespace?: string
    disabled?: boolean
  }
  ```

  - `as`: Element type to render (default: `'button'`)
  - `renderless`: If true, renders no wrapper element
  - `namespace`: Namespace for retrieving pagination context (default: `'v0:pagination'`)
  - `disabled`: Override disabled state (defaults to `isLast`)

- **Slots**

  ```ts
  interface PaginationNextSlots {
    default: (props: {
      disabled: boolean
      goto: () => void
    }) => any
  }
  ```

- **Data Attributes**

  | Attribute | Description |
  |---|---|
  | `data-disabled` | Present when the button is disabled |

- **Accessibility**

  - `aria-label="Go to next page"`
  - `aria-disabled` when disabled

### PaginationLast

Button to navigate to the last page.

- **Props**

  ```ts
  interface PaginationLastProps extends AtomProps {
    namespace?: string
    disabled?: boolean
  }
  ```

  - `as`: Element type to render (default: `'button'`)
  - `renderless`: If true, renders no wrapper element
  - `namespace`: Namespace for retrieving pagination context (default: `'v0:pagination'`)
  - `disabled`: Override disabled state (defaults to `isLast`)

- **Slots**

  ```ts
  interface PaginationLastSlots {
    default: (props: {
      disabled: boolean
      goto: () => void
    }) => any
  }
  ```

- **Data Attributes**

  | Attribute | Description |
  |---|---|
  | `data-disabled` | Present when the button is disabled |

- **Accessibility**

  - `aria-label="Go to last page"`
  - `aria-disabled` when disabled
