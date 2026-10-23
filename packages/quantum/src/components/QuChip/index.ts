export type { QuChipContext, QuChipProps } from './QuChip.vue'
export type { QuChipAddressProps } from './QuChipAddress.vue'
export { default as QuChipAddress } from './QuChipAddress.vue'
export type { QuChipAddressesProps } from './QuChipAddresses.vue'
export { default as QuChipAddresses } from './QuChipAddresses.vue'

// Context
import Root from './QuChip.vue'
import Address from './QuChipAddress.vue'
import Addresses from './QuChipAddresses.vue'

/**
 * The Material Design 1 chip: a small block for an entity, with text, an
 * icon or a photo; deletable from its `cancel` glyph or the Delete key; and,
 * as the in-field contact chip, opening to the contact's alternative
 * addresses. Text chips render v0 `Atom`; a chip with a press, and every
 * contact chip, renders `Button.Root`; the open state is `Popover.*`.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`QuChipAddresses`, `QuChipAddress`) remain
 * exported and valid.
 *
 * @example
 * ```vue
 * <QuChip>Free text</QuChip>
 * <QuChip icon="label" deletable @delete="remove">Rule</QuChip>
 *
 * <QuChip contact avatar="/alice.png" deletable @delete="remove">
 *   Alice Jones
 *
 *   <QuChip.Addresses>
 *     <QuChip.Address active>alice@example.com</QuChip.Address>
 *
 *     <QuChip.Address @click="swap">a.jones@work.example</QuChip.Address>
 *   </QuChip.Addresses>
 * </QuChip>
 * ```
 */
export const QuChip = Object.assign(Root, {
  /** The open contact chip: an 8 dp sheet headed by the contact's name, listing its addresses. */
  Addresses,
  /** One address row inside `Addresses`; `active` marks the one in use. */
  Address,
})
