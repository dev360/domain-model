import expect from 'expect'

import * as fields from 'domain-model/fields'


import {
  Order,
  Person,
  Employee,
  registerAll,
  unregisterAll,
} from '../../fixtures/models'

describe('Fields', () => {
  describe('OneToOneField', () => {
    before(() => {
      registerAll()
    })
    after(() => {
      unregisterAll()
    })

    describe('constructor', () => {
      it('expects model as argument', () => {
        // eslint-disable-next-line no-unused-vars
        expect(() => { const field = new fields.OneToOneField() }).toThrow(/Model required/)
      })
      it('sets model', () => {
        expect(Order.cart.Model.name).toBe('Cart')
      })
      it('sets model, even if string', () => {
        expect(Employee.person.Model.name).toBe('Person')
      })
    })

    describe('[Model].objects.get', () => {
      it('casts to correct type', () => {
        const manager = Employee.objects
        const getCall = expect.spyOn(manager.http, 'get').andReturn(new Promise((resolve) => {
          const data = {
            id: 2,
            jobTitle: 'Software Engineer',
            person: {
              id: 99,
              name: 'Christian',
            },
          }
          resolve({ data })
        }))
        const resp = manager.get({ id: 99 })
        return resp.then((employee) => {
          expect(employee.constructor.name).toBe('Employee')
          expect(employee.jobTitle).toBe('Software Engineer')
          expect(employee.person.constructor.name).toBe('Person')
          expect(employee.person.id).toBe(99)
          expect(employee.person.name).toBe('Christian')
          getCall.restore()
        })
      })

      it('resolves relatedName', () => {
        const manager = Person.objects
        const getCall = expect.spyOn(manager.http, 'get').andReturn(new Promise((resolve) => {
          const data = {
            id: 99,
            name: 'Christian',
            employee: {
              id: 2,
              jobTitle: 'Software Engineer',
            },
          }
          resolve({ data })
        }))
        const resp = manager.get({ id: 99 })
        return resp.then((company) => {
          expect(company.constructor.name).toBe('Person')
          expect(company.name).toBe('Christian')
          expect(company.employee.constructor.name).toBe('Employee')
          expect(company.employee.id).toBe(2)
          expect(company.employee.jobTitle).toBe('Software Engineer')
          getCall.restore()
        })
      })
    })
  })
})
