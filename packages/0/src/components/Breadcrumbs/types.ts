/**
 * @module BreadcrumbsTypes
 *
 * Shared types for Breadcrumbs components.
 */

// Types
import type { BreadcrumbsContext } from '#v0/composables/createBreadcrumbs'
import type { GroupContext, GroupTicket } from '#v0/composables/createGroup'
import type { OverflowContext } from '#v0/composables/createOverflow'
import type { ComputedRef, Ref } from 'vue'

export type BreadcrumbsTicketType = 'item' | 'divider' | 'ellipsis'

export interface BreadcrumbsTicket extends GroupTicket {
  /** Type of breadcrumb element */
  type: BreadcrumbsTicketType
}

export interface BreadcrumbsRootContext {
  /** Breadcrumbs composable context for navigation and state */
  breadcrumbs: BreadcrumbsContext
  /** Group context for managing item registration and selection (overflow) */
  group: GroupContext<BreadcrumbsTicket>
  /** Overflow context for width measurement and capacity calculation */
  overflow: OverflowContext
  /** Default divider character/text */
  divider: ComputedRef<string>
  /** Default ellipsis character/text */
  ellipsis: ComputedRef<string>
  /** Whether items are being truncated */
  isOverflowing: Readonly<Ref<boolean>>
}
