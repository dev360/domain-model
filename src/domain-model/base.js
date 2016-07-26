import { http, Url } from './http'
import { ModelSerializer } from './serialization'
import { REGISTRY, register, unregister } from './decorators'

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
    return new Promise((resolve, reject) => {
      const Model = this.Model
      const url = Model.Meta.list_url
      this.http.get(url).then((data) => {
        const items = data.map(item => ModelSerializer.deserialize(Model, item))
        resolve(items)
      }).catch(reject)
    })
  }

  create(instance) {
    const baseUrl = this.Model.Meta.list_url
    const url = Url.build(baseUrl, instance)
    return new Promise((resolve, reject) => {
      this.http.post(url, instance).then((data) => {
        if (data) {
          resolve(new this.Model(data))
        } else {
          reject({ type: 'Unable to read response', instance: data })
        }
      }).catch(reject)
    })
  }

  update(instance) {
    const baseUrl = this.Model.Meta.detail_url
    const url = Url.build(baseUrl, instance)
    return new Promise((resolve, reject) => {
      this.http.put(url, instance).then((data) => {
        if (data) {
          resolve(new this.Model(data))
        } else {
          reject({ type: 'Unable to read response', instance: data })
        }
      }).catch(reject)
    })
  }

  delete(instance) {
    const baseUrl = this.Model.Meta.detail_url
    const url = Url.build(baseUrl, instance)
    return this.http.delete(url, instance)
  }
}


class Model {

  constructor(props) {
    if (!REGISTRY.get(this.constructor.name)) {
      throw new Error(`Use @register/register(${this.constructor.name}) to register your models`)
    }
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

  static get _modelName() {
    return this.constructor.name
  }

  static register() {
    register(this)
  }

  static unregister() {
    unregister(this)
  }

  get _model() {
    // No idea how else to do this..
    return REGISTRY.get(this.constructor.name)
  }

  delete() {
    const Cls = this._model // eslint-disable-line no-underscore-dangle
    return Cls.objects.delete(this)
  }

  save() {
    const Cls = this._model // eslint-disable-line no-underscore-dangle
    if (!this.id) {
      return Cls.objects.create(this)
    }
    return Cls.objects.update(this)
  }
}

module.exports = {
  Manager,
  Model,
}

