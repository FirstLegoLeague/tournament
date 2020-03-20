import { Injectable } from '@angular/core'
import { CollectionClient } from '@first-lego-league/synced-resources'
import { Observable, from } from 'rxjs'

import { ConfigurationService } from '../utils/configuration.service'
import { Table } from '../../../../../resources/table'

@Injectable({
  providedIn: 'root'
})
export class TablesService {
  private client: CollectionClient
  private initObservable: Observable<any>

  constructor (private config: ConfigurationService) {
  }

  init () {
    if (!this.initObservable) {
      this.initObservable = new Observable(subscriber => {
        this.config.init()
          .subscribe(() => {
            this.client = this.client || new CollectionClient(Table, '/tables', { messengerOptions: { mhubURI: this.config.data.mhub } })
            this.client.init().then(() => {
              subscriber.next(this)
              subscriber.complete()
            })
          })
      })
    }
    return this.initObservable
  }

  data () {
    return this.client ? this.client.data : []
  }

  clear () {
    return from(this.client.clear())
  }

  create (attrs) {
    return from(this.client.create(attrs))
  }

  update (entry) {
    return from(this.client.update(entry))
  }

  delete (entry) {
    return from(this.client.delete(entry))
  }
}