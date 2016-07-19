import includes from 'array-includes'

import * as fields from './fields'
import { REGISTRY } from './decorators'

const RELATED_CACHE = new Map()
const FIELDS_CACHE = new Map()

export class ModelSerializer {

  static getFieldAttributes(Model) {
    const allAttrs = Object.getOwnPropertyNames(Model)
    const reserved = ['name', 'length', 'objectsCache', 'Meta', 'prototype']
    function isField(attr) {
      if (includes(reserved, attr)) {
        return false
      }
      return Model[attr] instanceof fields.BaseField
    }
    return allAttrs.filter(isField)
  }

  static getRelatedFields(Model) {
    if (RELATED_CACHE.get(Model.name) === undefined) {
      const items = new Map()
      // For every class in registry
      for (const [className, Cls] of REGISTRY.entries()) {
        // If its not the class we are trying to
        // resolve related fields for
        if (className !== Model.name) {
          const fieldAttrs = ModelSerializer.getFieldAttributes(Cls)
          const relatedFieldTypes = ['ForeignKey', 'OneToOneField']
          fieldAttrs.forEach((attr) => {
            const field = Cls[attr]
            const isRelatedField = includes(relatedFieldTypes, field.constructor.name)
            const isSameClass = field.Model === Model
            // If the field type has relatedName, then
            // store the field relation
            if (isRelatedField && field.relatedName && isSameClass) {
              items.set(field, Cls)
            }
          })
        }
      }
      RELATED_CACHE.set(Model.name, items)
    }
    return RELATED_CACHE.get(Model.name)
  }

  static getFields(Model) {
    if (FIELDS_CACHE.get(Model.name) === undefined) {
      const items = new Map()
      const fieldAttributes = ModelSerializer.getFieldAttributes(Model)
      fieldAttributes.forEach((attr) => {
        const field = Model[attr]
        items.set(attr, field)
      })
      FIELDS_CACHE.set(Model.name, items)
    }
    return FIELDS_CACHE.get(Model.name)
  }

  static deserializeAttrs(Model, data) {
    const instance = data
    const fieldsAttributes = ModelSerializer.getFields(Model)
    for (const [attr, field] of fieldsAttributes.entries()) {
      const attrData = instance[attr]
      if (attrData) {
        switch (field.constructor.name) {
          case 'ForeignKey':
            instance[attr] = ModelSerializer.deserialize(field.Model, attrData)
            break
          case 'OneToOneField':
            instance[attr] = ModelSerializer.deserialize(field.Model, attrData)
            break
          default:
            break
        }
      }
    }
    return instance
  }

  static deserializeRelatedAttrs(Model, data) {
    const instance = data
    const relatedAttributes = ModelSerializer.getRelatedFields(Model)

    for (const [field, Cls] of relatedAttributes.entries()) {
      let attr = null
      let value = null
      if (field.constructor.name === 'ForeignKey') {
        attr = field.relatedName
        value = instance[attr]
        if (value && value instanceof Array) {
          instance[attr] = value.map((item) => ModelSerializer.deserialize(Cls, item))
        }
      }
      if (field.constructor.name === 'OneToOneField') {
        attr = field.relatedName
        value = instance[attr]
        if (value && value instanceof Object) {
          instance[attr] = ModelSerializer.deserialize(Cls, value)
        }
      }
    }
    return instance
  }

  static deserialize(Model, data) {
    let instance = new Model(data)
    // Next we have to check the related properties to
    // see if there are more things to serialize.
    instance = ModelSerializer.deserializeAttrs(Model, instance)
    instance = ModelSerializer.deserializeRelatedAttrs(Model, instance)

    return instance
  }
}
