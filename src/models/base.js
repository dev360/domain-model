import { http, Url } from './http'
import { ModelSerializer } from './serialization'

class Manager {

  constructor(props = {}) {
    if (props.model === undefined) {
      throw new Error('Model required')
    }
    this.Model = props.model
    this.http = http
  }

  get modelName() {
    const m = new this.Model()
    return m.constructor.name
  }

  get(params = {}) {
    const manager = this
    const Model = this.Model
    const handler = (resolve, reject) => {
      // Have better url formatting in the future
      if (!params.id) {
        reject({ message: 'invalid request, no id' })
        return
      }

      const baseUrl = Model.Meta.detail_url
      const url = Url.build(baseUrl, params)
      const request = manager.http.get(url)
      request
        .then((data) => {
          const item = ModelSerializer.deserialize(Model, data)
          resolve(item)
        })
        .catch((r) => {
          reject(r)
        })
    }
    return new Promise(handler)
  }

  all() {
    const Model = this.Model
    return new Promise((resolve, reject) => {
      const url = Model.meta.url
      const request = this.http.get(url)
      request.then((data) => {
        const items = data.map(item => ModelSerializer.deserialize(Model, item))
        resolve(items)
      }).catch((r) => {
        reject(r)
      })
    })
  }

  filter() {
  }
}


class Model {

  constructor(props) {
    if (props) {
      Object.keys(props).forEach((key) => {
        this[key] = props[key]
      })
    }
  }

  get pk() {
    return (this.id !== undefined) ? this.id : null
  }

  static get objects() {
    if (!this.objectsCache) {
      this.objectsCache = new Manager({ model: this })
    }
    return this.objectsCache
  }

  static get actions() {
    const keys = this.meta.actions || []
    const actions = {}
    keys.forEach(key => {
      actions[key] = `${this.modelName}_${key}`
    })
    return actions
  }

  static get _modelName() {
    return this.constructor.name
  }

  del() {
  }
}

module.exports = {
  Manager,
  Model,
}

