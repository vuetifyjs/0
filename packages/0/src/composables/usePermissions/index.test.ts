import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Adapters
import { Vuetify0PermissionAdapter } from './adapters/v0'

// Utilities
import { inject, provide } from 'vue'

import { createPermissions, createPermissionsContext, createPermissionsPlugin, usePermissions } from './index'

vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return {
    ...actual,
    provide: vi.fn(),
    inject: vi.fn(),
  }
})

const mockProvide = vi.mocked(provide)
const mockInject = vi.mocked(inject)

describe('usePermissions', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('createPermissions', () => {
    it('should create permissions instance with default options', () => {
      const defaultPermissions = createPermissions()

      expect(defaultPermissions).toBeDefined()
      expect(typeof defaultPermissions.can).toBe('function')
      expect(typeof defaultPermissions.get).toBe('function')
    })

    it('should create permissions from config', () => {
      const permissions = createPermissions({
        permissions: {
          admin: [
            ['read', 'users'],
            ['write', 'users'],
            ['delete', 'users'],
          ],
          editor: [
            ['read', 'posts'],
            ['write', 'posts'],
          ],
          viewer: [
            ['read', ['posts', 'comments']],
          ],
        },
      })

      expect(permissions).toBeDefined()
      expect(typeof permissions.can).toBe('function')
    })

    it('should check single permission', () => {
      const permissions = createPermissions({
        permissions: {
          admin: [
            ['read', 'users'],
          ],
        },
      })

      expect(permissions.can('admin', 'read', 'users')).toBe(true)
      expect(permissions.can('admin', 'write', 'users')).toBe(false)
      expect(permissions.can('viewer', 'read', 'users')).toBe(false)
    })

    it('should check multiple actions', () => {
      const permissions = createPermissions({
        permissions: {
          editor: [
            [['read', 'write'], 'posts'],
          ],
        },
      })

      expect(permissions.can('editor', 'read', 'posts')).toBe(true)
      expect(permissions.can('editor', 'write', 'posts')).toBe(true)
      expect(permissions.can('editor', 'delete', 'posts')).toBe(false)
    })

    it('should check multiple subjects', () => {
      const permissions = createPermissions({
        permissions: {
          viewer: [
            ['read', ['posts', 'comments', 'users']],
          ],
        },
      })

      expect(permissions.can('viewer', 'read', 'posts')).toBe(true)
      expect(permissions.can('viewer', 'read', 'comments')).toBe(true)
      expect(permissions.can('viewer', 'read', 'users')).toBe(true)
      expect(permissions.can('viewer', 'write', 'posts')).toBe(false)
    })

    it('should handle complex role configurations', () => {
      const permissions = createPermissions({
        permissions: {
          admin: [
            [['read', 'write', 'delete'], ['users', 'posts', 'comments']],
          ],
          moderator: [
            [['read', 'write'], 'comments'],
            ['read', 'posts'],
          ],
          user: [
            ['read', ['posts', 'comments']],
          ],
        },
      })

      // Admin has full access
      expect(permissions.can('admin', 'read', 'users')).toBe(true)
      expect(permissions.can('admin', 'write', 'posts')).toBe(true)
      expect(permissions.can('admin', 'delete', 'comments')).toBe(true)

      // Moderator has limited access
      expect(permissions.can('moderator', 'read', 'comments')).toBe(true)
      expect(permissions.can('moderator', 'write', 'comments')).toBe(true)
      expect(permissions.can('moderator', 'read', 'posts')).toBe(true)
      expect(permissions.can('moderator', 'write', 'posts')).toBe(false)
      expect(permissions.can('moderator', 'delete', 'comments')).toBe(false)

      // User has read-only access
      expect(permissions.can('user', 'read', 'posts')).toBe(true)
      expect(permissions.can('user', 'read', 'comments')).toBe(true)
      expect(permissions.can('user', 'write', 'posts')).toBe(false)
    })

    it('should handle conditional permissions with functions', () => {
      const permissions = createPermissions({
        permissions: {
          owner: [
            ['write', 'posts', (ctx: any) => ctx.isOwner === true],
            ['delete', 'posts', (ctx: any) => ctx.isOwner === true],
          ],
        },
      })

      expect(permissions.can('owner', 'write', 'posts', { isOwner: true })).toBe(true)
      expect(permissions.can('owner', 'write', 'posts', { isOwner: false })).toBe(false)
      expect(permissions.can('owner', 'delete', 'posts', { isOwner: true })).toBe(true)
      expect(permissions.can('owner', 'delete', 'posts', { isOwner: false })).toBe(false)
    })

    it('should handle context in permission checks', () => {
      const permissions = createPermissions({
        permissions: {
          editor: [
            ['edit', 'posts', (ctx: any) => ctx.userId === ctx.postAuthorId],
          ],
        },
      })

      expect(permissions.can('editor', 'edit', 'posts', { userId: 123, postAuthorId: 123 })).toBe(true)
      expect(permissions.can('editor', 'edit', 'posts', { userId: 123, postAuthorId: 456 })).toBe(false)
    })

    it('should return false for non-existent permissions', () => {
      const permissions = createPermissions({
        permissions: {
          admin: [
            ['read', 'users'],
          ],
        },
      })

      expect(permissions.can('nonexistent', 'read', 'users')).toBe(false)
      expect(permissions.can('admin', 'nonexistent', 'users')).toBe(false)
      expect(permissions.can('admin', 'read', 'nonexistent')).toBe(false)
    })

    it('should return permission value via get()', () => {
      const permissions = createPermissions({
        permissions: {
          admin: [
            ['read', 'users'],
            ['write', 'posts', (ctx: Record<string, unknown>) => ctx.isOwner === true],
          ],
        },
      })

      const readTicket = permissions.get('admin.read.users')
      expect(readTicket).toBeDefined()
      expect(readTicket!.value).toBe(true)

      const writeTicket = permissions.get('admin.write.posts')
      expect(writeTicket).toBeDefined()
      expect(typeof writeTicket!.value).toBe('function')

      const missing = permissions.get('admin.delete.users')
      expect(missing).toBeUndefined()
    })
  })

  describe('vuetify0PermissionAdapter', () => {
    let adapter: Vuetify0PermissionAdapter

    beforeEach(() => {
      adapter = new Vuetify0PermissionAdapter()
    })

    it('should check boolean permissions', () => {
      const permissions = createPermissions({
        adapter,
        permissions: {
          admin: [['read', 'users']],
        },
      })

      expect(adapter.can('admin', 'read', 'users', {}, permissions)).toBe(true)
      expect(adapter.can('admin', 'write', 'users', {}, permissions)).toBe(false)
    })

    it('should check functional permissions', () => {
      const permissions = createPermissions({
        adapter,
        permissions: {
          owner: [
            ['edit', 'posts', (ctx: any) => ctx.isOwner],
          ],
        },
      })

      expect(adapter.can('owner', 'edit', 'posts', { isOwner: true }, permissions)).toBe(true)
      expect(adapter.can('owner', 'edit', 'posts', { isOwner: false }, permissions)).toBe(false)
    })

    it('should return false for missing permissions', () => {
      const permissions = createPermissions({
        adapter,
        permissions: {},
      })

      expect(adapter.can('admin', 'read', 'users', {}, permissions)).toBe(false)
    })
  })

  describe('createPermissionsPlugin', () => {
    it('should create a Vue plugin', () => {
      const plugin = createPermissionsPlugin()

      expect(plugin).toBeDefined()
      expect(typeof plugin.install).toBe('function')
    })

    it('should accept permissions options', () => {
      const plugin = createPermissionsPlugin({
        permissions: {
          admin: [['read', 'users']],
        },
      })

      expect(plugin).toBeDefined()
      expect(typeof plugin.install).toBe('function')
    })

    it('should accept custom adapter', () => {
      const customAdapter = new Vuetify0PermissionAdapter()
      const plugin = createPermissionsPlugin({
        adapter: customAdapter,
        permissions: {
          admin: [['read', 'users']],
        },
      })

      expect(plugin).toBeDefined()
    })
  })

  describe('edge cases', () => {
    it('should handle empty permissions', () => {
      const permissions = createPermissions({
        permissions: {},
      })

      expect(permissions.can('anyone', 'do', 'anything')).toBe(false)
    })

    it('should handle empty context', () => {
      const permissions = createPermissions({
        permissions: {
          user: [['read', 'posts']],
        },
      })

      expect(permissions.can('user', 'read', 'posts')).toBe(true)
      expect(permissions.can('user', 'read', 'posts', {})).toBe(true)
    })

    it('should handle function that throws', () => {
      const permissions = createPermissions({
        permissions: {
          user: [
            ['access', 'dangerous', () => {
              throw new Error('Permission check failed')
            }],
          ],
        },
      })

      expect(() => permissions.can('user', 'access', 'dangerous')).toThrow()
    })

    it('should handle undefined condition as true', () => {
      const permissions = createPermissions({
        permissions: {
          user: [
            ['read', 'posts', undefined as any],
          ],
        },
      })

      // Undefined condition should default to true
      expect(permissions.can('user', 'read', 'posts')).toBe(true)
    })
  })
})

