#!/usr/bin/env python3
"""
V0 Pattern Scaffolder

Generates common v0 composable patterns with proper TypeScript types and examples.
"""

import os
import argparse
from pathlib import Path
from typing import Dict

class PatternScaffolder:
    def __init__(self):
        self.patterns = {
            'selection': self._generate_selection,
            'form': self._generate_form,
            'context': self._generate_context,
            'registry': self._generate_registry,
            'component': self._generate_component
        }
    
    def scaffold(self, pattern_type: str, output_path: str, **kwargs):
        """Generate the specified pattern."""
        if pattern_type not in self.patterns:
            raise ValueError(f"Unknown pattern type: {pattern_type}")
        
        generator = self.patterns[pattern_type]
        code = generator(**kwargs)
        
        # Create output file
        output_file = Path(output_path)
        output_file.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_file, 'w') as f:
            f.write(code)
        
        print(f"✅ Generated {pattern_type} pattern: {output_file}")
    
    def _generate_selection(self, selection_type="multi", name="useSelection", **kwargs):
        """Generate selection composable patterns."""
        
        if selection_type == "single":
            return f'''import {{ createSingle }} from '@vuetify/v0/composables'
import {{ ref, computed }} from 'vue'

export interface {name.replace('use', '')}Item {{
  id: string
  value: any
  disabled?: boolean
}}

export function {name}<T = any>() {{
  const single = createSingle({{ mandatory: 'force' }})
  
  const register = (item: {name.replace('use', '')}Item) => {{
    single.register(item)
  }}
  
  const select = (id: string) => {{
    single.select(id)
  }}
  
  const selectedItem = computed(() => {{
    const selectedId = Array.from(single.selected.value)[0]
    return single.items.value.get(selectedId)
  }})
  
  return {{
    // State
    selected: single.selected,
    selectedValue: single.selectedValue,
    selectedItem,
    
    // Actions
    register,
    select,
    isSelected: single.isSelected,
    
    // Utils
    clear: single.clear,
    items: single.items
  }}
}}

// Usage example:
// const selection = {name}()
// selection.register({{ id: 'option1', value: 'Option 1' }})
// selection.select('option1')
'''
        
        elif selection_type == "multi":
            return f'''import {{ createSelection }} from '@vuetify/v0/composables'
import {{ computed }} from 'vue'

export interface {name.replace('use', '')}Item {{
  id: string
  value: any
  disabled?: boolean
}}

export function {name}<T = any>() {{
  const selection = createSelection({{ multiple: true }})
  
  const register = (item: {name.replace('use', '')}Item) => {{
    selection.register(item)
  }}
  
  const toggle = (id: string) => {{
    selection.toggle(id)
  }}
  
  const selectedItems = computed(() => {{
    return Array.from(selection.selected.value)
      .map(id => selection.items.value.get(id))
      .filter(Boolean)
  }})
  
  const selectedCount = computed(() => selection.selected.value.size)
  
  return {{
    // State
    selected: selection.selected,
    selectedItems,
    selectedCount,
    
    // Actions  
    register,
    toggle,
    select: selection.select,
    deselect: selection.deselect,
    isSelected: selection.isSelected,
    
    // Utils
    clear: selection.clear,
    items: selection.items
  }}
}}

// Usage example:
// const selection = {name}()
// selection.register({{ id: 'item1', value: 'Item 1' }})
// selection.toggle('item1')
'''
        
        elif selection_type == "group":
            return f'''import {{ createGroup }} from '@vuetify/v0/composables'
import {{ computed }} from 'vue'

export interface {name.replace('use', '')}Item {{
  id: string
  value: any
  disabled?: boolean
}}

export function {name}<T = any>() {{
  const group = createGroup()
  
  const register = (item: {name.replace('use', '')}Item) => {{
    group.register(item)
  }}
  
  const selectedItems = computed(() => {{
    return Array.from(group.selected.value)
      .map(id => group.items.value.get(id))
      .filter(Boolean)
  }})
  
  return {{
    // State
    selected: group.selected,
    selectedItems,
    isEmpty: group.isEmpty,
    isAll: group.isAll,
    isMixed: group.isMixed,
    
    // Actions
    register,
    toggle: group.toggle,
    select: group.select,
    deselect: group.deselect,
    selectAll: group.selectAll,
    deselectAll: group.deselectAll,
    toggleAll: group.toggleAll,
    isSelected: group.isSelected,
    
    // Utils
    clear: group.clear,
    items: group.items
  }}
}}

// Usage example:
// const group = {name}()
// group.register({{ id: 'item1', value: 'Item 1' }})
// group.selectAll() // Select all registered items
'''
    
    def _generate_form(self, name="useForm", **kwargs):
        """Generate form validation composable."""
        return f'''import {{ createForm }} from '@vuetify/v0/composables'
import {{ computed }} from 'vue'

export interface {name.replace('use', '')}Field {{
  id: string
  value: any
  rules?: Array<(value: any) => boolean | string | Promise<boolean | string>>
  disabled?: boolean
}}

export function {name}() {{
  const form = createForm()
  
  const registerField = (field: {name.replace('use', '')}Field) => {{
    form.register(field)
  }}
  
  const getFieldError = (id: string) => {{
    const field = form.fields.value.get(id)
    return field?.errorMessage || null
  }}
  
  const isFieldValid = (id: string) => {{
    const field = form.fields.value.get(id)
    return field?.isValid ?? true
  }}
  
  const updateField = (id: string, value: any) => {{
    const field = form.fields.value.get(id)
    if (field) {{
      field.value = value
    }}
  }}
  
  const validateField = async (id: string) => {{
    const field = form.fields.value.get(id)
    if (field) {{
      await field.validate()
    }}
  }}
  
  return {{
    // State
    isValid: form.isValid,
    errors: form.errors,
    fields: form.fields,
    
    // Actions
    registerField,
    updateField,
    validateField,
    validate: form.validate,
    reset: form.reset,
    submit: form.submit,
    
    // Utils
    getFieldError,
    isFieldValid
  }}
}}

// Usage example:
// const form = {name}()
// form.registerField({{
//   id: 'email',
//   value: '',
//   rules: [
//     v => !!v || 'Email required',
//     v => /.+@.+/.test(v) || 'Invalid email'
//   ]
// }})
'''
    
    def _generate_context(self, name="useAppContext", **kwargs):
        """Generate context composable.""" 
        context_name = name.replace('use', '').replace('Context', '')
        
        return f'''import {{ createContext }} from '@vuetify/v0/composables'

export interface {context_name}State {{
  // Define your context state here
  theme: 'light' | 'dark'
  user: {{ id: string, name: string }} | null
  settings: Record<string, any>
}}

export interface {context_name}Actions {{
  // Define your context actions here
  setTheme: (theme: 'light' | 'dark') => void
  login: (user: {{ id: string, name: string }}) => void
  logout: () => void
  updateSettings: (settings: Record<string, any>) => void
}}

export type {context_name}Context = {context_name}State & {context_name}Actions

// Create the context hooks
export const [use{context_name}, provide{context_name}] = 
  createContext<{context_name}Context>('{context_name}')

// Example provider setup function
export function create{context_name}Provider(): {context_name}Context {{
  const state = reactive<{context_name}State>({{
    theme: 'light',
    user: null,
    settings: {{}}
  }})
  
  const setTheme = (theme: 'light' | 'dark') => {{
    state.theme = theme
  }}
  
  const login = (user: {{ id: string, name: string }}) => {{
    state.user = user
  }}
  
  const logout = () => {{
    state.user = null
  }}
  
  const updateSettings = (settings: Record<string, any>) => {{
    state.settings = {{ ...state.settings, ...settings }}
  }}
  
  return {{
    ...toRefs(state),
    setTheme,
    login,
    logout,
    updateSettings
  }}
}}

// Usage example:
// // In parent component:
// const context = create{context_name}Provider()
// provide{context_name}(context)
//
// // In child component:
// const {{ theme, setTheme }} = use{context_name}()
'''
    
    def _generate_registry(self, name="useRegistry", **kwargs):
        """Generate registry composable."""
        return f'''import {{ createRegistry }} from '@vuetify/v0/composables'
import {{ computed }} from 'vue'

export interface {name.replace('use', '')}Item {{
  id: string
  value: any
  metadata?: Record<string, any>
}}

export function {name}<T = any>() {{
  const registry = createRegistry<T>()
  
  const register = (item: {name.replace('use', '')}Item) => {{
    registry.register(item)
  }}
  
  const itemsArray = computed(() => {{
    return Array.from(registry.items.value.values())
  }})
  
  const getItem = (id: string) => {{
    return registry.items.value.get(id)
  }}
  
  const hasItem = (id: string) => {{
    return registry.items.value.has(id)
  }}
  
  return {{
    // State
    items: registry.items,
    itemsArray,
    
    // Actions
    register,
    unregister: registry.unregister,
    
    // Utils
    getItem,
    hasItem,
    clear: registry.clear
  }}
}}

// Usage example:
// const registry = {name}()
// registry.register({{ id: 'item1', value: {{ name: 'Item 1' }} }})
'''
    
    def _generate_component(self, name="CustomComponent", **kwargs):
        """Generate headless component pattern."""
        return f'''<template>
  <div class="v-{name.lower()}" :class="componentClasses">
    <slot 
      :selected="selected"
      :toggle="toggle"
      :isSelected="isSelected"
    />
  </div>
</template>

<script setup lang="ts">
import {{ createSelection }} from '@vuetify/v0/composables'
import {{ computed }} from 'vue'

export interface {name}Props {{
  modelValue?: string[]
  multiple?: boolean
  disabled?: boolean
  color?: string
}}

const props = withDefaults(defineProps<{name}Props>(), {{
  multiple: false,
  disabled: false,
  color: 'primary'
}})

const emit = defineEmits<{{
  'update:modelValue': [value: string[]]
  change: [selected: string[]]
}}>()

const selection = createSelection({{ 
  multiple: props.multiple 
}})

// Sync with v-model
watchEffect(() => {{
  if (props.modelValue) {{
    selection.clear()
    props.modelValue.forEach(id => selection.select(id))
  }}
}})

watch(() => selection.selected.value, (selected) => {{
  const value = Array.from(selected)
  emit('update:modelValue', value)
  emit('change', value)
}})

const componentClasses = computed(() => ({{
  [`v-{name.lower()}--multiple`]: props.multiple,
  [`v-{name.lower()}--disabled`]: props.disabled,
  [`v-{name.lower()}--{props.color}`]: true
}}))

// Expose for programmatic access
defineExpose({{
  selected: selection.selected,
  toggle: selection.toggle,
  select: selection.select,
  deselect: selection.deselect,
  clear: selection.clear
}})
</script>

<style scoped>
.v-{name.lower()} {{
  /* Component styles */
}}
</style>

<!-- Usage example:
<{name} v-model="selected" multiple>
  <template #default="{{ selected, toggle, isSelected }}">
    <div v-for="item in items" :key="item.id">
      <button 
        @click="toggle(item.id)"
        :class="{{ active: isSelected(item.id) }}"
      >
        {{ item.name }}
      </button>
    </div>
  </template>
</{name}>
-->
'''

def main():
    parser = argparse.ArgumentParser(description="Generate v0 patterns")
    parser.add_argument("--type", required=True, 
                       choices=["selection", "form", "context", "registry", "component"],
                       help="Pattern type to generate")
    parser.add_argument("--output", required=True, help="Output file path")
    parser.add_argument("--name", help="Custom name for the pattern")
    parser.add_argument("--selection-type", choices=["single", "multi", "group"], 
                       default="multi", help="Selection pattern subtype")
    
    args = parser.parse_args()
    
    scaffolder = PatternScaffolder()
    
    kwargs = {}
    if args.name:
        kwargs['name'] = args.name
    if args.type == 'selection' and args.selection_type:
        kwargs['selection_type'] = args.selection_type
    
    scaffolder.scaffold(args.type, args.output, **kwargs)

if __name__ == "__main__":
    main()