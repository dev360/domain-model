import expect from 'expect'
import fetchMock from 'fetch-mock'

import { Http } from 'models/http'

describe('Http', () => {
  describe('httpRequest', () => {
    let request = null
    const url = '/api/1.0/orders/'

    beforeEach(() => {
      fetchMock.restore()
      fetchMock.mock(url, {})
      const http = new Http()
      request = http.httpRequest(url)
      return request
    })

    describe('default settings', () => {
      it('Credentials are \'same-origin\'', () => {
        const opts = fetchMock.lastOptions(url)
        expect(opts.credentials).toBe('same-origin')
      })

      it('Header: Accept is \'application/json\'', () => {
        const opts = fetchMock.lastOptions(url)
        expect(opts.headers.Accept).toBe('application/json')
      })

      it('Header: Content-Type is \'application/json\'', () => {
        const opts = fetchMock.lastOptions(url)
        expect(opts.headers['Content-Type']).toBe('application/json')
      })

      it('method is GET by default', () => {
        const opts = fetchMock.lastOptions(url)
        expect(opts.method).toBe(undefined)
      })
    })

    it('calls fetch with correct url', () => {
      expect(fetchMock.called(url))
    })

    it('resolves 200', () => {
      fetchMock.restore()
      fetchMock.mock(url, { test: 'hello' })
      const http = new Http()
      request = http.httpRequest(url)
      return request.then((data) => {
        expect(data.test).toBe('hello')
      }).catch(() => {
        throw new Error('Promise should not resolve')
      })
    })
    it('resolves 201', () => {
      fetchMock.restore()
      fetchMock.mock(url, { status: 201, body: { test: 'hello' } })
      const http = new Http()
      request = http.httpRequest(url)
      return request.then((data) => {
        expect(data.test).toBe('hello')
      }).catch(() => {
        throw new Error('Promise should not resolve')
      })
    })

    it('rejects 200 /w invalid json', () => {
      fetchMock.restore()
      fetchMock.mock(url, "{ test: 'hello")
      const http = new Http()
      request = http.httpRequest(url)
      return request.then(() => {
        throw new Error('Promise should not resolve')
      }).catch((error) => {
        expect(error.type).toBe('JSON serialization failed')
      })
    })


    it('rejects 301', () => {
      fetchMock.restore()
      fetchMock.mock(url, 301)
      const http = new Http()
      request = http.httpRequest(url)
      return request.then(() => {
        throw new Error('Promise should not resolve')
      }).catch((error) => {
        expect(error.type).toBe('Moved Permanently')
        expect(error.response.status).toBe(301)
      })
    })

    it('rejects 302', () => {
      fetchMock.restore()
      fetchMock.mock(url, 302)
      const http = new Http()
      request = http.httpRequest(url)
      return request.then(() => {
        throw new Error('Promise should not resolve')
      }).catch((error) => {
        expect(error.type).toBe('Found')
        expect(error.response.status).toBe(302)
      })
    })

    it('rejects 400', () => {
      fetchMock.restore()
      fetchMock.mock(url, 400)
      const http = new Http()
      request = http.httpRequest(url)
      return request.then(() => {
        throw new Error('Promise should not resolve')
      }).catch((error) => {
        expect(error.type).toBe('Bad Request')
        expect(error.response.status).toBe(400)
      })
    })

    it('rejects 401', () => {
      fetchMock.restore()
      fetchMock.mock(url, 401)
      const http = new Http()
      request = http.httpRequest(url)
      return request.then(() => {
        throw new Error('Promise should not resolve')
      }).catch((error) => {
        expect(error.type).toBe('Unauthorized')
        expect(error.response.status).toBe(401)
      })
    })

    it('rejects 403', () => {
      fetchMock.restore()
      fetchMock.mock(url, 403)
      const http = new Http()
      request = http.httpRequest(url)
      return request.then(() => {
        throw new Error('Promise should not resolve')
      }).catch((error) => {
        expect(error.type).toBe('Forbidden')
        expect(error.response.status).toBe(403)
      })
    })

    it('rejects 404', () => {
      fetchMock.restore()
      fetchMock.mock(url, 404)
      const http = new Http()
      request = http.httpRequest(url)
      return request.then(() => {
        throw new Error('Promise should not resolve')
      }).catch((error) => {
        expect(error.type).toBe('Not Found')
        expect(error.response.status).toBe(404)
      })
    })

    it('rejects 500 ', () => {
      fetchMock.restore()
      fetchMock.mock(url, 500)
      const http = new Http()
      request = http.httpRequest(url)
      return request.then(() => {
        throw new Error('Promise should not resolve')
      }).catch((error) => {
        expect(error.type).toBe('Internal Server Error')
        expect(error.response.status).toBe(500)
      })
    })
  })

  describe('get', () => {
     
  })

  describe('post', () => {
  })

  describe('put', () => {

  })

  describe('delete', () => {
  
  })

})
