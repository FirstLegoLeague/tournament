import { Injectable } from '@angular/core'
import { Editable } from '../models/interfaces/modal-model'
import { TeamsService } from './teams.service'
import { MatchesService } from './matches.service'
import { ModalsService } from './modals.service'
import { Match } from '../models/match'
import { Team } from '../models/team'

@Injectable({
  providedIn: 'root'
})
export class EditService {
  private editModel: Editable
  modal: any

  constructor (private teamsService: TeamsService, private matchesServices: MatchesService, private modalsService: ModalsService) {
    this.modal = modalsService.modal('edit-modal')
  }

  setEditModel (model) {
    this.editModel = Object.create(model)
    this.modal.open()
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
