import { BaseModel, Manager, Model } from './base'
import { Http, Url, http } from './http'
import { register, unregister, REGISTRY } from './decorators'

module.exports = {
  REGISTRY,
  register,
  unregister,
  http,
  Http,
  Manager,
  BaseModel,
  Model,
  Url,
}
