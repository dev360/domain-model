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
    it('calls fetch with method=GET', () => {
      let request = null
      const url = '/api/1.0/orders/'
      fetchMock.restore()
      fetchMock.mock(url, {})
      const http = new Http()
      request = http.get(url)
      return request.then(() => {
        const opts = fetchMock.lastOptions(url)
        expect(opts.method).toBe(undefined)
      })
    })
  })

  describe('post', () => {
    it('calls fetch with method=POST', () => {
      let request = null
      const url = '/api/1.0/orders/'
      fetchMock.restore()
      fetchMock.mock(url, {})
      const http = new Http()
      request = http.post(url, { test: true })
      return request.then(() => {
        const opts = fetchMock.lastOptions(url)
        expect(opts.method).toBe('POST')
      })
    })

    it('calls fetch with payload', () => {
      let request = null
      const url = '/api/1.0/orders/'
      fetchMock.restore()
      fetchMock.mock(url, {})
      const http = new Http()

      const payload = { test: true }
      request = http.post(url, payload)
      return request.then(() => {
        const opts = fetchMock.lastOptions(url)
        expect(opts.body).toBe(JSON.stringify(payload))
      })
    })

    it('calls makeRequest', () => {
      let request = null
      const url = '/api/1.0/test/'
      const http = new Http()
      const payload = { test: true }
      const response = new Promise((resolve) => { resolve(payload) })
      const httpRequest = expect.spyOn(http, 'httpRequest').andReturn(response)
      request = http.post(url, payload)
      return request.then((data) => {
        expect(data).toBe(payload)
        expect(httpRequest).toHaveBeenCalledWith(url, 'POST', payload)
      }).catch(() => {
        throw new Error('Should not error out')
      })
    })
  })

  describe('put', () => {
    it('calls fetch with method=PUT', () => {
      let request = null
      const url = '/api/1.0/orders/'
      fetchMock.restore()
      fetchMock.mock(url, {})
      const http = new Http()
      request = http.put(url, { test: true })
      return request.then(() => {
        const opts = fetchMock.lastOptions(url)
        expect(opts.method).toBe('PUT')
      })
    })

    it('calls fetch with payload', () => {
      let request = null
      const url = '/api/1.0/orders/'
      fetchMock.restore()
      fetchMock.mock(url, {})
      const http = new Http()

      const payload = { test: true }
      request = http.put(url, payload)
      return request.then(() => {
        const opts = fetchMock.lastOptions(url)
        expect(opts.body).toBe(JSON.stringify(payload))
      })
    })

    it('calls makeRequest', () => {
      let request = null
      const url = '/api/1.0/test/'
      const http = new Http()
      const payload = { test: true }
      const response = new Promise((resolve) => { resolve(payload) })
      const httpRequest = expect.spyOn(http, 'httpRequest').andReturn(response)
      request = http.put(url, payload)
      return request.then((data) => {
        expect(data).toBe(payload)
        expect(httpRequest).toHaveBeenCalledWith(url, 'PUT', payload)
      }).catch(() => {
        throw new Error('Should not error out')
      })
    })
  })

  describe('delete', () => {
    it('calls fetch with method=DELETE', () => {
      let request = null
      const url = '/api/1.0/orders/'
      fetchMock.restore()
      fetchMock.mock(url, {})
      const http = new Http()
      request = http.delete(url, { test: true })
      return request.then(() => {
        const opts = fetchMock.lastOptions(url)
        expect(opts.method).toBe('DELETE')
      })
    })

    it('calls fetch with payload', () => {
      // NOTE: not sure if this scenario really makes sense.
      // I see no reason why Http wrapper shouldnt support
      // a body on a delete call though.
      let request = null
      const url = '/api/1.0/orders/'
      fetchMock.restore()
      fetchMock.mock(url, {})
      const http = new Http()

      const payload = { test: true }
      request = http.delete(url, payload)
      return request.then(() => {
        const opts = fetchMock.lastOptions(url)
        expect(opts.body).toBe(JSON.stringify(payload))
      })
    })

    it('calls makeRequest', () => {
      let request = null
      const url = '/api/1.0/test/'
      const http = new Http()
      const payload = { test: true }
      const response = new Promise((resolve) => { resolve(payload) })
      const httpRequest = expect.spyOn(http, 'httpRequest').andReturn(response)
      request = http.delete(url, payload)
      return request.then((data) => {
        expect(data).toBe(payload)
        expect(httpRequest).toHaveBeenCalledWith(url, 'DELETE', payload)
      }).catch(() => {
        throw new Error('Should not error out')
      })
    })
  })
})