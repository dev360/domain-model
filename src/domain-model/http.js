import 'isomorphic-fetch'


export const HttpConfig = {
  credentials: 'same-origin',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
}

export class Http {
  static configure(options, headers) {
    HttpConfig.options = options
    HttpConfig.headers = headers
  }

  httpRequest(url, method = 'GET', payload = null, config = HttpConfig) {
    return new Promise((resolve, reject) => {
      const { headers, credentials } = config
      const options = {
        credentials,
        headers,
      }
      if (method !== 'GET') {
        options.method = method
      }
      if (payload) {
        options.body = JSON.stringify(payload)
      }

      fetch(url, options).then((response) => {
        const { status } = response
        response.json().then((data) => {
          // If serialization succeeds
          if (status >= 200 && status < 300) {
            resolve({ data, response })
          } else {
            const error = {
              type: response.statusText,
              response,
            }
            reject(error)
          }
        }).catch(() => {
          // If serialization fails
          if (status >= 200 && status < 300) {
            // It would seem more normal to receive
            // empty body on 201/204.. otherwise lets
            // trigger a warning.
            if (status !== 201 && status !== 204) {
              // eslint-disable-next-line no-console
              console.warn('JSON deserialization failed')
            }
            resolve({ response })
          } else {
            const error = {
              type: response.statusText,
              response,
            }
            reject(error)
          }
        })
      }).catch(() => {
        // If request fails alltogether
        const error = {
          type: 'Request failed',
        }
        reject(error)
      })
    })
  }

  get(url) {
    return this.httpRequest(url)
  }

  post(url, payload) {
    return this.httpRequest(url, 'POST', payload)
  }

  put(url, payload) {
    return this.httpRequest(url, 'PUT', payload)
  }

  delete(url, payload = null) {
    return this.httpRequest(url, 'DELETE', payload)
  }

}

export class Url {
  static getReplacements(url, params) {
    const re = /({)(.*?)(})+/g
    const replacements = {}
    let match = re.exec(url)
    while (match != null) {
      const attr = match[2]
      const text = match[0]
      const value = (params[attr] !== undefined) ? params[attr] : ''
      replacements[text] = value
      match = re.exec(url)
    }
    return replacements
  }

  static build(url, params) {
    const replacements = Url.getReplacements(url, params)
    let newUrl = url

    Object.keys(replacements).forEach((attr) => {
      const value = replacements[attr]
      newUrl = newUrl.replace(attr, value)
    })
    return newUrl
  }
}

export const http = new Http()
