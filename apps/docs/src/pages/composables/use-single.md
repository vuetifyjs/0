# useSingle

A wrapper around `useGroup` that provides a simplified API for single-selection scenarios with singular selection properties and streamlined selection methods.
    </button>

    <p>Selected: {{ tabSingle.selectedValue }}</p>
  </div>
</template>
```

## API Reference

### `useSingle<T, U>(namespace, options?)`

Creates a single-selection group management system built on top of `useGroup`.

**Generic Parameters:**

| Parameter | Description |
|-----------|-------------|
| `T` | Type extending `SingleTicket` for the context |
| `U` | Type extending `SingleContext` for the context |

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `namespace` | `string` | - | Unique identifier for the group context |
| `options` | `SingleOptions` | `{}` | Configuration options (excludes `multiple`) |

**Returns:**

A tuple containing:
- `useGroupContext`: Function to access group context in child components
- `provideGroupContext`: Function to provide group context to children with model binding
- `singleContext`: The single-selection context object

### SingleOptions

Extends `GroupOptions` but omits the `multiple` property (always `false`).

```typescript
interface SingleOptions extends Omit<GroupOptions, 'multiple'> {}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `mandatory` | `boolean \| 'force'` | `false` | Whether at least one item must be selected |
| `returnObject` | `boolean` | `false` | Whether to return full objects instead of values |

### SingleContext

Extends `GroupContext` with additional singular selection properties:

```typescript
export type SingleContext = GroupContext & {
  selectedId: ComputedRef<ID | undefined>
  selectedItem: ComputedRef<SingleTicket | undefined>
  selectedValue: ComputedRef<unknown>
  select: (id: ID) => void
}
```

| Property | Type | Description |
|----------|------|-------------|
| `selectedId` | `ComputedRef<ID \| undefined>` | ID of the selected item (first from selectedIds) |
| `selectedItem` | `ComputedRef<SingleTicket \| undefined>` | The selected item ticket |
| `selectedValue` | `ComputedRef<unknown>` | Value of the selected item |
| `select` | `(id: ID) => void` | Simplified select function for single ID |

All other properties from `GroupContext` are inherited (including `selectedIds`, `selectedItems`, `selectedValues` for backward compatibility).

### SingleTicket

Extends `GroupTicket` with the same interface:

```typescript
export interface SingleTicket extends GroupTicket {}
```

## Implementation Details

`useSingle` internally uses `useGroup` with `multiple: false` and adds convenience computed properties:

```typescript
export function useSingle<
  Z extends SingleTicket,
  U extends SingleContext,
> (
  namespace: string,
  options?: SingleOptions,
) {
  const [
    useGroupContext,
    provideGroupContext,
    group,
  ] = useGroup<T, U>(namespace, options)

  const selectedId = computed(() => group.selectedIds.values().next().value)
  const selectedItem = computed(() => selectedId.value ? group.registeredItems.get(selectedId.value) : undefined)
  const selectedValue = computed(() => selectedItem.value ? selectedItem.value.value : undefined)

  function select (id: ID) {
    group.select(id)
  }

  const context = {
    ...group,
    selectedId,
    selectedItem,
    selectedValue,
    select,
  } as U

  return [
    useGroupContext,
    function (
      model?: Ref<unknown | unknown[]>,
      _context: U = context,
      app?: App,
    ) {
      provideGroupContext(model, _context, app)

      return _context
    },
    context,
  ] as const
}
```

## Model Binding

Like `useGroup`, `useSingle` supports model binding with automatic synchronization:

```vue
<script setup>
import { useSingle } from 'v0'
import { ref } from 'vue'

const selectedValue = ref('home')

const [useTabSingle, provideTabSingle] = useSingle('tabs', {
  mandatory: true
})

// Bind model to single selection
provideTabSingle(selectedValue)

const group = useTabSingle()
group.register({ value: 'home' })
group.register({ value: 'about' })
group.register({ value: 'contact' })

// selectedValue automatically updates when selection changes
// Selection automatically updates when selectedValue changes
</script>
```

## TypeScript Support

The composable supports generic constraints similar to `useGroup`:

```typescript
import { useSingle } from 'v0'
import type { SingleContext, SingleTicket } from 'v0'

interface CustomSingleContext extends SingleContext {
  getCurrentLabel: () => string
}

export function useCustomSingle() {
  const [useSingle, provideSingle, single] = useSingle<SingleTicket, CustomSingleContext>('custom-single')

  const context: CustomSingleContext = {
    ...single,
    getCurrentLabel() {
      return single.selectedItem.value?.label || 'None'
    }
  }

  return [useSingle, provideSingle, context]
}
```
