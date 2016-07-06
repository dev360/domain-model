import { http, Url } from './http'

class Manager {

  constructor(props={}) {
    if(props.model===undefined) {
      throw new Error('Model required')
    }
    this.model = props.model
    this.http = http
  }

  get modelName() {
    const m = new this.model()
    return m.constructor.name
  }

  get(params={}) {
    let manager = this
    let Model = this.model
    return new Promise((resolve, reject) => {

      // Have better url formatting in the future
      if(!params.id) {
        reject({ message: 'invalid request, no id' }) 
        return
      }

      let base_url = Model.Meta.detail_url
      let url = Url.build(base_url, params)
      let request = manager.http.get(url)
      request
        .then((data) => {
          let item = new Model(data)
          resolve(item)
        })
        .catch((request) => {
          reject(request)
        })
    })
  }

  all() {
    let Model = this.model
    return new Promise((resolve, reject) => {
      let url = Model.meta.url
      let request = this.http.get(url)
      request
        .then((data) => {
          let items = data.map( item => {
            return new Model(item)
          })
          resolve(items)
        })
        .catch((request) => {
          reject(request)
        })
    })


  }

  filter() {
     
  }
}


class Model {

  constructor(props) {
    for (let key in props) {
      this[key] = props[key]
    }
  }

  get pk() {
    return (this.id!==undefined) ? this.id : null
  }

  static get objects() {
    if(!this._objects) {
      this._objects = new Manager({ model: this })
    }
    return this._objects
  }

  static get actions() {
    let keys = this.meta.actions || []
    let actions = {}
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
  Model
}

