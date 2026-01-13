/**
 * @module BreadcrumbsTypes
 *
 * Shared types for Breadcrumbs components.
 */

// Types
import type { GroupContext, GroupTicket } from '#v0/composables/createGroup'
import type { OverflowContext } from '#v0/composables/useOverflow'
import type { ComputedRef, Ref } from 'vue'

export type BreadcrumbsTicketType = 'item' | 'divider' | 'ellipsis'

export interface BreadcrumbsTicket extends GroupTicket {
  /** Type of breadcrumb element */
  type: BreadcrumbsTicketType
}

export interface BreadcrumbsContext {
  /** Group context for managing item registration and selection */
  group: GroupContext<BreadcrumbsTicket>
  /** Overflow context for width measurement and capacity calculation */
  overflow: OverflowContext
  /** Default divider character/text */
  divider: ComputedRef<string>
  /** Default ellipsis character/text */
  ellipsis: ComputedRef<string>
  /** Gap between items */
  gap: ComputedRef<number>
  /** Whether items are being truncated */
  isOverflowing: Readonly<Ref<boolean>>
}
