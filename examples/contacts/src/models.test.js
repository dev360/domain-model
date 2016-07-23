import expect from 'expect'

import { User } from './models'

describe('User', () => {
  describe('objects.get', () => {
    let user = null
    before(() => {
      const response = User.objects.get({ id: 1 })
      return response.then((data) => {
        user = data
      })
    })

    it('returns correct data', () => {
      expect(user.id).toBe(1)
      expect(user.name).toBe('Leanne Graham')
      expect(user.company).toNotBe(null)
      expect(user.company.constructor.name).toBe('Company')
      expect(user.company.name).toBe('Romaguera-Crona')
    })
  })
})
