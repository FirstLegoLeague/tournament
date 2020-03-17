import { Injectable } from '@angular/core'
import { CollectionClient } from '@first-lego-league/synced-resources'
import { Observable } from 'rxjs'

import { ConfigurationService } from '../configuration.service'
import { Table } from '../../../../resources/table'

@Injectable({
  providedIn: 'root'
})
export class TablesService {
  private client: CollectionClient

  constructor (private config: ConfigurationService) {
  }

  init () {
    return this.config.init()
      .then(() => {
        this.client = new CollectionClient(Table, '/tables', { mhubURI: this.config.data.mhub })
        return this.client.init()
      })
  }

  clear () {
    return this.client.clear()
  }

  create (attrs) {
    return this.client.creat(attrs)
  }

  update (entry) {
    return this.client.update(entry)
  }

  delete (entry) {
    return this.client.delete(entry)
  }
}