# Anti-Patterns: What NOT to Do

Common mistakes when using v0 and their proper solutions.

## Selection Anti-Patterns

### ❌ Manual Selection Logic
```ts
// BAD - Custom selection state
const selected = ref<string[]>([])
const isSelected = (id: string) => selected.value.includes(id)
const toggle = (id: string) => {
  const index = selected.value.indexOf(id)
  if (index >= 0) {
    selected.value.splice(index, 1)
  } else {
    selected.value.push(id)
  }
}

// Problems:
// - No reactivity optimization
// - No mandatory selection support
// - No proper event handling
// - Manual array manipulation bugs
// - No tri-state support for groups
```

```ts
// GOOD - Use v0 selection composables
const selection = createSelection({ multiple: true })
selection.toggle(id) // Handles all the complexity
```

### ❌ Custom Single Selection
```ts
// BAD - Manual single selection
const active = ref<string | null>(null)
const select = (id: string) => {
  active.value = active.value === id ? null : id
}

// Problems:
// - No mandatory selection support
// - Manual deselection logic
// - No registration system
// - No proper change events
```

```ts
// GOOD - Use createSingle
const single = createSingle({ mandatory: 'force' })
single.select(id) // Handles mandatory logic
```

### ❌ Array-Based Group Selection
```ts
// BAD - Manual tri-state logic
const selected = ref<string[]>([])
const allIds = computed(() => items.value.map(item => item.id))

const isAllSelected = computed(() => 
  selected.value.length === allIds.value.length
)
const isSomeSelected = computed(() => 
  selected.value.length > 0 && selected.value.length < allIds.value.length
)

const toggleAll = () => {
  if (isAllSelected.value) {
    selected.value = []
  } else {
    selected.value = [...allIds.value]
  }
}

// Problems:
// - Complex tri-state logic
// - Manual "select all" implementation
// - No proper indeterminate state
// - Performance issues with large lists
```

```ts
// GOOD - Use createGroup
const group = createGroup()
group.toggleAll() // Perfect tri-state handling
```

## Context Anti-Patterns

### ❌ Manual Provide/Inject
```ts
// BAD - Unsafe provide/inject
provide('theme', themeState)

// In child component
const theme = inject('theme') // Could be undefined!

// Problems:
// - No type safety
// - Silent failures if provider missing
// - No helpful error messages
// - Hard to debug injection chains
```

```ts
// GOOD - Type-safe context
const [useTheme, provideTheme] = createContext<ThemeState>('Theme')

// Provider
provideTheme(themeState)

// Consumer - throws descriptive error if missing
const theme = useTheme() // Always defined, type-safe
```

### ❌ Global State Instead of Context
```ts
// BAD - Global singletons
const globalTheme = reactive({ mode: 'light' })

// Problems:
// - No isolation between app instances
// - Breaks SSR
// - Hard to test
// - No proper provider hierarchy
```

```ts
// GOOD - Proper context hierarchy
const [useTheme, provideTheme] = createContext<Theme>('Theme')
// Each provider creates isolated scope
```

## Form Anti-Patterns

### ❌ Manual Form Validation
```ts
// BAD - Custom validation logic
const email = ref('')
const emailError = ref('')

const validateEmail = () => {
  if (!email.value) {
    emailError.value = 'Required'
    return false
  }
  if (!email.value.includes('@')) {
    emailError.value = 'Invalid email'
    return false
  }
  emailError.value = ''
  return true
}

// Problems:
// - Manual error state management
// - No async validation support
// - No field registration
// - No form-level validation
// - Repetitive validation logic
```

```ts
// GOOD - Use createForm
const form = createForm()

form.register({
  id: 'email',
  value: '',
  rules: [
    v => !!v || 'Required',
    v => v.includes('@') || 'Invalid email',
    async v => await checkAvailable(v) || 'Email taken'
  ]
})
```

## Browser Anti-Patterns

### ❌ Manual SSR Checks
```ts
// BAD - Unsafe environment detection
if (typeof window !== 'undefined') {
  // Browser-only code
}

// Problems:
// - Not tree-shakeable
// - Verbose
// - Easy to get wrong
// - No hydration considerations
```

```ts
// GOOD - Use provided constants
import { IN_BROWSER } from '@vuetify/v0/constants'

if (IN_BROWSER) {
  // Browser-only code
}
```

