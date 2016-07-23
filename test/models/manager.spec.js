import expect from 'expect'
import { Manager } from 'domain-model'

import {
  Company,
  Employee,
  registerAll,
  unregisterAll,
} from '../fixtures/models'


describe('Manager', () => {
  before(() => {
    registerAll()
  })
  after(() => {
    unregisterAll()
  })

  const manager = new Manager({ model: Company })

  describe('constructor', () => {
    it('expects model as argument', () => {
      // eslint-disable-next-line no-new
      expect(() => { new Manager() }).toThrow(/Model required/)
    })
    it('sets model', () => {
      expect(manager.Model).toBe(Company)
    })
  })

  describe('(instance).modelName', () => {
    it('to return the class name of the model', () => {
      expect(manager.modelName).toBe('Company')
    })
  })


  describe('(instance).get', () => {
    it('calls http with right params', () => {
      const mgr = Company.objects
      const getCall = expect.spyOn(mgr.http, 'get').andReturn(new Promise((resolve) => {
        resolve()
      }))

      mgr.get({ id: 99 })
      expect(getCall).toHaveBeenCalledWith('/api/company/99/')
      getCall.restore()
    })

    it('returns a class instance', () => {
      const item = { id: 99, name: 'Olivia', email: 'olivia@me' }
      const mgr = Employee.objects
      const getCall = expect.spyOn(mgr.http, 'get').andReturn(new Promise((resolve) => {
        resolve(item)
      }))

      const response = mgr.get({ id: 99 })
      return response.then((employee) => {
        expect(employee.id).toBe(99)
        expect(employee.name).toBe('Olivia')
        expect(employee.hasEmail).toBe(true)
        expect(employee.constructor.name).toBe('Employee')
        getCall.restore()
      })
    })
  })
})
