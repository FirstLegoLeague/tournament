import { Injectable } from '@angular/core'
import { Editable } from '../models/interfaces/modal-model'
import { TeamsService } from './teams.service'
import { MatchesService } from './matches.service'

@Injectable({
  providedIn: 'root'
})
export class EditService {
  private editModel: Editable

  constructor (private teamsService: TeamsService, private matchesServices: MatchesService,) {
  }

  setEditModel (model) {
    this.editModel = model
  }

  getEditModel () {
    return this.editModel
  }

  service (model) {
    switch (model.constructor.name) {
      case 'Team':
        return this.teamsService
      case 'Match':
        return this.matchesServices
      default:
        return null
    }
  }
}
