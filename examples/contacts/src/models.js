import { Model, fields } from 'domain-model'

export class User extends Model {

  static get address() {
    return new fields.ForeignKey({ model: 'Address' })
  }

  static get company() {
    return new fields.ForeignKey({ model: 'Company' })
  }

  static get Meta() {
    return {
      detail_url: 'https://jsonplaceholder.typicode.com/users/{id}/',
      list_url: 'https://jsonplaceholder.typicode.com/users/',
    }
  }
}
User.register()

export class Address extends Model {

}
Address.register()

export class Company extends Model {

}
Company.register()
