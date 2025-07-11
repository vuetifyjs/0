# useRegistrar

The `useRegistrar` composable is built on top of `useContext` and is used to register components or services within a specific namespace. It allows you to manage dependencies and ensure that components can access the necessary context.

## Usage

```ts
import { useRegistrar } from '@vuetify/0'
import type { RegistrarContext, RegistrarItem, RegistrarTicket } from '@vuetify/0'

interface MyItem extends RegistrarItem {
  name: string
}

interface MyTicket extends RegistrarTicket, MyItem {
  status: 'active' | 'inactive'
}

interface MyContext extends RegistrarContext<MyTicket, MyItem> {
  toggle: () => void
}
```
