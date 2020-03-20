import { Injectable } from '@angular/core'
import { EntityClient } from '@first-lego-league/synced-resources'
import { Observable, from } from 'rxjs'

import { ConfigurationService } from '../utils/configuration.service'
import { Settings } from '../../../../../resources/settings'

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private client: EntityClient
  private initObservable: Observable<any>

  constructor (private config: ConfigurationService) {
  }

  init () {
    if (!this.initObservable) {
      this.initObservable = new Observable(subscriber => {
        this.config.init()
          .subscribe(() => {
            this.client = this.client || new EntityClient(Settings, '/settings', { messengerOptions: { mhubURI: this.config.data.mhub } })
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
    return this.client ? this.client.data : {}
  }

  update (entry) {
    return from(this.client.set(entry))
  }
}
