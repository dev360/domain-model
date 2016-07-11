import expect from 'expect'
import { Manager, Model } from '../../src/models'


describe('Manager', () => {
  class Person extends Model.create() {
    get hasEmail() {
      return (this.email !== undefined)
    }

    static get Meta() {
      return {
        detail_url: '/api/contacts/{id}/',
        list_url: '/api/contacts/',
      }
    }

  }
  const manager = new Manager({ model: Person })

  describe('constructor', () => {
    it('expects model as argument', () => {
      // eslint-disable-next-line no-new
      expect(() => { new Manager() }).toThrow(/Model required/)
    })
    it('sets model', () => {
      expect(manager.Model).toBe(Person)
    })
  })

  describe('(instance).modelName', () => {
    it('to return the class name of the model', () => {
      expect(manager.modelName).toBe('Person')
    })
  })


  describe('(instance).get', () => {
    it('calls http with right params', () => {
      const mgr = Person.objects
      const getCall = expect.spyOn(mgr.http, 'get').andReturn(new Promise((resolve) => {
        resolve()
      }))

      mgr.get({ id: 99 })
      expect(getCall).toHaveBeenCalledWith('/api/contacts/99/')
      getCall.restore()
    })

    it('returns a class instance', () => {
      const item = { id: 99, name: 'Olivia', email: 'olivia@me' }
      const mgr = Person.objects
      const getCall = expect.spyOn(mgr.http, 'get').andReturn(new Promise((resolve) => {
        resolve(item)
      }))

      const response = mgr.get({ id: 99 })
      return response.then((person) => {
        expect(person.id).toBe(99)
        expect(person.name).toBe('Olivia')
        expect(person.hasEmail).toBe(true)
        expect(person.constructor.name).toBe('Person')
        getCall.restore()
      })
    })
  })
})
