class Http {

  constructor() {
  }

  _httpRequest(url, verb='GET', payload=null) {
    return new Promise((resolve, reject) => {
      var request = new XMLHttpRequest()
      request.open(verb, url, true)
      
      request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
          // Success!
          var data = JSON.parse(request.responseText)
          resolve(data, request)
        } else {
          // We reached our target server, but it returned an error
          reject(request)
        }
      }
      request.onerror = function() {
        console.dir(arguments)
        reject(request)
      }

      if (payload !== null) {
        request.setRequestHeader('Content-Type', 'application/json')
        request.send(data)
      }
      else {
        request.send()
      }
    })
  }

  get(url) {
    console.log('TESTST')
    return this._httpRequest(url)
  }

  post(url, data) {
    return this._httpRequest(url, 'POST', data)
  }

  put(url, data) {
    return this._httpRequest(url, 'PUT', data)
  }

  delete(url, data=null) {
    return this._httpRequest(url, 'DELETE', data)
  }

  
}

export class Url {
  static getReplacements(url, params) {
    const re = /({)(.*?)(})+/g
    let match;
    let replacements = {}
    while ((match = re.exec(url)) != null) {
      let attr = match[2]
      let text = match[0]
      let value = (params[attr] !== undefined) ? params[attr] : ""
      replacements[text] = value
    }
    return replacements;
  }

  static build(url, params) {
    let replacements = Url.getReplacements(url, params)
    for (let attr in replacements) {
      let value = replacements[attr]
      url = url.replace(attr, value)
    }
    return url
  }
}
 
export const http = new Http()
