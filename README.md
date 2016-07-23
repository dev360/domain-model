# domain-model
Allows you to define django-style [domain driven models](http://martinfowler.com/eaaCatalog/domainModel.html) for your REST endpoints in javascript. See [wiki](https://github.com/dev360/domain-model/wiki) for more information about the API.

Built on top of `isomorphic-fetch`, and returns ES6 promises. Originally intended to be used with react/redux.

## To install
```npm install domain-model```

## Example
```js
import { Model, fields } from 'domain-model'

class Company extends Model {}
Company.register()

class Address extends Model {}
Address.register()

export class User extends Model {

  get displayName() {
    return `${this.name} [${this.email}]`
  }

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

...

// To use:
User.objects.get({ id: 1 }).then((user) => {
  console.dir(user)
})

User.objects.all().then((users) => {
  console.dir(users)
})
  
```
