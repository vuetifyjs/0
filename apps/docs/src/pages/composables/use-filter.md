# useFilter

This composable provides a simple way to filter an array of items based on a search term. It is useful for creating searchable lists or tables in your Vue.js applications.

## Usage

```ts
import { useFilter } from '@vuetify/0'

const { items } = useFilter('ban', {
  items: ['apple', 'banana', 'cherry'],
})

console.log(items.value) // ['banana']
```
