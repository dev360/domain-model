import expect from 'expect'

import { ModelSerializer } from 'domain-model'

import {
  OrderItem,
  registerAll,
  unregisterAll,
} from '../fixtures/models'

describe('ModelSerializer', () => {
  before(() => {
    registerAll()
  })
  after(() => {
    unregisterAll()
  })

  describe('getFieldAttrs', () => {
    it('returns the field names', () => {
      const fieldAttrs = ModelSerializer.getFieldAttributes(OrderItem)
      expect(fieldAttrs[0]).toBe('order')
    })
  })

  describe('getRelatedFields', () => {
    it('returns the field names', () => {
      const relatedFields = ModelSerializer.getRelatedFields(OrderItem)
      expect(relatedFields.size).toBe(0)
    })
  })
})
