export type { Md1ChipContext, Md1ChipProps } from './Md1Chip.vue'
export type { Md1ChipAddressProps } from './Md1ChipAddress.vue'
export { default as Md1ChipAddress } from './Md1ChipAddress.vue'
export type { Md1ChipAddressesProps } from './Md1ChipAddresses.vue'
export { default as Md1ChipAddresses } from './Md1ChipAddresses.vue'

// Context
import Root from './Md1Chip.vue'
import Address from './Md1ChipAddress.vue'
import Addresses from './Md1ChipAddresses.vue'

/**
 * The Material Design 1 chip: a small block for an entity, with text, an
 * icon or a photo; deletable from its `cancel` glyph or the Delete key; and,
 * as the in-field contact chip, opening to the contact's alternative
 * addresses. Text chips render v0 `Atom`; a chip with a press, and every
 * contact chip, renders `Button.Root`; the open state is `Popover.*`.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`Md1ChipAddresses`, `Md1ChipAddress`) remain
 * exported and valid.
 *
 * @example
 * ```vue
 * <Md1Chip>Free text</Md1Chip>
 * <Md1Chip icon="label" deletable @delete="remove">Rule</Md1Chip>
 *
 * <Md1Chip contact avatar="/alice.png" deletable @delete="remove">
 *   Alice Jones
 *
 *   <Md1Chip.Addresses>
 *     <Md1Chip.Address active>alice@example.com</Md1Chip.Address>
 *
 *     <Md1Chip.Address @click="swap">a.jones@work.example</Md1Chip.Address>
 *   </Md1Chip.Addresses>
 * </Md1Chip>
 * ```
 */
export const Md1Chip = Object.assign(Root, {
  /** The open contact chip: an 8 dp sheet headed by the contact's name, listing its addresses. */
  Addresses,
  /** One address row inside `Addresses`; `active` marks the one in use. */
  Address,
})
