import expect from 'expect'

import { User } from './models'

describe('User', () => {
  let user = null
  before(() => {
    const response = User.objects.get({ id: 1 })
    return response.then((data) => {
      user = data
    })
  })

  describe('objects.get', () => {
    it('returns correct data', () => {
      expect(user.id).toBe(1)
      expect(user.name).toBe('Leanne Graham')
      expect(user.company).toNotBe(null)
      expect(user.company.constructor.name).toBe('Company')
      expect(user.company.name).toBe('Romaguera-Crona')
    })
  })

  describe('this.displayName', () => {
    it('returns correct string', () => {
      expect(user.displayName).toBe('Leanne Graham [Sincere@april.biz]')
    })
  })
})
