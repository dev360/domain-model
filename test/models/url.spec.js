import expect from 'expect'
import { Url } from 'domain-model'


describe('Url', () => {
  describe('build', () => {
    describe('returns correct url', () => {
      it('with one param', () => {
        const url = '/company/{id}'
        const params = { id: 1 }
        expect(Url.build(url, params)).toBe('/company/1')
      })

      it('with multiple params', () => {
        const url = '/company/{companyId}/contacts/{id}'
        const params = { id: 2, companyId: 1 }
        expect(Url.build(url, params)).toBe('/company/1/contacts/2')
      })

      it('when param missing', () => {
        const url = '/company/{companyId}/contacts/{id}'
        const params = { }
        expect(Url.build(url, params)).toBe('/company//contacts/')
      })
    })
  })
})

