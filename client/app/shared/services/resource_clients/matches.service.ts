import { Injectable } from '@angular/core'
import { CollectionClient } from '@first-lego-league/synced-resources'
import { Observable, from, forkJoin } from 'rxjs'

import { EditableModalService, DeletableModalService } from '../../interfaces/modal-model'

import { ConfigurationService } from '../utils/configuration.service'
import { Match } from '../../../../../resources/match'

import { TablesService } from './tables.service'
import { SettingsService } from './settings.service'

@Injectable({
  providedIn: 'root'
})
export class MatchesService implements EditableModalService, DeletableModalService {
  private client: CollectionClient
  private initObservable: Observable<any>

  constructor (private config: ConfigurationService, private tablesService: TablesService, private settingsService: SettingsService) {
  }

  init () {
    if (!this.initObservable) {
      this.initObservable = new Observable(subscriber => {
        forkJoin([this.config.init(), this.tablesService.init()])
          .subscribe(() => {
            this.client = this.client || new CollectionClient(Match, '/matches', {
              messengerOptions: { mhubURI: this.config.data.mhub },
              afterCreate: match => {
                match.offsetTimes(this.settingsService.data().scheduleTimeOffset)
              }
            })
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
    const matchId = Math.max.apply(Math, this.data().map(match => match.matchId)) + 1
    return from(this.client.create(Object.assign(attrs, { matchId })))
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
    const teamFields = this.tablesService.data().map((table, index) => {
      return {
        display: table.name,
        type: 'text',
        get: entry => entry.teams[index].teamNumber,
        set: (entry, value) => {
          entry.teams[index].teamNumber = value
        },
        editable: true
      }
    })

    return [
      {
        display: 'Stage',
        type: 'select',
        get: entry => entry.stage,
        set: (entry, value) => { entry.stage = value },
        editable: true,
        options: [{ display: 'Practice', value: 'practice' }, { display: 'Ranking',  value: 'ranking' }]
      },
      {
        display: 'Start time',
        type: 'time',
        get: entry => this.timeInputValueFromField(entry.startTime),
        set: (entry, value) => this.setTimeFieldFromInput(entry, 'startTime', value),
        editable: true
      },
      {
        display: 'End time',
        type: 'time',
        get: entry => this.timeInputValueFromField(entry.endTime),
        set: (entry, value) => this.setTimeFieldFromInput(entry, 'endTime', value),
        editable: true
      }
    ].concat(teamFields)
  }

  timeInputValueFromField (timeFieldValue) {
    return new Date(timeFieldValue).toLocaleTimeString('en-GB').replace(/:\d+$/, '')
  }

  setTimeFieldFromInput (entry, timeFieldName, timeInputValue) {
    const [hours, minutes] = timeInputValue.split(':')
    const date = entry[timeFieldName] ? new Date(entry[timeFieldName]) : new Date()
    date.setHours(hours)
    date.setMinutes(minutes)
    date.setFullYear(1970, 0, 1)
    entry[timeFieldName] = date.toISOString()
  }

  title (match) {
    return `Match #${match.matchId}`
  }
}