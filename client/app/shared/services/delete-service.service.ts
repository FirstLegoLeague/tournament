import { Injectable } from '@angular/core'
import { Deletable } from '../models/interfaces/modal-model'
import { TeamsService } from './teams.service'
import { MatchesService } from './matches.service'
import { ImagesService } from './images.service'
import { TournamentDataService } from './tournament-data.service'
import { Match } from '../models/match'
import { Team } from '../models/team'
import { Image } from '../models/image'

declare var jQuery: any

@Injectable({
  providedIn: 'root'
})
export class DeleteService {
  private deleteModel: Deletable

  constructor (private teamsService: TeamsService, private matchesServices: MatchesService, private imagesService: ImagesService, private tournamentDataService: TournamentDataService) {
  }

  setDeleteModel (model) {
    this.deleteModel = model
    jQuery('#delete-modal').modal().modal('show')
  }

  getDeleteModel () {
    return this.deleteModel
  }

  service (model) {
    switch (model.constructor) {
      case Team:
        return this.teamsService
      case Match:
        return this.matchesServices
      case Image:
        return this.imagesService
      case TournamentDataService:
        return this.tournamentDataService
      default:
        return null
    }
  }
}
