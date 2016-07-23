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

      const request = fetch(url, options).then((response) => {
        if (response.status >= 200 && response.status < 300) {
          response.json().then((data) => {
            resolve(data, request)
          }).catch(() => {
            const error = {
              type: 'JSON serialization failed',
              response,
            }
            reject(error)
          })
        }
        if (response.status >= 300) {
          const error = {
            type: response.statusText,
            response,
          }
          reject(error)
        }
      }).catch((response) => {
        const error = {
          type: 'Request failed',
          response,
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
