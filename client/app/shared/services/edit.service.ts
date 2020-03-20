import { Injectable } from '@angular/core'

import { ModalsService } from './ui/modals.service'

@Injectable({
  providedIn: 'root'
})
export class EditService {
  public model: any
  public service: any
  modal: any

  constructor (private modalsService: ModalsService) {
    this.modal = modalsService.modal('edit-modal')
  }

  openModalFor (model, service) {
    this.model = Object.create(model)
    this.service = service
    this.modal.open()
  }

  close () {
    this.modal.close()
  }
}
