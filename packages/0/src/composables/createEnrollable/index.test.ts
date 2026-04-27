import { describe, expect, it } from 'vitest'

// Composables
import { createGroup } from '#v0/composables/createGroup'

// Utilities
import { shallowRef, toRef } from 'vue'

import { createEnrollable } from './index'

describe('createEnrollable', () => {
  describe('standalone mode', () => {
    it('should mirror model.value on isChecked', () => {
      const model = shallowRef<boolean>(false)
      const enrollable = createEnrollable({ id: 'test:a', model, group: null })

      expect(enrollable.isChecked.value).toBe(false)
      model.value = true
      expect(enrollable.isChecked.value).toBe(true)
    })

    it('should flip model.value on toggle', () => {
      const model = shallowRef<boolean>(false)
      const enrollable = createEnrollable({ id: 'test:a', model, group: null })

      enrollable.toggle()
      expect(model.value).toBe(true)
      enrollable.toggle()
      expect(model.value).toBe(false)
    })

    it('should set model.value true on select', () => {
      const model = shallowRef<boolean>(false)
      const enrollable = createEnrollable({ id: 'test:a', model, group: null })

      enrollable.select()
      expect(model.value).toBe(true)
    })

    it('should set model.value false on unselect', () => {
      const model = shallowRef<boolean>(true)
      const enrollable = createEnrollable({ id: 'test:a', model, group: null })

      enrollable.unselect()
      expect(model.value).toBe(false)
    })

    it('should no-op mix and unmix without a group', () => {
      const model = shallowRef<boolean>(false)
      const enrollable = createEnrollable({ id: 'test:a', model, group: null })

      enrollable.mix()
      expect(model.value).toBe(false)
      expect(enrollable.isMixed.value).toBe(false)

      enrollable.unmix()
      expect(model.value).toBe(false)
    })

    it('should report isMixed from the indeterminate option', () => {
      const model = shallowRef<boolean>(false)
      const indeterminate = shallowRef<boolean>(false)
      const enrollable = createEnrollable({ id: 'test:a', model, indeterminate, group: null })

      expect(enrollable.isMixed.value).toBe(false)
      indeterminate.value = true
      expect(enrollable.isMixed.value).toBe(true)
    })

    it('should accept indeterminate as a plain boolean', () => {
      const model = shallowRef<boolean>(false)
      const enrollable = createEnrollable({ id: 'test:a', model, indeterminate: true, group: null })

      expect(enrollable.isMixed.value).toBe(true)
    })

    it('should accept indeterminate as a getter', () => {
      const model = shallowRef<boolean>(false)
      const source = shallowRef<boolean>(false)
      const enrollable = createEnrollable({
        id: 'test:a',
        model,
        indeterminate: () => source.value,
        group: null,
      })

      expect(enrollable.isMixed.value).toBe(false)
      source.value = true
      expect(enrollable.isMixed.value).toBe(true)
    })

    it('should respect the disabled option on isDisabled', () => {
      const model = shallowRef<boolean>(false)
      const disabled = shallowRef<boolean>(true)
      const enrollable = createEnrollable({ id: 'test:a', model, disabled, group: null })

      expect(enrollable.isDisabled.value).toBe(true)
    })

    it('should block toggle/select/unselect when disabled', () => {
      const model = shallowRef<boolean>(false)
      const enrollable = createEnrollable({ id: 'test:a', model, disabled: true, group: null })

      enrollable.toggle()
      enrollable.select()
      expect(model.value).toBe(false)

      model.value = true
      enrollable.unselect()
      expect(model.value).toBe(true)
    })

    it('should return a null ticket when standalone', () => {
      const model = shallowRef<boolean>(false)
      const enrollable = createEnrollable({ id: 'test:a', model, group: null })

      expect(enrollable.ticket).toBeNull()
    })
  })

  describe('group mode', () => {
    it('should register with the group on construction', () => {
      const group = createGroup()
      const model = shallowRef<boolean>(false)

      const enrollable = createEnrollable({
        id: 'test:a',
        value: 'alpha',
        model,
        group,
      })

      expect(enrollable.ticket).not.toBeNull()
      expect(group.has('test:a')).toBe(true)
      expect(group.get('test:a')?.value).toBe('alpha')
    })

    it('should read isChecked from the ticket, not the model', () => {
      const group = createGroup()
      const model = shallowRef<boolean>(false)
      const enrollable = createEnrollable({ id: 'test:a', model, group })

      expect(enrollable.isChecked.value).toBe(false)
      group.select('test:a')
      expect(enrollable.isChecked.value).toBe(true)

      model.value = false
      expect(enrollable.isChecked.value).toBe(true)
    })

    it('should read isMixed from the ticket', () => {
      const group = createGroup()
      const model = shallowRef<boolean>(false)
      const enrollable = createEnrollable({ id: 'test:a', model, group })

      expect(enrollable.isMixed.value).toBe(false)
      group.mix('test:a')
      expect(enrollable.isMixed.value).toBe(true)
    })

    it('should composite isDisabled from ticket.disabled and group.disabled', () => {
      const groupDisabled = shallowRef<boolean>(false)
      const group = createGroup({ disabled: toRef(() => groupDisabled.value) })
      const ticketDisabled = shallowRef<boolean>(false)
      const model = shallowRef<boolean>(false)

      const enrollable = createEnrollable({
        id: 'test:a',
        model,
        disabled: toRef(() => ticketDisabled.value),
        group,
      })

      expect(enrollable.isDisabled.value).toBe(false)

      ticketDisabled.value = true
      expect(enrollable.isDisabled.value).toBe(true)

      ticketDisabled.value = false
      groupDisabled.value = true
      expect(enrollable.isDisabled.value).toBe(true)
    })

    it('should route toggle through the ticket', () => {
      const group = createGroup()
      const model = shallowRef<boolean>(false)
      const enrollable = createEnrollable({ id: 'test:a', model, group })

      enrollable.toggle()
      expect(group.selectedIds.has('test:a')).toBe(true)
      expect(model.value).toBe(false)

      enrollable.toggle()
      expect(group.selectedIds.has('test:a')).toBe(false)
    })

    it('should route select and unselect through the ticket', () => {
      const group = createGroup()
      const model = shallowRef<boolean>(false)
      const enrollable = createEnrollable({ id: 'test:a', model, group })

      enrollable.select()
      expect(group.selectedIds.has('test:a')).toBe(true)
      expect(model.value).toBe(false)

      enrollable.unselect()
      expect(group.selectedIds.has('test:a')).toBe(false)
    })

    it('should route mix and unmix through the ticket', () => {
      const group = createGroup()
      const model = shallowRef<boolean>(false)
      const enrollable = createEnrollable({ id: 'test:a', model, group })

      enrollable.mix()
      expect(group.mixedIds.has('test:a')).toBe(true)
      expect(enrollable.isMixed.value).toBe(true)

      enrollable.unmix()
      expect(group.mixedIds.has('test:a')).toBe(false)
      expect(enrollable.isMixed.value).toBe(false)
    })

    it('should forward indeterminate: true to group.register so ticket starts mixed', () => {
      const group = createGroup()
      const model = shallowRef<boolean>(false)

      const enrollable = createEnrollable({
        id: 'test:a',
        model,
        indeterminate: true,
        group,
      })

      expect(enrollable.isMixed.value).toBe(true)
      expect(group.mixedIds.has('test:a')).toBe(true)
    })

    it('should block mutations when disabled via ticket.disabled', () => {
      const group = createGroup()
      const model = shallowRef<boolean>(false)
      const enrollable = createEnrollable({
        id: 'test:a',
        model,
        disabled: true,
        group,
      })

      enrollable.toggle()
      enrollable.select()
      enrollable.mix()

      expect(group.selectedIds.has('test:a')).toBe(false)
      expect(group.mixedIds.has('test:a')).toBe(false)
    })
  })
})
