import { BaseField } from './base'


export class ForeignKey extends BaseField {
  constructor(props={}) {
    super()

    if (!props.model) {
      throw new Error('Model required')
    }
    this.Model = props.model
  }


}
