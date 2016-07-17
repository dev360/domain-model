import includes from 'array-includes'

import * as fields from './fields'

export class ModelSerializer {

  static deserialize(ModelCls, data) {
    const instance = new ModelCls(data)
    const allAttrs = Object.getOwnPropertyNames(ModelCls)
    const reserved = ['name', 'length', 'objectsCache', 'Meta', 'prototype']

    function isField(attr) {
      if (includes(reserved, attr)) {
        return false
      }
      return ModelCls[attr] instanceof fields.BaseField
    }
    const fieldAttrs = allAttrs.filter(isField)
    fieldAttrs.forEach((attr) => {
      const field = ModelCls[attr]
      const fieldData = instance[attr]
      switch (field.constructor.name) {
        case 'ForeignKey':
          // Do ForeignKey stuff
          instance[attr] = new field.Model(fieldData)
          break
        default:
          break
      }
    })
    return instance
  }
}
