import { Model } from 'domain-model'

export class Album extends Model {

  static get Meta() {
    return {
      detail_url: 'https://jsonplaceholder.typicode.com/albums/{id}/',
      list_url: 'https://jsonplaceholder.typicode.com/albums/',
    }
  }
}
Album.register()

