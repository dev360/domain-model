import { Model, fields, register, unregister } from 'domain-model'


export class Cart extends Model {
  static get Meta() {
    return {
      detail_url: '/api/cart/{id}/',
      list_url: '/api/cart/',
    }
  }
}


export class Order extends Model {
  static get customer() {
    return new fields.ForeignKey({ model: 'Customer', relatedName: 'orders' })
  }

  static get cart() {
    return new fields.OneToOneField({ model: Cart, relatedName: 'order' })
  }

  static get Meta() {
    return {
      detail_url: '/api/orders/{id}/',
      list_url: '/api/orders/',
    }
  }
}

export class OrderItem extends Model {
  static get order() {
    return new fields.ForeignKey({ model: Order, relatedName: 'items' })
  }

  static get Meta() {
    return {
      detail_url: '/api/orders/{orderId}/items/{id}/',
      list_url: '/api/orders/{orderId}/items/',
    }
  }
}

export class Customer extends Model {

  static get Meta() {
    return {
      detail_url: '/api/customer/{id}/',
      list_url: '/api/customer/',
    }
  }
}

export class Company extends Model {

  static get Meta() {
    return {
      detail_url: '/api/company/{id}/',
      list_url: '/api/company/',
    }
  }
}

export class Person extends Model {
  static get Meta() {
    return {
      detail_url: '/api/people/{id}/',
      list_url: '/api/people/',
    }
  }
}

export class Employee extends Model {

  static get person() {
    return new fields.OneToOneField({ model: 'Person', relatedName: 'employee' })
  }

  static get company() {
    return new fields.ForeignKey({ model: Company, relatedName: 'employees' })
  }

  static get Meta() {
    return {
      detail_url: '/api/employee/{id}/',
      list_url: '/api/employee/',
    }
  }

  get hasEmail() {
    return (this.email || null) != null
  }
}


export function registerAll() {
  register(Order)
  register(OrderItem)
  register(Customer)
  register(Employee)
  register(Company)
  register(Cart)
  register(Person)
}

export function unregisterAll() {
  unregister(Order)
  unregister(OrderItem)
  unregister(Customer)
  unregister(Employee)
  unregister(Company)
  unregister(Cart)
  unregister(Person)
}
