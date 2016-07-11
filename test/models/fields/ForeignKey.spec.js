import expect from 'expect'
import { Model } from '../../../src/models'
import * as fields from '../../../src/models/fields'

describe('Fields', () => {
  describe('ForeignKey', () => {
    class Company extends Model.create() {

      static get Meta() {
        return {
          detail_url: '/api/company/{id}/',
          list_url: '/api/company/',
        }
      }
    }

    class Employee extends Model.create() {
      static get company() {
        return new fields.ForeignKey({ model: Company, relatedName: 'employees' })
      }

      static get Meta() {
        return {
          detail_url: '/api/contacts/{id}/',
          list_url: '/api/contacts/',
        }
      }
    }


    describe('constructor', () => {
      it('expects model as argument', () => {
        // eslint-disable-next-line no-unused-vars
        expect(() => { const field = new fields.ForeignKey() }).toThrow(/Model required/)
      })
      it('sets model', () => {
        expect(Employee.company.Model).toBe(Company)
      })
    })

    describe('[Model].objects.get', () => {
      it('traverses relationships', () => {
        const manager = Employee.objects
        const getCall = expect.spyOn(manager.http, 'get').andReturn(new Promise((resolve) => {
          resolve({
            id: 2,
            name: 'Christian',
            company: {
              id: 99,
              name: 'Acme Inc.',
            },
          })
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
    })
  })
})
