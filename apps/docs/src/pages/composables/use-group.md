# useGroup

The `useGroup` composable is designed to manage a group of items or components, allowing you to easily add, remove, and manipulate items within the group. This is particularly useful in scenarios where you need to handle collections of data or UI elements.

## Usage

```ts
import { useGroup } from '@vuetify/0'
import type { GroupContext, GroupItem, GroupTicket } from '@vuetify/0'

interface MyGroupItem extends GroupItem {
  //
}

interface MyGroupTicket extends GroupTicket {
  //
}

interface MyGroupContext extends GroupContext<MyGroupItem, MyGroupTicket> {
  //
}

export function myUseGroup () {
  const [useGroup, provideGroup, group] = useGroup<MyGroupContext>('my-group')

  const context = {
    ...group,
    // Custom methods or properties can be added here
  }

  return [
    useGroup,
    function (model: Ref<unknown>) {
      // Custom logic to provide the group context

      provideGroup(model, context)
    },
    group,
  ]
}
```
