import { Injectable } from '@angular/core'
import { Editable } from '../models/interfaces/modal-model'
import { TeamsService } from './teams.service'
import { MatchesService } from './matches.service'
import { Match } from '../models/match'
import { Team } from '../models/team'

declare var jQuery: any

@Injectable({
  providedIn: 'root'
})
export class EditService {
  private editModel: Editable

  constructor (private teamsService: TeamsService, private matchesServices: MatchesService) {
  }

  setEditModel (model) {
    this.editModel = Object.create(model)
    jQuery('#edit-modal').modal().modal('show')
  }

  getEditModel () {
    return this.editModel
  }

  service (model) {
    switch (model.constructor) {
      case Team:
        return this.teamsService
      case Match:
        return this.matchesServices
      default:
        return null
    }
  }
}
