import { Injectable } from '@angular/core'
import { Editable, Deletable } from '../models/interfaces/modal-model'
import { TeamsService } from './teams.service'
import { MatchesService } from './matches.service'
import { ImagesService } from './images.service'

@Injectable({
  providedIn: 'root'
})
export class ModelModalsService {

  private editModel: Editable


  constructor (private teamsService: TeamsService, private matchesServices: MatchesService, private imagesService: ImagesService) {
  }



  service (model) {
    switch (model.constructor.name) {
      case 'Team':
        return this.teamsService
      case 'Match':
        return this.matchesServices
      case 'Image':
        return this.imagesService
      default:
        return null
    }
  }

}
