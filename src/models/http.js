class Http {

  httpRequest(url, verb = 'GET', payload = null) {
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest()
      request.open(verb, url, true)
      request.onload = () => {
        if (request.status >= 200 && request.status < 400) {
          // Success!
          const data = JSON.parse(request.responseText)
          resolve(data, request)
        } else {
          // We reached our target server, but it returned an error
          reject(request)
        }
      }
      request.onerror = () => {
        reject(request)
      }

      if (payload !== null) {
        request.setRequestHeader('Content-Type', 'application/json')
        request.send(payload)
      } else {
        request.send()
      }
    })
  }

  get(url) {
    return this.httpRequest(url)
  }

  post(url, data) {
    return this.httpRequest(url, 'POST', data)
  }

  put(url, data) {
    return this.httpRequest(url, 'PUT', data)
  }

  delete(url, data = null) {
    return this.httpRequest(url, 'DELETE', data)
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
