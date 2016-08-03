import expect from 'expect'

import * as fields from 'domain-model/fields'


import {
  Customer,
  Order,
  OrderItem,
  Company,
  Employee,
  registerAll,
  unregisterAll,
} from '../../fixtures/models'

describe('Fields', () => {
  describe('ForeignKey', () => {
    before(() => {
      registerAll()
    })
    after(() => {
      unregisterAll()
    })

    describe('constructor', () => {
      it('expects model as argument', () => {
        // eslint-disable-next-line no-unused-vars
        expect(() => { const field = new fields.ForeignKey() }).toThrow(/Model required/)
      })
      it('sets model', () => {
        expect(OrderItem.order.Model).toBe(Order)
      })
      it('sets model, even if string', () => {
        expect(Order.customer.Model).toBe(Customer)
      })
    })

    describe('[Model].objects.get', () => {
      it('casts to correct type', () => {
        const manager = Employee.objects
        const getCall = expect.spyOn(manager.http, 'get').andReturn(new Promise((resolve) => {
          const data = {
            id: 2,
            name: 'Christian',
            company: {
              id: 99,
              name: 'Acme Inc.',
            },
          }
          resolve({ data })
        }))
        const resp = manager.get({ id: 99 })
        return resp.then((employee) => {
          expect(employee.constructor.name).toBe('Employee')
          expect(employee.name).toBe('Christian')
          expect(employee.company.constructor.name).toBe('Company')
          expect(employee.company.id).toBe(99)
          expect(employee.company.name).toBe('Acme Inc.')
          getCall.restore()
        })
      })

      it('resolves relatedName', () => {
        const manager = Company.objects
        const getCall = expect.spyOn(manager.http, 'get').andReturn(new Promise((resolve) => {
          const data = {
            id: 99,
            name: 'Acme Inc.',
            employees: [
              {
                id: 2,
                name: 'Christian',
              },
            ],
          }
          resolve({ data })
        }))
        const resp = manager.get({ id: 99 })
        return resp.then((company) => {
          expect(company.constructor.name).toBe('Company')
          expect(company.name).toBe('Acme Inc.')
          expect(company.employees[0].constructor.name).toBe('Employee')
          expect(company.employees[0].id).toBe(2)
          expect(company.employees[0].name).toBe('Christian')
          getCall.restore()
        })
      })
    })
  })
})
