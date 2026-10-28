/**
 * Team playground rules for the Open dialog and save flow.
 *
 * Contract is vuetifyjs/api#137: a playground is personal when `teamId` is
 * null, and shared when it is the user's team id. Omitted `teamId` on update
 * keeps the server value; `null` clears it. Lists and sessions from the API
 * before that change have no team fields — those playgrounds stay personal
 * and the team controls stay hidden.
 */

// Utilities
import { isObject, isString } from '#v0/utilities'
// Framework
import { shallowRef } from 'vue'

export type PlaygroundScope = 'personal' | 'team'

export interface OneTeam {
  id: string
  name?: string
}

/** Open-dialog personal/team filter. Survives dialog close; not persisted. */
export const playgroundScope = shallowRef<PlaygroundScope>('personal')

/** Team on the One session user. Null when the user has none or the field is absent. */
export function readUserTeam (user: unknown): OneTeam | null {
  if (!isObject(user)) return null
  const team = user.team
  if (!isObject(team)) return null
  const id = team.id
  if (!isString(id) || id.length === 0) return null
  const name = team.name
  return {
    id,
    name: isString(name) && name.length > 0 ? name : undefined,
  }
}

/** Empty and missing ids are personal. A real id is the team. */
export function responseTeamId (value: unknown): string | null {
  if (!isString(value) || value.length === 0) return null
  return value
}

export function playgroundTeamId (item: { teamId?: string | null } | null | undefined): string | null {
  if (!item) return null
  return responseTeamId(item.teamId)
}

export function isTeamPlayground (item: { teamId?: string | null } | null | undefined): boolean {
  return playgroundTeamId(item) !== null
}

export function filterPlaygroundsByScope<T extends { teamId?: string | null }> (
  items: readonly T[],
  scope: PlaygroundScope,
): T[] {
  const team = scope === 'team'
  return items.filter(item => isTeamPlayground(item) === team)
}

/**
 * True when this user may change owner-only fields.
 * A missing owner id is a pre-team list, which only contains the caller's rows.
 */
export function isPlaygroundOwner (userId: string | undefined, ownerId: string | undefined): boolean {
  if (!isString(userId) || userId.length === 0) return false
  if (!isString(ownerId) || ownerId.length === 0) return true
  return userId === ownerId
}

/** Owner with a team can move a playground between personal and that team. */
export function canAssignTeam (
  userId: string | undefined,
  ownerId: string | undefined,
  userTeamId: string | undefined,
): boolean {
  if (!isString(userTeamId) || userTeamId.length === 0) return false
  return isPlaygroundOwner(userId, ownerId)
}

/** Personal when it is already on a team; otherwise the user's team. */
export function nextTeamId (current: string | null | undefined, userTeamId: string | undefined): string | null {
  if (playgroundTeamId({ teamId: current })) return null
  return responseTeamId(userTeamId)
}

/** Skip rows the user does not own and rows already at the target. */
export function shouldAssignTeam (
  item: { teamId?: string | null, owner?: { id?: string } },
  userId: string | undefined,
  target: string | null,
): boolean {
  if (!isPlaygroundOwner(userId, item.owner?.id)) return false
  return playgroundTeamId(item) !== responseTeamId(target)
}

/**
 * Create body. Personal saves omit `teamId` so a pre-team API is unchanged.
 * A team save sends the id; a server that strips it stores a personal playground.
 */
export function createTeamField (teamId: string | null | undefined): { teamId: string } | Record<string, never> {
  const id = responseTeamId(teamId)
  if (!id) return {}
  return { teamId: id }
}

/**
 * Update body. The key must be absent to keep the current team.
 * Present `null` (or an empty string) moves the playground to personal.
 */
export function teamField (patch: { teamId?: string | null }): { teamId: string | null } | Record<string, never> {
  if (!Object.hasOwn(patch, 'teamId')) return {}
  return { teamId: responseTeamId(patch.teamId) }
}

/**
 * Team id to keep after a response.
 * A response that includes the field wins. A response that drops it after we
 * sent one did not store the change. A response that drops it when we did not
 * send one leaves the previous value alone.
 */
export function settledTeamId (
  previous: string | null,
  result: { teamId?: string | null },
  sent: boolean,
): string | null {
  if (Object.hasOwn(result, 'teamId')) return responseTeamId(result.teamId)
  if (sent) return null
  return previous
}
