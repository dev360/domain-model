import expect from 'expect'
import { Model } from '../../src/models'


describe('Model', () => {

  const params = {
    id: 1,
    name: "Olivia"
  }
  class Person extends Model {
     
     static get Meta() {
       return {
         detail_url: '/api/contacts/{id}/',
         list_url: '/api/contacts/'
       }
     }
  }
  const model = new Person(params)
  const emptyModel = new Person()

  describe('constructor', () => {
    it('maps params to instance attributes', () => {
      expect(model.id).toBe(1)
      expect(model.name).toBe("Olivia")
    })
  })

  describe('(instance).pk', () => {
    it('returns the id', () => {
      expect(model.pk).toBe(1)
    }) 
    it('returns null if no id defined', () => {
      expect(emptyModel.pk).toBe(null)
    })
    it('returns 0 if id is 0', () => {
      const anotherModel = new Model({ id: 0 })
      expect(anotherModel.pk).toBe(0)
    })
  })

  describe('(static).objects', () => {
    it('calls Manager with model', () => {
      const manager = Person.objects
      expect(manager.model).toBe(Person)
    })
    it('returns the same manager class every time', () => {
      const call1 = Person.objects
      const call2 = Person.objects
      expect(call1).toBe(call2)
    })
  })

  describe('(static).Meta', () => {
    it('returns detail_url', () => {
      expect(Person.Meta.detail_url).toBe('/api/contacts/{id}/')
    })
    it('returns list_url', () => {
      expect(Person.Meta.list_url).toBe('/api/contacts/')
    })
  })
})

