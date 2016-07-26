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
    it('calls http with correct params', () => {
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

  describe('(instance).all', () => {
    it('calls http with correct params', () => {
      const mgr = Company.objects
      const getCall = expect.spyOn(mgr.http, 'get').andReturn(new Promise((resolve) => {
        resolve()
      }))

      mgr.all()
      expect(getCall).toHaveBeenCalledWith('/api/company/')
      getCall.restore()
    })

    it('returns a class instance', () => {
      const data = { id: 99, name: 'Olivia', email: 'olivia@me' }
      const mgr = Employee.objects
      const getCall = expect.spyOn(mgr.http, 'get').andReturn(new Promise((resolve) => {
        resolve([data])
      }))
      const response = mgr.all({ id: 99 })
      return response.then((items) => {
        expect(items.length).toBe(1)
        const item = items[0]
        expect(item.id).toBe(99)
        expect(item.name).toBe('Olivia')
        expect(item.hasEmail).toBe(true)
        expect(item.constructor.name).toBe('Employee')
        getCall.restore()
      })
    })
  })

  describe('(instance).create()', () => {
    it('calls http with correct params', () => {
      const mgr = Company.objects
      const spy = expect.spyOn(mgr.http, 'post').andReturn(new Promise((resolve) => {
        resolve()
      }))

      const payload = { id: 99 }
      mgr.create(payload)
      expect(spy).toHaveBeenCalledWith('/api/company/', payload)
      spy.restore()
    })
  })

  describe('(instance).update()', () => {
    it('calls http with correct params', () => {
      const mgr = Company.objects
      const spy = expect.spyOn(mgr.http, 'put').andReturn(new Promise((resolve) => {
        resolve()
      }))

      const payload = { id: 99 }
      mgr.update(payload)
      expect(spy).toHaveBeenCalledWith('/api/company/99/', payload)
      spy.restore()
    })
  })

  describe('(instance).delete()', () => {
    it('calls http with correct params', () => {
      const mgr = Company.objects
      const spy = expect.spyOn(mgr.http, 'delete').andReturn(new Promise((resolve) => {
        resolve()
      }))

      const payload = { id: 99 }
      mgr.delete(payload)
      expect(spy).toHaveBeenCalledWith('/api/company/99/', payload)
      spy.restore()
    })
  })
})
