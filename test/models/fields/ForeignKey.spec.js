import expect from 'expect'
import { Model, register } from '../../../src/models'
import * as fields from '../../../src/models/fields'

describe('Fields', () => {
  describe('ForeignKey', () => {
    class Company extends Model {

      static get Meta() {
        return {
          detail_url: '/api/company/{id}/',
          list_url: '/api/company/',
        }
      }
    }
    register(Company)

    class Employee extends Model {
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
    register(Employee)


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
      it('casts to correct type', () => {
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

      it('resolves relatedName', () => {
        const manager = Company.objects
        const getCall = expect.spyOn(manager.http, 'get').andReturn(new Promise((resolve) => {
          resolve({
            id: 99,
            name: 'Acme Inc.',
            employees: [
              {
                id: 2,
                name: 'Christian',
              },
            ],
          })
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