describe('createPermissionsContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return a trinity tuple', () => {
    const result = createPermissionsContext()

    expect(Array.isArray(result)).toBe(true)
    expect(result).toHaveLength(3)
    expect(typeof result[0]).toBe('function') // usePermissionsContext
    expect(typeof result[1]).toBe('function') // providePermissionsContext
    expect(result[2]).toBeDefined() // default context
  })

  it('should create context with default namespace', () => {
    const [, providePermissionsContext, context] = createPermissionsContext()

    providePermissionsContext(context)

    expect(mockProvide).toHaveBeenCalledWith('v0:permissions', context)
  })

  it('should create context with custom namespace', () => {
    const [, providePermissionsContext, context] = createPermissionsContext({
      namespace: 'my-permissions',
    })

    providePermissionsContext(context)

    expect(mockProvide).toHaveBeenCalledWith('my-permissions', context)
  })

  it('should create a functional permissions context', () => {
    const [,, context] = createPermissionsContext({
      permissions: {
        admin: [['read', 'users']],
        editor: [['write', 'posts']],
      },
    })

    expect(context.can('admin', 'read', 'users')).toBe(true)
    expect(context.can('admin', 'write', 'users')).toBe(false)
    expect(context.can('editor', 'write', 'posts')).toBe(true)
  })

  it('should allow providing custom context', () => {
    const [, providePermissionsContext] = createPermissionsContext()
    const customContext = createPermissions({
      permissions: {
        admin: [['read', 'all']],
      },
    })

    providePermissionsContext(customContext)

    expect(mockProvide).toHaveBeenCalledWith('v0:permissions', customContext)
  })

  it('should provide context at app level when app is passed', () => {
    const mockApp = {
      provide: vi.fn(),
    } as any
    const [, providePermissionsContext, context] = createPermissionsContext()

    providePermissionsContext(context, mockApp)

    expect(mockApp.provide).toHaveBeenCalledWith('v0:permissions', context)
  })
})

describe('usePermissions consumer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should inject context with default namespace', () => {
    const mockContext = createPermissions()
    mockInject.mockReturnValue(mockContext)

    const result = usePermissions()

    expect(mockInject).toHaveBeenCalledWith('v0:permissions', undefined)
    expect(result).toBe(mockContext)
  })

  it('should inject context with custom namespace', () => {
    const mockContext = createPermissions()
    mockInject.mockReturnValue(mockContext)

    const result = usePermissions('my-permissions')

    expect(mockInject).toHaveBeenCalledWith('my-permissions', undefined)
    expect(result).toBe(mockContext)
  })

  it('should throw when context is not provided', () => {
    mockInject.mockReturnValue(undefined)

    expect(() => usePermissions()).toThrow(
      'Context "v0:permissions" not found. Ensure it\'s provided by an ancestor.',
    )
  })
})
