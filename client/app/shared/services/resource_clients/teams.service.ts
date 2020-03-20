import { Injectable } from '@angular/core'
import { CollectionClient } from '@first-lego-league/synced-resources'
import { Observable, from } from 'rxjs'

import { EditableModalService, DeletableModalService } from '../../interfaces/modal-model'

import { ConfigurationService } from '../utils/configuration.service'
import { Team } from '../../../../../resources/team'

@Injectable({
  providedIn: 'root'
})
export class TeamsService implements EditableModalService, DeletableModalService {
  private client: CollectionClient
  private initObservable: Observable<any>

  constructor (private config: ConfigurationService) {
  }

  init () {
    if (!this.initObservable) {
      this.initObservable = new Observable(subscriber => {
        this.config.init()
          .subscribe(() => {
            this.client = this.client || new CollectionClient(Team, '/teams', { messengerOptions: { mhubURI: this.config.data.mhub } })
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

  save (entry) {
    if (entry.id()) {
      return this.update(entry)
    } else {
      return this.create(entry)
    }
  }

  fields () {
    return [
      { display: 'Number', type: 'text', get: entry => entry.number, set: (entry, value) => { entry.number = value }, editable: false },
      { display: 'Name', type: 'text', get: entry => entry.name, set: (entry, value) => { entry.name = value } , editable: true },
      { display: 'Affiliation', type: 'text', get: entry => entry.affiliation, set: (entry, value) => { entry.affiliation = value }, editable: true }
    ]
  }

  title (team) {
    return `Team #${team.number}`
  }
}