import { describe, it, expect, beforeEach } from 'vitest'
import { createPermissions, createPermissionsPlugin } from './index'
import { Vuetify0PermissionAdapter } from './adapters/v0'

describe('usePermissions', () => {
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
  })

  describe('Vuetify0PermissionAdapter', () => {
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
