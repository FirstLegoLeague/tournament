import { Injectable } from '@angular/core'
import { CollectionClient } from '@first-lego-league/synced-resources'
import { Observable, from } from 'rxjs'

import { DeletableModalService } from '../../interfaces/modal-model'

import { ConfigurationService } from '../utils/configuration.service'
import { Logo } from '../../../../../resources/logo'

@Injectable({
  providedIn: 'root'
})
export class LogosService implements DeletableModalService {
  private client: CollectionClient
  private initObservable: Observable<any>

  constructor (private config: ConfigurationService) {
  }

  init () {
    if (!this.initObservable) {
      this.initObservable = new Observable(subscriber => {
        this.config.init()
          .subscribe(() => {
            this.client = this.client || new CollectionClient(Logo, '/logos', { messengerOptions: { mhubURI: this.config.data.mhub } })
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

  title (logo) {
    return `Logo ${logo.filename}`
  }
}