### ❌ Manual DOM Observers
```ts
// BAD - Manual ResizeObserver
const observer = new ResizeObserver(entries => {
  // Handle resize
})

onMounted(() => {
  if (elementRef.value) {
    observer.observe(elementRef.value)
  }
})

onUnmounted(() => {
  observer.disconnect()
})

// Problems:
// - Manual lifecycle management
// - Memory leaks if cleanup forgotten
// - No SSR safety
// - Repetitive setup code
```

```ts
// GOOD - Use composable
const { width, height } = useResizeObserver(elementRef)
// Auto-cleanup on unmount
```

### ❌ Manual Event Listeners
```ts
// BAD - Manual event management
const handleResize = () => {
  // Handle resize
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// Problems:
// - Manual cleanup required
// - Memory leaks possible
// - No passive/capture options
// - Repetitive lifecycle code
```

```ts
// GOOD - Auto-cleanup events
useEventListener(window, 'resize', handleResize)
// Automatically removed on unmount
```

## Registry Anti-Patterns

### ❌ Manual Collection Management
```ts
// BAD - Manual item tracking
const items = ref(new Map<string, Item>())

const register = (item: Item) => {
  items.value.set(item.id, item)
}

const unregister = (id: string) => {
  items.value.delete(id)
}

// Problems:
// - Manual lifecycle management
// - No automatic cleanup
// - No lifecycle events
// - No type safety
```

```ts
// GOOD - Use registry
const registry = createRegistry<Item>()

// Auto-cleanup on component unmount
registry.register({ id: 'item1', value: item })
```

## Performance Anti-Patterns

### ❌ Recreating Composables
```ts
// BAD - Creating composables inside computed/watch
const computed(() => {
  const selection = createSelection() // New instance every time!
  return selection.selected.value
})

// Problems:
// - Creates new instances on every computation
// - Loses previous state
// - Memory leaks
// - Poor performance
```

```ts
// GOOD - Create once, use many times
const selection = createSelection()
const selectedCount = computed(() => selection.selected.value.size)
```

### ❌ Not Using Provided Utilities
```ts
// BAD - Manual deep merge
const mergeObjects = (target: any, source: any) => {
  for (const key in source) {
    if (typeof source[key] === 'object' && source[key] !== null) {
      target[key] = target[key] || {}
      mergeObjects(target[key], source[key])
    } else {
      target[key] = source[key]
    }
  }
  return target
}

// Problems:
// - Not prototype-pollution safe
// - Doesn't handle edge cases
// - Poor performance
// - Reinventing the wheel
```

```ts
// GOOD - Use provided utility
import { mergeDeep } from '@vuetify/v0/utilities'
const result = mergeDeep(target, source) // Safe & optimized
```

## Component Anti-Patterns

### ❌ Overriding Component Structure
```ts
// BAD - Breaking compound component patterns
<Tabs.Root>
  <div class="my-custom-wrapper">
    <Tabs.List>
      <!-- This breaks the component relationship -->
    </Tabs.List>
  </div>
</Tabs.Root>

// Problems:
// - Breaks ARIA relationships
// - Loses keyboard navigation
// - Breaks focus management
// - Accessibility issues
```

```ts
// GOOD - Follow component structure
<Tabs.Root>
  <Tabs.List class="my-custom-styles">
    <!-- Keep proper structure, add styling -->
  </Tabs.List>
</Tabs.Root>
```

### ❌ Not Using Provided Slots
```ts
// BAD - Recreating component functionality
<div class="my-dialog" v-if="open">
  <div class="backdrop" @click="close"></div>
  <div class="content">
    <!-- Manual dialog implementation -->
  </div>
</div>

// Problems:
// - No focus trap
// - No ARIA attributes
// - No keyboard handling
// - No portal rendering
// - Accessibility issues
```

```ts
// GOOD - Use provided component
<Dialog.Root v-model="open">
  <Dialog.Content>
    <!-- Proper accessibility & focus management -->
  </Dialog.Content>
</Dialog.Root>
```

## Migration Strategy

When refactoring existing code:

1. **Identify patterns** - Look for manual state management
2. **Find v0 equivalent** - Check decision tree in main skill
3. **Replace incrementally** - Don't change everything at once
4. **Test thoroughly** - Ensure behavior is preserved
5. **Remove old code** - Clean up manual implementations

## Quick Fixes

### Find and Replace Patterns

```bash
# Find manual selection arrays
grep -r "ref<.*\[\]>" --include="*.vue" --include="*.ts"

# Find manual provide/inject  
grep -r "inject(" --include="*.vue" --include="*.ts"

# Find window checks
grep -r "typeof window" --include="*.vue" --include="*.ts"
```

Use the pattern checker script to identify anti-patterns:
```bash
python scripts/check_patterns.py ./src
```