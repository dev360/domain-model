import { BaseField } from './base'
import { REGISTRY } from '../decorators'

export class ForeignKey extends BaseField {
  constructor(props = {}) {
    super()

    if (!props.model) {
      throw new Error('Model required')
    }

    if (typeof props.model === 'string') {
      this.modelName = props.model
    } else {
      this.modelName = props.model.name
    }
    this.relatedName = props.relatedName
  }

  get Model() {
    return REGISTRY.get(this.modelName) || null
  }
}
