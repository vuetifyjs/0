import { describe, expect, it } from 'vitest'

import {
  canAssignTeam,
  createTeamField,
  filterPlaygroundsByScope,
  isPlaygroundOwner,
  isTeamPlayground,
  nextTeamId,
  playgroundTeamId,
  readUserTeam,
  responseTeamId,
  settledTeamId,
  shouldAssignTeam,
  teamField,
} from './teamPlaygrounds'

const personal = { id: 'p', teamId: null as string | null }
const shared = { id: 't', teamId: 'team-1' as string | null, owner: { id: 'owner' } }
const legacy: { id: string, teamId?: string | null, owner?: { id?: string } } = { id: 'l' }

describe('readUserTeam', () => {
  it('should return null when the session has no team', () => {
    expect(readUserTeam(null)).toBeNull()
    expect(readUserTeam({})).toBeNull()
    expect(readUserTeam({ team: null })).toBeNull()
    expect(readUserTeam({ team: {} })).toBeNull()
    expect(readUserTeam({ team: { id: '' } })).toBeNull()
    expect(readUserTeam({ team: { id: 1 } })).toBeNull()
  })

  it('should read a team id and an optional name', () => {
    expect(readUserTeam({ team: { id: 'team-1' } })).toEqual({ id: 'team-1', name: undefined })
    expect(readUserTeam({ team: { id: 'team-1', name: 'Acme' } })).toEqual({ id: 'team-1', name: 'Acme' })
    expect(readUserTeam({ team: { id: 'team-1', name: '' } })).toEqual({ id: 'team-1', name: undefined })
  })
})

describe('playground team id', () => {
  it('should treat missing and empty ids as personal', () => {
    expect(responseTeamId(undefined)).toBeNull()
    expect(responseTeamId(null)).toBeNull()
    expect(responseTeamId('')).toBeNull()
    expect(responseTeamId('team-1')).toBe('team-1')
    expect(playgroundTeamId(undefined)).toBeNull()
    expect(playgroundTeamId({ teamId: '' })).toBeNull()
    expect(isTeamPlayground(personal)).toBe(false)
    expect(isTeamPlayground(legacy)).toBe(false)
    expect(isTeamPlayground(shared)).toBe(true)
  })

  it('should filter personal and team lists', () => {
    const items = [personal, shared, legacy, { id: 'blank', teamId: '' }]
    expect(filterPlaygroundsByScope(items, 'personal').map(item => item.id)).toEqual(['p', 'l', 'blank'])
    expect(filterPlaygroundsByScope(items, 'team').map(item => item.id)).toEqual(['t'])
  })
})

describe('ownership', () => {
  it('should treat a missing owner as the caller on a pre-team list', () => {
    expect(isPlaygroundOwner(undefined, 'owner')).toBe(false)
    expect(isPlaygroundOwner('user', undefined)).toBe(true)
    expect(isPlaygroundOwner('user', '')).toBe(true)
    expect(isPlaygroundOwner('user', 'user')).toBe(true)
    expect(isPlaygroundOwner('user', 'owner')).toBe(false)
  })

  it('should allow assignment only for an owner who has a team', () => {
    expect(canAssignTeam('user', 'user', 'team-1')).toBe(true)
    expect(canAssignTeam('user', undefined, 'team-1')).toBe(true)
    expect(canAssignTeam('user', 'owner', 'team-1')).toBe(false)
    expect(canAssignTeam('user', 'user', undefined)).toBe(false)
    expect(canAssignTeam('user', 'user', '')).toBe(false)
  })
})

describe('assignment', () => {
  it('should toggle between personal and the user team', () => {
    expect(nextTeamId(null, 'team-1')).toBe('team-1')
    expect(nextTeamId('', 'team-1')).toBe('team-1')
    expect(nextTeamId('team-1', 'team-1')).toBeNull()
    expect(nextTeamId(null, undefined)).toBeNull()
  })

  it('should skip non-owners and rows already at the target', () => {
    expect(shouldAssignTeam(shared, 'owner', null)).toBe(true)
    expect(shouldAssignTeam(shared, 'owner', 'team-1')).toBe(false)
    expect(shouldAssignTeam(shared, 'user', null)).toBe(false)
    expect(shouldAssignTeam(personal, 'user', null)).toBe(false)
    expect(shouldAssignTeam(legacy, 'user', 'team-1')).toBe(true)
  })

  it('should omit teamId on a personal create and send it for a team create', () => {
    expect(createTeamField(undefined)).toEqual({})
    expect(createTeamField(null)).toEqual({})
    expect(createTeamField('')).toEqual({})
    expect(createTeamField('team-1')).toEqual({ teamId: 'team-1' })
  })

  it('should omit teamId on an update that does not change it', () => {
    expect(teamField({})).toEqual({})
    expect(teamField({ teamId: null })).toEqual({ teamId: null })
    expect(teamField({ teamId: '' })).toEqual({ teamId: null })
    expect(teamField({ teamId: 'team-1' })).toEqual({ teamId: 'team-1' })
  })

  it('should keep the previous team when a response omits the field', () => {
    expect(settledTeamId('team-1', {}, false)).toBe('team-1')
    expect(settledTeamId('team-1', { teamId: 'team-1' }, false)).toBe('team-1')
    expect(settledTeamId('team-1', { teamId: null }, true)).toBeNull()
    expect(settledTeamId('team-1', {}, true)).toBeNull()
    expect(settledTeamId(null, { teamId: 'team-1' }, true)).toBe('team-1')
  })
})
