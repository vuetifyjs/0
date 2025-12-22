---
title: usePermissions - Role-Based Access Control for Vue 3
meta:
- name: description
  content: RBAC composable for managing user permissions. Define access control with actions, subjects, and context-aware conditions using the adapter pattern for Vue 3.
- name: keywords
  content: permissions, authorization, RBAC, role-based access control, access control, plugin, Vue 3, composable
features:
  category: Plugin
  label: 'E: usePermissions'
  github: /composables/usePermissions/
---

# usePermissions

Manage role-based permissions across your app. Register permissions for roles, actions, and subjects with optional context-aware conditions.

<DocsPageFeatures :frontmatter />

## Usage

Install the Permissions plugin once, then access the context anywhere via `createPermissions`.

```ts
import { createApp } from 'vue'
import { createPermissionsPlugin } from '@vuetify/v0'
import App from './App.vue'

const app = createApp(App)

app.use(
  createPermissionsPlugin({
    permissions: {
      admin: [
        [['read', 'write'], 'user', true],
        [['read', 'write'], 'post', true],
        ['delete', ['user', 'post'], true],
      ],
      editor: [
        [['read', 'write'], 'post', true],
        ['read', 'user', true],
        ['delete', 'post', (context) => context.isOwner],
      ],
      viewer: [
        ['read', ['user', 'post'], true],
      ],
    },
  })
)

app.mount('#app')
```

Now in any component, check permissions for specific roles:

```vue UsePermissions
<script setup lang="ts">
  import { usePermissions } from '@vuetify/v0'

  const permissions = usePermissions()
  const currentUser = { role: 'editor', id: 'user123' }
</script>

<template>
  <div>
    <button v-if="permissions.can('admin', 'delete', 'user')">
      Delete User (Admin Only)
    </button>

    <button v-if="permissions.can('editor', 'write', 'post')">
      Edit Post
    </button>

    <button
      v-if="permissions.can('editor', 'delete', 'post', { isOwner: true })"
    >
      Delete Own Post
    </button>
  </div>
</template>
```

Optionally register permissions at runtime:

```vue UsePermissions
<script setup lang="ts">
  import { usePermissions } from '@vuetify/v0'

  const permissions = usePermissions()

  // Register permission at runtime
  permissions.register({
    id: 'moderator.ban.user',
    value: (context) => context.userLevel < 3
  })

  // Check the permission
  const canBan = permissions.can('moderator', 'ban', 'user', { userLevel: 2 })
</script>
```

## API


| Composable | Description |
|---|---|
| [useTokens](/composables/registration/use-tokens) | Design token system for managing permission definitions |
| [useRegistry](/composables/registration/use-registry) | Base registry system |
| [createPlugin](/composables/foundation/create-plugin) | Plugin creation pattern |
### Extensions

| Composable | Description |
|---|---|
| [useTokens](/composables/registration/use-tokens/) | Base tokens composable for managing token collections with namespaced access. |

### `usePermissions`

* **Type**
  ```ts
  interface PermissionTicket extends TokenTicket {
    value: boolean | ((context: Record<string, any>) => boolean)
  }

  interface PermissionContext<Z extends PermissionTicket = PermissionTicket> extends TokenContext<Z> {
    can (id: string, action: string, subject: string, context?: Record<string, any>): boolean
  }

  interface PermissionPluginOptions {
    adapter?: PermissionAdapter
    permissions?: Record<ID, Array<[string | string[], string | string[], boolean | Function]>>
  }

  interface PermissionOptions extends PermissionPluginOptions {}
  ```
* **Details**
  - `can (id: string, action: string, subject: string, context?: Record<string, any>): boolean`: Check if a role has permission to perform an action on a subject, optionally with context.

### `can`

 - **Type**
   ```ts
   function can (id: string, action: string, subject: string, context?: Record<string, any>): boolean
   ```

- **Details**
  Check if a role has permission to perform a specific action on a subject. The method constructs a permission key in the format `{role}.{action}.{subject}` and evaluates the associated condition.

- **Parameters**
  - `id`: The role identifier (e.g., 'admin', 'editor', 'viewer')
  - `action`: The action to check (e.g., 'read', 'write', 'delete')
  - `subject`: The subject/resource (e.g., 'user', 'post', 'comment')
  - `context`: Optional context object for conditional permissions

- **Example**
  ```ts
  // main.ts
  import { createApp } from 'vue'
  import { createPermissionsPlugin } from '@vuetify/v0'
  import App from './App.vue'

  const app = createApp(App)

  app.use(
    createPermissionsPlugin({
      permissions: {
        admin: [
          [['read', 'write', 'delete'], ['user', 'post'], true],
        ],
        editor: [
          [['read', 'write'], 'post', true],
          ['delete', 'post', (context) => context.isOwner],
        ],
        viewer: [
          ['read', ['user', 'post'], true],
        ],
      },
    })
  )
  ```
  ```vue UsePermissions
  <!-- Component.vue -->
  <script setup lang="ts">
    import { usePermissions } from '@vuetify/v0'

    const permissions = usePermissions()

    permissions.can('admin', 'delete', 'user') // true
    permissions.can('editor', 'write', 'post') // true
    permissions.can('editor', 'delete', 'post', { isOwner: true }) // true
    permissions.can('editor', 'delete', 'post', { isOwner: false }) // false
    permissions.can('viewer', 'write', 'post') // false
  </script>
  ```

### Permission Structure

Permissions are defined as arrays of tuples in the format:
```ts
[actions, subjects, condition]
```

- **actions**: String or array of action names
- **subjects**: String or array of subject names
- **condition**: Boolean value or function that receives context and returns boolean

### Custom Adapters

You can provide a custom adapter to implement different permission checking logic:

```ts
import { PermissionAdapter } from '@vuetify/v0'

class CustomPermissionAdapter extends PermissionAdapter {
  can(role, action, subject, context, permissions) {
    // Custom permission logic here
    return true
  }
}

app.use(
  createPermissionsPlugin({
    adapter: new CustomPermissionAdapter(),
    permissions: {
      // ... your permissions
    },
  })
)
```

## Examples

### Basic RBAC Setup

```ts
const permissions = {
  admin: [
    [['create', 'read', 'update', 'delete'], ['user', 'post', 'comment'], true],
  ],
  moderator: [
    [['read', 'update', 'delete'], ['post', 'comment'], true],
    ['read', 'user', true],
  ],
  user: [
    ['read', ['post', 'comment'], true],
    [['create', 'update'], 'post', (context) => context.userId === context.authorId],
  ],
}
```

### Context-Aware Permissions

```ts
const permissions = {
  editor: [
    ['edit', 'post', (context) => {
      return context.post.authorId === context.currentUserId ||
             context.currentUser.isAdmin
    }],
    ['publish', 'post', (context) => {
      return context.post.status === 'draft' &&
             context.currentUser.department === 'editorial'
    }],
  ],
}
```
