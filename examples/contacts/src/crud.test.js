import expect from 'expect'

import { Album } from './crud'

describe('Album', () => {
  before(() => {
  })

  describe('objects.all()', () => {
    it('gets all objects', () => {
      const promise = Album.objects.all().then((albums) => {
        expect(albums.length).toBe(100)
      })
      return promise
    })
  })

  describe('insert', () => {
    const item = new Album({ title: 'Dark Side of the Moon' })
    const promise = item.save().then((savedItem) => {
      expect(savedItem.id).toBe(101)
      expect(savedItem.name).toBe('Dark Side of the Moon')
    }).catch(() => {
      throw new Error('Should never happen')
    })
    return promise
  })

  describe('update', () => {
    const item = new Album({ id: 100, title: 'Dark Side of the Moon' })
    const promise = item.save().then((savedItem) => {
      expect(savedItem.id).toBe(100)
      expect(savedItem.name).toBe('Dark Side of the Moon')
    }).catch(() => {
      throw new Error('Should never happen')
    })
    return promise
  })
})
