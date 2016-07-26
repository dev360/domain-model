import expect from 'expect'
import { Model } from 'domain-model'

import { Order } from '../fixtures/models'

describe('Model', () => {
  const params = {
    id: 1,
    name: 'Olivia',
  }

  class Person extends Model {
    static get Meta() {
      return {
        detail_url: '/api/contacts/{id}/',
        list_url: '/api/contacts/',
      }
    }
  }
  Person.register()

  const model = new Person(params)
  const emptyModel = new Person()

  describe('extends', () => {
    it('it throws exception', () => {
      expect(() => {
        class Foo extends Model {
        }
        // eslint-disable-next-line no-unused-vars
        const foo = new Foo()
      }).toThrow(/Use @register\/register\(Foo\) to register your models/)
    })
  })

  describe('constructor', () => {
    it('maps params to instance attributes', () => {
      expect(model.id).toBe(1)
      expect(model.name).toBe('Olivia')
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
      class AnotherModel extends Model {
      }
      AnotherModel.register()
      const anotherModel = new AnotherModel({ id: 0 })
      expect(anotherModel.pk).toBe(0)
    })
  })

  describe('(instance).save()', () => {
    it('calls manager.create() when no id', () => {
      const spy = expect.spyOn(Order.objects, 'create').andReturn(null)
      const instance = new Order({ name: 'Christian' })
      instance.save()
      expect(spy).toHaveBeenCalledWith(instance)
      spy.restore()
    })

    it('calls manager.update() when there is id', () => {
      const spy = expect.spyOn(Order.objects, 'update').andReturn(null)
      const instance = new Order({ id: 2, name: 'Christian' })
      instance.save()
      expect(spy).toHaveBeenCalledWith(instance)
      spy.restore()
    })
  })

  describe('(instance).delete()', () => {
    it('calls manager.delete()', () => {
      const manager = Order.objects
      const spy = expect.spyOn(manager, 'delete').andReturn(null)
      const instance = new Order({ id: 2, name: 'Christian' })
      instance.delete()
      expect(spy).toHaveBeenCalledWith(instance)
      spy.restore()
    })
  })

  describe('(static).objects', () => {
    it('calls Manager with model', () => {
      const manager = Person.objects
      expect(manager.Model).toBe(Person)
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

